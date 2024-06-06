import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type UserConversationsDocument = UserConversations & Document;

@Schema()
class Message {
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

  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({ required: true, default: () => Date.now() })
  timestamp: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
class Conversation {
  @Prop({ required: true })
  receiverId: string;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];
}

const ConversationSchema = SchemaFactory.createForClass(Conversation);

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class UserConversations {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: [ConversationSchema], default: [] })
  conversations: Conversation[];
}

export const UserConversationsSchema =
  SchemaFactory.createForClass(UserConversations);
