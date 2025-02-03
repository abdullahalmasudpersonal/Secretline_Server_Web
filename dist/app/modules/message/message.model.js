"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video'],
        default: 'text',
    },
    timestamp: { type: Date, default: Date.now },
});
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
