import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ChatGateway } from './chat.gateway';

@Processor('chats')
export class ChatProcessor {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Process('sendNotification')
  async handleNotification(job: Job) {
    const { id_user, notification } = job.data;
    this.chatGateway.emitNotificationToUser(id_user, notification);
  }
}

@Processor('auth')
export class AuthProcessor {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Process('logoutUser')
  async handleNotification(job: Job) {
    const { id_user } = job.data;
    this.chatGateway.emitLogoutToUser(id_user);
  }
}
