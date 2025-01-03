import { model, Schema } from 'mongoose';
import { TMember } from './member.interface';

const memberSchema = new Schema<TMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImg: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    onlineStatus: {
      type: String,
      required: false,
      default: 'offline',
    },
    gender: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Member = model<TMember>('Member', memberSchema);
