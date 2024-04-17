import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './dto/warehouse.entity';
import { CreateWarehouse } from './dto/create-warehouse.entity';
import { StockMovement } from 'src/stock-movement/dto/stock-movement.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
  ) {}

  findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      relations: { stockMovements: true },
    });
  }

  findOne(id: string): Promise<Warehouse> {
    return this.warehouseRepository.findOne({
      where: { id: id },
      relations: { stockMovements: true },
    });
  }

  async create(createWarehouseInput: CreateWarehouse): Promise<Warehouse> {
    const newWarehouse = this.warehouseRepository.create(createWarehouseInput);
    return this.warehouseRepository.save(newWarehouse);
  }

  async remove(id: string): Promise<boolean> {
    await this.validateWarehouseProducts(id);

    const result = await this.warehouseRepository.delete(id);
    return result.affected > 0;
  }

  async findWarehouseWithProducts(warehouseId: string): Promise<Warehouse> {
    return this.warehouseRepository.findOne({
      where: { id: warehouseId },
      relations: { stockMovements: { product: true } },
    });
  }

  async validateWarehouseProducts(id: string) {
    const movements = await this.stockMovementRepository.find({
      where: { warehouseId: id },
      relations: ['product'],
    });

    const currentStock = movements.reduce(
      (acc, movement) => {
        acc[movement.product.id] = acc[movement.product.id] || 0;
        acc[movement.product.id] +=
          movement.type === 'import' ? movement.quantity : -movement.quantity;
        return acc;
      },
      {} as Record<number, number>,
    );

    // Check if any product has a positive stock
    if (Object.values(currentStock).some((stock) => stock > 0)) {
      throw new BadRequestException(
        'Cannot delete warehouse with active stock',
      );
    }
  }
}
