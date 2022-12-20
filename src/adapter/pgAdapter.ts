import { knex } from "knex";
import { DbAdapter } from "./type";

export function pgAdapter<T>(schema: any): DbAdapter<T> {
  const pool = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
  });

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
    getMany: async (filters) => {
      return await qb().where(filters);
    },
    removeOne: async (where) => {
      return await qb().where(where).delete().returning('*').first();
    },
    custom: () => qb,
  }
}
