import { Request } from 'express';
import { Chat } from './chat.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createChatIntoDB = async (req: Request) => {
  const { userId } = req?.user;
  const connectUserId = req.body.connectUserId;

  if (!connectUserId) {
    throw new AppError(httpStatus.CONFLICT, 'Enter the user ID of the user you want to connect with.');
  }

  // Check if chat already exists
  const existingChat = await Chat.findOne({
    userIds: { $all: [userId, connectUserId] },
  });
  if (existingChat) {
    throw new AppError(httpStatus.CONFLICT, 'Chat room alrady existies!!');
  }

  // // Create a new chat
  const newChat = new Chat({
    userIds: [userId, connectUserId],
  });

  const savedChat = await newChat.save();
  return savedChat;
};

export const ChatService = {
  createChatIntoDB,
};
