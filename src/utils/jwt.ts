import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import env from './enviroments';
import type { RouterFunctionNext } from '@/types/types';

export default class JWT {
  static instance: JWT | null = null;
  private readonly secretKey = env.SECRET_TOKEN_JWT ?? '1234';

  private constructor() {}

  CreateToken(user, expiresIn: `${string}h`): string {
    return jwt.sign(user, this.secretKey, { expiresIn });
  }

  VerifyToken(): RouterFunctionNext {
    const secKey = this.secretKey;
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      if (token === undefined) {
        res.status(403).json({ error: 'No Token' });
        return;
      }

      jwt.verify(token, secKey, (err, decoded) => {
        if (err === null) {
          res.status(401).json({ error: 'Invalid Token.' });
          return;
        }

        req.body.userJWTVerify = decoded;
        next();
      });
    };
  }

  static getInstance(): JWT {
    if (this.instance === null) {
      this.instance = new JWT();
    }

    return this.instance;
  }
}
