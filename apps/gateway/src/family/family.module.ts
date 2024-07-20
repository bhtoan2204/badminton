import { Module, forwardRef } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [forwardRef(() => InvitationModule)],
  controllers: [FamilyController],
  providers: [FamilyService],
})
export class FamilyModule {}
