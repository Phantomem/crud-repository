import { FilterBuilder } from "../../../lib/connector";
import { buildWhereByFilters } from "../../../lib/connector/sql/sqlFilterBuilder";
import knex from 'knex';

describe('sqlFilterBuilder', () => {
  describe('buildWhereByFilters', () => {
    const queryBuilder = knex({
        client: 'pg',
    })();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should build single filter', () => {
      const filters = FilterBuilder.single('name', '=', 'John').build();
      buildWhereByFilters(queryBuilder, filters);
      expect(queryBuilder.where).toHaveBeenCalled();
    });

    it('should build multiple filter', () => {
      const filters = FilterBuilder.or((or) => 
        or
          .and((and1) => 
            and1.single('lastName', '=', 'Smith').single('firstName', '=', 'John')
          )
          .and((and2) => 
            and2.single('lastName', '=', 'James').single('firstName', '=', 'Black')
          )
      ).build();
      buildWhereByFilters(queryBuilder, filters);
      expect(queryBuilder.orWhere).toHaveBeenCalled();
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(2);
    });
  });
});
