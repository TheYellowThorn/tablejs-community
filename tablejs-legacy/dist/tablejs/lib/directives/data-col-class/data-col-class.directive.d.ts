import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export declare class DataColClassDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    tablejsDataColClass: string | undefined | null;
    initialWidth: string | undefined | null;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerInitialColumnWidthOnGridDirective(): void;
}
//# sourceMappingURL=data-col-class.directive.d.ts.map