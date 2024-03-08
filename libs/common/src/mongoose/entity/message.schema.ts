import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class MessageContent extends Document {
  @Prop()
  senderId: string;

  @Prop()
  receiverId: string;

  @Prop()
  content: string;

  @Prop()
  timestamp: Date;
}

export const MessageContentSchema = SchemaFactory.createForClass(MessageContent);

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'MessageContent' })
  content: MessageContent | string;  

  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageDocument = Message & Document;
