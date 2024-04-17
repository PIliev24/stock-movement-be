import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Warehouse } from './dto/warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouse } from './dto/create-warehouse.entity';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => [Warehouse], { nullable: 'items' })
  async allWarehouses(): Promise<Warehouse[]> {
    return this.warehouseService.findAll();
  }

  @Query(() => Warehouse, { nullable: true })
  async warehouse(@Args('id') id: string): Promise<Warehouse> {
    return this.warehouseService.findOne(id);
  }

  @Mutation(() => Warehouse)
  async createWarehouse(
    @Args('createWarehouse') createWarehouseInput: CreateWarehouse,
  ): Promise<Warehouse> {
    return this.warehouseService.create(createWarehouseInput);
  }

  @Mutation(() => Boolean)
  async deleteWarehouse(@Args('id') id: string): Promise<boolean> {
    return this.warehouseService.remove(id);
  }

  @Query(() => Warehouse)
  async getWarehouseWithProducts(@Args('id') id: string): Promise<Warehouse> {
    return this.warehouseService.findWarehouseWithProducts(id);
  }
}
