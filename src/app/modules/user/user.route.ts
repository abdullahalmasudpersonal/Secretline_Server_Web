import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post('/create-member', UserController.createMember)

export const  UserRoute = router