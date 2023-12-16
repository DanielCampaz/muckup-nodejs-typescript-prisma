import UserDataBase from '@/db/user/user.db';
import type IRouter from '@/types/IRouter';
import type { PathType } from '@/types/IRouter';
import type { RouterFunction } from '@/types/types';
import { GetTime } from '@/utils/functions';
import Hash from '@/utils/hash';
import JWT from '@/utils/jwt';
import { $Enums, type User } from '@prisma/client';
import { Router, type Response, type Request } from 'express';

export default class AuthRouter implements IRouter {
  router: Router;
  path: PathType;
  userDB: UserDataBase;

  private constructor() {
    this.path = '/auth';
    this.router = Router();
    this.userDB = UserDataBase.getInstance();
    this.initializeRoutes();
  }

  initializeRoutes<T>(_value?: T | undefined): void {
    this.router.post('/login', this.login(this.userDB));
    this.router.post('/singup', this.singUp(this.userDB));
  }

  private login(db: UserDataBase): RouterFunction {
    return (req: Request, res: Response) => {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      db.readByEmail(email)
        .then((data) => {
          if (data !== null) {
            if (data.password === Hash.getInstance().hashText(password)) {
              res.json({
                token: this.getToken(data),
                user: data
              });
            }
          } else {
            res.status(403).json({ error: 'error to get User Verify email' });
          }
        })
        .catch((error) => {
          res.status(403).json({ error });
        });
    };
  }

  private getToken(user: User): string {
    const time = GetTime(user.role);
    return JWT.getInstance().CreateToken(user, time);
  }

  private singUp(db: UserDataBase): RouterFunction {
    return (req: Request, res: Response) => {
      const { name, email, password } = req.body as {
        email: string;
        password: string;
        name?: string;
      };

      db.create({
        email,
        name: name ?? '',
        password: Hash.getInstance().hashText(password),
        role: $Enums.Role.USER
      })
        .then(() => {
          res.json({
            message: 'User Create Suseccfull'
          });
        })
        .catch((error) => {
          res.json({
            message: `User Create UnSuseccfull ${JSON.stringify(error)}`
          });
        });
    };
  }

  static instance: AuthRouter | null = null;
  static getInstance(): AuthRouter {
    if (this.instance === null) {
      this.instance = new AuthRouter();
    }

    return this.instance;
  }
}
