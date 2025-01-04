import { Router } from 'express';
import { UserRoute } from '../modules/user/user.route';
import { AuthRoute } from '../modules/auth/auth.route';
import { ChatRoute } from '../modules/chat/chat.route';
import { MessageRoute } from '../modules/message/message.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/chat',
    route: ChatRoute,
  },
  {
    path: '/message',
    route: MessageRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
