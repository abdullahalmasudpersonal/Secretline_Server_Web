"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_constant_1 = require("./user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), user_controller_1.UserController.getAllUser);
router.post('/create-member', user_controller_1.UserController.createMember);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.member), user_controller_1.UserController.getMe);
// router.patch(
//   '/update-my-profile',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.buyer),
//   FileUploadHelper.upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req?.body?.data);
//     return UserController.updateMyProfile(req, res, next);
//   },
// );
exports.UserRoute = router;
