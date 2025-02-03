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
const createChatIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1Id, user2Id } = req.body;
    try {
        // Check if chat already exists
        const existingChat = yield chat_model_1.Chat.findOne({
            userIds: { $all: [user1Id, user2Id] },
        });
        if (existingChat) {
            throw new AppError_1.default(409, 'Chat room alrady existies!!');
        }
        // Create a new chat
        const newChat = new chat_model_1.Chat({
            userIds: [user1Id, user2Id],
        });
        const savedChat = yield newChat.save();
        console.log(savedChat, 'savechat');
        return savedChat;
    }
    catch (error) {
        console.log(' Failed to start chat. ');
    }
});
exports.ChatService = {
    createChatIntoDB,
};
