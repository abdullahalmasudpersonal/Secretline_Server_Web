import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import httpStatus from 'http-status';

const createMember = catchAsync(async (req, res) => {
  const memberData = req?.body?.member;
  const result = await UserService.createMemberIntoDB(req, memberData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member Created Successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await UserService.getMeIntoDB(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get my profile successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateMyProfileIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update my profile successfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all user successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserService.getSingleUserIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get single user successfully',
    data: result,
  });
});

export const UserController = {
  createMember,
  getMe,
  updateMyProfile,
  getAllUser,
  getSingleUser
};
