import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateWarehouse {
  @Field()
  name: string;

  @Field(() => Float)
  capacity: number;
}
