"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
// const chatUserIdSchema = new Schema<TChatUserId>({
//   userId: {
//     type: String,
//     required: true,
//     unique: true
//   }
// })
const chatSchema = new mongoose_1.Schema({
    userIds: {
        type: [String],
        required: true,
        unique: true
    },
    lastMessage: { type: String },
    updatedAt: { type: Date, default: Date.now },
});
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
