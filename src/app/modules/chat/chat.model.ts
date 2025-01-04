import { model, Schema } from 'mongoose';
import { TChat } from './chat.interface';

const chatSchema = new Schema<TChat>({
  userIds: { type: [String], required: true },
  lastMessage: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export const Chat = model<TChat>('Chat', chatSchema);
