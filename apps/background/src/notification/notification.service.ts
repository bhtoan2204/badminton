import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Family, MemberFamily, NotificationData, Users } from '@app/common';
import { Types } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { NotificationDataInterface } from './notification.processor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

const limit = 20;

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationData.name) private readonly notificationRepository,
    @InjectRepository(MemberFamily)
    private memberFamilyRepository: Repository<MemberFamily>,
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectQueue('chats') private readonly chatsQueue: Queue,
  ) {}

  async getNotification(id_user: string, index: number) {
    try {
      const notification = await this.notificationRepository
        .aggregate([
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
        ])
        .exec();

      const notificationArr = notification[0]?.notificationArr || [];

      const familyIds = new Set<number>();
      const userIds = new Set<string>();

      notificationArr.forEach((notification) => {
        if (notification.id_family) {
          familyIds.add(parseInt(notification.id_family));
        } else {
          userIds.add(notification.id_target.toString());
        }
      });

      const families = await this.familyRepository.findByIds(
        Array.from(familyIds),
      );
      const users = await this.userRepository.findByIds(Array.from(userIds));

      const familyMap = new Map<number, Family>();
      families.forEach((family) => familyMap.set(family.id_family, family));

      const userMap = new Map<string, Users>();
      users.forEach((user) => userMap.set(user.id_user, user));

      notificationArr.forEach((notification) => {
        if (notification.id_family) {
          const family = familyMap.get(notification.id_family);
          notification.familyInfo = family
            ? { name: family.name, avatar: family.avatar }
            : null;
        } else {
          const user = userMap.get(notification.id_target);
          notification.userInfo = user
            ? {
                name: `${user.firstname} ${user.lastname}`,
                avatar: user.avatar,
              }
            : null;
        }
      });

      return notificationArr;
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
      const { title, content, type, id_target } = notificationData;
      const notificationDetail = {
        _id: new Types.ObjectId(),
        title,
        content,
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
      const memberFamilies = await this.memberFamilyRepository.find({
        where: {
          id_family,
        },
      });
      const userIds = memberFamilies.map(
        (memberFamily) => memberFamily.id_user,
      );
      const family = await this.familyRepository.findOne({
        where: { id_family },
      });
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
}
