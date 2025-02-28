import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageService } from './message.service';
import { Request } from 'express';

const createMessage = catchAsync(async (req: Request, res) => {
  const result = await MessageService.createMessageIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Create message successfully',
    data: result,
  });
});

const createVoiceMessage = catchAsync(async (req: Request, res) => {
  const result = await MessageService.createVocieMessageIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Create voice message successfully',
    data: result,
  });
});

const getAllUserChatInSingleMember = catchAsync(async (req, res) => {
  const result = await MessageService.getAllUserChatInSingleMemberIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all user chat in single member successfully',
    data: result,
  });
});

const getSingleUserChatInSingleMember = catchAsync(async (req, res) => {
  const result =
    await MessageService.getSingleUserChatInSingleMemberIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get single user chat in single member successfully',
    data: result,
  });
});

export const MessageController = {
  createMessage,
  createVoiceMessage,
  getAllUserChatInSingleMember,
  getSingleUserChatInSingleMember,
};
