import { AfterViewInit, ElementRef, TemplateRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export declare class ReorderColDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    reorderGhost: TemplateRef<any>;
    reorderGhostContext: Object | null;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerColumnOnGridDirective(): void;
}
//# sourceMappingURL=reorder-col.directive.d.ts.map