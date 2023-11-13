import express, { type Express } from 'express';
import type IRouter from '@/types/IRouter';
import env from '@/utils/enviroments';

export default class App {
  static instance: App | null = null;
  public app: Express;
  private constructor() {
    this.app = express();

    this.middlewares();
  }

  middlewares(): void {
    this.app.use(express.json());
  }

  import(route: IRouter): void {
    this.app.use(route.path, route.router);
  }

  initialize(): void {
    const PORT = env.EXPRESS_PORT;
    this.app.listen(PORT, () => {
      console.log(`Server Lisent to Port ${PORT}`);
    });
  }

  static getInstance(): App {
    if (this.instance === null) {
      this.instance = new App();
    }

    return this.instance;
  }
}
