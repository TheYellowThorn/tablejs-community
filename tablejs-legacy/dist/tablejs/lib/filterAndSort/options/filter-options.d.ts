import { IFilterOptions } from './i-filter-options';
import { MatchType } from './../comparators/match-type';
export declare class FilterOptions implements IFilterOptions {
    id: string;
    variableIdentifiers: string | (string | null | undefined)[] | null | undefined;
    ignoreCase: boolean;
    ignoreTimeOfDay: boolean;
    comparator: (element: any, index: number, array: any[]) => boolean;
    variableMappers?: Function | (Function | null)[] | null;
    filterValue: any;
    matchType: string | MatchType.ALL | MatchType.ANY;
    constructor(variableIdentifiers: string | string[], comparator: (element: any, index: number, array: any[]) => boolean, filterValue?: any, matchType?: string | MatchType.ALL | MatchType.ANY, ignoreCase?: boolean);
}
//# sourceMappingURL=filter-options.d.ts.map