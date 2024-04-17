import { FamilyConversations, UploadFileRequest, UserConversations } from '@app/common';
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
    @InjectModel(FamilyConversations.name) private familyConversationsRepository,
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
        { $sort: { "conversations.updated_at": -1, "conversations.messages.timestamp": -1 } },
        {
            $group: {
                _id: "$_id",
                receiverId: { $first: "$conversations.receiverId" },
                lastMessage: { $first: "$conversations.messages" },
                lastUpdated: { $first: "$conversations.updated_at" }
            }
        },
        { $skip: skipAmount },
        { $limit: limit }
    ]).exec();

      const userIds = results.map(result => result.receiverId);
      const usersQuery = 'SELECT * FROM f_get_users_info($1)';
      const usersParams = [userIds];
      const usersInfo = await this.entityManager.query(usersQuery, usersParams);
      const enrichedResults = results.map(conversation => {
        const userInfo = usersInfo.find(user => user.id_user === conversation.receiverId);
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
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const checkParams = [id_user, id_family];
      const results = await this.entityManager.query(query, checkParams);
      const isMember = results[0].f_is_user_member_of_family;
      if (!isMember) {
        throw new RpcException({
          message: 'User is not a member of the family',
          statusCode: HttpStatus.FORBIDDEN
        });
      }
      
      const skip = index * limit;
      const messages = await this.familyConversationsRepository.findOne(
        { familyId: id_family }, 
        { conversations: { 
          $slice: [{ $reverseArray: "$conversations" }, skip, limit] 
        } }
      ).exec();

      if (!messages || messages.length === 0) {
        return [];
      }

      return messages.conversations;
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
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const checkParams = [id_user, messageData.familyId];
      const results = await this.entityManager.query(query, checkParams);
      const isMember = results[0].f_is_user_member_of_family;
      if (!isMember) {
        throw new RpcException({
          message: 'User is not a member of the family',
          statusCode: HttpStatus.FORBIDDEN
        });
      }
      
      const newMessage = {
        senderId: id_user,
        type: 'text',
        content: messageData.message,
        isRead: false,
        timestamp: new Date(),
      };

      await this.familyConversationsRepository.findOneAndUpdate(
        { familyId: messageData.familyId },
        { $push: { conversations: newMessage } },
        { new: true, upsert: true }
      ).exec();

      return newMessage;

    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'An error occurred while saving the family message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async saveFamilyImageMessage(id_user: string, messageData: { imageData: string; familyId: number; }): Promise<any> {
    try {
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const checkParams = [id_user, messageData.familyId];
      const results = await this.entityManager.query(query, checkParams);
      const isMember = results[0].f_is_user_member_of_family;
      if (!isMember) {
        throw new RpcException({
          message: 'User is not a member of the family',
          statusCode: HttpStatus.FORBIDDEN
        });
      }

      const fileName = 'family_' + messageData.familyId + '_' + Date.now();
      const fileUint8Array = await this.base64ToUint8Array(messageData.imageData);
      const params: UploadFileRequest = {
        fileName: fileName,
        file: fileUint8Array,
      };

      const uploadImageData = await this.storageService.uploadImageChat(params);
      const fileUrl = uploadImageData.fileUrl;

      const newMessage = {
        senderId: id_user,
        type: 'photo',
        content: fileUrl,
        isRead: false,
        timestamp: new Date(),
      };

      await this.familyConversationsRepository.findOneAndUpdate(
        { familyId: messageData.familyId },
        { $push: { conversations: newMessage } },
        { new: true, upsert: true }
      ).exec();

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
