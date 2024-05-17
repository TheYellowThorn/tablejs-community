import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
export class GridComponent {
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
    get gridDirective() {
        return this.elementRef.nativeElement.gridDirective;
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
GridComponent.decorators = [
    { type: Component, args: [{
                selector: 'tablejs-grid',
                template: "<div tablejsGrid class=\"grid-component\" [linkClass]=\"linkClass\" [resizeColumnWidthByPercent]=\"resizeColumnWidthByPercent\"\n(columnResizeStart)=\"columnResizeStarted($event)\"\n(columnResize)=\"columnResized($event)\"\n(columnResizeEnd)=\"columnResizeEnded($event)\"\n(columnReorderStart)=\"columnReorderStarted($event)\"\n(columnReorder)=\"columnReordered($event)\"\n(columnReorderEnd)=\"columnReorderEnded($event)\"\n(gridInitialize)=\"gridInitialized($event)\"\n>\n\n\t<ng-content></ng-content>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".tablejs-table-container{display:inline-block;padding:0!important;vertical-align:top}.tablejs-infinite-scroll-viewport{position:relative;height:301px;overflow:hidden;overflow-y:auto}.example-viewport table{overflow:visible}.tablejs-table-width{width:auto}.tablejs-table-container tr td,.tablejs-table-container tr th{padding:0}.grid-component tr td div,.grid-component tr th div{padding:.75rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tablejs-resizeable{cursor:ew-resize}.tablejs-editable-cell{display:inline-block;width:100%;padding:5px;margin:-5px;border:1px solid rgba(0,0,0,.1);box-shadow:inset 0 0 2px 1px #0000000d}.tablejs-editable-cell div{position:absolute;display:block;left:-3px;top:-3px;width:100%}.tablejs-editable-cell input{position:relative;top:0px;left:0px;display:block;width:100%}.tablejs-editable-cell input.error{outline-color:#900}\n"]
            },] }
];
GridComponent.ctorParameters = () => [
    { type: ElementRef }
];
GridComponent.propDecorators = {
    linkClass: [{ type: Input }],
    resizeColumnWidthByPercent: [{ type: Input }],
    columnResizeStart: [{ type: Output }],
    columnResize: [{ type: Output }],
    columnResizeEnd: [{ type: Output }],
    columnReorder: [{ type: Output }],
    columnReorderStart: [{ type: Output }],
    columnReorderEnd: [{ type: Output }],
    gridInitialize: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvY29tcG9uZW50cy9ncmlkL2dyaWQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQVFyRSxNQUFNLE9BQU8sYUFBYTtJQWlCeEIsWUFBbUIsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQWZoQyxjQUFTLEdBQXVCLFNBQVMsQ0FBQztRQUMxQywrQkFBMEIsR0FBWSxLQUFLLENBQUM7UUFFM0Msc0JBQWlCLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDL0QsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMxRCxvQkFBZSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzdELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDM0QsdUJBQWtCLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDaEUscUJBQWdCLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDOUQsbUJBQWMsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQU16QixDQUFDO0lBSjlDLElBQVcsYUFBYTtRQUN0QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUNyRCxDQUFDO0lBSUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsQ0FBb0I7UUFDdEMsQ0FBQyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsYUFBYSxDQUFDLENBQW9CO1FBQ2hDLENBQUMsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxDQUFvQjtRQUNwQyxDQUFDLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsb0JBQW9CLENBQUMsQ0FBcUI7UUFDeEMsQ0FBQyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxlQUFlLENBQUMsQ0FBcUI7UUFDbkMsQ0FBQyxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7UUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELGtCQUFrQixDQUFDLENBQXFCO1FBQ3RDLENBQUMsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGVBQWUsQ0FBQyxDQUFZO1FBQzFCLENBQUMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztRQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7WUE1REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4Qiw0Z0JBQW9DO2dCQUVwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQVhtQixVQUFVOzs7d0JBYzNCLEtBQUs7eUNBQ0wsS0FBSztnQ0FFTCxNQUFNOzJCQUNOLE1BQU07OEJBQ04sTUFBTTs0QkFDTixNQUFNO2lDQUNOLE1BQU07K0JBQ04sTUFBTTs2QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyaWREaXJlY3RpdmUgfSBmcm9tICcuLy4uLy4uL2RpcmVjdGl2ZXMvZ3JpZC9ncmlkLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDb2x1bW5SZW9yZGVyRXZlbnQgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL2V2ZW50cy9jb2x1bW4tcmVvcmRlci1ldmVudCc7XG5pbXBvcnQgeyBDb2x1bW5SZXNpemVFdmVudCB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2NsYXNzZXMvZXZlbnRzL2NvbHVtbi1yZXNpemUtZXZlbnQnO1xuaW1wb3J0IHsgR3JpZEV2ZW50IH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy9ldmVudHMvZ3JpZC1ldmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RhYmxlanMtZ3JpZCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9ncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZ3JpZC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpIGxpbmtDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBASW5wdXQoKSByZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBjb2x1bW5SZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNvbHVtblJlc2l6ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNvbHVtblJlc2l6ZUVuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNvbHVtblJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5SZW9yZGVyU3RhcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5SZW9yZGVyRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZ3JpZEluaXRpYWxpemU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHVibGljIGdldCBncmlkRGlyZWN0aXZlKCk6IEdyaWREaXJlY3RpdmUge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ncmlkRGlyZWN0aXZlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMubGlua0NsYXNzKTtcbiAgICB9XG4gIH1cblxuICBjb2x1bW5SZXNpemVTdGFydGVkKGU6IENvbHVtblJlc2l6ZUV2ZW50KTogdm9pZCB7XG4gICAgZS50eXBlID0gQ29sdW1uUmVzaXplRXZlbnQuT05fUkVTSVpFX1NUQVJUO1xuICAgIHRoaXMuY29sdW1uUmVzaXplU3RhcnQuZW1pdChlKTtcbiAgfVxuICBjb2x1bW5SZXNpemVkKGU6IENvbHVtblJlc2l6ZUV2ZW50KTogdm9pZCB7XG4gICAgZS50eXBlID0gQ29sdW1uUmVzaXplRXZlbnQuT05fUkVTSVpFO1xuICAgIHRoaXMuY29sdW1uUmVzaXplLmVtaXQoZSk7XG4gIH1cbiAgY29sdW1uUmVzaXplRW5kZWQoZTogQ29sdW1uUmVzaXplRXZlbnQpOiB2b2lkIHtcbiAgICBlLnR5cGUgPSBDb2x1bW5SZXNpemVFdmVudC5PTl9SRVNJWkVfRU5EO1xuICAgIHRoaXMuY29sdW1uUmVzaXplRW5kLmVtaXQoZSk7XG4gIH1cblxuICBjb2x1bW5SZW9yZGVyU3RhcnRlZChlOiBDb2x1bW5SZW9yZGVyRXZlbnQpOiB2b2lkIHtcbiAgICBlLnR5cGUgPSBDb2x1bW5SZW9yZGVyRXZlbnQuT05fUkVPUkRFUl9TVEFSVDtcbiAgICB0aGlzLmNvbHVtblJlb3JkZXJTdGFydC5lbWl0KGUpO1xuICB9XG4gIGNvbHVtblJlb3JkZXJlZChlOiBDb2x1bW5SZW9yZGVyRXZlbnQpOiB2b2lkIHtcbiAgICBlLnR5cGUgPSBDb2x1bW5SZW9yZGVyRXZlbnQuT05fUkVPUkRFUjtcbiAgICB0aGlzLmNvbHVtblJlb3JkZXIuZW1pdChlKTtcbiAgfVxuICBjb2x1bW5SZW9yZGVyRW5kZWQoZTogQ29sdW1uUmVvcmRlckV2ZW50KTogdm9pZCB7XG4gICAgZS50eXBlID0gQ29sdW1uUmVvcmRlckV2ZW50Lk9OX1JFT1JERVJfRU5EO1xuICAgIHRoaXMuY29sdW1uUmVvcmRlckVuZC5lbWl0KGUpO1xuICB9XG5cbiAgZ3JpZEluaXRpYWxpemVkKGU6IEdyaWRFdmVudCk6IHZvaWQge1xuICAgIGUudHlwZSA9IEdyaWRFdmVudC5PTl9JTklUSUFMSVpFRDtcbiAgICB0aGlzLmdyaWRJbml0aWFsaXplLmVtaXQoZSk7XG4gIH1cblxufVxuIl19