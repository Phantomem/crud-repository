import { Knex } from 'knex';
import { DBSchemaType } from '../../schema';
import { DBAdapterFunction, DbAdapter, FilterType } from '../adapter.types';
import { buildWhereByFilters } from './sqlFilterBuilder';

export function sqlAdapter<T>(pool: Knex): DBAdapterFunction<T> {
  return (schema: DBSchemaType<T>): DbAdapter<T> => {
    const qb = () => pool(schema.table);

    return {
      create: async (data) => {
        return await qb().insert(data).returning('*').first();
      },
      update: async (where, data) => {
        return await qb().where(where).update(data).returning('*');
      },
      getOne: async (where) => {
        return await qb().where(where).first();
      },
      getMany: async (filters: FilterType) => {
        const queryBuilder = buildWhereByFilters(qb(), filters);
        return await queryBuilder.groupBy('id');
      },
      removeOne: async (where) => {
        return await qb().where(where).delete().returning('*').first();
      },
      custom: () => qb,
    }
  };
}
