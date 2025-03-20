import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Quejas } from "@prisma/client";

export class QuejasService {

  static async getById(id: number) {
    const findQueja = await prisma.quejas.findUnique({ where: { id } })

    if (!findQueja) throw new HttpException(404, "Queja no encontrada");
    
    return findQueja;
  }

  static async getAll(motivo: string = "") {
    return await prisma.quejas.findMany({
      where: {
        ...(motivo && {
          motivo: {
            contains: motivo, 
          }
        })
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });
  }

  static async create(idUser: number, queja: Quejas) {
    return await prisma.quejas.create({
      data: {
        ...queja,
        idUser: idUser,
      },
    });
  }

  static async update(id: number, queja: Quejas) {
    const findQueja = await prisma.quejas.findUnique({ where: { id } });
    
    if (!findQueja) throw new HttpException(404, "Queja no encontrada");
    
    return await prisma.quejas.update({
      where: { id },
      data: {
        ...queja,
      },
    });
  }

  static async delete(id: number) {
    try {      
      return await prisma.quejas.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(404, "Queja no encontrada");
    }
  }
}