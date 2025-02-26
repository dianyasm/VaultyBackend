import { Router } from "express";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { userPreferencesValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";

const router = Router()

// Get current user profile
router.get('/profile', isAuthenticate, UserController.profile)
// Get all users (admin only)
router.get('/', isAuthenticate, isAdmin, UserController.getAll)
// Get user's series list with optional status filter
router.get('/series', isAuthenticate, UserController.getUserSeries)
// Get user's reviews
router.get('/reviews', isAuthenticate, UserController.getUserReviews)
// Update user preferences
router.put('/preferences', isAuthenticate, userPreferencesValidation, ValidationMiddleware, UserController.updatePreferences)

export default router