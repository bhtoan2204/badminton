import { Controller } from '@nestjs/common';
import { FamilyService } from './family.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class FamilyController {
  constructor(
    private readonly familyService: FamilyService,
    private readonly rmqService: RmqService) { }

  @EventPattern('family/get_Family')
  async getFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getFamily(data.id_user, data.id_family);
  }
  @EventPattern('family/get_Member')
  async getMember(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getMember(data.id_user);
  }
  @EventPattern('family/get_all_Family')
  async getAllFamily(@Payload() id_user: string, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getAllFamily(id_user);
  }

  @EventPattern('family/get_all_Member')
  async getAllMember(@Payload() data: { id_user, id_family }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getAllMember(data.id_user, data.id_family);
  }

  @EventPattern('family/create_Family')
  async createFamily(@Payload() data: { id_user, createFamilyDto }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.createFamily(data.id_user, data.createFamilyDto);
  }

  @EventPattern('family/add_Member')
  async addMember(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.addMember(data.id_user, data.memberFamilyDto);
  }

  @EventPattern('family/delete_Member')
  async deleteMember(@Payload() data: any, @Ctx() context: RmqContext) {

    this.rmqService.ack(context);
    return this.familyService.deleteMember(data.id_user, data.DeleteMemberDTO);
  }

  @EventPattern('family/update_Family')
  async updateFamily(@Payload() data: { id_user, updateFamilyDTO }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.updateFamily(data.id_user, data.updateFamilyDTO);
  }

  @EventPattern('family/delete_Family')
  async deleteFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.deleteFamily(data.id_user, data.id_family);
  }

  @EventPattern('family/getIdsMember')
  async getIdsMember(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getIdsMember(data.id_user, data.id_family);
  }

  @EventPattern('family/change_avatar')
  async changeAvatar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.changeAvatar(data.id_user, data.id_family, data.file);
  }
}