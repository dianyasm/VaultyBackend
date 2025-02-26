import { Router } from "express";
import { genreValidation } from "@/middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { GenreController } from "../controllers/genre.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router()

router.get("/", GenreController.getAll);
router.get("/:id", GenreController.getById);
router.post("/", isAuthenticate, isAdmin, genreValidation, ValidationMiddleware, GenreController.create);
router.put("/:id", isAuthenticate, isAdmin, genreValidation, ValidationMiddleware, GenreController.update);
router.delete("/:id", isAuthenticate, isAdmin, GenreController.delete); 

export default router