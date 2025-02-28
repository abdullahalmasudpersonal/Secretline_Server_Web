import { NextFunction, Request, Response, Router } from 'express';
import { MessageController } from './message.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

const router = Router();

router.post(
  '/send-message',
  auth(USER_ROLE.admin, USER_ROLE.member),
  MessageController.createMessage,
);

router.post(
  '/send-voice-message',
  auth(USER_ROLE.admin, USER_ROLE.member),
  FileUploadHelper.uploadAudio.single('audio'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    return MessageController.createVoiceMessage(req, res, next);
  },
);

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
