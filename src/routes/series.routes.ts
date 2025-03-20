import { Router } from "express";
import { seriesValidation, rateValidation } from "../middlewares/validators.middleware";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { SeriesController } from "../controllers/series.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router()

//GET Listar todas las ofertas localhost:3000/api/offers/?title=react&category=dam
router.get('/', isAuthenticate, SeriesController.getAll)
//localhost:3000/api/offers/xxxx
router.get('/:id', isAuthenticate, SeriesController.getById)
//POST añadir una oferta nueva localhost:3000/api/offers/  {body}
router.post('/', isAuthenticate, isAdmin, seriesValidation, ValidationMiddleware, SeriesController.create)
//DELETE Borrar una oferta localhost:3000/api/offers/XXXX  
router.delete('/:id',isAuthenticate,isAdmin, SeriesController.delete)
//PUT modificar una oferta localhost:3000/api/offers/XXXX  {body}
router.put('/:id',isAuthenticate,isAdmin, seriesValidation, ValidationMiddleware, SeriesController.update)   

// Calificamos una oferta x   {body}
router.post('/:id/rate/',isAuthenticate, rateValidation, SeriesController.rate)  
// Vemos que calificación (total) se le ha data a una oferta X
router.get('/:id/rate/', isAuthenticate, SeriesController.getRate)
router.get('/:id/myRate/', isAuthenticate, SeriesController.getMyRate)



export default router