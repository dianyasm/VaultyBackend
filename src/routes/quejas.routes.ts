import { Router } from "express";
import { QuejasController } from "../controllers/quejas.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { quejaValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";

const router = Router();

router.get("/", isAuthenticate, QuejasController.getAll);
router.get("/:id", isAuthenticate, QuejasController.getById);
router.post("/", isAuthenticate, quejaValidation, ValidationMiddleware, QuejasController.create);
router.put("/:id", isAuthenticate, quejaValidation, ValidationMiddleware, QuejasController.update);
router.delete("/:id", isAuthenticate, QuejasController.delete);

export default router;