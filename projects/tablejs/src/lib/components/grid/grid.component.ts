import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { GridDirective } from './../../directives/grid/grid.directive';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';

@Component({
  selector: 'tablejs-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit {

  @Input() linkClass: string | undefined = undefined;
  @Input() resizeColumnWidthByPercent: boolean = false;

  @Output() columnResizeStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnResize: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnResizeEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnReorder: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnReorderStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnReorderEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() gridInitialize: EventEmitter<any> = new EventEmitter<any>();

  public get gridDirective(): GridDirective {
    return this.elementRef.nativeElement.gridDirective;
  }

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
    if (this.linkClass !== undefined) {
      this.elementRef.nativeElement.classList.add(this.linkClass);
    }
  }

  columnResizeStarted(e: ColumnResizeEvent): void {
    e.type = ColumnResizeEvent.ON_RESIZE_START;
    this.columnResizeStart.emit(e);
  }
  columnResized(e: ColumnResizeEvent): void {
    e.type = ColumnResizeEvent.ON_RESIZE;
    this.columnResize.emit(e);
  }
  columnResizeEnded(e: ColumnResizeEvent): void {
    e.type = ColumnResizeEvent.ON_RESIZE_END;
    this.columnResizeEnd.emit(e);
  }

  columnReorderStarted(e: ColumnReorderEvent): void {
    e.type = ColumnReorderEvent.ON_REORDER_START;
    this.columnReorderStart.emit(e);
  }
  columnReordered(e: ColumnReorderEvent): void {
    e.type = ColumnReorderEvent.ON_REORDER;
    this.columnReorder.emit(e);
  }
  columnReorderEnded(e: ColumnReorderEvent): void {
    e.type = ColumnReorderEvent.ON_REORDER_END;
    this.columnReorderEnd.emit(e);
  }

  gridInitialized(e: GridEvent): void {
    e.type = GridEvent.ON_INITIALIZED;
    this.gridInitialize.emit(e);
  }

}
