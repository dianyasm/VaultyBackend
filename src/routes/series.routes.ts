import { Router } from "express";
import { seriesValidation, userSeriesValidation, reviewValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { SeriesController } from "../controllers/series.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router()

// GET List all series with optional filters
router.get('/', SeriesController.getAll)
// GET specific series by ID
router.get('/:id', SeriesController.getById)
// POST Add a new series (admin only)
router.post('/', isAuthenticate, isAdmin, seriesValidation, ValidationMiddleware, SeriesController.create)
// DELETE Remove a series (admin only)
router.delete('/:id', isAuthenticate, isAdmin, SeriesController.delete)
// PUT Modify a series (admin only)
router.put('/:id', isAuthenticate, isAdmin, seriesValidation, ValidationMiddleware, SeriesController.update)

// User series tracking routes
// Add/update series to user's list
router.post('/:id/track', isAuthenticate, userSeriesValidation, ValidationMiddleware, SeriesController.addToUserList)
// Update user's progress for a series
router.put('/:id/progress', isAuthenticate, userSeriesValidation, ValidationMiddleware, SeriesController.updateUserProgress)

// Reviews routes
// Add/update a review for a series
router.post('/:id/review', isAuthenticate, reviewValidation, ValidationMiddleware, SeriesController.review)
// Get all reviews for a series
router.get('/:id/reviews', SeriesController.getReviews)

export default router