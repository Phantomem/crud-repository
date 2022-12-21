# crud-repository


Crud-repository is an abstract object that can handle CRUD default methods like create, update, read, delete. Purpose is to easely gain ability to handle CRUD operations on databse table. Skipping creation from scratch every method for every table written as a code. Crud-repository is ORM-like builder for CRUD operations then. 

## Usage <a name = "usage"></a>

```ts

interface User {
  id: number,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  createdAt: string,
  updatedAt: string,
}

const userSchema: DBSchemaType<User> = {
  table: 'user',
  type: 'object',
  properties: {
    id: {
      type: 'number',
      isPrimary: true, // isPrimary property implicate unique value
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
      format: 'date',
    },
    updatedAt: {
      type: 'string',
      format: 'date',
    },
  },
  required: ['email', 'password', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
  uniques: ['email'],
};

const dbAdapter = sqlAdapter(knex({
  client: 'pg',
  connection: process.env.CONNECTION_STRING,
}))

const userRepository = repository(dbAdapter, userSchema);

userRepository.create({
  email: 'email@email.com',
  password: 'SomePassword123',
  firstName: 'John',
  lastName: 'Smith',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
}).then().catch();

```
