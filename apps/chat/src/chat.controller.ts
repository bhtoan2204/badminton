import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class ChatController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly chatService: ChatService) {}

  @EventPattern('chatClient/getMessages')
  async getMessages(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getMessages(data.sender_id, data.receiver_id, data.index);
  }

  @EventPattern('chatClient/getFamilyMessages')
  async getFamilyMessages(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getFamilyMessages(data.id_user, data.id_family, data.index);
  }

  @EventPattern('chatClient/sendMessage')
  async saveMessage(@Payload() data: { id_user: string, message: {message: string; receiverId: string;} }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.saveMessage(data.id_user, data.message);
  }

  @EventPattern('chatClient/sendFamilyMessage')
  async saveFamilyMessage(@Payload() data: { id_user: string, message: {message: string; familyId: number;} }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.saveFamilyMessage(data.id_user, data.message);
  }

  @EventPattern('chatClient/sendImageMessage')
  async saveImageMessage(@Payload() data: { id_user: string, message: {imageData: string; receiverId: string;} }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.saveImageMessage(data.id_user, data.message);
  }

  @EventPattern('chatClient/getImage')
  async getImage(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getImage(data.image_name);
  }
}
