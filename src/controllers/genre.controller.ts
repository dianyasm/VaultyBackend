import { Request, Response, NextFunction } from "express";
import { GenreService } from "../services/genre.service";
import { HttpException } from "../exceptions/httpException";

export class GenreController {
    static async getAll(req: Request, res: Response, next: NextFunction){
        try {
            const genres = await GenreService.getAll();
            res.status(200).json(genres)
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new HttpException(400, "Invalid genre ID");

            const genre = await GenreService.getById(id);
            res.status(200).json(genre)            
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const genre = req.body;

            if (!genre) throw new HttpException(400, "Genre is required");

            const newGenre = await GenreService.create(genre);
            res.status(201).json(newGenre);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new HttpException(400, "Invalid genre ID");

            const genre = req.body;
            if (!genre) throw new HttpException(400, "Genre is required");

            const updatedGenre = await GenreService.update(id, genre);
            res.status(200).json(updatedGenre)
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new HttpException(400, "Invalid genre ID");

            const deleted = await GenreService.delete(id);
            res.status(200).json(deleted)
        } catch (error) {
            next(error);
        }
    }
}