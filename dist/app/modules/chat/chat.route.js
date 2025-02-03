"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoute = void 0;
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
router.post('/create-chat', chat_controller_1.ChatController.createChat);
exports.ChatRoute = router;
