import { ErrorObject } from 'ajv';

export class DBUniqueKeyError extends Error {
  private readonly context: any;
  constructor(context: any) {
    super('Database Error');
    this.context = context;
  }
}

export class DBValidationError extends Error {
  private readonly context: undefined | null | ErrorObject[];
  constructor(context: undefined | null | ErrorObject[]) {
    super('DB Validation Error');
    this.context = context;
  }
}
