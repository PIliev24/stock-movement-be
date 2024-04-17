import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './dto/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseResolver } from './warehouse.resolver';
import { StockMovement } from 'src/stock-movement/dto/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, StockMovement])],
  providers: [WarehouseService, WarehouseResolver],
})
export class WarehousesModule {}
