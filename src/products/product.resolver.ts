import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './dto/product.entity';
import { CreateProductInput } from './dto/crete-product.entity';
import { DeleteProduct } from './dto/delete-product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  async allProducts() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  async addProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productService.create(createProductInput);
  }

  @Mutation(() => DeleteProduct)
  async deleteProduct(@Args('id') id: string): Promise<DeleteProduct> {
    return this.productService.remove(id);
  }
}
