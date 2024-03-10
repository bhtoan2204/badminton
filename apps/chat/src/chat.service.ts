import { MessageContent } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

const limit = 20;

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(MessageContent.name) private messageRepository,
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

  async saveMessage(id_user: string, messageData: { message: string; receiverId: string; }): Promise<MessageContent> {
    try {
      if (!id_user || !messageData.receiverId || id_user === messageData.receiverId) {
        throw new Error('Invalid sender or receiver ID.');
      }
      const newMessageContent = new this.messageRepository({
        _id: null,
        senderId: id_user,
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
}
