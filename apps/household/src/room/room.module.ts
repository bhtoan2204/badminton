import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule, RmqModule, Room } from '@app/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { HouseholdModule } from '../household.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    RmqModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Room]),
    StorageModule,
    forwardRef(() => HouseholdModule),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
