import { DBSchemaType } from '../schema';

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
  filter: FilterType,
  value: any,
};
export type FilterType = FilterParam | FilterAnd | FilterOr | FilterNot;
export type DBAdapterFunction<T> = (schema: DBSchemaType<T>) => DbAdapter<T>;
export type DbAdapter<T> = {
  create: (data: Omit<T, 'id'>) => Promise<T>,
  update: (where: Partial<T>, data: Partial<T>) => Promise<T[]>,
  getOne: (where: Partial<T>) => Promise<T>,
  getMany: (filters: FilterType) => Promise<T[]>,
  removeOne: (where: Partial<T>) => Promise<T>,
  custom: () => any
};
