import { Module, forwardRef } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { HouseholdModule } from "../household.module";

@Module({
  imports: [
    forwardRef(() => HouseholdModule)
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomModule],
})
export class RoomModule { }