import { 
  FilterArrayFilterType,
  FilterMarkType,
  FilterMultipleType,
  FilterOperatorMultiple,
  FilterOperatorSingle,
  FilterSingleFilterType,
  FilterSingleType,
  FilterType
} from './connector.types';

class SingleFilter implements FilterSingleType {
  readonly flow: FilterSingleFilterType;
  readonly operator: FilterOperatorSingle = 'single';

  constructor(flow: FilterSingleFilterType,) {
    this.flow = flow;
  }

  public build(): FilterSingleType {
    return { flow: this.flow, operator: this.operator };
  }
}

class MultipleFilter implements FilterMultipleType {
  readonly flow: FilterArrayFilterType;
  readonly operator: FilterOperatorMultiple;

  constructor(flow: FilterArrayFilterType, operator: FilterOperatorMultiple) {
    this.flow = flow;
    this.operator = operator;
  }

  public build(): FilterMultipleType {
    return { flow: this.flow, operator: this.operator };
  }
}

export class FilterBuilder {
  private filters: FilterType;

  constructor(filters: FilterType) {
    this.filters = filters;
  }

  public static multiple(operator: FilterOperatorMultiple): FilterBuilder {
    return new FilterBuilder(new MultipleFilter([], operator).build());
  }

  public static single(key: string, filter: FilterMarkType, value: any): FilterBuilder {
    return new FilterBuilder(new SingleFilter({ key, filter, value }).build());
  }

  public static and(cb: (arg: FilterBuilder) => FilterBuilder): FilterBuilder {
    return cb(FilterBuilder.multiple('and'));
  }

  public static or(cb: (arg: FilterBuilder) => FilterBuilder): FilterBuilder {
    return cb(FilterBuilder.multiple('or'));
  }

  public single(key: string, filter: FilterMarkType, value: any): FilterBuilder {
    if (this.filters.flow instanceof Array) {
      this.filters.flow.push(FilterBuilder.single(key, filter, value).build() as never);
    }
    return this;
  }

  public or(cb: (arg: FilterBuilder) => FilterBuilder): FilterBuilder {
    if (this.filters.flow instanceof Array) {
      this.filters.flow.push(cb(FilterBuilder.multiple('or')).build() as never);
    }
    return this;
  }

  public and(cb: (arg: FilterBuilder) => FilterBuilder): FilterBuilder {
    if (this.filters.flow instanceof Array) {
      this.filters.flow.push(cb(FilterBuilder.multiple('and')).build() as never);
    }
    return this;
  }

  public build() {
    return this.filters;
  }
}
