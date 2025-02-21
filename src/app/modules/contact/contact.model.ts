import { model, Schema } from 'mongoose';
import { TContact, TContactUser } from './contact.interface';

const contactUserSchema = new Schema<TContactUser>({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  about: {
    type: String,
    required: false,
    default: 'Hey there! I am using Secretline.',
  },
});

const contactSchema = new Schema<TContact>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: [contactUserSchema],
});

export const Contact = model<TContact>('Contact', contactSchema);
