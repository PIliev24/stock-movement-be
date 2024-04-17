import { Module } from '@nestjs/common';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { Product } from './products/dto/product.entity';
import { StockMovement } from './stock-movement/dto/stock-movement.entity';
import { Warehouse } from './warehouses/dto/warehouse.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.ACTIVE_DB,
      entities: [Product, StockMovement, Warehouse],
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ProductsModule,
    WarehousesModule,
    StockMovementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
