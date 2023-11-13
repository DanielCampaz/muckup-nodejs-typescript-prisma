import type IRouter from '@/types/IRouter';
import { type PathType } from '@/types/IRouter';
import { Router, type Response, type Request } from 'express';

export default class ExampleRouter implements IRouter {
  router: Router;
  path: PathType;
  static instance: ExampleRouter | null = null;

  private constructor() {
    this.path = '/example';
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes<T>(_value?: T | undefined): void {
    this.router.get('/', this.getExample);
  }

  private getExample(_req: Request, res: Response): void {
    res.send('example Route').sendStatus(200);
  }

  static getInstance(): ExampleRouter {
    if (this.instance === null) {
      this.instance = new ExampleRouter();
    }

    return this.instance;
  }
}
