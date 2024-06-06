import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
class Conversation {
  @Prop({ required: true })
  senderId: string;

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
const ConversationSchema = SchemaFactory.createForClass(Conversation);

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class FamilyConversations {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  familyId: number;

  @Prop({ type: [ConversationSchema], default: [] })
  conversations: Conversation[];
}

export const FamilyConversationsSchema =
  SchemaFactory.createForClass(FamilyConversations);
