"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_model_1 = require("./message.model");
const chat_model_1 = require("../chat/chat.model");
const member_model_1 = require("../member/member.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createMessageIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const { chatId, content, messageType } = req.body;
    const chat = yield chat_model_1.Chat.findOne({ _id: chatId });
    if (!chat) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No Chat found');
    }
    const isSenderInChat = chat.userIds.includes(senderId);
    if (!isSenderInChat) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This is not your chat');
    }
    const newMessage = new message_model_1.Message({
        chatId,
        senderId,
        content,
        messageType,
    });
    const savedMessage = yield newMessage.save();
    // Update the chat's last message
    yield chat_model_1.Chat.findByIdAndUpdate({ _id: chatId }, {
        lastMessage: content,
        updatedAt: new Date(),
    });
    return savedMessage;
});
const getAllUserChatInSingleMemberIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
    const loggedInUserId = req.user.userId;
    const chats = yield chat_model_1.Chat.find({ userIds: loggedInUserId });
    const chatDetails = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
        // Find the other user in the chat
        const otherUserId = chat.userIds.find((id) => id !== loggedInUserId);
        const otherUser = yield member_model_1.Member.find({
            userId: otherUserId,
        })
            .select('name')
            .populate({
            path: 'user',
            select: 'userId phone email',
        });
        const [mergedData] = otherUser.map((item) => {
            const user = item.user; // user ফিল্ডকে User টাইপে কাস্ট করা
            return {
                name: item.name,
                userId: user === null || user === void 0 ? void 0 : user.userId,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                email: user === null || user === void 0 ? void 0 : user.email,
            };
        });
        const latestMessage = yield message_model_1.Message.findOne({ chatId: chat._id })
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
    })));
    return chatDetails;
});
const getSingleUserChatInSingleMemberIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    // Step 1: Verify if the chat exists and the user is a participant
    const chat = yield chat_model_1.Chat.findOne({ _id: chatId });
    if (!chat) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Chat not found');
    }
    const loggedInUserId = req.user.userId;
    if (!chat.userIds.includes(loggedInUserId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You are not part of this chat');
    }
    // Step 2: Fetch all messages in the chat
    const messages = yield message_model_1.Message.find({ chatId }).sort({ timestamp: 1 });
    return messages;
});
exports.MessageService = {
    createMessageIntoDB,
    getAllUserChatInSingleMemberIntoDB,
    getSingleUserChatInSingleMemberIntoDB,
};
