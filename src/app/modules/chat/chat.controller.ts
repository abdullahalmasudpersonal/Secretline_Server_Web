import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatService } from './chat.service';

const createChat = catchAsync(async (req, res) => {
  const result = await ChatService.createChatIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Create chat successfully',
    data: result,
  });
});

export const ChatController = {
  createChat,
};
