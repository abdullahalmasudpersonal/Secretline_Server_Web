import { Router } from 'express';
import { ChatController } from './chat.controller';

const router = Router();

router.post('/create-chat', ChatController.createChat);

export const ChatRoute = router;
