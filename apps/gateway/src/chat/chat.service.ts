import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CHAT_SERVICE, FAMILY_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,
    @Inject(FAMILY_SERVICE) private readonly familyClient: ClientProxy
  ) { }

  async getUsersChat(id_user: string, index: number) {
    try {
      const response = this.chatClient.send('chatClient/getUsersChat', { id_user, index }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getMessages(sender_id: string, receiver_id: string, index: number) {
    try {
      const response = this.chatClient.send('chatClient/getMessages', { sender_id, receiver_id, index }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getFamilyChats(id_user: string) {
    try {
      const listFamilyId = this.familyClient.send('family/get_all_Family', id_user).pipe(timeout(5000));
      const family = await lastValueFrom(listFamilyId);
      const familyId = family.map((item: any) => item.id_family);
      const response = this.chatClient.send('chatClient/getFamilyChats', { familyId }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getFamilyMessages(id_user: string, id_family: number, index: number) {
    try {
      const response = this.chatClient.send('chatClient/getFamilyMessages', { id_user, id_family, index }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveMessage(id_user: string, message: any) {
    try {
      const response = this.chatClient.send('chatClient/sendMessage', { id_user, message });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveFamilyMessage(id_user: string, message: any) {
    try {
      const response = this.chatClient.send('chatClient/sendFamilyMessage', { id_user, message });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveFamilyImageMessage(id_user: string, message: any) {
    try {
      const response = this.chatClient.send('chatClient/sendFamilyImageMessage', { id_user, message });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getListReceiverId(id_user: string, id_family: number) {
    try {
      const response = this.familyClient.send('family/getIdsMember', { id_user, id_family });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async saveImageMessage(id_user: string, message: any) {
    try {
      const response = this.chatClient.send('chatClient/sendImageMessage', { id_user, message });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async markSeen(id_user: string, receiver_id: string) {
    try {
      const response = this.chatClient.send('chatClient/markSeenMessage', { id_user, receiver_id });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async removeMessage(id_user: string, receiver_id: string, id_message: string) {
    try {
      const response = this.chatClient.send('chatClient/removeMessage', { id_user, receiver_id, id_message });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
