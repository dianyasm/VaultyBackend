import { Router } from "express";
import { GenreController } from "../controllers/genre.controller";
const router = Router()

router.get("/", GenreController.getAll);
 router.get("/:id", GenreController.getById);
router.post("/", GenreController.create);
router.put("/:id", GenreController.update);
router.delete("/:id", GenreController.delete); 

export default router