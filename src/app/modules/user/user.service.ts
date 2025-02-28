import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TMember } from '../member/member.interface';
import { User } from './user.model';
import { TUser } from './user.interface';
import httpStatus from 'http-status';
import { generateMemberId } from '../member/member.constant';
import { Request } from 'express';
import requestIp from 'request-ip';
import { Member } from '../member/member.model';
import { IUploadFile } from '../../interface/file';
import { USER_ROLE } from './user.constant';

const createMemberIntoDB = async (req: Request, payload: TMember) => {
  const ip = requestIp?.getClientIp(req);
  const { password } = req?.body;
  const { phone } = req?.body?.member;

  const existsUser = await User.findOne({ email: payload?.email });
  if (existsUser) {
    throw new AppError(409, 'User Alrady Exists!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: Partial<TUser> = {};

    userData.userId = await generateMemberId();
    userData.phone = phone;
    userData.email = payload?.email;
    userData.password = password;
    userData.role = 'member';
    userData.ipAddress = ip || '';

    const createNewUser = await User.create([userData], { session });

    if (!createNewUser?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.userId = createNewUser[0].userId;
    payload.user = createNewUser[0]._id;
    payload.name = payload.name;
    payload.email = createNewUser[0].email;
    payload.about = payload.about;
    // payload.onlineStatus=payload./

    const createNewMember = await Member.create([payload], { session });

    if (!createNewMember.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Member');
    }

    await session.commitTransaction();
    await session.endSession();
    return createNewMember;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getMeIntoDB = async (email: string, role: string) => {
  let result = null;
  if (role === 'member') {
    result = await Member.findOne({ email }).populate('user');
  }
  return result;
};

const updateMyProfileIntoDB = async (req: Request) => {
  const user = req?.user;
  const userData = await User.findOne({ email: user?.email });
  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exists!');
  }
  const file = req.file as IUploadFile;
  req.body.profileImg = file?.path;

  let profileData;

  if (userData?.role === USER_ROLE.member) {
    profileData = await Member.findOneAndUpdate(
      { email: userData?.email },
      { $set: req.body },
    );
  }
  // else if (userData?.role === USER_ROLE.admin) {
  //   profileData = await Admin.findOneAndUpdate(
  //     { email: userData?.email },
  //     { $set: req.body },
  //   );
  // } else if (userData?.role === USER_ROLE.buyer) {
  //   profileData = await Buyer.findOneAndUpdate(
  //     { email: userData?.email },
  //     { $set: req.body },
  //   );
  // }
  return profileData;
};

const getAllUserIntoDB = async (req: Request) => {
  return await User.find();
};

const getSingleUserIntoDB = async (req: Request) => {
  const userId = req?.params?.userId;

  const user = await Member.findOne({ userId })
    .select({
      name: true,
      profileImg: true,
    })
    .populate({ path: 'user', select: 'isOnline' });
  return user;
};

export const UserService = {
  createMemberIntoDB,
  getMeIntoDB,
  updateMyProfileIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
};
