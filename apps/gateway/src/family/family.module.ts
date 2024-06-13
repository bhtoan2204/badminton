import { RmqModule } from '@app/common';
import { Module, forwardRef } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { FAMILY_SERVICE, PermissionGuard } from '../utils';
import { InvitationModule } from './invitation/invitation.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => InvitationModule),
  ],
  controllers: [FamilyController],
  providers: [
    FamilyService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [RmqModule],
})
export class FamilyModule {}
