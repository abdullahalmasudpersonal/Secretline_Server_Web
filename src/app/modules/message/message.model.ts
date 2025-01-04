import { model, Schema } from 'mongoose';
import { TMessage } from './message.interface';

const messageSchema = new Schema<TMessage>({
  chatId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text',
  },
  timestamp: { type: Date, default: Date.now },
});

export const Message = model<TMessage>('Message', messageSchema);
