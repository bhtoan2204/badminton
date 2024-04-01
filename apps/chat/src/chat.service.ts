import { FamilyMessageContent, MessageContent, UploadFileRequest } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { StorageService } from './storage/storage.service';

const limit = 20;

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(MessageContent.name) private messageRepository,
    @InjectModel(FamilyMessageContent.name) private familyMessageRepository,
    private readonly storageService: StorageService
  ) { }

  async base64ToUint8Array(base64: string): Promise<Uint8Array> {
    const buffer = Buffer.from(base64, 'base64');
    return new Uint8Array(buffer);
  }

  async getMessages(senderId: string, receiverId: string, index: number): Promise<MessageContent[]> {
    try {
      const skip = index * limit;
      console.log(this.messageRepository.find({ senderId: senderId, receiverId: receiverId }));
      return await this.messageRepository.find({
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
    try {
      const fileName = 'chat_' + id_user + '_' + Date.now();
      const fileUint8Array = await this.base64ToUint8Array(messageData.imageData)
      const params: UploadFileRequest = {
        fileName: fileName,
        file: fileUint8Array,
      };

      const uploadImageData = await this.storageService.uploadImageChat(params);
      const fileUrl = uploadImageData.fileUrl;

      if (!id_user || !messageData.receiverId || id_user === messageData.receiverId) {
        throw new Error('Invalid sender or receiver ID.');
      }
      const newMessageContent = new this.messageRepository({
        _id: null,
        senderId: id_user,
        type: 'photo',
        receiverId: messageData.receiverId,
        content: fileUrl,
      });
      return await newMessageContent.save();
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'An error occurred while saving the message.';
      throw new RpcException({ message, statusCode });
    }
  }
}
