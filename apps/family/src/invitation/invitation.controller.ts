import { Controller } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('familyClient/getInvitationCode')
  async getInvitationCode(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invitationService.getInvitationCode(
      data.id_user,
      data.id_family,
    );
  }

  @EventPattern('familyClient/generateInvitation')
  async generateInvitation(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invitationService.generateInvitation(
      data.id_user,
      data.id_family,
    );
  }

  @EventPattern('familyClient/handleInvitation')
  async handleInvitation(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invitationService.handleInvitation(
      data.id_user,
      data.id_family,
      data.code,
    );
  }
}
