import { Router } from 'express';
import { MessageController } from './message.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/send-message', MessageController.createMessage);

router.get(
  '/member-message',
  auth(USER_ROLE.admin, USER_ROLE.member),
  MessageController.getMessageSingleMember,
);

router.get(
  '/get-single-member-message/:chatId',
  MessageController.getSingleMessage,
);

export const MessageRoute = router;
