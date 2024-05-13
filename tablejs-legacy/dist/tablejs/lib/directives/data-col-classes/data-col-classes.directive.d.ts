import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export declare class DataColClassesDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    tablejsDataColClasses: string;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    cacheClassesOnElement(): void;
    registerColumnsWithDataClassesOnGridDirective(): void;
}
//# sourceMappingURL=data-col-classes.directive.d.ts.map