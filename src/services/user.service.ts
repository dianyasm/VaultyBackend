import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { User } from "@prisma/client";

export class UserService {
  static async getByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        preferences: true,
        active: true,
        acceptNotifications: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) throw new HttpException(404, "User not found");
    return user;
  }

  static async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        preferences: true,
        active: true,
        acceptNotifications: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) throw new HttpException(404, "User not found");
    return user;
  }

  static async getAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        active: true,
        acceptNotifications: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async getUserSeries(userId: number, status?: string) {
    try {
      return await prisma.userSeries.findMany({
        where: {
          idUser: userId,
          ...(status && { status })
        },
        include: {
          series: {
            include: {
              genre: true
            }
          }
        },
        orderBy: {
          updatedAt: "desc"
        }
      });
    } catch (error) {
      throw new HttpException(400, "Error fetching user series");
    }
  }

  static async getUserReviews(userId: number) {
    try {
      return await prisma.review.findMany({
        where: {
          idUser: userId
        },
        include: {
          series: {
            include: {
              genre: true
            }
          }
        },
        orderBy: {
          updatedAt: "desc"
        }
      });
    } catch (error) {
      throw new HttpException(400, "Error fetching user reviews");
    }
  }

  static async updatePreferences(userId: number, preferences: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { preferences },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          preferences: true,
          acceptNotifications: true
        }
      });
    } catch (error) {
      throw new HttpException(400, "Error updating user preferences");
    }
  }
}
