import { Router } from "express";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { isAdmin} from "../middlewares/isAdmin.middleware";

const router = Router()

router.get('/profile', isAuthenticate, UserController.profile)
router.get('/', isAuthenticate, isAdmin, UserController.getAll)

export default router