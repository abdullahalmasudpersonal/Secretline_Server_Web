import { Request } from 'express';
import { Message } from './message.model';
import { Chat } from '../chat/chat.model';
import { User } from '../user/user.model';
import { Member } from '../member/member.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createMessageIntoDB = async (req: Request) => {
  const { chatId, senderId, content, messageType } = req.body;
  try {
    /////
    const newMessage = new Message({
      chatId,
      senderId,
      content,
      messageType,
    });
    const savedMessage = await newMessage.save();

    // Update the chat's last message
    await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        lastMessage: content,
        updatedAt: new Date(),
      },
    );
    return savedMessage;
  } catch (error) {
    console.log('error', error);
  }
};

const getAllUserChatInSingleMemberIntoDB = async (req: Request) => {
  // const loggedInUserId = req.user.userId;
  // const chats = await Chat.find({ userIds: loggedInUserId });
  // // Step 2: Populate chat details
  // const chatDetails = await Promise.all(
  //   chats.map(async (chat) => {
  //     // Find the other user in the chat
  //     const otherUserId = chat.userIds.find((id) => id !== loggedInUserId);
  //     const otherUser = await User.find({
  //       userId: otherUserId,
  //     }).select('email phone userId');
  //     // console.log(otherUserId);
  //     // console.log(otherUser);
  //     // Get the latest message in this chat
  //     const latestMessage = await Message.findOne({ chatId: chat._id })
  //       .sort({ timestamp: -1 }) // Sort by latest timestamp
  //       .select('content timestamp senderId');

  //     return {
  //       chatId: chat._id,
  //       // isGroupChat: chat.isGroupChat,
  //       // chatName: chat.isGroupChat ? chat.chatName : otherUser?.name,
  //       // otherUser: chat.isGroupChat ? undefined : otherUser,
  //       user: otherUser,
  //       lastMessage: latestMessage,
  //       updatedAt: chat.updatedAt,
  //     };
  //   }),
  // );
  // return chatDetails;
  // /////////////////////////////////////////////
  // interface Member {
  //   name: string;
  //   user: User | Types.ObjectId; // Either a populated object or an ObjectId
  // }
  interface User {
    userId: string;
    phone: string;
    email: string;
  }
  interface mergedData {
    name: string;
    userId: string;
    phone: string;
    email: string;
  }
  const loggedInUserId = req.user.userId;

  const chats = await Chat.find({ userIds: loggedInUserId });
  const chatDetails = await Promise.all(
    chats.map(async (chat) => {
      // Find the other user in the chat
      const otherUserId = chat.userIds.find((id) => id !== loggedInUserId);
      const otherUser = await Member.find({
        userId: otherUserId,
      })
        .select('name')
        .populate({
          path: 'user',
          select: 'userId phone email',
        });
      const [mergedData] = otherUser.map((item) => {
        const user = item.user as unknown as User; // user ফিল্ডকে User টাইপে কাস্ট করা
        return {
          name: item.name,
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
        lastMessage: latestMessage,
        updatedAt: chat.updatedAt,
      };
    }),
  );

  return chatDetails;
};

const getSingleUserChatInSingleMemberIntoDB = async (req: Request) => {
  const { chatId } = req.params;

  // Step 1: Verify if the chat exists and the user is a participant
  const chat = await Chat.findOne({ _id: chatId });
  if (!chat) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat not found');
  }

  const loggedInUserId = req.user.userId;
  if (!chat.userIds.includes(loggedInUserId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not part of this chat');
  }

  // Step 2: Fetch all messages in the chat
  const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
  return messages;
};

export const MessageService = {
  createMessageIntoDB,
  getAllUserChatInSingleMemberIntoDB,
  getSingleUserChatInSingleMemberIntoDB,
};
