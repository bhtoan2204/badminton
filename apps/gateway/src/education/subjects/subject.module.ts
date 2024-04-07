import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { EDUCATION_SERVICE } from "../../utils";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";

@Module({
  imports: [
    RmqModule.register({ name: EDUCATION_SERVICE })
  ],
  controllers: [
    SubjectController
  ],
  providers: [
    SubjectService
  ]
})
export class SubjectModule {}