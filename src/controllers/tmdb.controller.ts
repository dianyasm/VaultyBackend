import { Request, Response, NextFunction } from 'express';
import TMDbService from '../services/tmdb.service';
import { HttpException } from '../exceptions/httpException';
import { SeriesService } from '../services/series.service';

export class TMDbController {
  // Buscar series por consulta
  static async searchSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, page } = req.query;
      
      if (!query) {
        throw new HttpException(400, 'Search query is required');
      }
      
      const results = await TMDbService.searchSeries(
        query as string, 
        page ? parseInt(page as string) : 1
      );
      
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  // Obtener detalles de una serie
  static async getSeriesDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid series ID');
      }
      
      const series = await TMDbService.getSeriesDetails(id);
      res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  }

  // Obtener series populares
  static async getPopularSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const series = await TMDbService.getPopularSeries(page);
      res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  }

  // Obtener series mejor valoradas
  static async getTopRatedSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const series = await TMDbService.getTopRatedSeries(page);
      res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  }

  // Obtener series al aire actualmente
  static async getOnAirSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const series = await TMDbService.getOnAirSeries(page);
      res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  }

  // Obtener detalles de temporada
  static async getSeasonDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const seriesId = parseInt(req.params.id);
      const seasonNumber = parseInt(req.params.season);
      
      if (isNaN(seriesId) || isNaN(seasonNumber)) {
        throw new HttpException(400, 'Invalid series ID or season number');
      }
      
      const seasonDetails = await TMDbService.getSeasonDetails(seriesId, seasonNumber);
      res.status(200).json(seasonDetails);
    } catch (error) {
      next(error);
    }
  }

  // Obtener géneros de TMDb
  static async getGenres(req: Request, res: Response, next: NextFunction) {
    try {
      const genres = await TMDbService.getGenres();
      res.status(200).json(genres);
    } catch (error) {
      next(error);
    }
  }
  
  // Buscar series por género
  static async discoverSeriesByGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const genreId = parseInt(req.params.genreId);
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      
      if (isNaN(genreId)) {
        throw new HttpException(400, 'Invalid genre ID');
      }
      
      const series = await TMDbService.discoverSeriesByGenre(genreId, page);
      res.status(200).json(series);
    } catch (error) {
      next(error);
    }
  }

  // Importar una serie de TMDb a tu base de datos
  static async importSeriesToDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const tmdbId = parseInt(req.params.tmdbId);
      
      if (isNaN(tmdbId)) {
        throw new HttpException(400, 'Invalid TMDb series ID');
      }
      
      // Obtener detalles de la serie desde TMDb
      const seriesDetails = await TMDbService.getSeriesDetails(tmdbId);
      
      // Verificar si el género existe en tu base de datos, y si no, crearlo
      let genreId = null;
      if (seriesDetails.genres && seriesDetails.genres.length > 0) {
        const mainGenre = seriesDetails.genres[0];
        
        // Aquí podrías buscar o crear el género en tu base de datos
        // Este ejemplo simplificado asume que ya tienes un servicio para manejar géneros
        // const genre = await GenreService.findOrCreate(mainGenre.name);
        // genreId = genre.id;
      }
      
      // Crear la serie en tu base de datos
      const newSeries = {
        title: seriesDetails.name,
        description: seriesDetails.overview,
        releaseDate: seriesDetails.first_air_date ? new Date(seriesDetails.first_air_date) : null,
        endDate: seriesDetails.last_air_date ? new Date(seriesDetails.last_air_date) : null,
        seasons: seriesDetails.number_of_seasons || 1,
        episodes: seriesDetails.number_of_episodes || 1,
        network: seriesDetails.networks?.length > 0 ? seriesDetails.networks[0].name : null,
        idGenre: genreId,
        // Podrías agregar un campo extra para almacenar el ID de TMDb
        // tmdbId: seriesDetails.id
      };
      
      // Importar la serie a la base de datos
      const series = await SeriesService.create(newSeries);
      
      res.status(201).json({
        message: 'Series imported successfully',
        series
      });
    } catch (error) {
      next(error);
    }
  }
}