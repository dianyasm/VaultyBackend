import { AuthService } from "@/services/auth.service";
import {Response, Request} from 'express'

export class AuthController{
    static async register(req:Request, res:Response){
        try{
            const userData = req.body
            const newUser = await AuthService.register(userData)
            res.status(201).json({message:"User register succesfully", newUser})
        }catch(error){
            res.status(409).json({message:"Fallo al registrar al usuario"})
        }
    }   

    static async login(req:Request, res:Response){
        try{
            const userData = req.body
            const token = await AuthService.login(userData.email, userData.password)
            res.status(201).json({message:"login succesfully", token})
        }catch(error){
            res.status(409).json({message:"Fallo al loguearse el usuario"+error})
        }
        
    }

}