import {
  FamilyConversations,
  UploadFileRequest,
  UserConversations,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { StorageService } from './storage/storage.service';
import { EntityManager } from 'typeorm';
import path from 'path';

const limit = 30;

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(UserConversations.name) private userConversationsRepository,
    @InjectModel(FamilyConversations.name)
    private familyConversationsRepository,
    private readonly storageService: StorageService,
    private readonly entityManager: EntityManager,
  ) {}

  async updateConversationWithExistOne(
    userId: string,
    partnerId: string,
    newMessage: any,
  ) {
    const conversationExists = await this.userConversationsRepository.findOne({
      userId,
      'conversations.receiverId': partnerId,
    });

    if (conversationExists) {
      return this.userConversationsRepository.findOneAndUpdate(
        { userId, 'conversations.receiverId': partnerId },
        { $push: { 'conversations.$.messages': newMessage } },
        { new: true },
      );
    } else {
      return this.userConversationsRepository.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            conversations: { receiverId: partnerId, messages: [newMessage] },
          },
        },
        { upsert: true, new: true },
      );
    }
  }

  async base64ToUint8Array(base64: string): Promise<Uint8Array> {
    const buffer = Buffer.from(base64, 'base64');
    return new Uint8Array(buffer);
  }

  async getUsersChat(id_user: string, index: number): Promise<any> {
    try {
      const skipAmount = index * limit;

      const results = await this.userConversationsRepository
        .aggregate([
          { $match: { userId: id_user } },
          { $unwind: '$conversations' },
          { $unwind: '$conversations.messages' },
          { $sort: { 'conversations.messages.timestamp': -1 } },
          {
            $group: {
              _id: '$conversations._id',
              receiverId: { $first: '$conversations.receiverId' },
              created_at: { $first: '$conversations.created_at' },
              updated_at: { $first: '$conversations.updated_at' },
              latestMessage: { $first: '$conversations.messages' },
            },
          },
          {
            $group: {
              _id: '$userId',
              conversations: {
                $push: {
                  _id: '$_id',
                  receiverId: '$receiverId',
                  created_at: '$created_at',
                  updated_at: '$updated_at',
                  messages: ['$latestMessage'],
                },
              },
            },
          },
          {
            $lookup: {
              from: 'userConversations',
              localField: '_id',
              foreignField: 'userId',
              as: 'userDocument',
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  { $arrayElemAt: ['$userDocument', 0] },
                  { conversations: '$conversations' },
                ],
              },
            },
          },
          { $skip: skipAmount },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              userId: 1,
              __v: 1,
              conversations: 1,
              created_at: 1,
              updated_at: 1,
            },
          },
        ])
        .exec();
      const datas = results[0].conversations;

      const userIds = datas.map((result) => result.receiverId);
      const usersQuery = 'SELECT * FROM f_get_users_info($1)';
      const usersParams = [userIds];
      const usersInfo = await this.entityManager.query(usersQuery, usersParams);
      const enrichedResults = datas.map((data) => {
        const userInfo = usersInfo.find(
          (user) => user.id_user === data.receiverId,
        );
        return {
          ...data,
          user: userInfo
            ? {
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                avatar: userInfo.avatar,
              }
            : null,
        };
      });

      return enrichedResults;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getMessages(
    senderId: string,
    receiverId: string,
    index: number,
  ): Promise<any[]> {
    try {
      const skip = index * limit;
      const conversationForCount =
        await this.userConversationsRepository.findOne(
          {
            userId: senderId,
            'conversations.receiverId': receiverId,
          },
          { 'conversations.$': 1 },
        );

      if (
        !conversationForCount ||
        conversationForCount.conversations.length === 0
      ) {
        throw new RpcException({
          message: 'Conversation not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const totalMessages =
        conversationForCount.conversations[0].messages.length;

      if (skip >= totalMessages) {
        return [];
      }
      const messagesPosition = Math.max(totalMessages - skip - limit, 0);
      const conversation = await this.userConversationsRepository
        .aggregate([
          {
            $match: {
              userId: senderId,
              'conversations.receiverId': receiverId,
            },
          },
          { $unwind: '$conversations' },
          { $match: { 'conversations.receiverId': receiverId } },
          {
            $project: {
              messages: {
                $slice: ['$conversations.messages', messagesPosition, limit],
              },
            },
          },
        ])
        .exec();

      if (
        !conversation ||
        conversation.length === 0 ||
        conversation[0].messages.length === 0
      ) {
        return [];
      }

      const messages = conversation[0].messages.reverse();
      return messages;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFamilyChats(familyId): Promise<any> {
    try {
      const conversations = await this.familyConversationsRepository
        .aggregate([
          { $match: { familyId: { $in: familyId } } },
          { $unwind: '$conversations' },
          { $sort: { 'conversations.timestamp': -1 } },
          {
            $group: {
              _id: '$_id',
              lastMessage: { $first: '$conversations' },
              lastUpdated: { $first: '$updated_at' },
            },
          },
          { $sort: { 'lastMessage.timestamp': -1 } },
          { $limit: familyId.length },
        ])
        .exec();

      return conversations;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFamilyMessages(
    id_user: string,
    id_family: number,
    index: number,
  ): Promise<any> {
    try {
      const skip = index * limit;
      const messages = await this.familyConversationsRepository
        .findOne(
          { familyId: id_family },
          {
            conversations: {
              $slice: [{ $reverseArray: '$conversations' }, skip, limit],
            },
          },
        )
        .lean()
        .exec();

      if (!messages || messages.length === 0) {
        return [];
      }

      const userIds = messages.conversations.reduce((uniqueIds, message) => {
        if (!uniqueIds.includes(message.senderId)) {
          uniqueIds.push(message.senderId);
        }
        return uniqueIds;
      }, []);

      const userInfos = await this.entityManager.query(
        'SELECT * FROM f_get_users_infos($1)',
        [userIds],
      );
      const userInfoMap = new Map(
        userInfos.map((user) => [user.id_user, user]),
      );

      const result = messages.conversations.map((conversation) => ({
        ...conversation,
        userInfo: userInfoMap.get(conversation.senderId),
      }));
      return result;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async saveMessage(
    id_user: string,
    messageData: { message: string; receiverId: string },
  ): Promise<any> {
    try {
      if (
        !id_user ||
        !messageData.receiverId ||
        id_user === messageData.receiverId
      ) {
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

      await Promise.all([
        this.updateConversationWithExistOne(
          id_user,
          messageData.receiverId,
          newMessage,
        ),
        this.updateConversationWithExistOne(
          messageData.receiverId,
          id_user,
          newMessage,
        ),
      ]);

      return newMessage;
    } catch (error) {
      throw new RpcException({
        message: error.message || 'An error occurred while saving the message.',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async saveFamilyMessage(
    id_user: string,
    messageData: { message: string; familyId: number },
  ): Promise<any> {
    try {
      const newMessage = {
        senderId: id_user,
        type: 'text',
        content: messageData.message,
        isRead: false,
        timestamp: new Date(),
      };

      await this.familyConversationsRepository
        .findOneAndUpdate(
          { familyId: messageData.familyId },
          { $push: { conversations: newMessage } },
          { new: true, upsert: true },
        )
        .exec();

      return newMessage;
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.message || 'An error occurred while saving the family message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async saveFamilyImageMessage(
    id_user: string,
    messageData: { imageData: string; familyId: number },
  ): Promise<any> {
    try {
      const fileName = 'family_' + messageData.familyId + '_' + Date.now();
      const fileUint8Array = await this.base64ToUint8Array(
        messageData.imageData,
      );
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

      await this.familyConversationsRepository
        .findOneAndUpdate(
          { familyId: messageData.familyId },
          { $push: { conversations: newMessage } },
          { new: true, upsert: true },
        )
        .exec();

      return newMessage;
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.message || 'An error occurred while saving the family message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async updateOrCreateConversation(
    userId: string,
    partnerId: string,
    newMessage: any,
  ) {
    const conversationExists = await this.userConversationsRepository.findOne({
      userId,
      'conversations.receiverId': partnerId,
    });

    if (conversationExists) {
      return this.userConversationsRepository.findOneAndUpdate(
        { userId, 'conversations.receiverId': partnerId },
        { $push: { 'conversations.$.messages': newMessage } },
        { new: true },
      );
    } else {
      return this.userConversationsRepository.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            conversations: { receiverId: partnerId, messages: [newMessage] },
          },
        },
        { upsert: true, new: true },
      );
    }
  }

  async saveImageMessage(
    id_user: string,
    receiverId: string,
    file: any,
  ): Promise<any> {
    try {
      if (!file) {
        throw new RpcException({
          message: 'File is required',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      let fileUrl = null;
      const fileName = 'chat_' + id_user + '_' + Date.now();
      const params: UploadFileRequest = {
        file: new Uint8Array(file.buffer.data),
        fileName: fileName,
      };
      const uploadImageData = await this.storageService.uploadImageChat(params);
      fileUrl = uploadImageData.fileUrl;

      const newMessage = {
        senderId: id_user,
        receiverId: receiverId,
        type: 'photo',
        content: fileUrl,
        isRead: false,
        timestamp: new Date(),
      };

      await Promise.all([
        this.updateOrCreateConversation(id_user, receiverId, newMessage),
        this.updateOrCreateConversation(receiverId, id_user, newMessage),
      ]);

      return newMessage;
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.message || 'An error occurred while saving the message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async saveVideoMessage(id_user: string, receiverId: string, file: any) {
    try {
      if (!file) {
        throw new RpcException({
          message: 'File is required',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      let fileUrl = null;
      const fileExtension = file.originalname;
      const fileName =
        'chat_' + id_user + '_' + Date.now() + '_' + fileExtension;
      console.log('fileName', fileName);
      const params: UploadFileRequest = {
        file: new Uint8Array(file.buffer.data),
        fileName: fileName,
      };
      const uploadImageData = await this.storageService.uploadVideoChat(params);
      fileUrl = uploadImageData.fileUrl;

      const newMessage = {
        senderId: id_user,
        receiverId: receiverId,
        type: 'video',
        content: fileUrl,
        isRead: false,
        timestamp: new Date(),
      };

      await Promise.all([
        this.updateOrCreateConversation(id_user, receiverId, newMessage),
        this.updateOrCreateConversation(receiverId, id_user, newMessage),
      ]);

      return newMessage;
    } catch (error) {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.message || 'An error occurred while saving the message.';
      throw new RpcException({ message, statusCode });
    }
  }

  async markSeen(id_user: string, receiver_id: string): Promise<any> {
    try {
      const updatedConversation =
        await this.userConversationsRepository.findOneAndUpdate(
          { userId: id_user, 'conversations.receiverId': receiver_id },
          {
            $set: {
              'conversations.$.messages.$[elem].isRead': true,
              'conversations.$.messages.$[elem].timestamp': new Date(),
            },
          },
          {
            arrayFilters: [{ 'elem.isRead': false }],
            new: true,
          },
        );

      if (!updatedConversation) {
        throw new RpcException({
          message: 'Conversation not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      return { message: 'Mark Seen successfully' };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async removeMessage(
    id_user: string,
    receiver_id: string,
    id_message: string,
  ): Promise<any> {
    try {
      const updatedConversation =
        await this.userConversationsRepository.findOneAndUpdate(
          { userId: id_user, 'conversations.receiverId': receiver_id },
          {
            $pull: { 'conversations.$.messages': { _id: id_message } },
          },
          { new: true },
        );

      if (!updatedConversation) {
        throw new RpcException({
          message: 'Conversation not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      return { message: 'Remove message successfully' };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
