import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationData } from '@app/common';
import { Types } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

const limit = 20;

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationData.name) private readonly notificationRepository
  ) { }

  async getNotification(id_user: string, index: number) {
    try {
      const notification = await this.notificationRepository.aggregate([
        { $match: { id_user: id_user } },
        { $unwind: '$notificationArr' },
        { $sort: { 'notificationArr._id': -1 } },
        { $skip: index * limit },
        { $limit: limit },
        { $group: { _id: '$_id', notificationArr: { $push: '$notificationArr' } } }
      ]).exec();

      return notification[0]?.notificationArr || [];
    }
    catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      })
    }
  }

  async createNotification(id_user: string, dto: any, listReceiverId: string[]) {
    try {
      const { title, content, type, data } = dto;

      const newNotifications = listReceiverId.map(() => ({
        _id: new Types.ObjectId(),
        title,
        content,
        type,
        data,
        isRead: false
      }));

      await Promise.all(newNotifications.map((newNotification, index) =>
        this.notificationRepository.updateOne(
          { id_user: listReceiverId[index] },
          { $push: { notificationArr: { $each: [newNotification], $position: 0 } } },
          { upsert: true }
        )
      ));

      return newNotifications.map((notification, index) => ({
        _id: notification._id,
        id_user: listReceiverId[index],
        title,
        content,
        type,
        data,
        isRead: false
      }));
    }
    catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      })
    }
  }

  async markRead(id_user: string, id_notification: string) {
    try {
      const notification = await this.notificationRepository.findOneAndUpdate(
        { id_user: id_user, "notificationArr._id": new Types.ObjectId(id_notification) },
        { $set: { "notificationArr.$.isRead": true } }
      ).exec();
      if (!notification) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Notification not found'
        });
      }
      return { message: 'Notification marked as read' };
    }
    catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message
      })
    }
  }
}
