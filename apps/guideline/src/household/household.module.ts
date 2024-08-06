import { GrpcModule } from '@app/common';
import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';

@Module({
  imports: [GrpcModule.register({ name: 'HOUSEHOLD' })],
  providers: [HouseholdService],
  exports: [HouseholdService],
})
export class HouseholdModule {}
