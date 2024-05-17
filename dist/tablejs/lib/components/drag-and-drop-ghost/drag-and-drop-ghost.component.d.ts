import { AfterViewInit, ChangeDetectorRef, TemplateRef, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DragAndDropGhostComponent implements AfterViewInit {
    viewContainerRef: ViewContainerRef;
    cdr: ChangeDetectorRef;
    ref: any;
    left: number;
    top: number;
    private _templateToLoad;
    private _contextToLoad;
    constructor(viewContainerRef: ViewContainerRef, cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    updateView(template: TemplateRef<any>, context?: object | null): void;
    getTransform(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DragAndDropGhostComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DragAndDropGhostComponent, "tablejs-drag-and-drop-ghost", never, {}, {}, never, never, false, never>;
}
