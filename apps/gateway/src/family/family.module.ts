import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { FamilyService } from "./family.service";
import { FamilyController } from "./family.controller";
import { FAMILY_SERVICE } from "../utils/constant/services.constant";

@Module({
  imports: [
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
})
export class FamilyModule { }