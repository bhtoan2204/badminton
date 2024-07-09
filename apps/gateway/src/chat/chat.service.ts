import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CHAT_SERVICE, FAMILY_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NewMessageDto } from './dto/newMessage.dto';
import { NotificationType } from '@app/common';
import { NewFamilyMessageDto } from './dto/newFamilyMessage.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,
    @Inject(FAMILY_SERVICE) private readonly familyClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getUsersChat(id_user: string, index: number) {
    try {
      const response = this.chatClient
        .send('chatClient/getUsersChat', { id_user, index })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getMessages(sender_id: string, receiver_id: string, index: number) {
    try {
      const response = this.chatClient
        .send('chatClient/getMessages', { sender_id, receiver_id, index })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveMessage(id_user: string, message: NewMessageDto) {
    try {
      const response = this.chatClient.send('chatClient/sendMessage', {
        id_user,
        message,
      });
      const data = await lastValueFrom(response);
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
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveFamilyMessage(id_user: string, message: NewFamilyMessageDto) {
    try {
      const response = this.chatClient.send('chatClient/sendFamilyMessage', {
        id_user,
        message,
      });
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: message.familyId,
        notificationData: {
          title: 'New message',
          content: message.message,
          type: NotificationType.CHAT,
          id_family: message.familyId,
          id_target: message.familyId,
        },
      });
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveFamilyImageMessage(id_user: string, familyId: number, file: any) {
    try {
      const response = this.chatClient.send(
        'chatClient/sendFamilyImageMessage',
        { id_user, message: familyId, file },
      );
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: familyId,
        notificationData: {
          title: 'New message',
          content: 'You have received an image message',
          type: NotificationType.CHAT,
          id_family: familyId,
          id_target: familyId,
        },
      });
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveFamilyVideoMessage(id_user: string, familyId: number, file: any) {
    try {
      const response = this.chatClient.send(
        'chatClient/sendFamilyVideoMessage',
        { id_user, familyId, file },
      );
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: familyId,
        notificationData: {
          title: 'New message',
          content: 'You have received a video message',
          type: NotificationType.CHAT,
          id_family: familyId,
          id_target: familyId,
        },
      });
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveImageMessage(id_user: string, receiverId: string, file: any) {
    try {
      const response = this.chatClient.send('chatClient/sendImageMessage', {
        id_user,
        receiverId,
        file,
      });
      const data = await lastValueFrom(response);
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
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveVideoMessage(id_user: string, receiverId: string, file: any) {
    try {
      const response = this.chatClient.send('chatClient/sendVideoMessage', {
        id_user,
        receiverId,
        file,
      });
      const data = await lastValueFrom(response);
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
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getFamilyChats(id_user: string) {
    try {
      const listFamilyId = this.familyClient
        .send('familyClient/getAllFamily', id_user)
        .pipe(timeout(15000));
      const family = await lastValueFrom(listFamilyId);
      const familyId = family.map((item: any) => item.id_family);
      const response = this.chatClient
        .send('chatClient/getFamilyChats', { familyId })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getFamilyMessages(id_user: string, id_family: number, index: number) {
    try {
      const response = this.chatClient
        .send('chatClient/getFamilyMessages', { id_user, id_family, index })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getListReceiverId(id_user: string, id_family: number) {
    try {
      const response = this.familyClient.send('familyClient/getIdsMember', {
        id_user,
        id_family,
      });
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async markSeen(id_user: string, receiver_id: string) {
    try {
      const response = this.chatClient.send('chatClient/markSeenMessage', {
        id_user,
        receiver_id,
      });
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async removeMessage(
    id_user: string,
    receiver_id: string,
    id_message: string,
  ) {
    try {
      const response = this.chatClient.send('chatClient/removeMessage', {
        id_user,
        receiver_id,
        id_message,
      });
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getLinkedUser(id_user: string, search: string) {
    try {
      const response = this.chatClient.send('chatClient/getLinkedUser', {
        id_user,
        search,
      });
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
