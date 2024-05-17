import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { GridDirective } from './../../directives/grid/grid.directive';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<GridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GridComponent, "tablejs-grid", never, { "linkClass": "linkClass"; "resizeColumnWidthByPercent": "resizeColumnWidthByPercent"; }, { "columnResizeStart": "columnResizeStart"; "columnResize": "columnResize"; "columnResizeEnd": "columnResizeEnd"; "columnReorder": "columnReorder"; "columnReorderStart": "columnReorderStart"; "columnReorderEnd": "columnReorderEnd"; "gridInitialize": "gridInitialize"; }, never, ["*"], false, never>;
}