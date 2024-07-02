import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = NotificationData & Document;

export enum NotificationType {
  FAMILY = 'FAMILY',
  CHAT = 'CHAT',
  CALENDAR = 'CALENDAR',
  CHECKLIST = 'CHECKLIST',
  GUIDELINE = 'GUIDELINE',
  EDUCATION = 'EDUCATION',
  HOUSEHOLD = 'HOUSEHOLD',
  SHOPPING_LIST = 'SHOPPING_LIST',
  SHOPPING_ITEM = 'SHOPPING_ITEM',
}

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

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: false })
  id_family: number;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  id_target: string | number;

  @Prop({ required: true, default: false })
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
