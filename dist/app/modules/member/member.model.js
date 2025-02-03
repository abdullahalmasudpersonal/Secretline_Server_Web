"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const mongoose_1 = require("mongoose");
const memberSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImg: {
        type: String,
        required: false,
    },
    about: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        required: false,
    },
}, {
    timestamps: true,
});
exports.Member = (0, mongoose_1.model)('Member', memberSchema);
