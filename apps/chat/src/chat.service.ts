import { FamilyMessageContent, UploadFileRequest, UserConversations } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { StorageService } from './storage/storage.service';
import { EntityManager } from 'typeorm';

const limit = 30;

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(UserConversations.name) private userConversationsRepository,
    @InjectModel(FamilyMessageContent.name) private familyMessageRepository,
    private readonly storageService: StorageService,
    private readonly entityManager: EntityManager
  ) { }

  async base64ToUint8Array(base64: string): Promise<Uint8Array> {
    const buffer = Buffer.from(base64, 'base64');
    return new Uint8Array(buffer);
  }

  async getUsersChat(id_user: string, index: number): Promise<any> {
    try {
      const skipAmount = index * limit;

      const results = await this.userConversationsRepository.aggregate([
        { $match: { userId: id_user } },
        { $unwind: "$conversations" },
        { $unwind: "$conversations.messages" },
        { $sort: { "conversations.messages.timestamp": -1 } },
        {
          $group: {
            _id: "$conversations.receiverId",
            lastMessage: { $first: "$conversations.messages" }
          }
        },
        { $skip: skipAmount },
        { $limit: limit },
      ]).exec();

      const userIds = results.map(result => result._id);
      const usersQuery = 'SELECT * FROM f_get_users_info($1)';
      const usersParams = [userIds];
      const usersInfo = await this.entityManager.query(usersQuery, usersParams);

      const enrichedResults = results.map(conversation => {
        const userInfo = usersInfo.find(user => user.id_user === conversation._id.toString());
        return {
          ...conversation,
          user: userInfo ? {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            avatar: userInfo.avatar,
          } : null,
        };
      });

      return enrichedResults;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getMessages(senderId: string, receiverId: string, index: number): Promise<any[]> {
    try {
      const skip = index * limit;
      const conversationForCount = await this.userConversationsRepository.findOne({
        userId: senderId,
        'conversations.receiverId': receiverId,
      }, { 'conversations.$': 1 });

      if (!conversationForCount || conversationForCount.conversations.length === 0) {
        throw new RpcException({
          message: 'Conversation not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const totalMessages = conversationForCount.conversations[0].messages.length;

      if (skip >= totalMessages) {
        return [];
      }
      const messagesPosition = Math.max(totalMessages - skip - limit, 0);
      const conversation = await this.userConversationsRepository.aggregate([
        { $match: { userId: senderId, 'conversations.receiverId': receiverId } },
        { $unwind: '$conversations' },
        { $match: { 'conversations.receiverId': receiverId } },
        {
          $project: {
            messages: {
              $slice: ['$conversations.messages', messagesPosition, limit]
            }
          }
        }
      ]).exec();

      if (!conversation || conversation.length === 0 || conversation[0].messages.length === 0) {
        return [];
      }

      const messages = conversation[0].messages.reverse();
      return messages;
    } catch (error) {
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

  async saveMessage(id_user: string, messageData: { message: string; receiverId: string }): Promise<any> {
    try {
      if (!id_user || !messageData.receiverId || id_user === messageData.receiverId) {
        throw new Error('Invalid sender or receiver ID.');
      }
      const newMessage = {
        senderId: id_user,
        receiverId: messageData.receiverId,
        type: 'text',
        content: messageData.message,
        isRead: false,
        timestamp: new Date(),
      };
      const updateOrCreateConversation = async (userId: string, partnerId: string) => {
        const conversationExists = await this.userConversationsRepository.findOne({ userId, 'conversations.receiverId': partnerId });

        if (conversationExists) {
          return this.userConversationsRepository.findOneAndUpdate(
            { userId, 'conversations.receiverId': partnerId },
            { $push: { 'conversations.$.messages': newMessage } },
            { new: true }
          );
        } else {
          return this.userConversationsRepository.findOneAndUpdate(
            { userId },
            { $addToSet: { conversations: { receiverId: partnerId, messages: [newMessage] } } },
            { upsert: true, new: true }
          );
        }
      };

      await Promise.all([
        updateOrCreateConversation(id_user, messageData.receiverId),
        updateOrCreateConversation(messageData.receiverId, id_user),
      ]);

      return newMessage;
    } catch (error) {
      throw new RpcException({
        message: error.message || 'An error occurred while saving the message.',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
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
      const newMessage = {
        senderId: id_user,
        receiverId: messageData.receiverId,
        type: 'photo',
        content: fileUrl,
        isRead: false,
        timestamp: new Date(),
      };

      const updateOrCreateConversation = async (userId: string, partnerId: string) => {
        const conversationExists = await this.userConversationsRepository.findOne({ userId, 'conversations.receiverId': partnerId });

        if (conversationExists) {
          return this.userConversationsRepository.findOneAndUpdate(
            { userId, 'conversations.receiverId': partnerId },
            { $push: { 'conversations.$.messages': newMessage } },
            { new: true }
          );
        } else {
          return this.userConversationsRepository.findOneAndUpdate(
            { userId },
            { $addToSet: { conversations: { receiverId: partnerId, messages: [newMessage] } } },
            { upsert: true, new: true }
          );
        }
      };

      await Promise.all([
        updateOrCreateConversation(id_user, messageData.receiverId),
        updateOrCreateConversation(messageData.receiverId, id_user),
      ]);

      return newMessage;
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'An error occurred while saving the message.';
      throw new RpcException({ message, statusCode });
    }
  }
}
