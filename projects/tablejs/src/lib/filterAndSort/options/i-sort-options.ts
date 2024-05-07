import { SortDirection } from './sort-direction';
import { IAbstractOptions } from './i-abstract-options';

export interface ISortOptions extends IAbstractOptions {
  variableIdentifier: string | null | undefined;
  comparator: (valueA: any, valueB: any) => number;
  variableMapper?: Function | null;
  initialSortDirection:
    | number
    | SortDirection.DESCENDING
    | SortDirection.NONE
    | SortDirection.ASCENDING;
  sortOrder: number;
  useLocaleCompare: boolean;
  localeCompareOptions: [string | string[]] | [string | string[], Intl.CollatorOptions] | null;
  directionOrder: (
    | number
    | SortDirection.ASCENDING
    | SortDirection.DESCENDING
    | SortDirection.NONE
  )[];

  sortDirection: | number
  | SortDirection.ASCENDING
  | SortDirection.DESCENDING
  | SortDirection.NONE;
}
