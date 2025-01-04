import { Types } from 'mongoose';

export type TMember = {
  userId: string;
  user: Types.ObjectId;
  name: string;
  email: string;
  profileImg?: string;
  about?: string;
  gender?: 'male' | 'female' | 'other';
  isDeleted: boolean;
};
