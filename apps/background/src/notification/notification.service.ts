import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GerUserIdsRequest,
  GetFamiliesRequest,
  GetFamilyRequest,
  GetFamilyResponse,
  GetUserResponse,
  GetUsersRequest,
  NotificationData,
  NotificationDetail,
} from '@app/common';
import { Types } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { NotificationDataInterface } from './notification.processor';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FamilyService } from '../family/family.service';
import { UserService } from '../user/user.service';

const limit = 20;

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationData.name) private readonly notificationRepository,
    @InjectQueue('chats') private readonly chatsQueue: Queue,
    private readonly familyService: FamilyService,
    private readonly userService: UserService,
  ) {}

  async getNotification(id_user: string, index: number) {
    try {
      const notificationPipeline = [
        { $match: { id_user: id_user } },
        { $unwind: '$notificationArr' },
        { $sort: { 'notificationArr._id': -1 } },
        { $skip: index * limit },
        { $limit: limit },
        {
          $group: {
            _id: '$_id',
            notificationArr: { $push: '$notificationArr' },
          },
        },
      ];
      const notification = await this.notificationRepository
        .aggregate(notificationPipeline)
        .exec();
      const notificationArr: (NotificationDetail & {
        familyInfo?: { name: string; avatar: string };
        userInfo?: { name: string; avatar: string };
      })[] = notification[0]?.notificationArr || [];

      const familyIds = new Set<number>();
      const userIds = new Set<string>();
      notificationArr.forEach((notification) => {
        if (notification.id_family) {
          familyIds.add(notification.id_family);
        } else {
          userIds.add(notification.id_target.toString());
        }
      });

      const getFamiliesRequest: GetFamiliesRequest = {
        idFamilies: Array.from(familyIds),
      };
      const families = await this.familyService.findByIds(getFamiliesRequest);

      const userRequest: GetUsersRequest = { idUsers: Array.from(userIds) };
      const users = await this.userService.findByIds(userRequest);

      const familyMap = new Map<number, GetFamilyResponse>();
      families.families.forEach((family) =>
        familyMap.set(family.idFamily, family),
      );
      const userMap = new Map<string, GetUserResponse>();
      if (users.users !== undefined) {
        users.users.forEach((user) => userMap.set(user.idUser, user));
      }

      notificationArr.forEach((notification) => {
        if (notification.id_family) {
          const family = familyMap.get(notification.id_family);
          notification.familyInfo = family
            ? { name: family.name, avatar: family.avatar }
            : null;
        } else {
          const user = userMap.get(notification.id_target as any);
          notification.userInfo = user
            ? {
                name: `${user.firstname} ${user.lastname}`,
                avatar: user.avatar,
              }
            : null;
        }
      });
      const unreadCountPipeline = [
        { $match: { id_user: id_user } },
        { $unwind: '$notificationArr' },
        { $match: { 'notificationArr.isRead': false } },
        { $count: 'unreadCount' },
      ];
      const unreadCountResult = await this.notificationRepository
        .aggregate(unreadCountPipeline)
        .exec();
      const unreadCount = unreadCountResult[0]?.unreadCount || 0;
      return {
        data: notificationArr,
        unreadCount: unreadCount,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  async createNotificationProcessorUser(
    id_user: string,
    notificationData: NotificationDataInterface,
  ) {
    try {
      const { title, content, type, id_target, title_vn, content_vn } =
        notificationData;
      const notificationDetail = {
        _id: new Types.ObjectId(),
        title,
        title_vn,
        content,
        content_vn,
        type,
        id_family: null,
        id_target,
      };
      await this.notificationRepository.updateOne(
        { id_user: id_user },
        { $push: { notificationArr: notificationDetail } },
        { upsert: true },
      );
      return notificationDetail;
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationProcessorFamily(
    id_family: number,
    notificationData: NotificationDataInterface,
  ) {
    try {
      const idsUserInFamilyRequest: GerUserIdsRequest = { idFamily: id_family };
      const idsUserInFamily = await this.familyService.getIdsUserInFamily(
        idsUserInFamilyRequest,
      );
      const userIds = idsUserInFamily.idUser;
      const getFamilyReq: GetFamilyRequest = { idFamily: id_family };
      const family = await this.familyService.findById(getFamilyReq);
      const familyInfo = family
        ? { name: family.name, avatar: family.avatar }
        : null;
      await Promise.all(
        userIds.map(async (userId) => {
          const notificationDetail = {
            _id: new Types.ObjectId(),
            title: notificationData.title,
            title_vn: notificationData.title_vn,
            content: notificationData.content,
            content_vn: notificationData.content_vn,
            type: notificationData.type,
            id_family,
            id_target: notificationData.id_target,
          };
          await this.notificationRepository.updateOne(
            { id_user: userId },
            { $push: { notificationArr: notificationDetail } },
            { upsert: true },
          );
          await this.chatsQueue.add('sendNotification', {
            id_user: userId,
            notification: { familyInfo, ...notificationDetail },
          });
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async markRead(id_user: string, id_notification: string) {
    try {
      const notification = await this.notificationRepository
        .findOneAndUpdate(
          {
            id_user: id_user,
            'notificationArr._id': new Types.ObjectId(id_notification),
          },
          { $set: { 'notificationArr.$.isRead': true } },
        )
        .exec();
      if (!notification) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Notification not found',
        });
      }
      return { message: 'Notification marked as read' };
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  async markAllRead(id_user: string) {
    try {
      await this.notificationRepository.updateMany(
        { id_user: id_user, 'notificationArr.isRead': false },
        { $set: { 'notificationArr.$[elem].isRead': true } },
        { arrayFilters: [{ 'elem.isRead': false }] },
      );

      return { message: 'All notifications marked as read' };
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}
