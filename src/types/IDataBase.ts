import type { Paginate, PaginateResponse } from './types';

export type QueryType<T> = string | number | object | symbol | boolean | T;

export interface Query<T> {
  where: Record<string, QueryType<T>>;
}

export interface BatchPayload {
  count: number;
}
export interface IDataBase<TD, T> {
  create: (data: T) => Promise<TD>;
  delete: (id: string) => Promise<TD>;
  deleteMany: (query: Query<Partial<TD>>) => Promise<BatchPayload>;
  update: (data: Partial<TD>, id: string) => Promise<TD>;
  read: (id: string, paginate?: Paginate) => Promise<PaginateResponse<TD[]>>;
  readById: (id: string) => Promise<TD | null>;
  readBySearch: (
    query: Query<Partial<TD>>,
    paginate?: Paginate
  ) => Promise<PaginateResponse<TD[]>>;
}
