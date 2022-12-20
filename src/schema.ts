import Ajv, { JSONSchemaType } from "ajv";
import { DBValidationError } from "./error";
const ajv = new Ajv();

export type DBSchemaType<T> = {
  uniques: string[]
} & JSONSchemaType<T>;

export type ValidatorFunction<T> = (data: T | Partial<T>) => void;

const validate = <T>(schema: DBSchemaType<T>, skipRequired: boolean): ValidatorFunction<T> => {
  return (data: T | Partial<T>): void => {
    const schemaValidation = skipRequired
      ? { ...schema, required: [] }
      : schema;
    
    const validateSchema = ajv.compile(schemaValidation);
    const valid = validateSchema(data);

    if(!valid) {
      throw new DBValidationError(validateSchema.errors);
    }
  }
};

export const createValidator = <T>(schema: DBSchemaType<T>) => validate(schema, false);
export const updateValidator = <T>(schema: DBSchemaType<T>) => validate(schema, true);
