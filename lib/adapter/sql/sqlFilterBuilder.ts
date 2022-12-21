import { Knex } from "knex";
import { FilterOperator, FilterParam, FilterType } from "../adapter.types";

export const getSingleFilterValues = (filters: FilterParam): FilterParam => {
  const [key, filter, value] = Object.values(filters);
  return { key, filter, value };
}

export const getOperator = (filters: FilterType): FilterOperator => {
  return Object.values(filters)[0];
}

export const buildSingleFilter = (qb: Knex.QueryBuilder, filters: FilterParam): Knex.QueryBuilder => {
  const [key, filter, value] = Object.values(filters);
  return qb.where(key, filter, value);
}

export const isSingleFilter = (filter: FilterType) => {
  const [key] = Object.values(filter);
  return !['and', 'or'].includes(key);
}

export const assignOperation = (qb: Knex.QueryBuilder, { key, filter, value }: FilterParam, operator: FilterOperator): void => {
  switch (operator) {
    case 'and':
      qb.andWhere(key, filter, value); // FIXME ts(2769)
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
}

export const buildMultipleFilter = (qb: Knex.QueryBuilder, filters: any, operator: FilterOperator): Knex.QueryBuilder => {
  filters.forEach((filterGroup: any, i: number) => {
    if (isSingleFilter(filterGroup)) {
      const { key, filter, value } = getSingleFilterValues(filterGroup as FilterParam);
      assignOperation(
        qb,
        { key, filter, value },
        i === 0 ? 'none' : operator
      );
    } else {
      qb.andWhere((builder) => {
        buildMultipleFilter(
          builder,
          filterGroup,
          getOperator(filterGroup));
      });
    }
  });

  return qb;
};

export const buildWhereByFilters = (qb: Knex.QueryBuilder, filters: FilterType): Knex.QueryBuilder => {
  if (isSingleFilter(filters)) {
    return buildSingleFilter(qb, filters as FilterParam);
  }
  const operator = getOperator(filters);
  return buildMultipleFilter(qb, filters[operator], operator); // FIXME ts(7053)
};
