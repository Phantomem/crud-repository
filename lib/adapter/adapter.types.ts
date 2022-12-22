import { DBSchemaType } from '../schema';

export type FilterOperatorMultiple = 'and' | 'or' | 'not';
export type FilterOperatorSingle = 'single';
export type FilterArrayFilterType = [FilterSingleType, ...FilterType[]];
export type FilterSingleFilterType = {
  key: string,
  filter: string,
  value: any,
};
export type FilterMultipleType = {
  operator: FilterOperatorMultiple,
  flow: FilterArrayFilterType,
};
export type FilterSingleType = {
  operator: FilterOperatorSingle,
  flow: FilterSingleFilterType,
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

const filter: FilterType = {
  operator: 'and',
  flow: [
    {
      operator: 'single',
      flow: {
        key: '',
        filter: '',
        value: '',
      }
    },
  ],
}