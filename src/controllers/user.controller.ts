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
}