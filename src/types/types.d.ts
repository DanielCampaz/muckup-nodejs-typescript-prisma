import type { NextFunction, Response, Request } from 'express';

export interface Paginate {
  skip: number;
  take: number;
}

export interface PaginateResponse<T> {
  data: T;
  paginate: Paginate;
}

export type RouterFunction = (req: Request, res: Response) => void;
export type RouterFunctionNext = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
