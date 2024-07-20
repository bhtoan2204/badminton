import { Module } from '@nestjs/common';
import { GuidelineController } from './guideline.controller';
import { GuidelineService } from './guideline.service';

@Module({
  imports: [],
  controllers: [GuidelineController],
  providers: [GuidelineService],
})
export class GuidelineModule {}
