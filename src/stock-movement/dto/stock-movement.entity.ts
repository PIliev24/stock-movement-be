import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/dto/product.entity';
import { Warehouse } from 'src/warehouses/dto/warehouse.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class StockMovement {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.stockMovements)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Field(() => Warehouse)
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stockMovements)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Field(() => String)
  @Column()
  productId: string; // FK to Product

  @Field(() => String)
  @Column()
  warehouseId: string; // FK to Warehouse

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column()
  type: string; // 'import' or 'export'
}
