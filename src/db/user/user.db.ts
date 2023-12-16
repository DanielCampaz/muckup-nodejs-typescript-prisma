import { type User, type PrismaClient, type $Enums } from '@prisma/client';
import PrismaConnect from '../prisma.class';
import type { Query, IDataBase, BatchPayload } from '@/types/IDataBase';
import type { Paginate, PaginateResponse } from '@/types/types';

export interface UserOptional {
  email: string;
  password: string;
  name: string;
  role?: $Enums.Role;
}

export default class UserDataBase implements IDataBase<User, UserOptional> {
  static instance: UserDataBase | null = null;
  prisma: PrismaClient;

  private constructor() {
    this.prisma = PrismaConnect.getInstance().prisma;
  }

  async create(data: UserOptional): Promise<User> {
    return await this.prisma.user.create({
      data
    });
  }

  async delete(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id
      }
    });
  }

  async deleteMany(_query: Query<Partial<User>>): Promise<BatchPayload> {
    throw new Error('No Implemented Mehtod');
  }

  async update(data: Partial<User>, id: string): Promise<User> {
    return await this.prisma.user.update({
      data,
      where: {
        id
      }
    });
  }

  async readById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async read(
    _id: string,
    paginate?: Paginate
  ): Promise<PaginateResponse<User[]>> {
    let pgn: Paginate = {
      take: 10,
      skip: 0
    };

    if (paginate !== undefined) {
      pgn = paginate;
    }

    const data = await this.prisma.user.findMany({
      ...pgn
    });

    return {
      data,
      paginate: pgn
    };
  }

  async readByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async readBySearch(
    query: Query<Partial<User>>,
    paginate?: Paginate
  ): Promise<PaginateResponse<User[]>> {
    let pgn: Paginate = {
      take: 10,
      skip: 0
    };

    if (paginate !== undefined) {
      pgn = paginate;
    }

    const data = await this.prisma.user.findMany({
      ...pgn,
      where: query.where
    });

    return {
      data,
      paginate: pgn
    };
  }

  static getInstance(): UserDataBase {
    if (this.instance === null) {
      this.instance = new UserDataBase();
    }
    return this.instance;
  }
}
