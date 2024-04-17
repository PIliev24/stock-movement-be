import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StockMovement } from './dto/stock-movement.entity';
import { StockMovementService } from './stock-movement.service';
import { CreateStockMovement } from './dto/create-stock-movement.entity';

@Resolver(() => StockMovement)
export class StockMovementResolver {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Query(() => [StockMovement], { nullable: 'items' })
  async getAllStockMovements(): Promise<StockMovement[]> {
    return this.stockMovementService.findAll();
  }

  @Query(() => StockMovement, { nullable: true })
  async getStockMovement(@Args('id') id: string): Promise<StockMovement> {
    return this.stockMovementService.findOne(id);
  }

  @Query(() => [StockMovement])
  async getStockMovementsByWarehouse(
    @Args('warehouseId') warehouseId: string,
  ): Promise<StockMovement[]> {
    return this.stockMovementService.findAllByWarehouseId(warehouseId);
  }

  @Mutation(() => StockMovement)
  async createStockMovement(
    @Args('createStockMovementInput')
    createStockMovementInput: CreateStockMovement,
  ): Promise<StockMovement> {
    return this.stockMovementService.create(createStockMovementInput);
  }
}
