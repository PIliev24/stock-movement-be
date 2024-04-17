// product.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './dto/product.entity';
import { StockMovement } from 'src/stock-movement/dto/stock-movement.entity';
import { DeleteProduct } from './dto/delete-product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<DeleteProduct> {
    await this.validateProductForDelete(id); // (1

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    await this.productRepository.remove(product);

    const deleteProductDto = new DeleteProduct({
      name: product.name,
      isHazardous: product.isHazardous,
      sizePerUnit: product.sizePerUnit,
    });
    return deleteProductDto;
  }

  async validateProductForDelete(id: string) {
    const movements = await this.stockMovementRepository.find({
      where: { productId: id },
    });

    const totalStock = movements.reduce((sum, movement) => {
      return (
        sum +
        (movement.type === 'import' ? movement.quantity : -movement.quantity)
      );
    }, 0);

    if (totalStock > 0) {
      throw new BadRequestException(
        'Cannot delete product that is currently stored in a warehouse',
      );
    }
  }
}
