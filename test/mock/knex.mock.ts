import knex from 'knex';

jest.mock('knex');

const querybuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  // TODO: add more used methods of knex query builder
};

const KnexMock = jest.fn().mockReturnValue(querybuilder);

(knex as unknown as jest.Mock).mockReturnValue(KnexMock);

export default KnexMock;
