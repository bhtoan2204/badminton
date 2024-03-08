import { Controller } from '@nestjs/common';
import { FamilyService } from './family.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class FamilyController {

  constructor(
    private readonly familyService: FamilyService,
    private readonly rmqService: RmqService) {}

  @EventPattern('family/get_Family')
  async getFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getFamily(data.CurrentUser, data.id_family);
  }
  @EventPattern('family/get_Member')
  async getMember(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getMember(data.CurrentUser, data.id_user);
  }
  @EventPattern('family/get_all_Family')
  async getallFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.GetAllFamily(data.CurrentUser);
  }

  @EventPattern('family/get_all_Member')
  async getallMember(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getallMember(data.CurrentUser, data.id_family);
  }

  @EventPattern('family/create_Family')
  async createFamily(@Payload() data: any, @Ctx() context: RmqContext) {

    this.rmqService.ack(context);
    return this.familyService.createFamily(data.CurrentUser,data.createFamilyDto);
  }
  @EventPattern('family/add_Member')
  async addMember(@Payload() data: any, @Ctx() context: RmqContext) {

    this.rmqService.ack(context);
    return this.familyService.addMember(data.CurrentUser,data.memberFamilyDto);
  }

  @EventPattern('family/delete_Member')
  async deleteMember(@Payload() data: any, @Ctx() context: RmqContext) {

    this.rmqService.ack(context);
    return this.familyService.deleteMember(data.CurrentUser, data.DeleteMemberDTO);
  }

  @EventPattern('family/update_Family')
  async updateFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.updateFamily(data.CurrentUser,data.UpdateFamilyDTO);

  }
  @EventPattern('family/delete_Family')
  async deleteFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.deleteFamily(data.CurrentUser, data.id_family);
  }

}