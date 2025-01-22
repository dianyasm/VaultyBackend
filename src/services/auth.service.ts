import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt"
import { error } from "console";
import  jwt  from "jsonwebtoken";

const prisma = new PrismaClient()
const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || "pass"

export class AuthService{
    static async register(user: User){
        //ver si el usuario no existe
        // select id,nombre from user where email=user.email
       const findUser = await prisma.user.findUnique({where:{ email: user.email}})
       if(findUser) throw new Error(`User ${user.email} already exists`)
    
        //encriptar el password
        const passwordEncrypted = await bcrypt.hash(user.password, 10)
        user.password=''
        //guardar el usuario en la bd
        return await prisma.user.create({
            data:{
                ...user,
                password: passwordEncrypted,
                role: null
            },
            omit:{
                password:true
            }
        })
    }

    static async login(email:string, password:string){
        //ver si el usuario existe
        const findUser = await prisma.user.findUnique({where:{email}})
        if(!findUser) throw new Error ('Invalid user or password')

        //ver si el password coincide
        const isPasswordCorrect = await bcrypt.compare(password, findUser.password)
        if(!isPasswordCorrect) throw new Error('Invalid user or password')
        
        //generar el token de autenticacion
        const token = jwt.sign(
            {colorFavorito:"azul", id:findUser.id, email:findUser.email, role:findUser.role},
            TOKEN_PASSWORD,
            {expiresIn:"1h"}
        )
        //devolver el token
        return token
    }
}