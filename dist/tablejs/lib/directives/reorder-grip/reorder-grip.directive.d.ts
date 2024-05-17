import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class ReorderGripDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerGripOnGridDirective(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReorderGripDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ReorderGripDirective, "[reorderGrip]", never, {}, {}, never, never, false, never>;
}
