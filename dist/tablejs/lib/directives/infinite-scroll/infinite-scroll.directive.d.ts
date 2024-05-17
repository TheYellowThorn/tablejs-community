import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class InfiniteScrollDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerColumnOnGridDirective(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InfiniteScrollDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<InfiniteScrollDirective, "[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],  [tablejsViewport], [tablejsviewport], [tablejs-viewport]", never, {}, {}, never, never, false, never>;
}
