import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

interface FamilyMessage {
  senderId: string;
  content: string;
  timestamp: Date;
}

export type FamilyMessageContentDocument = FamilyMessageContent & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: false, 
})
export class FamilyMessageContent {
  @Prop({ required: true, unique: true })
  _id: number;

  @Prop({ type: [{ senderId: String, content: String, timestamp: Date }], default: [] })
  messages: FamilyMessage[];
}

export const FamilyMessageContentSchema = SchemaFactory.createForClass(FamilyMessageContent);

FamilyMessageContentSchema.methods.addMessage = function(familyId: number, senderId: string, content: string) {
  this.messages.push({ senderId, content, timestamp: new Date() });
  return this.save();
};
