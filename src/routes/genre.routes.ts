import { Router } from "express";
import {AuthController} from '../controllers/auth.controller'
import { loginValidation, registerValidation } from "@/middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { GenreController } from "../controllers/genre.controller";
const router = Router()

router.get("/", GenreController.getAll);
 router.get("/:id", GenreController.getById);
router.post("/", GenreController.create);
router.put("/:id", GenreController.update);
router.delete("/:id", GenreController.delete); 

export default router