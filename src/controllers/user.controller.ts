import { HttpException } from "../exceptions/httpException";
import { Response, Request, NextFunction } from 'express'
import { UserService } from "../services/user.service";

export class UserController {
    static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.user?.email
            if (!email) throw new HttpException(404, 'Email not found')
            const user = await UserService.getByEmail(email)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAll()
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    static async getUserSeries(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User ID is required")
            
            const status = req.query.status as string
            
            const userSeries = await UserService.getUserSeries(userId, status)
            res.status(200).json(userSeries)
        } catch (error) {
            next(error)
        }
    }

    static async getUserReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User ID is required")
            
            const userReviews = await UserService.getUserReviews(userId)
            res.status(200).json(userReviews)
        } catch (error) {
            next(error)
        }
    }

    static async updatePreferences(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User ID is required")
            
            const { preferences } = req.body
            
            const updatedUser = await UserService.updatePreferences(userId, preferences)
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    }
}