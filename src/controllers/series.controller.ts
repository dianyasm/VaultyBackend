import { NextFunction, Request, Response } from "express"
import { SeriesService } from "../services/series.service"
import { HttpException } from "../exceptions/httpException";
import { prisma } from "../database/database";
import { Prisma, Series } from "@prisma/client";

export class SeriesController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const series = await SeriesService.getById(id)
            res.status(200).json(series)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.query;
            const series = await SeriesService.getAll(title as string)
            res.status(200).json(series)
        } catch (error) {
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpException(400, "User ID is required");
    
            const serieData = req.body;
    
            const newSeries = await prisma.series.create({
                data: {
                    ...serieData,
                    idUserCreator: userId
                }
            });
    
            res.status(201).json(newSeries);
        } catch (error) {
            next(error);
        }
    }    

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const seriesData = req.body
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const updatedSeries = await SeriesService.update(id, seriesData)
            res.status(200).json(updatedSeries)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const deletedSeries = await SeriesService.delete(id)
            res.status(200).json(deletedSeries)
        } catch (error) {
            next(error)
        }
    }

    static async addToUserList(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const { status, progress, favorite } = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User ID is required")

            await SeriesService.addToUserList(userId, id, { status, progress, favorite })
            res.status(200).json({ message: 'Series added to your list successfully' })
        } catch (error) {
            next(error)
        }
    }

    static async updateUserProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const { status, progress, favorite } = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User ID is required")

            await SeriesService.updateUserProgress(userId, id, { status, progress, favorite })
            res.status(200).json({ message: 'Progress updated successfully' })
        } catch (error) {
            next(error)
        }
    }

    static async review(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const { rating, comment } = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User ID is required")

            await SeriesService.review(userId, id, { rating, comment })
            res.status(200).json({ message: 'Review submitted successfully' })
        } catch (error) {
            next(error)
        }
    }

    static async getReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid series ID");

            const reviews = await SeriesService.getReviews(id)
            res.status(200).json(reviews)
        } catch (error) {
            next(error)
        }
    }

    static async getFavorites(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException(400, 'User ID is required');
            }
    
            const favorites = await SeriesService.getFavorites(userId);
            res.status(200).json(favorites);
        } catch (error) {
            next(error);
        }
    }
    
    static async getWatchlist(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException(400, 'User ID is required');
            }
    
            const watchlist = await SeriesService.getWatchlist(userId);
            res.status(200).json(watchlist);
        } catch (error) {
            next(error);
        }
    }
}