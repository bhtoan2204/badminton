import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type NotificationDocument = NotificationData & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
class NotificationDetail {
  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  isRead: boolean;

  @Prop({ required: true, default: () => Date.now() })
  timestamp: Date;
}

export const NotificationDetailSchema =
  SchemaFactory.createForClass(NotificationDetail);

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class NotificationData {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  id_user: string;

  @Prop({ type: [NotificationDetailSchema], default: [] })
  notificationArr: NotificationDetail[];
}

export const NotificationDataSchema =
  SchemaFactory.createForClass(NotificationData);
