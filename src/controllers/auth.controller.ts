import { AuthService } from "../services/auth.service";
import {Response, Request, NextFunction} from 'express'

export class AuthController{
    static async register(req:Request, res:Response, next: NextFunction){
        try{
            const userData = req.body
            const newUser = await AuthService.register(userData)
            res.status(201).json({message:"User register succesfully", newUser})
        }catch(error){
            next(error)
        }
    }   

    static async login(req:Request, res:Response,  next: NextFunction){
        try{
            const userData = req.body
            const token = await AuthService.login(userData.email, userData.password)
            res.cookie('token', token,{
                maxAge: 60*60*1000*3, //3 hora de caducidad
                httpOnly:true, //no se puede acceder mediante js
                secure:false, //solo se envia si usas https
                sameSite:'strict', //evita ataques CSRF
            })
            res.status(201).json({message:"login succesfully", token})
        }catch(error){
            next(error)
        }
    }
}