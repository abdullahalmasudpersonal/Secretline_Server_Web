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
exports.ChatService = void 0;
const chat_model_1 = require("./chat.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const message_model_1 = require("../message/message.model");
const member_model_1 = require("../member/member.model");
const createChatIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req === null || req === void 0 ? void 0 : req.user;
    const connectUserId = req.body.connectUserId;
    if (!connectUserId) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Enter the user ID of the user you want to connect with.');
    }
    // Check if chat already exists
    const existingChat = yield chat_model_1.Chat.findOne({
        userIds: { $all: [userId, connectUserId] },
    });
    if (existingChat) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Chat room alrady existies!!');
    }
    // // Create a new chat
    const newChat = new chat_model_1.Chat({
        userIds: [userId, connectUserId],
    });
    const savedChat = yield newChat.save();
    return savedChat;
});
const getAllChattingUserSingleMemberIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.user.userId;
    const chats = yield chat_model_1.Chat.find({ userIds: loggedInUserId }).sort({
        updatedAt: -1,
    });
    const chatDetails = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
        // Find the other user in the chat
        const otherUserId = chat.userIds.find((id) => id !== loggedInUserId);
        const otherUser = yield member_model_1.Member.find({
            userId: otherUserId,
        })
            .select('name profileImg')
            .populate({
            path: 'user',
            select: 'userId phone email',
        });
        const [mergedData] = otherUser.map((item) => {
            const user = item.user; // user ফিল্ডকে User টাইপে কাস্ট করা
            return {
                name: item.name,
                profileImg: item.profileImg,
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
            profileImg: mergedData.profileImg,
            lastMessage: latestMessage,
            updatedAt: chat.updatedAt,
        };
    })));
    return chatDetails;
});
exports.ChatService = {
    createChatIntoDB,
    getAllChattingUserSingleMemberIntoDB,
};
