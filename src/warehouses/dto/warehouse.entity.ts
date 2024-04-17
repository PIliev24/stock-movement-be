import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StockMovement } from 'src/stock-movement/dto/stock-movement.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class Warehouse {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('double precision')
  capacity: number;

  @Field(() => [StockMovement])
  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.warehouse)
  stockMovements: StockMovement[];
}
