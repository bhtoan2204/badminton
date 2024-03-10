import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CHAT_SERVICE } from '../utils/constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy
  ) { }

  async getMessages(sender_id: string, receiver_id: string, index: number) {
    try {
      console.log({ sender_id, receiver_id, index });
      const response = this.chatClient.send('chatClient/getMessages', { sender_id, receiver_id, index }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveMessage(id_user: string, message: any) {
    try {
      const response = this.chatClient.send('chatClient/sendMessage', { id_user, message });
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
}
