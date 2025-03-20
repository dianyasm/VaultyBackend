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

    static async rate(req:Request, res:Response, next: NextFunction){
        try{
            const id = Number.parseInt(req.params.id)
            console.log('id!!!', id)
            if (isNaN(id)) throw new HttpException(400, "Invalid offer ID");

            const {value} = req.body
            const userId = req.user?.id
            if(!userId) throw new HttpException(400, "User creator ID is required");
            console.log('value!!!', value)
            console.log('userId!!!', userId)
            await SeriesService.rate(userId, id, value)
            res.status(200).json({message: 'Offer rate successfully'})
        }catch(error){
            next(error)
        }
    }

    static async getRate(req:Request, res:Response, next: NextFunction){
        try{
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid offer ID");

            const rate = await SeriesService.getRate(id)
            console.log(rate)
            res.status(200).json(rate)
        }catch(error){
            next(error)
        }
    }
    static async getMyRate(req:Request, res:Response, next: NextFunction){
        try{
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid offer ID");
            
            const userId = req.user?.id
            if(!userId) throw new HttpException(400, "User creator ID is required");

            const rate = await SeriesService.getMyRate(userId, id)
            res.status(200).json(rate)
        }catch(error){
            next(error)
        }
    }
}