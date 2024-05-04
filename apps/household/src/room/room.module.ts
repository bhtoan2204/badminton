import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule, RmqModule } from '@app/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { HouseholdModule } from '../household.module';

@Module({
  imports: [
    RmqModule,
    DatabaseModule,
    forwardRef(() => HouseholdModule)
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
