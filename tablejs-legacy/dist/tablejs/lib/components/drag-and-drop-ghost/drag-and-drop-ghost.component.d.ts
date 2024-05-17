import { AfterViewInit, ChangeDetectorRef, TemplateRef, ViewContainerRef } from '@angular/core';
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
}
//# sourceMappingURL=drag-and-drop-ghost.component.d.ts.map