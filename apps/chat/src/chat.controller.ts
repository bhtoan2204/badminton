import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class ChatController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly chatService: ChatService,
  ) {}

  @EventPattern('chatClient/getUsersChat')
  async getChats(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getUsersChat(data.id_user, data.index);
  }

  @EventPattern('chatClient/getMessages')
  async getMessages(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getMessages(
      data.sender_id,
      data.receiver_id,
      data.index,
    );
  }

  @EventPattern('chatClient/getFamilyChats')
  async getFamilyChats(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getFamilyChats(data.familyId);
  }

  @EventPattern('chatClient/getFamilyMessages')
  async getFamilyMessages(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getFamilyMessages(
      data.id_user,
      data.id_family,
      data.index,
    );
  }

  @EventPattern('chatClient/sendMessage')
  async saveMessage(
    @Payload()
    data: { id_user: string; message: { message: string; receiverId: string } },
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.chatService.saveMessage(data.id_user, data.message);
  }

  @EventPattern('chatClient/sendFamilyMessage')
  async saveFamilyMessage(
    @Payload()
    data: { id_user: string; message: { message: string; familyId: number } },
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.chatService.saveFamilyMessage(data.id_user, data.message);
  }

  @EventPattern('chatClient/sendFamilyImageMessage')
  async saveFamilyImageMessage(
    @Payload()
    data: {
      id_user: string;
      familyId: number;
      file: Express.Multer.File;
    },
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.chatService.saveFamilyImageMessage(
      data.id_user,
      data.familyId,
      data.file,
    );
  }

  @EventPattern('chatClient/sendFamilyVideoMessage')
  async saveFamilyVideoMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.chatService.saveFamilyVideoMessage(
      data.id_user,
      data.familyId,
      data.file,
    );
  }

  @EventPattern('chatClient/sendImageMessage')
  async saveImageMessage(
    @Payload()
    data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.chatService.saveImageMessage(
      data.id_user,
      data.receiverId,
      data.file,
    );
  }

  @EventPattern('chatClient/sendVideoMessage')
  async saveVideoMessage(
    @Payload()
    data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.chatService.saveVideoMessage(
      data.id_user,
      data.receiverId,
      data.file,
    );
  }

  @EventPattern('chatClient/markSeenMessage')
  async markSeen(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.markSeen(data.id_user, data.receiver_id);
  }

  @EventPattern('chatClient/removeMessage')
  async removeMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.removeMessage(
      data.id_user,
      data.receiver_id,
      data.id_message,
    );
  }

  @EventPattern('chatClient/getLinkedUser')
  async getLinkedUser(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getLinkedUser(data.id_user, data.search);
  }

  @EventPattern('chatClient/getJitsiToken')
  async getJitsiToken(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getJitsiToken(data.user);
  }
}
