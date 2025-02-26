import { body } from 'express-validator'

export const registerValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 4 }).withMessage('Password too short'),
    body('name').notEmpty().withMessage('Name required')
]

export const loginValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password required')
]

export const seriesValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('seasons').optional().isInt({ min: 1 }).withMessage('Seasons must be a positive integer'),
    body('episodes').optional().isInt({ min: 1 }).withMessage('Episodes must be a positive integer'),
    body('releaseDate').optional().isISO8601().withMessage('Release date must be a valid date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    body('idGenre').optional().isInt().withMessage('Genre ID must be an integer')
]

export const genreValidation = [
    body('name').notEmpty().withMessage('Genre name is required')
]

export const userSeriesValidation = [
    body('status').isIn(['watching', 'completed', 'plan_to_watch', 'dropped']).withMessage('Invalid status'),
    body('progress').isInt({ min: 0 }).withMessage('Progress must be a non-negative integer'),
    body('favorite').isBoolean().withMessage('Favorite must be a boolean')
]

export const reviewValidation = [
    body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
    body('comment').optional().isString().withMessage('Comment must be a string')
]

export const userPreferencesValidation = [
    body('preferences').isString().withMessage('Preferences must be a string')
]