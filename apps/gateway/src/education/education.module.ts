import { Module } from "@nestjs/common";
import { EducationService } from "./education.service";
import { EducationController } from "./education.controller";
import { RmqModule } from "@app/common";
import { EDUCATION_SERVICE, FAMILY_SERVICE } from "../utils";
import { SubjectModule } from "./subjects/subject.module";

@Module({
  imports: [
    RmqModule.register({ name: EDUCATION_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    SubjectModule
  ],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule { }