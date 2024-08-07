import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CHAT_SERVICE, FAMILY_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NewMessageDto } from './dto/newMessage.dto';
import { NotificationType, RmqService } from '@app/common';
import { NewFamilyMessageDto } from './dto/newFamilyMessage.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,
    @Inject(FAMILY_SERVICE) private readonly familyClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getUsersChat(id_user: string, index: number) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/getUsersChat',
        { id_user, index },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getMessages(sender_id: string, receiver_id: string, index: number) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/getMessages',
        { sender_id, receiver_id, index },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async saveMessage(id_user: string, message: NewMessageDto) {
    try {
      const data = await await this.rmqService.send(
        this.chatClient,
        'chatClient/sendMessage',
        { id_user, message },
      );
      this.notificationsQueue.add('createNotificationUser', {
        id_user: message.receiverId,
        notificationData: {
          title: 'New message',
          content: message.message,
          type: NotificationType.CHAT,
          id_family: null,
          id_target: message.receiverId,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async saveFamilyMessage(id_user: string, message: NewFamilyMessageDto) {
    try {
      const data = await this.rmqService.send(
        this.chatClient,
        'chatClient/sendFamilyMessage',
        { id_user, message },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: message.familyId,
        notificationData: {
          title: 'New message',
          title_vn: 'Tin nhắn mới',
          content: message.message,
          content_vn: message.message,
          type: NotificationType.CHAT,
          id_family: message.familyId,
          id_target: message.familyId,
        },
      });
      return { familyId: message.familyId, ...data };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async saveFamilyImageMessage(id_user: string, familyId: number, file: any) {
    try {
      const data = await this.rmqService.send(
        this.chatClient,
        'chatClient/sendFamilyImageMessage',
        { id_user, familyId, file },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: familyId,
        notificationData: {
          title: 'New message',
          title_vn: 'Tin nhắn mới',
          content: 'You have received an image message',
          content_vn: 'Bạn đã nhận được một hình ảnh',
          type: NotificationType.CHAT,
          id_family: familyId,
          id_target: familyId,
        },
      });
      return { familyId: familyId, ...data };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async saveFamilyVideoMessage(id_user: string, familyId: number, file: any) {
    try {
      const data = await this.rmqService.send(
        this.chatClient,
        'chatClient/sendFamilyVideoMessage',
        { id_user, familyId, file },
        60000,
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: familyId,
        notificationData: {
          title: 'New message',
          title_vn: 'Tin nhắn mới',
          content: 'You have received a video message',
          content_vn: 'Bạn đã nhận được một video',
          type: NotificationType.CHAT,
          id_family: familyId,
          id_target: familyId,
        },
      });
      return { familyId: familyId, ...data };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async saveImageMessage(id_user: string, receiverId: string, file: any) {
    try {
      const data = await this.rmqService.send(
        this.chatClient,
        'chatClient/sendImageMessage',
        { id_user, receiverId, file },
      );
      this.notificationsQueue.add('createNotificationUser', {
        id_user: receiverId,
        notificationData: {
          title: 'New message',
          content: "You've received an image message",
          type: NotificationType.CHAT,
          id_family: null,
          id_target: receiverId,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async saveVideoMessage(id_user: string, receiverId: string, file: any) {
    try {
      const data = await this.rmqService.send(
        this.chatClient,
        'chatClient/sendVideoMessage',
        { id_user, receiverId, file },
        60000,
      );
      this.notificationsQueue.add('createNotificationUser', {
        id_user: receiverId,
        notificationData: {
          title: 'New message',
          content: "You've received an video message",
          type: NotificationType.CHAT,
          id_family: null,
          id_target: receiverId,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getFamilyChats(id_user: string) {
    try {
      const family = await this.rmqService.send(
        this.familyClient,
        'familyClient/getAllFamily',
        id_user,
      );
      const familyId = family.map((item: any) => item.id_family);
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/getFamilyChats',
        { familyId },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getFamilyMessages(id_user: string, id_family: number, index: number) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/getFamilyMessages',
        { id_user, id_family, index },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getListReceiverId(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getIdsMember',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async markSeen(id_user: string, receiver_id: string) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/markSeenMessage',
        { id_user, receiver_id },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async removeMessage(
    id_user: string,
    receiver_id: string,
    id_message: string,
  ) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/removeMessage',
        { id_user, receiver_id, id_message },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async removeFamilyMessage(
    id_user: string,
    id_family: number,
    id_message: string,
  ) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/removeFamilyMessage',
        { id_user, id_family, id_message },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getLinkedUser(id_user: string, search: string) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/getLinkedUser',
        { id_user, search },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getJitsiToken(user: any) {
    try {
      return await this.rmqService.send(
        this.chatClient,
        'chatClient/getJitsiToken',
        { user },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
