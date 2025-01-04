import { Request } from 'express';
import { TLoginUser } from './auth.interface';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { createToken } from './auth.utils';
import config from '../../config';
import requestIp from 'request-ip';

const loginUserIntoDB = async (req: Request) => {
  const payload: TLoginUser = req.body;
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password is incorrect!');
  const jwtPayload = {
    userId: user.userId,
    phone: user.phone,
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt.accessToken as string,
    config.jwt.accessTokenExpriesin as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refreshtoken as string,
    config.jwt.refreshtokenexpiresin as string,
  );
  if (user.role === 'member') {
    await User.updateOne({ email: user?.email }, { $set: { isOnline: true } });
  }
  // if (user.role === 'admin') {
  //   await Admin.updateOne(
  //     { email: user?.email },
  //     { $set: { onlineStatus: 'online' } },
  //   );
  // }
  // if (user.role === 'superAdmin') {
  //   await Admin.updateOne(
  //     { email: user?.email },
  //     { $set: { onlineStatus: 'online' } },
  //   );
  // }
  const ip = requestIp.getClientIp(req);
  await User.updateOne({ email: payload?.email }, { ipAddress: ip });
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUserIntoDB,
};
