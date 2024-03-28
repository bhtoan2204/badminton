import { Controller, Get } from '@nestjs/common';
import { GuidelineService } from './guideline.service';

@Controller()
export class GuidelineController {
  constructor(private readonly guidelineService: GuidelineService) {}

  @Get()
  getHello(): string {
    return this.guidelineService.getHello();
  }
}
