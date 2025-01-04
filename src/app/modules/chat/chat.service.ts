import { Request } from 'express';
import { Chat } from './chat.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createChatIntoDB = async (req: Request) => {
  const { user1Id, user2Id } = req.body;

  try {
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      userIds: { $all: [user1Id, user2Id] },
    });

    if (existingChat) {
      throw new AppError(409, 'Chat room alrady existies!!');
    }

    // Create a new chat
    const newChat = new Chat({
      userIds: [user1Id, user2Id],
    });

    const savedChat = await newChat.save();
    console.log(savedChat, 'savechat');
    return savedChat;
  } catch (error) {
    console.log(' Failed to start chat. ');
  }
};

export const ChatService = {
  createChatIntoDB,
};
