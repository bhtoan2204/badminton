import { RmqModule } from '@app/common';
import { Module, forwardRef } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { FAMILY_SERVICE } from '../utils';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => InvitationModule),
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [RmqModule],
})
export class FamilyModule {}
