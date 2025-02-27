import { Router } from "express";
import { TMDbController } from "../controllers/tmdb.controller";
import { isAuthenticate } from "../middlewares/auth.middleware";

const router = Router();

// Rutas públicas
router.get('/search', TMDbController.searchSeries);
router.get('/popular', TMDbController.getPopularSeries);
router.get('/top-rated', TMDbController.getTopRatedSeries);
router.get('/on-air', TMDbController.getOnAirSeries);
router.get('/genres', TMDbController.getGenres);
router.get('/discover/genre/:genreId', TMDbController.discoverSeriesByGenre);
router.get('/:id', TMDbController.getSeriesDetails);
router.get('/:id/season/:season', TMDbController.getSeasonDetails);

// Rutas protegidas
router.post('/import/:tmdbId', isAuthenticate, TMDbController.importSeriesToDatabase);

export default router;