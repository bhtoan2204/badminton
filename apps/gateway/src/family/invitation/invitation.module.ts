import { Module, forwardRef } from "@nestjs/common";
import { FamilyModule } from "../family.module";
import { InvitationController } from "./invitation.controller";
import { InvitationService } from "./invitation.service";

@Module({
  imports: [
    forwardRef(() => FamilyModule),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}