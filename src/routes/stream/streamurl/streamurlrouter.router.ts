import StreamUrlDataBase from '@/db/streamUrl/streamUrl.db';
import type IRouter from '@/types/IRouter';
import { type PathType } from '@/types/IRouter';
import type { RouterFunction } from '@/types/types';
import {
  DeleteFile,
  VerifyEnumTypeStreamType,
  VerifyRequestID,
  VerifyRequestIDStreamUrl
} from '@/utils/functions';
import Hash from '@/utils/hash';
import JWT from '@/utils/jwt';
import { Router, type Response, type Request } from 'express';

export default class StreamUrlRouter implements IRouter {
  router: Router;
  path: PathType;
  streamUrlDB: StreamUrlDataBase;
  static instance: StreamUrlRouter | null = null;

  private constructor() {
    this.path = '/streamurl';
    this.router = Router();
    this.streamUrlDB = StreamUrlDataBase.getInstance();
    this.initializeRoutes();
  }

  initializeRoutes<T>(_value?: T | undefined): void {
    this.router.post(
      '/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      this.postSave(this.streamUrlDB)
    );
    this.router.delete(
      '/:id/:idStreamUrl',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      VerifyRequestIDStreamUrl,
      this.deleteUrl(this.streamUrlDB)
    );

    this.router.get(
      '/:id/:idStreamUrl',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      VerifyRequestIDStreamUrl,
      this.getStreamUrl(this.streamUrlDB)
    );
  }

  private postSave(db: StreamUrlDataBase): RouterFunction {
    return ({ body }: Request, res: Response) => {
      const { name, type, password } = body;
      db.create({
        name,
        url: '',
        type: VerifyEnumTypeStreamType(type),
        active: false,
        password: Hash.getInstance().hashText(password)
      })
        .then((data) => {
          res.json(data);
        })
        .catch((_err) => {
          res.json({
            error: 'To Create StreamUrl to Database {{StreamUrlRouter}}'
          });
        });
    };
  }

  private getStreamUrl(db: StreamUrlDataBase): RouterFunction {
    return ({ params }: Request, res: Response) => {
      const { idStreamUrl } = params;
      db.readById(idStreamUrl)
        .then((data) => {
          res.json(data);
        })
        .catch((_err) => {
          res.json({
            error: 'To Get StreamUrl to Database {{StreamUrlRouter}}'
          });
        });
    };
  }

  private deleteUrl(db: StreamUrlDataBase): RouterFunction {
    return (req: Request, res: Response) => {
      const { idStreamUrl } = req.params;
      db.delete(idStreamUrl)
        .then((data) => {
          const del = DeleteFile(data.url);
          if (del) {
            res.json({
              message: `Stream Url "${data.name}" deleting Succesfully`
            });
          } else {
            res.json({
              error: `Stream Url "${data.name}" deleting UnSuccesfully File System`
            });
          }
        })
        .catch((_err) => {
          res.json({
            error: `Stream Url "${idStreamUrl}" deleting UnSuccesfully Database`
          });
        });
    };
  }

  static getInstance(): StreamUrlRouter {
    if (this.instance === null) {
      this.instance = new StreamUrlRouter();
    }

    return this.instance;
  }
}
