import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FilterSortService } from './services/filter-sort.service';

@NgModule({
  imports: [BrowserModule],
  declarations: [],
  providers: [FilterSortService],
  exports: [],
  bootstrap: [],
})
export class FilterAndSortModule {}

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
