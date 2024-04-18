import { Module } from "@nestjs/common";
import { HouseholdController } from "./household.controller";
import { HouseholdService } from "./household.service";
import { RmqModule } from "@app/common";
import { HOUSEHOLD_SERVICE } from "../utils";

@Module({
  imports: [
    RmqModule.register({ name: HOUSEHOLD_SERVICE }),
  ],
  controllers: [HouseholdController],
  providers: [HouseholdService]
})
export class HouseholdModule {}