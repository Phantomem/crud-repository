import { Knex } from "knex";
import { FilterMultipleType, FilterOperatorMultiple, FilterOperatorSingle, FilterSingleFilterType, FilterType } from "../adapter.types";

export const assignOperation = (
  qb: Knex.QueryBuilder,
  { key, filter, value }: FilterSingleFilterType,
  operator: FilterOperatorSingle | FilterOperatorMultiple
): void => {
  switch (operator) {
    case 'and':
      qb.andWhere(key, filter, value);
      break;
    case 'or':
      qb.orWhere(key, filter, value);
      break;
    case 'not':
      qb.whereNot(key, filter, value);
      break;
    default:
      qb.where(key, filter, value);
      break;
  };
};

export const buildMultipleFilter = (
  qb: Knex.QueryBuilder,
  filters: FilterMultipleType,
): Knex.QueryBuilder => {
  filters.flow.forEach((filterGroup: FilterType) => {
    if (filterGroup.operator === 'single') {
      const { key, filter, value } = filterGroup.flow;
      assignOperation(
        qb,
        { key, filter, value },
        filterGroup.operator,
      );
    } else {
      qb.andWhere((builder) => {
        buildMultipleFilter(
          builder,
          filterGroup,
        );
      });
    }
  });

  return qb;
};

export const buildWhereByFilters = (
  qb: Knex.QueryBuilder,
  filters: FilterType
): Knex.QueryBuilder => {
  if (filters.operator === 'single') {
    assignOperation(qb, filters.flow, filters.operator);
    return qb;
  }

  return buildMultipleFilter(qb, filters as FilterMultipleType);
};
