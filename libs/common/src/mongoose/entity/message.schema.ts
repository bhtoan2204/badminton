import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type MessageContentDocument = MessageContent & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class MessageContent {
  _id: Types.ObjectId;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true, enum: ['text', 'photo', 'video'] })
  type: string;

  @Prop({ required: false })
  content?: string;

  @Prop({ required: false })
  photoUrl?: string;
  
  @Prop({ required: false })
  videoUrl?: string;
}

export const MessageContentSchema = SchemaFactory.createForClass(MessageContent);
