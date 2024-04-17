import { InputType, Field, Float } from '@nestjs/graphql';
import { StockMovementType } from './stock-movement-types';

@InputType()
export class CreateStockMovement {
  @Field(() => String)
  productId: string;

  @Field(() => String)
  warehouseId: string;

  @Field(() => Float)
  quantity: number;

  @Field()
  date: Date;

  @Field()
  type: StockMovementType;
}
