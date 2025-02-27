import axios from 'axios';
import { HttpException } from '../exceptions/httpException';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export class TMDbService {
  private static instance: TMDbService;
  private constructor() {}

  public static getInstance(): TMDbService {
    if (!TMDbService.instance) {
      TMDbService.instance = new TMDbService();
    }
    return TMDbService.instance;
  }

  // Buscar series por título
  async searchSeries(query: string, page: number = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page,
          language: 'es-ES', // Puedes cambiar el idioma según prefieras
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error searching series from TMDb');
    }
  }

  // Obtener detalles de una serie por ID
  async getSeriesDetails(seriesId: number) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES',
          append_to_response: 'credits,similar,recommendations,videos',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error fetching series details from TMDb');
    }
  }

  // Obtener series populares
  async getPopularSeries(page: number = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          language: 'es-ES',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error fetching popular series from TMDb');
    }
  }

  // Obtener series mejor valoradas
  async getTopRatedSeries(page: number = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          language: 'es-ES',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error fetching top rated series from TMDb');
    }
  }

  // Obtener series al aire actual
  async getOnAirSeries(page: number = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/on_the_air`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          language: 'es-ES',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error fetching on air series from TMDb');
    }
  }
  
  // Obtener información de temporada
  async getSeasonDetails(seriesId: number, seasonNumber: number) {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}`,
        {
          params: {
            api_key: TMDB_API_KEY,
            language: 'es-ES',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error fetching season details from TMDb');
    }
  }

  // Obtener todos los géneros de TMDb
  async getGenres() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'es-ES',
        },
      });
      return response.data.genres;
    } catch (error) {
      throw new HttpException(500, 'Error fetching genres from TMDb');
    }
  }

  // Descubrir series por género
  async discoverSeriesByGenre(genreId: number, page: number = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreId,
          page,
          language: 'es-ES',
          sort_by: 'popularity.desc',
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(500, 'Error discovering series by genre from TMDb');
    }
  }
}

export default TMDbService.getInstance();