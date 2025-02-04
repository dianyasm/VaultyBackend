import { Router } from "express";
import {AuthController} from '../controllers/auth.controller'
import { loginValidation, registerValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { OfferController } from "@/controllers/offer.controller";
import { isAuthenticate } from "@/middlewares/auth.middleware";
const router = Router()

//API REST FULL

//GET Listar todas las ofertas localhost:3000/api/offerts/?title=react&category=dam
router.get('/', isAuthenticate ,OfferController.getAll)
router.get('/:id',isAuthenticate, OfferController.getById)
//POST Añadir una oferta localhost:3000/api/offerts/ {body}
//DELETE Borrar una oferta localhost:3000/api/offerts/XXXX
router.delete('/:id', OfferController.delete)
//PUT modificar una oferta localhost:3000/api/offerts/XXXX {body}
router.put('/:id', OfferController.update)

// Calificamos una oferta x   {body}
router.post('/:id/rate/',OfferController.rate)  
// Vemos que calificación (total) se le ha data a una oferta X
router.get('/:id/rate/', OfferController.getRate)
router.get('/:id/rate/', OfferController.getMyRate)



export default router