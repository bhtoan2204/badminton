import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { FAMILY_SERVICE } from "apps/gateway/constant/services.constant";
import { FamilyService } from "./family.service";
import { FamilyController } from "./family.controller";

@Module({
  imports: [
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
})
export class FamilyModule { }