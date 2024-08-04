import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ChatGateway } from './chat.gateway';

@Processor('chats')
export class ChatProcessor {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Process('sendNotification')
  async handleNotification(job: Job) {
    try {
      const { id_user, notification } = job.data;
      this.chatGateway.emitNotificationToUser(id_user, notification);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

@Processor('auth')
export class AuthProcessor {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Process('logoutUser')
  async handleNotification(job: Job) {
    try {
      const { id_user } = job.data;
      this.chatGateway.emitLogoutToUser(id_user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
