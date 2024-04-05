import { Module } from "@nestjs/common";
import { EducationService } from "./education.service";
import { EducationController } from "./education.controller";
import { RmqModule } from "@app/common";
import { EDUCATION_SERVICE } from "../utils";

@Module({
  imports: [
    RmqModule.register({ name: EDUCATION_SERVICE })
  ],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}