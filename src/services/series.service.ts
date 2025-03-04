import { NextFunction } from "express";
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

    static async create(idUser: number, serie: Series) {
      console.log("creando", idUser);
      return await prisma.series.create({
        data: {
          ...serie,
          idUserCreator: idUser,
        },
      });
    }

    static async update(id: number, data: Partial<Series>) {
      try {
          // First, check if the series exists
          const existingSeries = await prisma.series.findUnique({
              where: { id }
          });

          if (!existingSeries) {
              throw new HttpException(404, "Series not found");
          }

          // Perform the update
          return await prisma.series.update({
              where: { id },
              data: {
                  ...data,
                  updatedAt: new Date() // Ensure updatedAt is refreshed
              },
              include: {
                  genre: true // Optional: include genre details in the response
              }
          });
      } catch (error) {
          if (error instanceof HttpException) throw error;
          console.error(error);
          throw new HttpException(400, "Error updating series");
      }
  }

  static async delete(id: number) {
      try {
          // First, check if the series exists
          const existingSeries = await prisma.series.findUnique({
              where: { id }
          });

          if (!existingSeries) {
              throw new HttpException(404, "Series not found");
          }

          // Soft delete: set active to false
          return await prisma.series.update({
              where: { id },
              data: { 
                  active: false,
                  updatedAt: new Date()
              }
          });
      } catch (error) {
          if (error instanceof HttpException) throw error;
          console.error(error);
          throw new HttpException(400, "Error deleting series");
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

    static async getFavorites(userId: number): Promise<Series[]> {
      try {
          const favorites = await prisma.userSeries.findMany({
              where: {
                  idUser: userId,
                  favorite: true,
              },
              select: {
                  series: {
                      include: {
                          genre: true
                      }
                  }
              }
          });

          // Extract series from UserSeries
          return favorites.map(item => item.series);
      } catch (error) {
          console.error(error);
          throw new HttpException(500, "Error obtaining favorite series");
      }
  }

  static async getWatchlist(userId: number): Promise<Series[]> {
      try {
          const watchlist = await prisma.userSeries.findMany({
              where: {
                  idUser: userId,
                  status: "watchlist", 
              },
              select: {
                  series: {
                      include: {
                          genre: true
                      }
                  }
              }
          });

          // Extract series from UserSeries
          return watchlist.map(item => item.series);
      } catch (error) {
          console.error(error);
          throw new HttpException(500, "Error obtaining watchlist");
      }
  }
}