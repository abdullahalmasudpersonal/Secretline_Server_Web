import { Router } from 'express';
import { MessageController } from './message.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/send-message', MessageController.createMessage);

router.get(
  '/get-all-user-chat-single-member',
  auth(USER_ROLE.admin, USER_ROLE.member),
  MessageController.getAllUserChatInSingleMember,
);

router.get(
  '/get-single-user-chat-single-member/:chatId',
  auth(USER_ROLE.admin, USER_ROLE.member),
  MessageController.getSingleUserChatInSingleMember,
);

export const MessageRoute = router;
