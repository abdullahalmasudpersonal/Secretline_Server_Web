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

const getMessageSingleMember = catchAsync(async (req, res) => {
  const result = await MessageService.getMessageSingleMemberIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get single member message successfully',
    data: result,
  });
});

const getSingleMessage = catchAsync(async (req, res) => {
  const result = await MessageService.getSingleMessageIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get single message successfully',
    data: result,
  });
});

export const MessageController = {
  createMessage,
  getMessageSingleMember,
  getSingleMessage,
};
