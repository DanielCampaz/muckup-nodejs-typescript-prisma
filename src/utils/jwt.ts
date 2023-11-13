import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import env from './enviroments';

export default class JWT {
  static instance: JWT | null = null;
  private readonly secretKey =
    env.SECRET_TOKEN_JWT ?? 'muckup-nodejs-typescript-express';

  private constructor() {}

  CreateToken(user, expiresIn: `${string}h`): string {
    return jwt.sign(user, this.secretKey, { expiresIn });
  }

  VerifyToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;

    if (token === undefined) {
      res.status(403).json({ error: 'No Token' });
      return;
    }

    jwt.verify(token, this.secretKey, (err, decoded) => {
      if (err === null) {
        res.status(401).json({ error: 'Invalid Token.' });
        return;
      }

      req.body.userJWTVerify = decoded;
      next();
    });
  }

  static getInstance(): JWT {
    if (this.instance === null) {
      this.instance = new JWT();
    }

    return this.instance;
  }
}
