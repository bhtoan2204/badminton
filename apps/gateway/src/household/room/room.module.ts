import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { RmqModule } from "@app/common";
import { HOUSEHOLD_SERVICE } from "../../utils";

@Module({
  imports: [
    RmqModule.register({ name: HOUSEHOLD_SERVICE })
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomModule],
})
export class RoomModule { }