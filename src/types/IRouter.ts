import type { Router } from 'express';

export type PathType = `/${string}`;

export default interface IRouter {
  path: PathType;
  router: Router;
  initializeRoutes: <T>(value?: T) => void;
}
