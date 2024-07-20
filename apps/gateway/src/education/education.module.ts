import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { SubjectModule } from './subjects/subject.module';

@Module({
  imports: [SubjectModule],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
