import { Request } from 'express';
import { Chat } from './chat.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Message } from '../message/message.model';
import { Member } from '../member/member.model';

const createChatIntoDB = async (req: Request) => {
  const { userId } = req?.user;
  const connectUserId = req.body.connectUserId;

  if (!connectUserId) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Enter the user ID of the user you want to connect with.',
    );
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

const getAllChattingUserSingleMemberIntoDB = async (req: Request) => {
  interface User {
    userId: string;
    phone: string;
    email: string;
    profileImg: string;
  }

  const loggedInUserId = req.user.userId;

  const chats = await Chat.find({ userIds: loggedInUserId }).sort({
    updatedAt: -1,
  });
  const chatDetails = await Promise.all(
    chats.map(async (chat) => {
      // Find the other user in the chat
      const otherUserId = chat.userIds.find((id) => id !== loggedInUserId);
      const otherUser = await Member.find({
        userId: otherUserId,
      })
        .select('name profileImg')
        .populate({
          path: 'user',
          select: 'userId phone email',
        });
      const [mergedData] = otherUser.map((item) => {
        const user = item.user as unknown as User; // user ফিল্ডকে User টাইপে কাস্ট করা
        return {
          name: item.name,
          profileImg: item.profileImg,
          userId: user?.userId,
          phone: user?.phone,
          email: user?.email,
        };
      });

      const latestMessage = await Message.findOne({ chatId: chat._id })
        .sort({ timestamp: -1 }) // Sort by latest timestamp
        .select('content timestamp senderId');

      return {
        chatId: chat._id,
        name: mergedData.name,
        userId: mergedData.userId,
        phone: mergedData.phone,
        email: mergedData.email,
        profileImg: mergedData.profileImg,
        lastMessage: latestMessage,
        updatedAt: chat.updatedAt,
      };
    }),
  );

  return chatDetails;
};

export const ChatService = {
  createChatIntoDB,
  getAllChattingUserSingleMemberIntoDB,
};
