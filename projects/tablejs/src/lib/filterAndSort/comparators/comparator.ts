import { FilterSortService } from './../services/filter-sort.service';
import { IFilterOptions } from './../options/i-filter-options';
import { ISortOptions } from './../options/i-sort-options';

export class Comparator {
  public static filterSortService: FilterSortService | null = null;

  public static getCurrentSortOptions(): ISortOptions | null {
    return Comparator.filterSortService!.currentSortOptions;
  }

  public static getCurrentFilterOptions(): IFilterOptions | null {
    return Comparator.filterSortService!.currentFilterOptions;
  }

  public static isString(val: any): boolean {
    return typeof val === 'string' || val instanceof String;
  }
}
