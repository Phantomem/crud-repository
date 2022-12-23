import { DBSchemaType } from '../schema';

export type FilterMarkType = '>=' | '<=' | '>' | '<' | '=' | 'ilike' | '!=' | 'in';
export type FilterOperatorMultiple = 'and' | 'or';
export type FilterOperatorSingle = 'single';
export type FilterArrayFilterType = FilterType[];
export type FilterSingleFilterType = {
  key: string,
  filter: string,
  value: any,
};
export type FilterMultipleType = {
  readonly operator: FilterOperatorMultiple,
  readonly flow: FilterArrayFilterType,
};
export type FilterSingleType = {
  readonly operator: FilterOperatorSingle,
  readonly flow: FilterSingleFilterType,
};
export type FilterType = FilterMultipleType | FilterSingleType;
export type DBAdapterFunction<T> = (schema: DBSchemaType<T>) => DbAdapter<T>;
export type DbAdapter<T> = {
  create: (data: Omit<T, 'id'>) => Promise<T>,
  update: (where: Partial<T>, data: Partial<T>) => Promise<T[]>,
  getOne: (where: Partial<T>) => Promise<T>,
  getMany: (filters: FilterType) => Promise<T[]>,
  removeOne: (where: Partial<T>) => Promise<T>,
  custom: () => any
};
