import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService,
    private readonly rmqService: RmqService) { }

  @EventPattern('role/getallrole')
  async getallrole(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.roleService.getAllRole();
  }

  @EventPattern('role/getrole')
  async getrole(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.roleService.getRole(data.user, data.family);
  }
}
