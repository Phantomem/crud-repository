import { JSONSchemaType } from 'ajv';

export type FiltersType = '>='|'<='|'ilike'|'in';

export type DBPropertySchemaKeywords = {
  filters?: FiltersType[],
  isPrimary?: boolean,
}

export type PropertySchemaType<T> = {
  [K in keyof T]-?: (JSONSchemaType<T[K]> & DBPropertySchemaKeywords) | {
    $ref: string;
  };
};

export type DBSchemaType<T> = {
  table: string,
  uniques: string[],
  properties: PropertySchemaType<T>
} & JSONSchemaType<T>;

export type ValidatorFunction<T> = (data: T | Partial<T>) => void;
