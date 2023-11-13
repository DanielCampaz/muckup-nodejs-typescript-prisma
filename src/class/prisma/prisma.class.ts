import { PrismaClient } from '@prisma/client';

export default class PrismaConnect {
  static instance: PrismaConnect | null = null;
  prisma: PrismaClient;
  error: boolean | string = false;
  private constructor() {
    this.prisma = new PrismaClient();
  }

  checkConnection(): void {
    this.prisma.user
      .create({
        data: {
          name: 'Example',
          email: 'example@prisma.io',
          password: 'examplepassword'
        }
      })
      .then((data) => {
        console.log(data);
        if (
          data === null ||
          data === undefined ||
          Object.entries(data).length < 0
        ) {
          this.error = true;
        }
      })
      .catch((er) => {
        this.error = JSON.stringify(er);
      });
  }

  static getInstance(): PrismaConnect {
    if (this.instance === null) {
      this.instance = new PrismaConnect();
    }

    return this.instance;
  }
}
