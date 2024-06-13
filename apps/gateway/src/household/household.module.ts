import { Module, forwardRef } from '@nestjs/common';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';
import { RmqModule } from '@app/common';
import { FAMILY_SERVICE, HOUSEHOLD_SERVICE, PermissionGuard } from '../utils';
import { RoomModule } from './room/room.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: HOUSEHOLD_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => RoomModule),
  ],
  controllers: [HouseholdController],
  providers: [
    HouseholdService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [RmqModule],
})
export class HouseholdModule {}
