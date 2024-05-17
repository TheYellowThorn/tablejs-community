import { AfterViewInit, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class ReorderColDirective implements AfterViewInit, OnDestroy {
    elementRef: ElementRef;
    gridService: GridService;
    reorderGhost: TemplateRef<any> | null;
    reorderGhostContext: Object | null;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerColumnOnGridDirective(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReorderColDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ReorderColDirective, "[reorderCol], [reordercol]", never, { "reorderGhost": "reorderGhost"; "reorderGhostContext": "reorderGhostContext"; }, {}, never, never, false, never>;
}
