import { DBAdapterFunction, DbAdapter, FilterType } from '../connector/connector.types';
import { DBUniqueKeyError } from '../error';
import { curry } from '../helper/curry';
import { createValidator, updateValidator } from '../schema/schema';
import { DBSchemaType } from '../schema/schema.types';
import { Repository, MethodParams } from './builder.types';

const validateUniques = async <T>(dbAdapter: DbAdapter<T>, uniques: Partial<T>[]): Promise<void> => {
  const uniquesFound = (await Promise.all(uniques.map((unique) => dbAdapter.getOne(unique))))
    .reduce((acc, val, i) => {
      return val !== undefined
          ? [...acc, ...[uniques[i]]]
          : [...acc];
    }, [] as Partial<T>[]);

  if (uniquesFound.length) {
    throw new DBUniqueKeyError(uniquesFound);
  }
};

const create = async <T>({ dbAdapter, schema, validateCreate }: MethodParams<T>,  data: Omit<T, 'id'> & Record<string, unknown>): Promise<T> => {
  validateCreate(data as T);
  await validateUniques(dbAdapter, schema.uniques.map((uniqie) => ({ [uniqie]: data[uniqie] } as Partial<T>)));

  return dbAdapter.create(data);
};

const update = async <T>({ dbAdapter, schema, validateUpdate }: MethodParams<T>, { where, data }: { where: Partial<T>, data: Omit<Partial<T>, 'id'> & Record<string, unknown> }): Promise<T[]> => {
  validateUpdate(data as Partial<T>);
  await validateUniques(dbAdapter, schema.uniques.map((uniqie) => ({ [uniqie]: data[uniqie] } as Partial<T>)));

  return dbAdapter.update(where, data as Partial<T>);
};

const getOne = async <T>({ dbAdapter }: MethodParams<T>, where: Partial<T>): Promise<T> => {
  return dbAdapter.getOne(where);
};

const getMany = <T>({ dbAdapter }: MethodParams<T>, filters: FilterType): Promise<T[]> => {
  return dbAdapter.getMany(filters);
};

const removeOne = async <T>({ dbAdapter }: MethodParams<T>, where: Partial<T>): Promise<T | undefined> => {
  if (!await dbAdapter.getOne(where)) {
    return undefined;
  }

  return dbAdapter.removeOne(where);
};

const custom = <T>(dbAdapter: DbAdapter<T>) => (): any => {
  return dbAdapter.custom();
};

async function query<T>(methodParams: MethodParams<T>, method: Function, param: any) {
  try {
    return await method(methodParams, param);
  } catch(error) {
    console.error(error.message);
    throw new Error('DB ERROR');
  }
}

export function repository<T>(dbAdapter: DBAdapterFunction<T>, entitySchema: DBSchemaType<T>): Repository<T> {
  const adapter = dbAdapter(entitySchema);
  const validateCreate = createValidator(entitySchema);
  const validateUpdate = updateValidator(entitySchema);

  return { ...[
      create,
      update,
      getOne,
      getMany,
      removeOne,
    ].reduce((acc, method) => {
      const methodParams: MethodParams<T> = { 
        dbAdapter: adapter,
        validateCreate,
        validateUpdate,
        schema: entitySchema
      };

      return { ...acc, [method.name]: curry(query)(methodParams)(method) }
    }, {} as Repository<T>),
    custom: custom(adapter),
  };
}
