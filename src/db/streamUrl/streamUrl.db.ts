import type { PrismaClient, StreamUrl } from '@prisma/client';
import PrismaConnect from '../prisma.class';

export default class StreamUrlDataBase {
  static instance: StreamUrlDataBase | null = null;
  prisma: PrismaClient;

  private constructor() {
    this.prisma = PrismaConnect.getInstance().prisma;
  }

  async create(data: Omit<StreamUrl, 'id'>): Promise<StreamUrl> {
    return await this.prisma.streamUrl.create({
      data
    });
  }

  async delete(id: string): Promise<StreamUrl> {
    return await this.prisma.streamUrl.delete({
      where: {
        id
      }
    });
  }

  async update(data: Omit<StreamUrl, 'id'>, id: string): Promise<StreamUrl> {
    return await this.prisma.streamUrl.update({
      data,
      where: {
        id
      }
    });
  }

  async read(): Promise<StreamUrl | null> {
    return await this.prisma.streamUrl.findFirst();
  }

  // TODO: Change to PreConnect NMS
  async readById(id: string): Promise<StreamUrl | null> {
    return await this.prisma.streamUrl.findUnique({
      where: {
        id
      }
    });
  }

  static getInstance(): StreamUrlDataBase {
    if (this.instance === null) {
      this.instance = new StreamUrlDataBase();
    }
    return this.instance;
  }
}
