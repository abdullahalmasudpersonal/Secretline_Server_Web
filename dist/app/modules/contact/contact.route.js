"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
router.post('/create-contact', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), contact_controller_1.ContactController.createContact);
router.get('/get-my-contact', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), contact_controller_1.ContactController.getMyContact);
exports.ContactRoute = router;
