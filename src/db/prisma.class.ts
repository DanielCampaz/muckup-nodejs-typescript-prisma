import { PrismaClient } from '@prisma/client';

export default class PrismaConnect {
  static instance: PrismaConnect | null = null;
  prisma: PrismaClient;
  error: boolean | string = false;
  private constructor() {
    this.prisma = new PrismaClient();
  }

  async checkConnection(): Promise<void> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: 'example@prisma.io'
        }
      });
      if (
        user === null ||
        user === undefined ||
        Object.entries(user).length < 0
      ) {
        const data = await this.prisma.user.create({
          data: {
            name: 'Example',
            email: 'example@prisma.io',
            password: 'examplepassword'
          }
        });
        if (
          data === null ||
          data === undefined ||
          Object.entries(data).length < 0
        ) {
          console.log('Conection to Db Fatal error');
        } else {
          console.log('Conection to Db Succesfull');
        }
        this.error = true;
      } else {
        console.log('Conection to Db Succesfull');
      }
    } catch (error) {
      console.log('Conection to Db Fatal error');
      this.error = JSON.stringify(error);
    }
  }

  static getInstance(): PrismaConnect {
    if (this.instance === null) {
      this.instance = new PrismaConnect();
    }

    return this.instance;
  }
}
