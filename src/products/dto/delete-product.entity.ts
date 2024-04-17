import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProduct {
  @Field()
  name: string;

  @Field()
  isHazardous: boolean;

  @Field()
  sizePerUnit: number;

  constructor(...args) {
    Object.assign(this, ...args);
  }
}
