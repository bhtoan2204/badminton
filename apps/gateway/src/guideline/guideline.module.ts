import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { FAMILY_SERVICE, GUIDELINE_SERVICE } from '../utils';
import { GuidelineController } from './guideline.controller';
import { GuidelineService } from './guideline.service';

@Module({
  imports: [
    RmqModule.register({ name: GUIDELINE_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [GuidelineController],
  providers: [GuidelineService],
})
export class GuidelineModule {}
