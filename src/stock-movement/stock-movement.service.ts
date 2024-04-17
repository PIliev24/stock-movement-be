import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from './dto/stock-movement.entity';
import { CreateStockMovement } from './dto/create-stock-movement.entity';
import { Product } from 'src/products/dto/product.entity';
import { Warehouse } from 'src/warehouses/dto/warehouse.entity';
import { StockMovementType } from './dto/stock-movement-types';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  findAll(): Promise<StockMovement[]> {
    return this.stockMovementRepository.find({
      relations: { product: true, warehouse: true },
    });
  }

  findOne(id: string): Promise<StockMovement> {
    return this.stockMovementRepository.findOne({
      where: { id: id },
      relations: { product: true, warehouse: true },
    });
  }

  async findAllByWarehouseId(warehouseId: string): Promise<StockMovement[]> {
    return this.stockMovementRepository.find({
      where: { warehouseId: warehouseId },
      relations: { product: true, warehouse: true },
    });
  }

  async create(
    createStockMovementInput: CreateStockMovement,
  ): Promise<StockMovement> {
    const { productId, warehouseId, type, quantity } = createStockMovementInput;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }

    const existingMovements = await this.stockMovementRepository.find({
      where: { warehouseId: warehouseId },
      relations: { product: true },
    });

    await this.validateQuantity({
      existingMovements,
      warehouse,
      product,
      type,
      quantity,
    });

    await this.validateHazardousProduct({ existingMovements, product });

    const newStockMovement = this.stockMovementRepository.create(
      createStockMovementInput,
    );
    return this.stockMovementRepository.save(newStockMovement);
  }

  private async validateHazardousProduct({
    existingMovements,
    product,
  }: {
    existingMovements: StockMovement[];
    product: Product;
  }) {
    const isHazardousConflict = existingMovements.some((movement) => {
      return movement.product.isHazardous !== product.isHazardous;
    });

    if (isHazardousConflict) {
      throw new BadRequestException(
        'Cannot store hazardous and non-hazardous products in the same warehouse',
      );
    }
  }

  private async validateQuantity({
    existingMovements,
    warehouse,
    product,
    type,
    quantity,
  }: {
    existingMovements: StockMovement[];
    warehouse: Warehouse;
    product: Product;
    type: StockMovementType;
    quantity: number;
  }) {
    const totalIn = existingMovements
      .filter((m) => m.type === 'import')
      .reduce((sum, curr) => sum + curr.quantity, 0);
    const totalOut = existingMovements
      .filter((m) => m.type === 'export')
      .reduce((sum, curr) => sum + curr.quantity, 0);
    const currentStock = totalIn - totalOut;

    if (type === 'import') {
      // Check if the warehouse can hold the additional stock
      const warehouseCapacityUsed = await this.calculateWarehouseCapacityUsed(
        warehouse.id,
      );
      const productSizeTotal = product.sizePerUnit * quantity;

      if (warehouseCapacityUsed + productSizeTotal > warehouse.capacity) {
        throw new BadRequestException(
          'Adding this product exceeds warehouse capacity',
        );
      }
    } else if (type === 'export') {
      // Check if there is enough stock to export
      if (quantity > currentStock) {
        throw new BadRequestException('Not enough stock available to export');
      }
    }
  }

  private async calculateWarehouseCapacityUsed(
    warehouseId: string,
  ): Promise<number> {
    const movements = await this.stockMovementRepository.find({
      where: { warehouseId: warehouseId },
      relations: ['product'],
    });

    const totalIn = movements
      .filter((m) => m.type === 'import')
      .reduce((sum, curr) => sum + curr.quantity * curr.product.sizePerUnit, 0);
    const totalOut = movements
      .filter((m) => m.type === 'export')
      .reduce((sum, curr) => sum + curr.quantity * curr.product.sizePerUnit, 0);

    return totalIn - totalOut;
  }
}
