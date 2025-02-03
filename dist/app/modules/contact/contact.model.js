"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactUserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    about: {
        type: String,
        required: false,
        default: 'Hey there! I am using Secretline.',
    },
});
const contactSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    contacts: [contactUserSchema],
});
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
