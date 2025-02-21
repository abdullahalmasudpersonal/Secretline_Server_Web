import { Router } from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/create-chat', auth(USER_ROLE.admin, USER_ROLE.member), ChatController.createChat);

export const ChatRoute = router;
