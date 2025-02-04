import { Router } from "express";
import {AuthController} from '../controllers/auth.controller'
import { loginValidation, registerValidation } from "@/middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { CategoryController } from "../controllers/category.controller";
const router = Router()

router.get("/", CategoryController.getAll);
 router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete); 

export default router