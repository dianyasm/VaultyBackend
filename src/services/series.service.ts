import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Series, Review, UserSeries } from "@prisma/client";

export class SeriesService {
    static async getById(id: number) {
      const series = await prisma.series.findUnique({
        where: { id },
        include: {
          genre: true
        }
      });
      if (!series) throw new HttpException(404, "Series not found");
      return series;
    }

    static async getAll(title: string = "") {
      return await prisma.series.findMany({
        where: {
          ...(title && {
            title: {
              contains: title,
            },
          }),
          active: true
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          genre: true,
        },
      });
    }

    static async create(series: Partial<Series>) {
      try {
        if (!series.title) {
          throw new HttpException(400, "Title is required");
        }
    
        // Excluir propiedades no necesarias
        const { id, createdAt, updatedAt, ...validSeriesData } = series;
    
        return await prisma.series.create({
          data: {
            ...validSeriesData,
          },
          include: {
            genre: true,
          },
        });
      } catch (error) {
        throw new HttpException(400, "Error creating series");
      }
    }

    static async update(id: number, series: Partial<Series>) {
      try {
        return await prisma.series.update({
          where: { id },
          data: { ...series },
          include: {
            genre: true
          }
        });
      } catch (error) {
        throw new HttpException(404, "Series not found");
      }
    }

    static async delete(id: number) {
      try {
        // Instead of deleting, set active to false
        return await prisma.series.update({
          where: { id },
          data: { active: false },
        });
      } catch (error) {
        throw new HttpException(404, "Series not found");
      }
    }

    static async addToUserList(
      userId: number,
      seriesId: number,
      data: { status: string; progress: number; favorite: boolean }
    ) {
      // Check if series exists
      const series = await prisma.series.findUnique({ where: { id: seriesId } });
      if (!series) throw new HttpException(404, "Series not found");

      try {
        return await prisma.userSeries.upsert({
          where: {
            idUser_idSeries: {
              idUser: userId,
              idSeries: seriesId
            }
          },
          update: { ...data },
          create: {
            idUser: userId,
            idSeries: seriesId,
            ...data
          }
        });
      } catch (error) {
        throw new HttpException(400, "Error adding series to user list");
      }
    }

    static async updateUserProgress(
      userId: number,
      seriesId: number,
      data: { status?: string; progress?: number; favorite?: boolean }
    ) {
      try {
        // Find existing user series relation
        const userSeries = await prisma.userSeries.findUnique({
          where: {
            idUser_idSeries: {
              idUser: userId,
              idSeries: seriesId
            }
          }
        });

        if (!userSeries) {
          throw new HttpException(404, "Series not in user's list");
        }

        return await prisma.userSeries.update({
          where: {
            idUser_idSeries: {
              idUser: userId,
              idSeries: seriesId
            }
          },
          data: { ...data }
        });
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new HttpException(400, "Error updating user progress");
      }
    }

    static async review(
      userId: number,
      seriesId: number,
      reviewData: { rating: number; comment?: string }
    ) {
      // Check if series exists
      const series = await prisma.series.findUnique({ where: { id: seriesId } });
      if (!series) throw new HttpException(404, "Series not found");

      try {
        return await prisma.review.upsert({
          where: {
            idUser_idSeries: {
              idUser: userId,
              idSeries: seriesId
            }
          },
          update: { ...reviewData },
          create: {
            idUser: userId,
            idSeries: seriesId,
            ...reviewData
          }
        });
      } catch (error) {
        throw new HttpException(400, "Error submitting review");
      }
    }

    static async getReviews(seriesId: number) {
      try {
        const reviews = await prisma.review.findMany({
          where: { idSeries: seriesId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        });

        return reviews;
      } catch (error) {
        throw new HttpException(400, "Error fetching reviews");
      }
    }
}