import FileDatabase from '@/db/file/file.db';
import UserDataBase from '@/db/user/user.db';
import type IRouter from '@/types/IRouter';
import type { PathType } from '@/types/IRouter';
import type { RouterFunction } from '@/types/types';
import {
  DeleteFolderUser,
  VerifyIDUser,
  VerifyRequestID
} from '@/utils/functions';
import Hash from '@/utils/hash';
import JWT from '@/utils/jwt';
import { $Enums } from '@prisma/client';
import { Router, type Response, type Request } from 'express';

export default class UserRouter implements IRouter {
  router: Router;
  path: PathType;
  userDB: UserDataBase;

  private constructor() {
    this.path = '/user';
    this.router = Router();
    this.userDB = UserDataBase.getInstance();
    this.initializeRoutes();
  }

  initializeRoutes<T>(_value?: T | undefined): void {
    this.router.get('/token/:id', this.getToken());

    this.router.post('/', this.postSave(this.userDB));

    this.router.get(
      '/files/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      this.getFiles(FileDatabase.getInstance())
    );
    this.router.delete(
      '/files/:id',
      JWT.getInstance().VerifyToken(),
      VerifyRequestID,
      this.deleteFiles(FileDatabase.getInstance())
    );
  }

  private postSave(db: UserDataBase): RouterFunction {
    return (req: Request, res: Response) => {
      let { name, email, password, role } = req.body as {
        name: string;
        email: string;
        password: string;
        role?: $Enums.Role;
      };

      role = $Enums.Role.USER;

      db.create({
        email,
        name,
        password: Hash.getInstance().hashText(password),
        role
      })
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res.status(403).json({ error });
        });
    };
  }

  private getToken(): RouterFunction {
    return (req: Request, res: Response) => {
      const { id } = req.params;
      if (id !== undefined) {
        VerifyIDUser(id)
          .then(({ is, user }) => {
            if (is) {
              const token = JWT.getInstance().CreateToken(user, '2h');
              res.json({
                token
              });
            } else {
              res.status(400).json({
                error: 'No User Whit this Id'
              });
            }
          })
          .catch((error) => {
            console.log(`Error Get TOken UserRouter: ${JSON.stringify(error)}`);
          });
      } else {
        res.status(400).json({
          error: 'No Proccess Id Undefined'
        });
      }
    };
  }

  private getFiles(db: FileDatabase): RouterFunction {
    return ({ params, query }: Request, res: Response) => {
      const { id } = params;
      const quer = query as { take: string; skip: string };
      const take = parseInt(quer.take ?? '0');
      const skip = parseInt(quer.skip ?? '0');
      db.read(id, { skip, take })
        .then((data) => {
          res.json(data);
        })
        .catch(() => {
          res.status(400).json({ error: 'Error to search Files' });
        });
    };
  }

  private deleteFiles(db: FileDatabase): RouterFunction {
    return (req: Request, res: Response) => {
      const id = req.params.id;
      db.deleteMany({
        where: {
          userId: id
        }
      })
        .then((data) => {
          DeleteFolderUser(id);
          console.log(data);
          res.json({
            message: `Folders Deleting and ${data.count} Files Deleting`
          });
        })
        .catch(() => {
          res.json({ error: 'Error To Delete All File Whit UserId' });
        });
    };
  }

  static instance: UserRouter | null = null;
  static getInstance(): UserRouter {
    if (this.instance === null) {
      this.instance = new UserRouter();
    }

    return this.instance;
  }
}
