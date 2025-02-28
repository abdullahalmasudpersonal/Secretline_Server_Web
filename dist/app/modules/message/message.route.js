"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoute = void 0;
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const fileUploadHelper_1 = require("../../utils/fileUploadHelper");
const router = (0, express_1.Router)();
router.post('/send-message', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), message_controller_1.MessageController.createMessage);
router.post('/send-voice-message', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), fileUploadHelper_1.FileUploadHelper.uploadAudio.single('audio'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    return message_controller_1.MessageController.createVoiceMessage(req, res, next);
});
router.get('/get-all-user-chat-single-member', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), message_controller_1.MessageController.getAllUserChatInSingleMember);
router.get('/get-single-user-chat-single-member/:chatId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), message_controller_1.MessageController.getSingleUserChatInSingleMember);
exports.MessageRoute = router;
