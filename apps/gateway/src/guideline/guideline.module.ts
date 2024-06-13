import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { FAMILY_SERVICE, GUIDELINE_SERVICE, PermissionGuard } from '../utils';
import { GuidelineController } from './guideline.controller';
import { GuidelineService } from './guideline.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: GUIDELINE_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [GuidelineController],
  providers: [
    GuidelineService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class GuidelineModule {}
