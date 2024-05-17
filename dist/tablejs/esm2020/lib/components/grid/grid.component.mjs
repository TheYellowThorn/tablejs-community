import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/grid/grid.directive";
export class GridComponent {
    get gridDirective() {
        return this.elementRef.nativeElement.gridDirective;
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.linkClass = undefined;
        this.resizeColumnWidthByPercent = false;
        this.columnResizeStart = new EventEmitter();
        this.columnResize = new EventEmitter();
        this.columnResizeEnd = new EventEmitter();
        this.columnReorder = new EventEmitter();
        this.columnReorderStart = new EventEmitter();
        this.columnReorderEnd = new EventEmitter();
        this.gridInitialize = new EventEmitter();
    }
    ngOnInit() {
        if (this.linkClass !== undefined) {
            this.elementRef.nativeElement.classList.add(this.linkClass);
        }
    }
    columnResizeStarted(e) {
        e.type = ColumnResizeEvent.ON_RESIZE_START;
        this.columnResizeStart.emit(e);
    }
    columnResized(e) {
        e.type = ColumnResizeEvent.ON_RESIZE;
        this.columnResize.emit(e);
    }
    columnResizeEnded(e) {
        e.type = ColumnResizeEvent.ON_RESIZE_END;
        this.columnResizeEnd.emit(e);
    }
    columnReorderStarted(e) {
        e.type = ColumnReorderEvent.ON_REORDER_START;
        this.columnReorderStart.emit(e);
    }
    columnReordered(e) {
        e.type = ColumnReorderEvent.ON_REORDER;
        this.columnReorder.emit(e);
    }
    columnReorderEnded(e) {
        e.type = ColumnReorderEvent.ON_REORDER_END;
        this.columnReorderEnd.emit(e);
    }
    gridInitialized(e) {
        e.type = GridEvent.ON_INITIALIZED;
        this.gridInitialize.emit(e);
    }
}
GridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
GridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: GridComponent, selector: "tablejs-grid", inputs: { linkClass: "linkClass", resizeColumnWidthByPercent: "resizeColumnWidthByPercent" }, outputs: { columnResizeStart: "columnResizeStart", columnResize: "columnResize", columnResizeEnd: "columnResizeEnd", columnReorder: "columnReorder", columnReorderStart: "columnReorderStart", columnReorderEnd: "columnReorderEnd", gridInitialize: "gridInitialize" }, ngImport: i0, template: "<div tablejsGrid class=\"grid-component\" [linkClass]=\"linkClass\" [resizeColumnWidthByPercent]=\"resizeColumnWidthByPercent\"\n(columnResizeStart)=\"columnResizeStarted($event)\"\n(columnResize)=\"columnResized($event)\"\n(columnResizeEnd)=\"columnResizeEnded($event)\"\n(columnReorderStart)=\"columnReorderStarted($event)\"\n(columnReorder)=\"columnReordered($event)\"\n(columnReorderEnd)=\"columnReorderEnded($event)\"\n(gridInitialize)=\"gridInitialized($event)\"\n>\n\n\t<ng-content></ng-content>\n</div>\n", styles: [".tablejs-table-container{display:inline-block;padding:0!important;vertical-align:top}.tablejs-infinite-scroll-viewport{position:relative;height:301px;overflow:hidden;overflow-y:auto}.example-viewport table{overflow:visible}.tablejs-table-width{width:auto}.tablejs-table-container tr td,.tablejs-table-container tr th{padding:0rem}.grid-component tr td div,.grid-component tr th div{padding:.75rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tablejs-resizeable{cursor:ew-resize}.tablejs-editable-cell{display:inline-block;width:100%;padding:5px;margin:-5px;border:1px solid rgba(0,0,0,.1);box-shadow:inset 0 0 2px 1px #0000000d}.tablejs-editable-cell div{position:absolute;display:block;left:-3px;top:-3px;width:100%}.tablejs-editable-cell input{position:relative;top:0;left:0;display:block;width:100%}.tablejs-editable-cell input.error{outline-color:#900}\n"], dependencies: [{ kind: "directive", type: i1.GridDirective, selector: "[tablejsGrid],[tablejsgrid]", inputs: ["linkClass", "resizeColumnWidthByPercent"], outputs: ["columnResizeStart", "columnResize", "columnResizeEnd", "columnReorder", "columnReorderStart", "dragOver", "columnReorderEnd", "preGridInitialize", "gridInitialize"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-grid', encapsulation: ViewEncapsulation.None, template: "<div tablejsGrid class=\"grid-component\" [linkClass]=\"linkClass\" [resizeColumnWidthByPercent]=\"resizeColumnWidthByPercent\"\n(columnResizeStart)=\"columnResizeStarted($event)\"\n(columnResize)=\"columnResized($event)\"\n(columnResizeEnd)=\"columnResizeEnded($event)\"\n(columnReorderStart)=\"columnReorderStarted($event)\"\n(columnReorder)=\"columnReordered($event)\"\n(columnReorderEnd)=\"columnReorderEnded($event)\"\n(gridInitialize)=\"gridInitialized($event)\"\n>\n\n\t<ng-content></ng-content>\n</div>\n", styles: [".tablejs-table-container{display:inline-block;padding:0!important;vertical-align:top}.tablejs-infinite-scroll-viewport{position:relative;height:301px;overflow:hidden;overflow-y:auto}.example-viewport table{overflow:visible}.tablejs-table-width{width:auto}.tablejs-table-container tr td,.tablejs-table-container tr th{padding:0rem}.grid-component tr td div,.grid-component tr th div{padding:.75rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tablejs-resizeable{cursor:ew-resize}.tablejs-editable-cell{display:inline-block;width:100%;padding:5px;margin:-5px;border:1px solid rgba(0,0,0,.1);box-shadow:inset 0 0 2px 1px #0000000d}.tablejs-editable-cell div{position:absolute;display:block;left:-3px;top:-3px;width:100%}.tablejs-editable-cell input{position:relative;top:0;left:0;display:block;width:100%}.tablejs-editable-cell input.error{outline-color:#900}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { linkClass: [{
                type: Input
            }], resizeColumnWidthByPercent: [{
                type: Input
            }], columnResizeStart: [{
                type: Output
            }], columnResize: [{
                type: Output
            }], columnResizeEnd: [{
                type: Output
            }], columnReorder: [{
                type: Output
            }], columnReorderStart: [{
                type: Output
            }], columnReorderEnd: [{
                type: Output
            }], gridInitialize: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvY29tcG9uZW50cy9ncmlkL2dyaWQuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2NvbXBvbmVudHMvZ3JpZC9ncmlkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDeEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDdEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDBDQUEwQyxDQUFDOzs7QUFRckUsTUFBTSxPQUFPLGFBQWE7SUFheEIsSUFBVyxhQUFhO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ3JELENBQUM7SUFFRCxZQUFtQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBZmhDLGNBQVMsR0FBdUIsU0FBUyxDQUFDO1FBQzFDLCtCQUEwQixHQUFZLEtBQUssQ0FBQztRQUUzQyxzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMvRCxpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzFELG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDN0Qsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMzRCx1QkFBa0IsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNoRSxxQkFBZ0IsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM5RCxtQkFBYyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO0lBTXpCLENBQUM7SUFFOUMsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsQ0FBb0I7UUFDdEMsQ0FBQyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsYUFBYSxDQUFDLENBQW9CO1FBQ2hDLENBQUMsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxDQUFvQjtRQUNwQyxDQUFDLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsb0JBQW9CLENBQUMsQ0FBcUI7UUFDeEMsQ0FBQyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxlQUFlLENBQUMsQ0FBcUI7UUFDbkMsQ0FBQyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7UUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELGtCQUFrQixDQUFDLENBQXFCO1FBQ3RDLENBQUMsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGVBQWUsQ0FBQyxDQUFZO1FBQzFCLENBQUMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztRQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDOzswR0F0RFUsYUFBYTs4RkFBYixhQUFhLDJaQ1oxQixrZ0JBWUE7MkZEQWEsYUFBYTtrQkFOekIsU0FBUzsrQkFDRSxjQUFjLGlCQUdULGlCQUFpQixDQUFDLElBQUk7aUdBSTVCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csMEJBQTBCO3NCQUFsQyxLQUFLO2dCQUVJLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFDRyxZQUFZO3NCQUFyQixNQUFNO2dCQUNHLGVBQWU7c0JBQXhCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxrQkFBa0I7c0JBQTNCLE1BQU07Z0JBQ0csZ0JBQWdCO3NCQUF6QixNQUFNO2dCQUNHLGNBQWM7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy9ncmlkL2dyaWQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENvbHVtblJlb3JkZXJFdmVudCB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2NsYXNzZXMvZXZlbnRzL2NvbHVtbi1yZW9yZGVyLWV2ZW50JztcbmltcG9ydCB7IENvbHVtblJlc2l6ZUV2ZW50IH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy9ldmVudHMvY29sdW1uLXJlc2l6ZS1ldmVudCc7XG5pbXBvcnQgeyBHcmlkRXZlbnQgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL2V2ZW50cy9ncmlkLWV2ZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndGFibGVqcy1ncmlkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2dyaWQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9ncmlkLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgbGlua0NsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGNvbHVtblJlc2l6ZVN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVzaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVzaXplRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNvbHVtblJlb3JkZXJTdGFydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNvbHVtblJlb3JkZXJFbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBncmlkSW5pdGlhbGl6ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwdWJsaWMgZ2V0IGdyaWREaXJlY3RpdmUoKTogR3JpZERpcmVjdGl2ZSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdyaWREaXJlY3RpdmU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMubGlua0NsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5saW5rQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIGNvbHVtblJlc2l6ZVN0YXJ0ZWQoZTogQ29sdW1uUmVzaXplRXZlbnQpOiB2b2lkIHtcbiAgICBlLnR5cGUgPSBDb2x1bW5SZXNpemVFdmVudC5PTl9SRVNJWkVfU1RBUlQ7XG4gICAgdGhpcy5jb2x1bW5SZXNpemVTdGFydC5lbWl0KGUpO1xuICB9XG4gIGNvbHVtblJlc2l6ZWQoZTogQ29sdW1uUmVzaXplRXZlbnQpOiB2b2lkIHtcbiAgICBlLnR5cGUgPSBDb2x1bW5SZXNpemVFdmVudC5PTl9SRVNJWkU7XG4gICAgdGhpcy5jb2x1bW5SZXNpemUuZW1pdChlKTtcbiAgfVxuICBjb2x1bW5SZXNpemVFbmRlZChlOiBDb2x1bW5SZXNpemVFdmVudCk6IHZvaWQge1xuICAgIGUudHlwZSA9IENvbHVtblJlc2l6ZUV2ZW50Lk9OX1JFU0laRV9FTkQ7XG4gICAgdGhpcy5jb2x1bW5SZXNpemVFbmQuZW1pdChlKTtcbiAgfVxuXG4gIGNvbHVtblJlb3JkZXJTdGFydGVkKGU6IENvbHVtblJlb3JkZXJFdmVudCk6IHZvaWQge1xuICAgIGUudHlwZSA9IENvbHVtblJlb3JkZXJFdmVudC5PTl9SRU9SREVSX1NUQVJUO1xuICAgIHRoaXMuY29sdW1uUmVvcmRlclN0YXJ0LmVtaXQoZSk7XG4gIH1cbiAgY29sdW1uUmVvcmRlcmVkKGU6IENvbHVtblJlb3JkZXJFdmVudCk6IHZvaWQge1xuICAgIGUudHlwZSA9IENvbHVtblJlb3JkZXJFdmVudC5PTl9SRU9SREVSO1xuICAgIHRoaXMuY29sdW1uUmVvcmRlci5lbWl0KGUpO1xuICB9XG4gIGNvbHVtblJlb3JkZXJFbmRlZChlOiBDb2x1bW5SZW9yZGVyRXZlbnQpOiB2b2lkIHtcbiAgICBlLnR5cGUgPSBDb2x1bW5SZW9yZGVyRXZlbnQuT05fUkVPUkRFUl9FTkQ7XG4gICAgdGhpcy5jb2x1bW5SZW9yZGVyRW5kLmVtaXQoZSk7XG4gIH1cblxuICBncmlkSW5pdGlhbGl6ZWQoZTogR3JpZEV2ZW50KTogdm9pZCB7XG4gICAgZS50eXBlID0gR3JpZEV2ZW50Lk9OX0lOSVRJQUxJWkVEO1xuICAgIHRoaXMuZ3JpZEluaXRpYWxpemUuZW1pdChlKTtcbiAgfVxuXG59XG4iLCI8ZGl2IHRhYmxlanNHcmlkIGNsYXNzPVwiZ3JpZC1jb21wb25lbnRcIiBbbGlua0NsYXNzXT1cImxpbmtDbGFzc1wiIFtyZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudF09XCJyZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudFwiXG4oY29sdW1uUmVzaXplU3RhcnQpPVwiY29sdW1uUmVzaXplU3RhcnRlZCgkZXZlbnQpXCJcbihjb2x1bW5SZXNpemUpPVwiY29sdW1uUmVzaXplZCgkZXZlbnQpXCJcbihjb2x1bW5SZXNpemVFbmQpPVwiY29sdW1uUmVzaXplRW5kZWQoJGV2ZW50KVwiXG4oY29sdW1uUmVvcmRlclN0YXJ0KT1cImNvbHVtblJlb3JkZXJTdGFydGVkKCRldmVudClcIlxuKGNvbHVtblJlb3JkZXIpPVwiY29sdW1uUmVvcmRlcmVkKCRldmVudClcIlxuKGNvbHVtblJlb3JkZXJFbmQpPVwiY29sdW1uUmVvcmRlckVuZGVkKCRldmVudClcIlxuKGdyaWRJbml0aWFsaXplKT1cImdyaWRJbml0aWFsaXplZCgkZXZlbnQpXCJcbj5cblxuXHQ8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbiJdfQ==