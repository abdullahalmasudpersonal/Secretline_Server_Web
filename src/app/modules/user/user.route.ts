import { Router } from 'express';
import { UserController } from './user.controller';
import { USER_ROLE } from './user.constant';
import auth from '../../middleware/auth';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.member),
  UserController.getAllUser,
);

router.post('/create-member', UserController.createMember);

router.get(
  '/me',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.member),
  UserController.getMe,
);

// router.patch(
//   '/update-my-profile',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.buyer),
//   FileUploadHelper.upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req?.body?.data);
//     return UserController.updateMyProfile(req, res, next);
//   },
// );

export const UserRoute = router;
