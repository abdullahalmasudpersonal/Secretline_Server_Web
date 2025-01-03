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

export const UserController = {
  createMember,
};
