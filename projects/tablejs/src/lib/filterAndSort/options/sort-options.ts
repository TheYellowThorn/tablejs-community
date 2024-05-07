import { ISortOptions } from './i-sort-options';
import { SortDirection } from './sort-direction';

export class SortOptions implements ISortOptions {
  public id: string;
  variableIdentifier: string | null | undefined;
  initialSortDirection:
    | number
    | SortDirection.DESCENDING
    | SortDirection.NONE
    | SortDirection.ASCENDING;
  ignoreCase: boolean;
  ignoreTimeOfDay: boolean = true;
  sortOrder: number;
  comparator: (valueA: any, valueB: any) => number;
  variableMapper?: Function | null;
  useLocaleCompare: boolean;
  localeCompareOptions: [string | string[]] | [string | string[], Intl.CollatorOptions] | null;
  _directionOrder: (
    | number
    | SortDirection.ASCENDING
    | SortDirection.DESCENDING
    | SortDirection.NONE
  )[] = [SortDirection.ASCENDING, SortDirection.DESCENDING, SortDirection.NONE];

  get directionOrder(): (
    | number
    | SortDirection.ASCENDING
    | SortDirection.DESCENDING
    | SortDirection.NONE
  )[] {
    return this._directionOrder;
  }

  set directionOrder(
    order: (
      | number
      | SortDirection.ASCENDING
      | SortDirection.DESCENDING
      | SortDirection.NONE
    )[]
  ) {
    this._sortDirectionIndex = -1;
    this._directionOrder = order;
  }

  private _sortDirectionIndex: number = -1;

  get sortDirection(): number| SortDirection.ASCENDING | SortDirection.DESCENDING | SortDirection.NONE {
    return this._sortDirectionIndex === -1
      ? SortDirection.NONE
      : this._directionOrder[this._sortDirectionIndex];
  }

  set sortDirection(
    direction:
      | number
      | SortDirection.ASCENDING
      | SortDirection.DESCENDING
      | SortDirection.NONE
  ) {
    this._sortDirectionIndex = this._directionOrder.indexOf(direction);
  }

  constructor(
    variableIdentifier: string,
    comparator: (valueA: any, valueB: any) => number,
    initialSortDirection:
      | number
      | SortDirection.DESCENDING
      | SortDirection.NONE
      | SortDirection.ASCENDING = SortDirection.NONE,
    ignoreCase: boolean = true,
    sortOrder: number = 0,
    useLocalCompare: boolean = false,
    localeCompareOptions: [string | string[]] | [string | string[], Intl.CollatorOptions] | null = null
  ) {
    this.variableIdentifier = variableIdentifier;
    this.comparator = comparator;
    this.initialSortDirection = initialSortDirection;
    this.ignoreCase = ignoreCase;
    this.sortOrder = sortOrder;
    this.useLocaleCompare = useLocalCompare;
    this.localeCompareOptions = localeCompareOptions;

    this.sortDirection = this.initialSortDirection;
  }

  public nextSortDirection(): void {
    this._sortDirectionIndex++;

    if (this._sortDirectionIndex >= this._directionOrder.length) {
      this._sortDirectionIndex = 0;
    }
  }
}
