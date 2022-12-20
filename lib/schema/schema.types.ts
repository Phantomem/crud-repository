import { JSONSchemaType } from "ajv";

export type DBSchemaType<T> = {
  uniques: string[]
} & JSONSchemaType<T>;

export type ValidatorFunction<T> = (data: T | Partial<T>) => void;
