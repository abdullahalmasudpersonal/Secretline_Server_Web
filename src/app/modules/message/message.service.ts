import { Request } from 'express';
import { Message } from './message.model';
import { Chat } from '../chat/chat.model';
import { User } from '../user/user.model';

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

const getMessageSingleMemberIntoDB = async (req: Request) => {
  const loggedInUserId = req.user.userId;

  const chats = await Chat.find({ userIds: loggedInUserId });

  // Step 2: Populate chat details
  const chatDetails = await Promise.all(
    chats.map(async (chat) => {
      // Find the other user in the chat
      const otherUserId = chat.userIds.find((id) => id !== loggedInUserId);
      const otherUser = await User.find({
        userId: otherUserId,
      }).select('email phone userId');
      // console.log(otherUserId);
      // console.log(otherUser);
      // Get the latest message in this chat
      const latestMessage = await Message.findOne({ chatId: chat._id })
        .sort({ timestamp: -1 }) // Sort by latest timestamp
        .select('content timestamp senderId');

      return {
        chatId: chat._id,
        // isGroupChat: chat.isGroupChat,
        // chatName: chat.isGroupChat ? chat.chatName : otherUser?.name,
        // otherUser: chat.isGroupChat ? undefined : otherUser,
        user: otherUser,
        lastMessage: latestMessage,
        updatedAt: chat.updatedAt,
      };
    }),
  );
  return chatDetails;
};

const getSingleMessageIntoDB = async (req: Request) => {
  const { chatId } = req.params;

  try {
    // Fetch messages for the given chat ID
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    return messages;
  } catch (error) {
    console.log(error, 'error');
  }
};

export const MessageService = {
  createMessageIntoDB,
  getMessageSingleMemberIntoDB,
  getSingleMessageIntoDB,
};