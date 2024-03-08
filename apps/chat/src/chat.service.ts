import { Message, MessageDocument } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageRepository: Model<MessageDocument>,
  ) {}

  async getMessages(senderId: string, receiverId: string, index: number): Promise<Message[]> {
    const limit = 50; 
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
  
  async saveMessage(idUser: string, messageData: { message: string; receiverId: string; }): Promise<Message> {
    const newMessage = new this.messageRepository({
      senderId: idUser,
      receiverId: messageData.receiverId,
      content: messageData.message,
      timestamp: new Date(),
    });
    return newMessage.save();
  }
}
