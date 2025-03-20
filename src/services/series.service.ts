import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Series, PrismaClient, User } from "@prisma/client";
//const prisma = new PrismaClient()

export class SeriesService {
  static async getById(id: number) {
    const findSerie = await prisma.series.findUnique({ where: { id } });
    if (!findSerie) throw new HttpException(404, "Serie not found");
    return findSerie;
  }

  // localhost:3000/api/offer/?title=dam
  static async getAll(title: string = "") {
    /*  return await prisma.offer.findMany({
            where: title ? {
                title: {
                    contains: title
                }
            } : {},
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        }) */

    return await prisma.series.findMany({
      where: {
        ...(title && {
          title: {
            contains: title,
            //mode: "insensitive" // Búsqueda sin distinción entre mayúsculas y minúsculas
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      include: {
        genre: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  static async create(idUser: number, series: Series) {
    console.log("creando", idUser);
    return await prisma.series.create({
      data: {
        ...series,
        idUserCreator: idUser,
      },
    });
  }

  static async update(id: number, series: Series) {
    const findSeries = await prisma.series.findUnique({ where: { id } });
    if (!findSeries) throw new HttpException(404, "Serie doesnt exists");
    return await prisma.series.update({
      where: { id },
      data: {
        ...series,
      },
    });
  }

  static async delete(id: number) {
    try {
      return await prisma.series.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(404, "Serie not found");
    }
  }

  static async rate(
    idUser: number,
    idSerie: number,
    value: number
  ): Promise<void> {
    // Validar que el rating está dentro del rango permitido
    if (value < 0 || value > 5) {
      throw new Error("Rating must be between 0 and 5.");
    }

    // Verificar si la oferta existe
    const serie = await prisma.series.findUnique({ where: { id: idSerie } });
    if (!serie) {
      throw new Error("Serie not found.");
    }

    // Actualizar o crear la calificación

    /*
        SELECT  AVG(value) AS averageValue, COUNT(value) AS totalCount
    FROM Rating
    WHERE offerId = <offerId>;
        */
    await prisma.rate.upsert({
      where: { idUser_idSerie: { idUser, idSerie } },
      update: { value },
      create: { idUser, idSerie, value },
    });
  }

  static async getRate(idSerie: number) {
    const ratingStats = await prisma.rate.aggregate({
      where: { idSerie },
      _avg: { value: true }, // Calcular el promedio
      _count: { value: true }, // Contar el total de calificaciones
    });
    return {
      totalRatings: ratingStats._count.value || 0,
      averageRating: ratingStats._avg.value?.toFixed(2) || 0,
    };
  }

  static async getMyRate(idUser: number, idSerie: number) {
    return await prisma.rate.findUnique({
      where: { idUser_idSerie: { idUser, idSerie } },
    });
  }
}