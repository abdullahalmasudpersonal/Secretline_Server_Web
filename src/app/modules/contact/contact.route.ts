import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { ContactController } from './contact.controller';

const router = Router();

router.post(
  '/create-contact',
  auth(USER_ROLE.admin, USER_ROLE.member),
  ContactController.createContact,
);

router.get(
  '/get-my-contact',
  auth(USER_ROLE.admin, USER_ROLE.member),
  ContactController.getMyContact,
);

export const ContactRoute = router;
