import { Router } from "express";
import {AuthController} from '../controllers/auth.controller'
import { loginValidation, registerValidation } from "@/middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
const router = Router()




export default router