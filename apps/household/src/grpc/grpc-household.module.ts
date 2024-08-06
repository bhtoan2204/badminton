import {
  GrpcModule,
  HouseholdConsumableItems,
  HouseholdDatabaseModule,
  HouseholdDurableItems,
  HouseholdItemCategories,
  HouseholdItems,
  Room,
} from '@app/common';
import { Module } from '@nestjs/common';
import { GrpcHouseholdController } from './grpc-household.controller';
import { GrpcHouseholdService } from './grpc-household.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GrpcModule,
    HouseholdDatabaseModule,
    TypeOrmModule.forFeature([
      HouseholdItems,
      HouseholdDurableItems,
      HouseholdConsumableItems,
      HouseholdItemCategories,
      Room,
    ]),
  ],
  controllers: [GrpcHouseholdController],
  providers: [GrpcHouseholdService],
})
export class GrpcHouseholdModule {}
