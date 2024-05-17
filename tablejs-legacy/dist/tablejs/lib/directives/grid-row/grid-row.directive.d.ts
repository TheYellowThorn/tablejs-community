import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export declare class GridRowDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerRowsOnGridDirective(): void;
}
//# sourceMappingURL=grid-row.directive.d.ts.map