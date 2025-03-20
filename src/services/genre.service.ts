import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Genre } from "@prisma/client";

//TODO problema, mejor usar el patrón singleton

export class GenreService {
  static async getAll() {
    return prisma.genre.findMany();
  }

  static async getById(id: number) {
    const findSerie = await prisma.genre.findUnique({ where: { id: id } });
    if (!findSerie) throw new HttpException(404, "Genre doesn't exist");

    return findSerie;
  }

  static async create(genre: Genre) {
    try{
      return await prisma.genre.create({
        data: {
          ...genre,
        },
      });
    }catch(error){
        throw new HttpException(401, "Error creating genre");
      }
  }

  static async update(id: number, genre: Genre) {
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