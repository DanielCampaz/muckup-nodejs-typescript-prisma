import type IRouter from '@/types/IRouter';
import type { RouterFunction } from '@/types/types';
import { Router, type Response, type Request } from 'express';
import JWT from '../jwt';
import { VerifyRequestIDAdmin } from '../functions';
import type { PathType } from '@/types/IRouter';

export default class StreamRouter implements IRouter {
  static instance: StreamRouter | null = null;
  path: PathType;
  router: Router;
  private constructor() {
    this.path = '/stream';
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(
      '/init/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestIDAdmin,
      this.postInitTransmition()
    );

    this.router.delete(
      '/finish/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestIDAdmin,
      this.deleteFinishTransmition()
    );
  }

  private postInitTransmition(): RouterFunction {
    return (_req: Request, res: Response) => {
      res.send('Initial Transmisition');
    };
  }

  private deleteFinishTransmition(): RouterFunction {
    return (_req: Request, res: Response) => {
      res.send('Finish Transmisition');
    };
  }

  static getInstance(): StreamRouter {
    if (this.instance === null) {
      this.instance = new StreamRouter();
    }
    return this.instance;
  }
}
