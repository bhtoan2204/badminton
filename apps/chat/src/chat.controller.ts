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
  async getMessages(@Payload() data: { sender_id: string, receiver_id: string, index: number }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.getMessages(data.sender_id, data.receiver_id, data.index);
  }

  @EventPattern('chatClient/sendMessage')
  async saveMessage(@Payload() data: { id_user: string, message: {message: string; receiverId: string;} }, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.chatService.saveMessage(data.id_user, data.message);
  }
}
