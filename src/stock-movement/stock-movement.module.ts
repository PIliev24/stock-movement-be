import { Module } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { StockMovement } from './dto/stock-movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementResolver } from './stock-movement.resolver';
import { Product } from 'src/products/dto/product.entity';
import { Warehouse } from 'src/warehouses/dto/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, Product, Warehouse])],
  providers: [StockMovementService, StockMovementResolver],
})
export class StockMovementModule {}
