import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './dto/product.entity';
import { ProductResolver } from './product.resolver';
import { StockMovement } from 'src/stock-movement/dto/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StockMovement])],
  providers: [ProductService, ProductResolver],
  exports: [TypeOrmModule, ProductService],
})
export class ProductsModule {}
