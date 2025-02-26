import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Genre } from "@prisma/client";

export class GenreService {
  static async getAll() {
    return prisma.genre.findMany();
  }

  static async getById(id: number) {
    const genre = await prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new HttpException(404, "Genre not found");
    return genre;
  }

  static async create(genre: Partial<Genre>) {
    try {
      return await prisma.genre.create({
        data: {
          ...genre,
        },
      });
    } catch (error) {
      throw new HttpException(400, "Error creating genre");
    }
  }

  static async update(id: number, genre: Partial<Genre>) {
    try {
      return await prisma.genre.update({
        where: { id },
        data: { ...genre },
      });
    } catch (error) {
      throw new HttpException(404, "Genre not found");
    }
  }

  static async delete(id: number) {
    try {
      return await prisma.genre.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(404, "Genre not found");
    }
  }
}