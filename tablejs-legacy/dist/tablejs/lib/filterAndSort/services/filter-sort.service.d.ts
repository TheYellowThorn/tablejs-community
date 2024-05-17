import { ISortOptions } from './../options/i-sort-options';
import { SortOptions } from './../options/sort-options';
import { IFilterOptions } from './../options/i-filter-options';
import { FilterOptions } from './../options/filter-options';
export declare class FilterSortService {
    autoDefineUnsetProperties: boolean;
    filterSplits: any[];
    private filterSplitsLen;
    private splits;
    private splitsLen;
    sortDirection: number;
    ignoreCase: boolean;
    private vName;
    private varNames;
    private _items;
    private _currentFilterOptions;
    private _currentSortOptions;
    get currentFilterOptions(): IFilterOptions | FilterOptions | null;
    get currentSortOptions(): ISortOptions | SortOptions | null;
    get itemsBeingFilteredAndSorted(): any[];
    constructor();
    filterAndSortItems(items: any[], filterOptions: IFilterOptions | (IFilterOptions | null)[] | FilterOptions | (FilterOptions | null)[] | null, sortOptions: ISortOptions | (ISortOptions | null)[] | SortOptions | (SortOptions | null)[] | null): any[];
    isString(val: any): boolean;
    filterItemsByVarNames(items: any[], filterOptions: IFilterOptions | FilterOptions | null): any[];
    splitVariablesFromIdentifier(varName: string | null | undefined): void;
    sortItemsByVarName(items: any[], sortOptions: ISortOptions | null): any[];
    multiSortItemsByVarName(items: any[], sortOptionsGroup: (ISortOptions | null)[] | (SortOptions | null)[]): any[];
    getFilterValuesFromPropertyIndentifiers(value: any): any[];
    private defineProperty;
    getSortValuesFromPropertyIdentifiers(valueA: any, valueB: any): any[];
}
//# sourceMappingURL=filter-sort.service.d.ts.map