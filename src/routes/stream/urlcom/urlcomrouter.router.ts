import UrlComDatabase from '@/db/urlCom/urlCom.db';
import type IRouter from '@/types/IRouter';
import { type PathType } from '@/types/IRouter';
import type { RouterFunction } from '@/types/types';
import {
  DeleteFile,
  VerifyEnumTypeStreamType,
  VerifyRequestID,
  VerifyRequestIDUrlCom
} from '@/utils/functions';
import JWT from '@/utils/jwt';
import { Router, type Response, type Request } from 'express';

export default class UrlComRouter implements IRouter {
  router: Router;
  path: PathType;
  urlComDB: UrlComDatabase;
  static instance: UrlComRouter | null = null;

  private constructor() {
    this.path = '/urlcom';
    this.router = Router();
    this.urlComDB = UrlComDatabase.getInstance();
    this.initializeRoutes();
  }

  initializeRoutes<T>(_value?: T | undefined): void {
    this.router.post(
      '/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      this.postSave(this.urlComDB)
    );
    this.router.delete(
      '/:id/:idUrlCom',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      VerifyRequestIDUrlCom,
      this.deleteUrl(this.urlComDB)
    );
  }

  private postSave(db: UrlComDatabase): RouterFunction {
    return ({ body }: Request, res: Response) => {
      const { type, url } = body;

      db.create({
        url,
        type: VerifyEnumTypeStreamType(type)
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

  private deleteUrl(db: UrlComDatabase): RouterFunction {
    return (req: Request, res: Response) => {
      const { idStreamUrl } = req.params;
      db.delete(idStreamUrl)
        .then((data) => {
          const del = DeleteFile(data.url);
          if (del) {
            res.json({
              message: `Url Com "${data.url}" deleting Succesfully`
            });
          } else {
            res.json({
              error: `Url Com "${data.url}" deleting UnSuccesfully File System`
            });
          }
        })
        .catch((_err) => {
          res.json({
            error: `Url Com "${idStreamUrl}" deleting UnSuccesfully Database`
          });
        });
    };
  }

  static getInstance(): UrlComRouter {
    if (this.instance === null) {
      this.instance = new UrlComRouter();
    }

    return this.instance;
  }
}
