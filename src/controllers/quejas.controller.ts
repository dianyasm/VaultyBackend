import { NextFunction, Request, Response } from "express";
import { QuejasService } from "../services/quejas.service";
import { HttpException } from "../exceptions/httpException";
import { prisma } from "../database/database";
import { Prisma, Quejas } from "@prisma/client";

export class QuejasController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid queja ID")

            const quejas = await QuejasService.getById(id)
            res.status(200).json(quejas)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { motivo } = req.query
            const user = await QuejasService.getAll(motivo as string)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const quejaData = req.body
            const idUser = req.user?.id
            if (!idUser) throw new HttpException(400, "User ID is required")

            const newQueja = await QuejasService.create(idUser, quejaData)
            res.status(200).json(newQueja)
        } catch (error) {
            next(error)
        }
    }    

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const quejaData = req.body
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid queja ID")

            const updatedQueja = await QuejasService.update(id, quejaData)
            res.status(200).json(updatedQueja)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid queja ID")

            const deletedQueja = await QuejasService.delete(id)
            res.status(200).json(deletedQueja)
        } catch (error) {
            next(error)
        }
    }
}
