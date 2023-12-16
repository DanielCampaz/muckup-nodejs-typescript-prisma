import FileDatabase from '@/db/file/file.db';
import type IRouter from '@/types/IRouter';
import { type PathType } from '@/types/IRouter';
import type { RouterFunction } from '@/types/types';
import CONSTS from '@/utils/consts';
import ExtractTypesSubtypes from '@/utils/extractTST';
import {
  DeleteFile,
  GenerateURLLinkRequest,
  VerifyRequestID,
  VerifyRequestIDFile
} from '@/utils/functions';
import JWT from '@/utils/jwt';
import MulterImplementation from '@/utils/multer';
import { Router, type Response, type Request } from 'express';

export default class AudioRouter implements IRouter {
  router: Router;
  path: PathType;
  fileDb: FileDatabase;
  static instance: AudioRouter | null = null;

  private constructor() {
    this.path = '/audio';
    this.router = Router();
    this.fileDb = FileDatabase.getInstance();
    this.initializeRoutes();
  }

  initializeRoutes<T>(_value?: T | undefined): void {
    const mut = new MulterImplementation('AUDIO', {}, {});
    this.router.post(
      '/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      mut.multer.single(CONSTS.SINGLE_FILE_KEY_MULTER),
      GenerateURLLinkRequest,
      this.postSave(this.fileDb)
    );
    this.router.delete(
      '/:id/:idFile',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      VerifyRequestIDFile,
      this.deleteFile(this.fileDb)
    );
  }

  private postSave(db: FileDatabase): RouterFunction {
    return ({ file, params }: Request, res: Response) => {
      const { id } = params;
      if (file !== undefined) {
        const ets = ExtractTypesSubtypes.getInstance().ConverGet({
          filename: file.filename,
          type: 'AUDIO'
        });
        if (ets !== false) {
          db.create({
            name: file.originalname,
            size: file.size,
            url: file.path,
            filename: file.filename,
            encoding: file.encoding,
            type: ets.type,
            subtype: ets.subType,
            userId: id
          })
            .then((data) => {
              res.json(data);
            })
            .catch((_err) => {
              res.json({ error: 'To Create File to Database {{AudioRouter}}' });
            });
        } else {
          res.json({ error: 'Get Type And Subtype {{AudioRouter}}' });
        }
      }
    };
  }

  private deleteFile(db: FileDatabase): RouterFunction {
    return (req: Request, res: Response) => {
      const { idFile } = req.params;
      db.delete(idFile)
        .then((data) => {
          const del = DeleteFile(data.url);
          if (del) {
            res.json({ message: `File "${data.name}" deleting Succesfully` });
          } else {
            res.json({
              error: `File "${data.name}" deleting UnSuccesfully File System`
            });
          }
        })
        .catch((_err) => {
          res.json({
            error: `File "${idFile}" deleting UnSuccesfully Database`
          });
        });
    };
  }

  static getInstance(): AudioRouter {
    if (this.instance === null) {
      this.instance = new AudioRouter();
    }

    return this.instance;
  }
}
