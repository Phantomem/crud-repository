import { DbAdapter, FilterType } from '../adapter/adapter.types';
import { DBSchemaType, ValidatorFunction } from '../schema/schema.types';

export type MethodParams<T> = {
  dbAdapter: DbAdapter<T>,
  schema: DBSchemaType<T>,
  validateCreate: ValidatorFunction<T>,
  validateUpdate: ValidatorFunction<T>,
};
export type Create<T> = (data: Omit<T, 'id'>) => Promise<T | undefined>;
export type Update<T> = ({ where, data }: { where: Partial<T>, data: Partial<T> }) => Promise<T[] | undefined>;
export type GetOne<T> = (id: string) => Promise<T | undefined>;
export type GetMany<T> = (filters: FilterType) => Promise<T[] | undefined>;
export type RemoveOne<T> = (id: string) => Promise<T | undefined>;
export type Repository<T> = {
  create: Create<T>,
  update: Update<T>,
  getOne: GetOne<T>,
  getMany: GetMany<T>,
  removeOne: RemoveOne<T>,
  custom: () => any,
};