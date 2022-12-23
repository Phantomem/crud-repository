import { Knex } from "knex";
import { FilterMultipleType, FilterOperatorMultiple, FilterOperatorSingle, FilterSingleFilterType, FilterType } from "../connector.types";

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
    default:
      qb.where(key, filter, value);
      break;
  };
};

export const assignMultipleOperation = (
  qb: Knex.QueryBuilder,
  operator: FilterOperatorMultiple,
  cb: (arg: Knex.QueryBuilder) => Knex.QueryBuilder,
): void => {
  switch (operator) {
    case 'and':
      qb.andWhere(cb);
      break;
    case 'or':
      qb.orWhere(cb);
      break;
    default:
      break;
  }
}

export const buildMultipleFilter = (
  qb: Knex.QueryBuilder,
  filters: FilterMultipleType,
): Knex.QueryBuilder => {
  const operator: FilterOperatorMultiple = filters.operator;

  filters.flow.forEach((filterGroup: FilterType, i: number) => {
    const isFirst = i === 0;
    if (filterGroup.operator === 'single') {
      isFirst
        ? assignOperation(qb, filterGroup.flow, 'single') 
        : assignOperation(qb, filterGroup.flow, operator);
    } else {
      assignMultipleOperation(
        qb,
        operator,
        (a) => buildMultipleFilter(a, filterGroup),
      );
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
