import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Offer, PrismaClient, User } from "@prisma/client";

//const prisma = new PrismaClient()

export class OfferService {

    static async getById(id: number){
        const findOffer = await prisma.offer.findUnique({ where: {id}})
        if(!findOffer) throw new HttpException(404, 'Offer not found')
         return findOffer
     }

    //localhost:3000/api/offer/?title=dam
     static async getAll(title: string=''){
        /*return await prisma.offer.findMany({ 
            where: title? {
                title: {
                    contains: title
                }
            } : {},
            orderBy: {
                createdAt: 'desc'
            },
            take:100
        })*/
            return await prisma.offer.findMany({
                where: {
                    ...(title && {
                        title: {
                            contains: title,
                            //mode: "insensitive" // Búsqueda sin distinción entre mayúsculas y minúsculas
                        }
                    })
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 100,
                include: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    }

    static async create(idUser: number, offer: Offer){
        return await prisma.offer.create({ 
            data: {
                ...offer,
                idUserCreator: idUser
            }
        })
     }

     static async update(id: number, offer: Offer){
        const findOffer = prisma.offer.findUnique({where:{id}})
        if(!findOffer) throw new HttpException(404, 'Offer doesnt exists')
        return await prisma.offer.update({ 
            where: {id},
            data: {
                ...offer
            }
        })
    }

    static async delete(id: number){
        try{
            return await prisma.offer.delete({where:{id}})
        }catch (error) {
            throw new HttpException(404, "Offer not found");
        }   
    }

    static async rate(idUser: number, idOffer: number, value: number): Promise<void>{
        if(value < 0 || value > 5) throw new Error('Rating must be between 0 and 5')


        const offer = await prisma.offer.findUnique({where: {id:idOffer}})
        if(!offer) throw new Error ('Offer not found')

        await prisma.rate.upsert({
            where:{idUser_idOffer:{idUser, idOffer} },
            update:{value},
            create:{idUser, idOffer, value}
        })
    }

    static async getRate(idOffer: number){
        //select avg(value) as mediaCalificacion, cont(value) as totalRates
        //from rate
        //where offerId = id
        const ratingStats = await prisma.rate.aggregate({
            where:{idOffer},
            _avg: {value:true},
            _count: {value: true}
        })

        return{
            totalRating: ratingStats._count.value,
            averateRating: ratingStats._avg.value?.toFixed(2)
        }
    }
}