import { ISortOptions } from './i-sort-options';
import { SortDirection } from './sort-direction';
export declare class SortOptions implements ISortOptions {
    id: string;
    variableIdentifier: string | null | undefined;
    initialSortDirection: number | SortDirection.DESCENDING | SortDirection.NONE | SortDirection.ASCENDING;
    ignoreCase: boolean;
    ignoreTimeOfDay: boolean;
    sortOrder: number;
    comparator: (valueA: any, valueB: any) => number;
    variableMapper?: Function | null;
    useLocaleCompare: boolean;
    localeCompareOptions: [string | string[]] | [string | string[], Intl.CollatorOptions] | null;
    _directionOrder: (number | SortDirection.ASCENDING | SortDirection.DESCENDING | SortDirection.NONE)[];
    get directionOrder(): (number | SortDirection.ASCENDING | SortDirection.DESCENDING | SortDirection.NONE)[];
    set directionOrder(order: (number | SortDirection.ASCENDING | SortDirection.DESCENDING | SortDirection.NONE)[]);
    private _sortDirectionIndex;
    get sortDirection(): number | SortDirection.ASCENDING | SortDirection.DESCENDING | SortDirection.NONE;
    set sortDirection(direction: number | SortDirection.ASCENDING | SortDirection.DESCENDING | SortDirection.NONE);
    constructor(variableIdentifier: string, comparator: (valueA: any, valueB: any) => number, initialSortDirection?: number | SortDirection.DESCENDING | SortDirection.NONE | SortDirection.ASCENDING, ignoreCase?: boolean, sortOrder?: number, useLocalCompare?: boolean, localeCompareOptions?: [string | string[]] | [string | string[], Intl.CollatorOptions] | null);
    nextSortDirection(): void;
}
