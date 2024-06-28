import { Module, forwardRef } from '@nestjs/common';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';
import { RmqModule } from '@app/common';
import { FAMILY_SERVICE, HOUSEHOLD_SERVICE } from '../utils';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    RmqModule.register({ name: HOUSEHOLD_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => RoomModule),
  ],
  controllers: [HouseholdController],
  providers: [HouseholdService],
  exports: [RmqModule],
})
export class HouseholdModule {}
