import { IFilterOptions } from './i-filter-options';
import { MatchType } from './../comparators/match-type';

export class FilterOptions implements IFilterOptions {
  public id: string;
  variableIdentifiers: string | (string | null | undefined)[] | null | undefined;
  ignoreCase: boolean;
  ignoreTimeOfDay: boolean = true;
  comparator: (element: any, index: number, array: any[]) => boolean;
  variableMappers?: Function | (Function | null)[] | null;
  filterValue: any;
  matchType: string | MatchType.ALL | MatchType.ANY;

  constructor(
    variableIdentifiers: string | string[],
    comparator: (element: any, index: number, array: any[]) => boolean,
    filterValue: any = null,
    matchType: string | MatchType.ALL | MatchType.ANY = MatchType.ANY,
    ignoreCase: boolean = true
  ) {
    this.variableIdentifiers = variableIdentifiers;
    this.comparator = comparator;
    this.ignoreCase = ignoreCase;
    this.filterValue = filterValue;
    this.matchType = matchType;
  }
}
