import { AfterViewInit, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class DataColClassesDirective implements AfterViewInit {
    elementRef: ElementRef;
    gridService: GridService;
    tablejsDataColClasses: string;
    constructor(elementRef: ElementRef, gridService: GridService);
    ngAfterViewInit(): void;
    cacheClassesOnElement(): void;
    registerColumnsWithDataClassesOnGridDirective(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DataColClassesDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DataColClassesDirective, "[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]", never, { "tablejsDataColClasses": "tablejsDataColClasses"; }, {}, never, never, false, never>;
}
