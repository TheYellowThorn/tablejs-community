import { MatchType } from './../comparators/match-type';
import { IAbstractOptions } from './i-abstract-options';

export interface IFilterOptions extends IAbstractOptions {
  variableIdentifiers: string | (string | null | undefined)[] | null | undefined;
  comparator: (element: any, index: number, array: any[]) => boolean;
  variableMappers?: Function | (Function | null)[] | null;
  filterValue?: any;
  matchType?: string | MatchType.ALL | MatchType.ANY;
}
