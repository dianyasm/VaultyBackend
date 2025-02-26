import { AuthService } from "../services/auth.service";
import { Response, Request, NextFunction } from 'express'
import jwt from "jsonwebtoken";

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body
            const newUser = await AuthService.register(userData)
            res.status(201).json({ message: 'User registered successfully', newUser })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body
            console.log('login attempt', userData.email, userData.password)
            const { token, user } = await AuthService.login(userData.email, userData.password)
            
            const validSameSiteValues = ["none", "lax", "strict"] as const;

            const sameSiteValue: "none" | "lax" | "strict" = validSameSiteValues.includes(process.env.COOKIE_SAME_SITE as "none" | "lax" | "strict")
            ? (process.env.COOKIE_SAME_SITE as "none" | "lax" | "strict")
            : "none";

            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 3,
                httpOnly: true, 
                secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === "true" : true, 
                sameSite: sameSiteValue, 
            })
            res.status(201).json({ message: 'Login successful', user })
        } catch (error) {
            next(error)
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie('token')
            res.status(204).json({ message: 'Logout successful' })
        } catch (error) {
            next(error)
        }
    }

    static async getAuthenticatedUser (req: Request, res: Response, next: NextFunction){
        try {
            const token = req.cookies.token;
            if (!token) res.status(401).json({ message: "Not authenticated" });
            const decoded = jwt.verify(token, TOKEN_PASSWORD);
            res.status(200).json(decoded)
        } catch (error) {
            next(error)
        }
    };
}