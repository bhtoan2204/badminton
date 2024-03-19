import { FamilyMessageContent, MessageContent } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

const limit = 20;

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(MessageContent.name) private messageRepository,
    @InjectModel(FamilyMessageContent.name) private familyMessageRepository,
  ) { }

  async getMessages(senderId: string, receiverId: string, index: number): Promise<MessageContent[]> {
    try {
      const skip = index * limit;
      return this.messageRepository.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }).sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getFamilyMessages(id_user: string, id_family: number, index: number): Promise<any> {
    try {
      const skip = index * limit;
      const familyMessage = await this.familyMessageRepository.findOne({ _id: id_family });
      if (!familyMessage) {
        return [];
      }
      return familyMessage.messages.sort((a, b) => b.timestamp - a.timestamp)
        .slice(skip, skip + limit);
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async saveMessage(id_user: string, messageData: { message: string; receiverId: string; }): Promise<MessageContent> {
    try {
      if (!id_user || !messageData.receiverId || id_user === messageData.receiverId) {
        throw new Error('Invalid sender or receiver ID.');
      }
      const newMessageContent = new this.messageRepository({
        _id: null,
        senderId: id_user,
        type: 'text',
        receiverId: messageData.receiverId,
        content: messageData.message,
      });

      return await newMessageContent.save();
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'An error occurred while saving the message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async saveFamilyMessage(id_user: string, messageData: { message: string; familyId: number; }): Promise<any> {
    try {
      if (!id_user || !messageData.familyId) {
        throw new Error('Invalid sender or family ID.');
      }
      let familyMessage = await this.familyMessageRepository.findOne({ _id: messageData.familyId });
      if (!familyMessage) {
        familyMessage = new this.familyMessageRepository({
          _id: messageData.familyId,
          messages: [],
        });
      }
      const newMessage = {
        senderId: id_user,
        content: messageData.message,
        timestamp: new Date(),
      };
      familyMessage.messages.push(newMessage);
      await familyMessage.save();

      return newMessage;
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'An error occurred while saving the family message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async saveImageMessage(id_user, messageData) {
    // return this.saveMessage(id_user, messageData);
  }
}
