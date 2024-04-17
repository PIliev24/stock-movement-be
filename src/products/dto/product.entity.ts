import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { StockMovement } from 'src/stock-movement/dto/stock-movement.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@ObjectType() // GraphQL decorator
@Entity() // TypeORM decorator
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Float)
  @Column('double precision')
  sizePerUnit: number;

  @Field()
  @Column()
  isHazardous: boolean;

  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.product)
  stockMovements: StockMovement[];
}
