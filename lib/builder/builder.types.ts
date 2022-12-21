import { DbAdapter } from '../adapter/adapter.types';
import { DBSchemaType, FiltersType, ValidatorFunction } from '../schema/schema.types';

export type FilterOperator = 'and' | 'or' | 'not' | 'none';
export type FilterArrayType = [FilterParam, ...FilterType[]];
export type FilterAnd = {
  and: FilterArrayType,
};
export type FilterOr = {
  or: FilterArrayType,
};
export type FilterNot = {
  not: FilterArrayType,
}
export type FilterParam = {
  key: string,
  filter: FiltersType,
  value: any,
};
export type FilterType = FilterParam | FilterAnd | FilterOr | FilterNot;
export type MethodParams<T> = {
  dbAdapter: DbAdapter<T>,
  schema: DBSchemaType<T>,
  validateCreate: ValidatorFunction<T>,
  validateUpdate: ValidatorFunction<T>,
};
export type Create<T> = (data: Omit<T, 'id'>) => Promise<T | undefined>;
export type Update<T> = ({ where, data }: { where: Partial<T>, data: Partial<T> }) => Promise<T[] | undefined>;
export type GetOne<T> = (id: string) => Promise<T | undefined>;
export type GetMany<T> = (filters: FilterParam) => Promise<T[] | undefined>;
export type RemoveOne<T> = (id: string) => Promise<T | undefined>;
export type Repository<T> = {
  create: Create<T>,
  update: Update<T>,
  getOne: GetOne<T>,
  getMany: GetMany<T>,
  removeOne: RemoveOne<T>,
  custom: () => any,
};