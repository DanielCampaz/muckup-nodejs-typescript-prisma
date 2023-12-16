import type { PrismaClient, StreamType, UrlCom } from '@prisma/client';
import PrismaConnect from '../prisma.class';

export default class UrlComDatabase {
  static instance: UrlComDatabase | null = null;
  prisma: PrismaClient;

  private constructor() {
    this.prisma = PrismaConnect.getInstance().prisma;
  }

  async create(data: Omit<UrlCom, 'id'>): Promise<UrlCom> {
    return await this.prisma.urlCom.create({
      data
    });
  }

  async delete(id: string): Promise<UrlCom> {
    return await this.prisma.urlCom.delete({
      where: {
        id
      }
    });
  }

  async update(data: Partial<UrlCom>, id: string): Promise<UrlCom> {
    return await this.prisma.urlCom.update({
      data,
      where: {
        id
      }
    });
  }

  async read(): Promise<UrlCom | null> {
    return await this.prisma.urlCom.findFirst();
  }

  // TODO: Change to PreConnect NMS
  async readFirst(type: StreamType): Promise<UrlCom | null> {
    return await this.prisma.urlCom.findFirst({
      where: {
        type
      }
    });
  }

  async readById(id: string): Promise<UrlCom | null> {
    return await this.prisma.urlCom.findUnique({
      where: {
        id
      }
    });
  }

  static getInstance(): UrlComDatabase {
    if (this.instance === null) {
      this.instance = new UrlComDatabase();
    }
    return this.instance;
  }
}
