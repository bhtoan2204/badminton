import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { ROLE_SERVICE } from "../utils/constant/services.constant";

@Module({
  imports: [
    RmqModule.register({ name: ROLE_SERVICE }),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule { }