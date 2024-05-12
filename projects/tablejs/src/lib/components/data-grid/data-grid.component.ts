import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  ColumnResizeEvent,
  ColumnReorderEvent,
  ScrollViewportDirective,
  GridEvent,
  ScrollViewportEvent,
  SortOptions,
} from '@transunion-ui/tablejs';
import { IColumnConfig } from './types/i-column-config';

@Component({
  selector: 'lib-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataGridComponent implements OnInit {
  @Input() public data: unknown[] = [];
  @Input() public columnConfigs: IColumnConfig[] = [];
  @Input() public rowIsSelectable = false;
  @Input() public loading = true;

  private lastConfigs: IColumnConfig[] | undefined;

  public showGrid = false;
  public viewportDirective: ScrollViewportDirective | undefined;
  public allItemsFitInViewport = true;
  public allItemsFitTimeout: any;

  public gridIsRefreshing = false;

  @Output() public onColumnResizeStart: EventEmitter<ColumnResizeEvent> =
    new EventEmitter<ColumnResizeEvent>();
  @Output() public onColumnResize: EventEmitter<ColumnResizeEvent> =
    new EventEmitter<ColumnResizeEvent>();
  @Output() public onColumnResizeEnd: EventEmitter<ColumnResizeEvent> =
    new EventEmitter<ColumnResizeEvent>();
  @Output() public onColumnReorderStart: EventEmitter<ColumnReorderEvent> =
    new EventEmitter<ColumnReorderEvent>();
  @Output() public onColumnReorder: EventEmitter<ColumnReorderEvent> =
    new EventEmitter<ColumnReorderEvent>();
  @Output() public onViewportReady: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onColumnReorderEnd: EventEmitter<ColumnReorderEvent> =
    new EventEmitter<ColumnReorderEvent>();
  @Output() public onGridInitialized: EventEmitter<GridEvent> =
    new EventEmitter<GridEvent>();
  @Output() public onRowClicked: EventEmitter<unknown> =
    new EventEmitter<unknown>();
  @Output() public onRangeUpdated: EventEmitter<ScrollViewportEvent> =
    new EventEmitter<ScrollViewportEvent>();
  @Output() public onColumnSort: EventEmitter<SortOptions> =
    new EventEmitter<SortOptions>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.lastConfigs = this.columnConfigs;
  }

  columnResizeStart(e: unknown | ColumnResizeEvent) {
    this.checkForItemsFittingViewport();
    this.onColumnResizeStart.emit(e as ColumnResizeEvent);
  }
  columnResize(e: unknown | ColumnResizeEvent) {
    this.checkForItemsFittingViewport();
    this.onColumnResize.emit(e as ColumnResizeEvent);
  }
  columnResizeEnd(e: unknown | ColumnResizeEvent) {
    this.checkForItemsFittingViewport();
    this.onColumnResizeEnd.emit(e as ColumnResizeEvent);
  }
  columnReorderStart(e: unknown | ColumnReorderEvent) {
    this.checkForItemsFittingViewport();
    this.onColumnReorderStart.emit(e as ColumnReorderEvent);
  }
  columnReorder(e: unknown | ColumnReorderEvent) {
    this.checkForItemsFittingViewport();
    this.onColumnReorder.emit(e as ColumnReorderEvent);
  }
  columnReorderEnd(e: unknown | ColumnReorderEvent) {
    this.checkForItemsFittingViewport();
    this.onColumnReorderEnd.emit(e as ColumnReorderEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (
        changes['columnConfigs'] &&
        this.lastConfigs &&
        this.lastConfigs !== this.columnConfigs
      ) {
        this.lastConfigs = this.columnConfigs;
        this.gridIsRefreshing = true;
        this.showGrid = false;
        window.requestAnimationFrame(() => {
          this.gridIsRefreshing = false;
        });
        return;
      }
      if (changes['data'] || changes['loading']) {
        if (changes['loading'] && changes['loading'].currentValue === true) {
          this.data = [];
        }
        this.checkForItemsFittingViewport();
      }
    }
  }

  checkForItemsFittingViewport(): void {
    if (!this.viewportDirective) {
      return;
    }
    this.allItemsFitTimeout = setTimeout(() => {
      this.allItemsFitInViewport = false;
      this.allItemsFitInViewport = this.viewportDirective!.allItemsFitViewport(
        true,
        true
      );
      this.cdr.detectChanges();
    }, 1);
  }

  viewportReady(e: any): void {
    this.viewportDirective = e.viewport;
    this.onViewportReady.emit(e);
  }
  gridInitialized(e: GridEvent): void {
    this.checkForItemsFittingViewport();
    this.showGrid = true;
    this.onGridInitialized.emit(e);
  }
  rangeUpdated(e: ScrollViewportEvent): void {
    this.onRangeUpdated.emit(e);
  }

  onRowSelected(e: MouseEvent, item: unknown): void {
    if (this.rowIsSelectable) {
      e.stopPropagation();
      this.onRowClicked.emit({ event: e, item: item });
    }
  }

  sortColumnBy(sortOptions: SortOptions): void {
    this.onColumnSort.emit(sortOptions);
  }

  public getArrowClass(sortOptions: SortOptions): string {
    const defaultClass = 'fa-long-arrow-alt-up fa-long-arrow-alt-down';

    switch (sortOptions.sortDirection) {
      case 1:
        return 'fa-arrow-down';
      case -1:
        return 'fa-arrow-up';
      default:
        return defaultClass;
    }
  }
}
