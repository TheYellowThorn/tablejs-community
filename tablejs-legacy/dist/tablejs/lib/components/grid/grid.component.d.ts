import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { GridDirective } from './../../directives/grid/grid.directive';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
export declare class GridComponent implements OnInit {
    elementRef: ElementRef;
    linkClass: string | undefined;
    resizeColumnWidthByPercent: boolean;
    columnResizeStart: EventEmitter<any>;
    columnResize: EventEmitter<any>;
    columnResizeEnd: EventEmitter<any>;
    columnReorder: EventEmitter<any>;
    columnReorderStart: EventEmitter<any>;
    columnReorderEnd: EventEmitter<any>;
    gridInitialize: EventEmitter<any>;
    get gridDirective(): GridDirective;
    constructor(elementRef: ElementRef);
    ngOnInit(): void;
    columnResizeStarted(e: ColumnResizeEvent): void;
    columnResized(e: ColumnResizeEvent): void;
    columnResizeEnded(e: ColumnResizeEvent): void;
    columnReorderStarted(e: ColumnReorderEvent): void;
    columnReordered(e: ColumnReorderEvent): void;
    columnReorderEnded(e: ColumnReorderEvent): void;
    gridInitialized(e: GridEvent): void;
}
//# sourceMappingURL=grid.component.d.ts.map