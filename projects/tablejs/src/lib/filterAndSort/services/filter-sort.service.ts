import { Injectable } from '@angular/core';
import { ISortOptions } from './../options/i-sort-options';
import { SortOptions } from './../options/sort-options';
import { Comparator } from './../comparators/comparator';
import { IFilterOptions } from './../options/i-filter-options';
import { FilterOptions } from './../options/filter-options';
import { SortDirection } from '../options/sort-direction';

@Injectable({
  providedIn: 'root',
})
export class FilterSortService {
  public autoDefineUnsetProperties: boolean = false;
  public filterSplits: any[];
  private filterSplitsLen: number;
  private splits: any[];
  private splitsLen: number;
  public sortDirection: number;
  public ignoreCase: boolean;
  private vName: string;
  private varNames: string[];
  private _items: any[];

  private _currentFilterOptions: IFilterOptions | FilterOptions | null;
  private _currentSortOptions: ISortOptions | SortOptions | null;

  public get currentFilterOptions(): IFilterOptions | FilterOptions | null {
    return this._currentFilterOptions;
  }
  public get currentSortOptions(): ISortOptions | SortOptions | null {
    return this._currentSortOptions;
  }
  public get itemsBeingFilteredAndSorted(): any[] {
    return this._items;
  }

  constructor() {
    Comparator.filterSortService = this;
  }

  filterAndSortItems(
    items: any[],
    filterOptions:
      | IFilterOptions
      | (IFilterOptions | null)[]
      | FilterOptions
      | (FilterOptions | null)[]
      | null,
    sortOptions: ISortOptions | (ISortOptions | null)[] | SortOptions | (SortOptions | null)[] | null
  ): any[] {
    let filteredItems: any[];

    this._items = items;
    filteredItems = items;

    if (filterOptions) {
      if (Array.isArray(filterOptions)) {
        const filterOptionsLen: number = filterOptions.length;
        for (let i = 0; i < filterOptionsLen; i++) {
          const options: IFilterOptions | FilterOptions | null = filterOptions[i];
          this._currentFilterOptions = options;
          filteredItems = this.filterItemsByVarNames(filteredItems, options);
        }
      } else {
        filteredItems = this.filterItemsByVarNames(
          filteredItems,
          filterOptions
        );
      }
    }

    if (sortOptions) {
      if (Array.isArray(sortOptions)) {
        filteredItems = this.multiSortItemsByVarName(
          filteredItems,
          sortOptions
        );
      } else {
        filteredItems = this.sortItemsByVarName(filteredItems, sortOptions);
      }
    }

    return filteredItems;
  }

  isString(val: any): boolean {
    return typeof val === 'string' || val instanceof String;
  }

  filterItemsByVarNames(items: any[], filterOptions: IFilterOptions | FilterOptions | null): any[] {
    this._currentFilterOptions = filterOptions;
    if (!filterOptions) {
      throw Error(
        'A FilterOptions object is not defined. Please supply filter options to sort items by.'
      );
    }
    const varNames: string | (string | null | undefined)[] | undefined | null = this.isString(
      filterOptions.variableIdentifiers
    )
      ? ([filterOptions.variableIdentifiers] as string[])
      : filterOptions.variableIdentifiers;

    this.ignoreCase = filterOptions.ignoreCase;

    if (items === null || items === undefined) {
      throw Error(
        'Item array is not defined. Please supply a defined array to filter.'
      );
    }

    if (items.length === 0) {
      return items;
    }

    this.filterSplits = [];

    const numOfVarNames: number = varNames && varNames.length > 0 ? varNames.length : 0;

    for (let i = 0; i < numOfVarNames; i++) {
      this.splitVariablesFromIdentifier(varNames![i]);
      this.filterSplits.push(this.splits);
    }

    this.filterSplitsLen = this.filterSplits.length;

    items = items.concat();

    items = items.filter(filterOptions.comparator);

    return items;
  }

  splitVariablesFromIdentifier(varName: string | null | undefined): void {
    if (varName === null || varName === undefined || varName === '') {
      this.splits = [];
      this.splitsLen = this.splits.length;
      return;
    }
    const containsBrackets: boolean = varName.includes('[');
    this.splits = varName.split('.');
    this.splitsLen = this.splits.length;

    if (containsBrackets) {
      const bracketSplits: string[] = [];
      for (let i = 0; i < this.splitsLen; i++) {
        let split: string = this.splits[i];
        let startBracketIndex: number = split.indexOf('[');

        if (startBracketIndex !== -1) {
          while (split !== '') {
            const endBracketIndex: number = split.indexOf(']') + 1;
            const preBracketVar: string = split.substring(0, startBracketIndex);
            const brackets: string = split.substring(
              startBracketIndex + 1,
              endBracketIndex - 1
            );
            const postBracketVar: string = split.substring(
              endBracketIndex,
              split.length
            );
            split = postBracketVar;
            startBracketIndex = split.indexOf('[');

            if (preBracketVar !== '') {
              bracketSplits.push(preBracketVar);
            }
            bracketSplits.push(brackets);
          }
        } else {
          bracketSplits.push(split);
        }
      }
      this.splits = bracketSplits;
    }

    this.splitsLen = this.splits.length;
    let varStr: string = '(array item)';
    this.varNames = [varStr];

    for (let i = 0; i < this.splitsLen; i++) {
      this.vName = this.splits[i];
      if (isNaN(Number(this.vName))) {
        varStr += '.' + this.vName;
      } else {
        varStr += '[' + this.vName + ']';
      }
      this.varNames.push(varStr);
    }
  }

  sortItemsByVarName(items: any[], sortOptions: ISortOptions | null): any[] {
    this._currentSortOptions = sortOptions;

    if (!sortOptions) {
      throw Error(
        'A SortOptions object is not defined. Please supply filter options to sort items by.'
      );
    }

    const varName: string = sortOptions.variableIdentifier as string;
    this.sortDirection = sortOptions.sortDirection;
    this.ignoreCase = sortOptions.ignoreCase;

    if (items === null || items === undefined) {
      throw Error(
        'Item array is not defined. Please supply a defined array to sort.'
      );
    }
    if (items.length === 0) {
      return items;
    }

    this.splitVariablesFromIdentifier(varName);

    items = items.concat();

    if (this.sortDirection !== SortDirection.NONE) {
      items.sort(sortOptions.comparator);
    }

    return items;
  }

  multiSortItemsByVarName(
    items: any[],
    sortOptionsGroup: (ISortOptions | null)[] | (SortOptions | null)[]
  ): any[] {
    sortOptionsGroup.sort(
      (sortOptionsA: ISortOptions | null, sortOptionsB: ISortOptions | null) => {
        if (!sortOptionsA || !sortOptionsB) {
          return 0;
        }
        const orderA = sortOptionsA.sortOrder;
        const orderB = sortOptionsB.sortOrder;
        if (orderA === orderB) {
          return 0;
        }
        return orderA > orderB ? 1 : -1;
      }
    );

    sortOptionsGroup.forEach((sortOptions) => {
      items = this.sortItemsByVarName(items, sortOptions);
    });
    return items;
  }

  getFilterValuesFromPropertyIndentifiers(value: any): any[] {
    this.filterSplitsLen = this.filterSplits.length;
    const vals: any[] = this.filterSplitsLen === 0 ? [value] : [];

    for (let j = 0; j < this.filterSplitsLen; j++) {
      let varA = value;
      const splits: any[] = this.filterSplits[j];
      const splitsLen: number = splits.length;

      for (let i = 0; i < splitsLen; i++) {
        this.vName = splits[i];

        if (!varA.hasOwnProperty(this.vName)) {
          if (!this.autoDefineUnsetProperties) {
            throw Error(
              `Property ${this.vName} not found on ${this.varNames[i]}`
            );
          }
          this.defineProperty(varA, this.vName);
        } else {
          varA = varA[this.vName];
        }
      }
      vals.push(varA);
    }

    return vals;
  }

  private defineProperty(obj: any, propName: string, value: any = undefined, writable: boolean = true): void {
    Object.defineProperty(obj, propName, {
      value: value,
      writable: writable
    });
  }

  getSortValuesFromPropertyIdentifiers(valueA: any, valueB: any): any[] {
    let varA = valueA;
    let varB = valueB;

    for (let i = 0; i < this.splitsLen; i++) {
      this.vName = this.splits[i];
      if (
        !varA.hasOwnProperty(this.vName) ||
        !varB.hasOwnProperty(this.vName)
      ) {
        throw Error(`Property ${this.vName} not found on ${this.varNames[i]}`);
      }
      varA = varA[this.vName];
      varB = varB[this.vName];
    }

    return [varA, varB];
  }
}
