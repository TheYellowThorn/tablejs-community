import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class GridRowDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerRowsOnGridDirective(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridRowDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GridRowDirective, "[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]", never, {}, {}, never, never, false, never>;
}
