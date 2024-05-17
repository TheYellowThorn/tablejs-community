import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class DataColClassDirective implements AfterViewInit, OnDestroy {
    elementRef: ElementRef;
    gridService: GridService;
    tablejsDataColClass: string | undefined | null;
    initialWidth: string | undefined | null;
    timeoutID: any;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    registerInitialColumnWidthOnGridDirective(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DataColClassDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DataColClassDirective, "[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]", never, { "tablejsDataColClass": "tablejsDataColClass"; "initialWidth": "initialWidth"; }, {}, never, never, false, never>;
}
