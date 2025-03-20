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
    body('title')
        .isLength({ min: 2, max: 40 }).withMessage('Título debe tener entre 2 y 40 caracteres'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Descripción demasiado larga'),
    body('seasons').optional().isInt().withMessage('Número de temporadas inválido'), // Assuming it should be an integer
    body('episodes').optional().isInt().withMessage('Número de episodios inválido'), // Assuming it should be an integer
    body('active').isBoolean().withMessage('El campo active debe ser un valor booleano')
]

export const genreValidation = [
    body('name').notEmpty().withMessage('Name required')
]

export const rateValidation = [
    body('value').isInt({ min: 0, max: 5 }).toInt().withMessage('Value is required')
]

export const quejaValidation = [
    body("motivo")
    .notEmpty()
    .withMessage("El motivo es requerido")
    .isString()
    .withMessage("El motivo debe ser texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El motivo debe tener entre 3 y 100 caracteres"),
  
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es requerida")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 10, max: 1000 })
    .withMessage("La descripción debe tener entre 10 y 1000 caracteres")
];