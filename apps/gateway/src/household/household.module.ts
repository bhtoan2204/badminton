import { Module, forwardRef } from '@nestjs/common';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';
import { RoomModule } from './room/room.module';

@Module({
  imports: [forwardRef(() => RoomModule)],
  controllers: [HouseholdController],
  providers: [HouseholdService],
})
export class HouseholdModule {}
