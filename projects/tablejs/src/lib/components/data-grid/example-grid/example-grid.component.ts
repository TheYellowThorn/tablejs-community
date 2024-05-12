import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IColumnConfig } from './../types/i-column-config';
import { IGridData } from './../../../../app/query.module/types/i-grid-data';
import {
  ColumnResizeEvent,
  ColumnReorderEvent,
  FilterOptions,
  GridEvent,
  ScrollViewportEvent,
  SortDirection,
  SortOptions,
  SortComparator,
  FilterSortService,
  FilterComparator,
  MatchType
} from '@transunion-ui/tablejs';
// import { testData, testColumnConfigs } from './test-data/test-data';
// import { testData, testColumnConfigs } from './test-data/test-data-2';
import { testData, testColumnConfigs } from './test-data/test-data-3';

@Component({
  selector: 'lib-example-grid',
  templateUrl: './example-grid.component.html',
  styleUrls: ['./example-grid.component.scss']
})
export class ExampleGridComponent implements OnInit {

  @ViewChild('checkboxRef', { static: true, read: TemplateRef }) checkboxRef: TemplateRef<any>;
  @ViewChild('headerRef', { static: true, read: TemplateRef }) headerRef: TemplateRef<any>;

  public testColumnConfigs: IColumnConfig[] = testColumnConfigs;
  public testData: IGridData[] = testData;
  public filteredData: IGridData[] = [];

  public currentSortOptions: SortOptions | null = null;
  public sortOptionsList: SortOptions[] = [];
  public filterOptions: FilterOptions | null = null;

  public showLoadingSpinner = true;

  constructor(public filterSortService: FilterSortService) {
    // Ensures undefined properties don't throw an error on filter
    this.filterSortService.autoDefineUnsetProperties = true;
  }

  ngOnInit(): void {
    // this.testDataLoadCycle(); // uncomment to test loading data simulation
    this.testData = this.testData.map(item => {
      return {...item, creditVisionOnly: item.creditVisionOnly ? item.creditVisionOnly : 'No'};
    });

    this.filteredData = this.testData.concat();
    this.showLoadingSpinner = false;

    this.setConfiguration();
    this.setSortOptions();
    this.setFilterOptions();
  }

  public testDataLoadCycle(): void {
    setTimeout(() => {
      this.showLoadingSpinner = false;
      this.filteredData = this.testData.concat();
      setTimeout(() => {
        this.showLoadingSpinner = true;
        setTimeout(() => {
          this.showLoadingSpinner = false;
          this.filteredData = [];
          setTimeout(() => {
            this.showLoadingSpinner = true;
            setTimeout(() => {
              this.showLoadingSpinner = false;
              this.filteredData = this.testData.concat();
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 3000);
  }

  public setConfiguration(): void {
    const columnConfig: IColumnConfig = this.testColumnConfigs[0] as IColumnConfig;
    columnConfig.tableDataTemplateRef = this.checkboxRef;

    this.testColumnConfigs.forEach((config: IColumnConfig, index: number) => {
      config.resizable = true; // test resizable functionality
      if (index !== 0) {
        config.reorderable = true; // test reorderable functionality
      }
      config.tableHeaderTemplateRef = this.headerRef; // test header template functionality
    });
  }

  public setSortOptions(): void {
    this.testColumnConfigs.forEach((config: IColumnConfig, index: number) => {
      if (index !== 0) {
        const valueTypeIsString: boolean = typeof (this.testData[0] as any)[config.dataClass] === 'string';

        config.sortOptions = new SortOptions(
          '',
          valueTypeIsString ? SortComparator.ALPHABETICAL :  SortComparator.NUMERIC,
          SortDirection.NONE
        );
        config.sortOptions.variableMapper = (item: any) => {
          return item[config.dataClass] ? item[config.dataClass] : '';
        };
      } else {
        config.sortOptions = new SortOptions(
          '',
          SortComparator.NUMERIC,
          SortDirection.NONE
        );
        config.sortOptions.variableMapper = (item: any) => {
          if (item.indeterminate) {
            return 2;
          }
          return item.checked ? 1 : 3;
        };
      }
      this.sortOptionsList.push(config.sortOptions);
    });
  }

  public setFilterOptions(): void {
    const identifierNames: string[] = this.testColumnConfigs.reduce(
      (previousValue: string[], config: IColumnConfig, index: number) => {
        if (index !== 0) {
          return [...previousValue, config.dataClass];
        }
        return previousValue;
      },
      [],
    );
    this.filterOptions = new FilterOptions(identifierNames, FilterComparator.CONTAINS_WORD, '', MatchType.ANY, true);

    // Ensures columns can sort even with undefined properties by mapping undefined property values to an empty string
    const variableMappers: any = identifierNames.map(() => (value: any) => {
      return value ? value.toString() : '';
    });
    this.filterOptions.variableMappers = variableMappers;
  }

  filterByText(e: Event): void {
    if (!this.filterOptions) {
      return;
    }
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const asteriskIndex: number = target.value.indexOf('*');
    const valueContainsAsterisk: boolean = asteriskIndex !== -1;

    if (valueContainsAsterisk) {
      this.filterOptions.comparator = FilterComparator.WORD_STARTS_WITH;
      (this.filterOptions as FilterOptions).filterValue = target.value.substring(0, asteriskIndex);
    } else {
      this.filterOptions.comparator = FilterComparator.CONTAINS_WORD;
      (this.filterOptions as FilterOptions).filterValue = target.value;
    }
    this.setFilteredAndSortedItems();
  }

  sortColumnBy(sortOptions: SortOptions | null): void {
    if (!sortOptions) {
      return;
    }

    sortOptions.nextSortDirection();
    this.resetSortDirections(sortOptions);
    this.currentSortOptions = sortOptions.sortDirection === SortDirection.NONE ? null : sortOptions;

    this.setFilteredAndSortedItems();
  }

  public setFilteredAndSortedItems(): void {
    this.filteredData = this.filterSortService.filterAndSortItems(
      this.testData,
      !this.filterOptions || this.filterOptions.filterValue === '' ? null : this.filterOptions,
      this.currentSortOptions
    );
  }

  resetSortDirections(sortOptions: SortOptions): void {
    this.sortOptionsList.forEach((options: SortOptions) => {
      if (options !== sortOptions) {
        options.sortDirection = SortDirection.NONE;
      }
    });
  }

  public gridRowSelected(e: MouseEvent, item: any): void {
    e.stopPropagation();
    item.checked = !item.checked;
  }


  public onColumnResizeStart(e: ColumnResizeEvent) {
    // Place code that should run on resize start
    return e;
  }
  public onColumnResize(e: ColumnResizeEvent) {
    // Place code that should run on every resize change
    return e;
  }
  public onColumnResizeEnd(e: ColumnResizeEvent) {
    // Place code that should run on resize end
    return e;
  }
  public onColumnReorderStart(e: ColumnReorderEvent) {
    // Place code that should run on reorder start
    return e;
  }
  public onColumnReorder(e: ColumnReorderEvent) {
    // Place code that should run on every reorder change
    return e;
  }
  public onColumnReorderEnd(e: ColumnReorderEvent) {
    // Place code that should run on reorder end
    return e;
  }
  public onViewportReady(e: any) {
    // Place code that should run when the viewport is ready
    return e;
  }
  public onGridInitialized(e: GridEvent) {
    // Place code that should run when the grid has intialized
    return e;
  }
  public onRangeUpdated(e: ScrollViewportEvent) {
    // Place code that should run the viewport range has changed
    return e;
  }
  public onRowClicked(e: any) {
    // Place code that should run when a table row is clicked
    return e;
  }
}
