import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  userId: string;
  phone: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'member';
  status: 'active' | 'blocked';
  ipAddress?: string;
  isOnline: boolean;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
