import type { $Enums, File, PrismaClient } from '@prisma/client';
import PrismaConnect from '../prisma.class';
import type { Query, IDataBase, BatchPayload } from '@/types/IDataBase';
import type { Paginate, PaginateResponse } from '@/types/types';

export interface FileOptional {
  name: string;
  size: number;
  subtype: $Enums.SubType;
  type: $Enums.Type;
  url: string;
  userId: string;
  encoding: string;
  filename: string;
}

export default class FileDatabase implements IDataBase<File, FileOptional> {
  static instance: FileDatabase | null = null;
  prisma: PrismaClient;

  private constructor() {
    this.prisma = PrismaConnect.getInstance().prisma;
  }

  async create(data: FileOptional): Promise<File> {
    return await this.prisma.file.create({
      data
    });
  }

  async delete(id: string): Promise<File> {
    return await this.prisma.file.delete({
      where: {
        id
      }
    });
  }

  async deleteMany(query: Query<Partial<File>>): Promise<BatchPayload> {
    return await this.prisma.file.deleteMany({
      where: query.where
    });
  }

  async update(data: Partial<File>, id: string): Promise<File> {
    return await this.prisma.file.update({
      data,
      where: {
        id
      }
    });
  }

  async readById(id: string): Promise<File | null> {
    return await this.prisma.file.findUnique({
      where: {
        id
      }
    });
  }

  async read(
    id: string,
    paginate?: Paginate
  ): Promise<PaginateResponse<File[]>> {
    let pgn: Paginate = {
      take: 10,
      skip: 0
    };

    if (paginate !== undefined) {
      pgn = paginate;
    }

    const data = await this.prisma.file.findMany({
      ...pgn,
      where: {
        userId: id
      }
    });

    return {
      data,
      paginate: pgn
    };
  }

  async readBySearch(
    query: Query<Partial<File>>,
    paginate?: Paginate
  ): Promise<PaginateResponse<File[]>> {
    let pgn: Paginate = {
      take: 10,
      skip: 0
    };

    if (paginate !== undefined) {
      pgn = paginate;
    }

    const data = await this.prisma.file.findMany({
      ...pgn,
      where: query.where
    });

    return {
      data,
      paginate: pgn
    };
  }

  static getInstance(): FileDatabase {
    if (this.instance === null) {
      this.instance = new FileDatabase();
    }
    return this.instance;
  }
}
