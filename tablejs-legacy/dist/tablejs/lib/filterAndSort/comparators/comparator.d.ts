import { FilterSortService } from './../services/filter-sort.service';
import { IFilterOptions } from './../options/i-filter-options';
import { ISortOptions } from './../options/i-sort-options';
export declare class Comparator {
    static filterSortService: FilterSortService | null;
    static getCurrentSortOptions(): ISortOptions | null;
    static getCurrentFilterOptions(): IFilterOptions | null;
    static isString(val: any): boolean;
}
//# sourceMappingURL=comparator.d.ts.map