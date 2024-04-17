import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field(() => Float)
  sizePerUnit: number;

  @Field(() => Boolean)
  isHazardous: boolean;
}
