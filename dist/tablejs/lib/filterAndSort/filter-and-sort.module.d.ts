import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
export declare class FilterAndSortModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<FilterAndSortModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<FilterAndSortModule, never, [typeof i1.BrowserModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<FilterAndSortModule>;
}
export * from './services/filter-sort.service';
export * from './options/sort-direction';
export * from './options/sort-options';
export * from './options/i-sort-options';
export * from './options/filter-options';
export * from './options/i-filter-options';
export * from './comparators/comparator';
export * from './comparators/sort-comparator';
export * from './comparators/filter-comparator';
export * from './comparators/match-type';
