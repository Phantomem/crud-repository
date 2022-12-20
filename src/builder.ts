import { DbAdapter } from './adapter/type';
import { DBUniqueKeyError } from './error';
import { curry } from "./lib/curry";
import { DBSchemaType, createValidator, updateValidator, ValidatorFunction } from './schema';

type MethodParams<T> = { 
  dbAdapter: DbAdapter<T>,
  schema: DBSchemaType<T>,
  validateCreate: ValidatorFunction<T>,
  validateUpdate: ValidatorFunction<T>,
}

type Create<T> = (data: Omit<T, 'id'>) => Promise<T | undefined>
type Update<T> = ({ where, data }: { where: Partial<T>, data: Partial<T> }) => Promise<T[] | undefined>
type GetOne<T> = (id: string) => Promise<T | undefined>
type GetMany<T> = (filters: Partial<T>) => Promise<T[] | undefined>
type RemoveOne<T> = (id: string) => Promise<T | undefined>
type Repository<T> = {
  create: Create<T>,
  update: Update<T>,
  getOne: GetOne<T>,
  getMany: GetMany<T>,
  removeOne: RemoveOne<T>,
  custom: () => any,
}

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
}

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

const getMany = <T>({ dbAdapter }: MethodParams<T>, filters: Partial<T>): Promise<T[]> => {
  return dbAdapter.getMany(filters);
};

const removeOne = async <T>({ dbAdapter }: MethodParams<T>, where: Partial<T>): Promise<T | undefined> => {
  if (!await dbAdapter.getOne(where)) {
    return undefined;
  }

  return dbAdapter.removeOne(where);
}

const custom = <T>(dbAdapter: DbAdapter<T>) => (): any => {
  return dbAdapter.custom();
}

async function query<T>(methodParams: MethodParams<T>, method: Function, param: any) {
  try {
    return await method(methodParams, param);
  } catch(error) {
    console.error(error.message);
    throw new Error('DB ERROR');
  }
}

export function repository<T>(dbAdapter: { <T>(schema: any): DbAdapter<T> }, entitySchema: DBSchemaType<T>): Repository<T> {
  const adapter = dbAdapter<T>(entitySchema);
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
