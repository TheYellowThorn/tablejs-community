import { Component, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class DragAndDropGhostComponent {
    constructor(viewContainerRef, cdr) {
        this.viewContainerRef = viewContainerRef;
        this.cdr = cdr;
        this.left = 0;
        this.top = 0;
        this._contextToLoad = null;
    }
    ngAfterViewInit() {
        this.ref.clear();
        if (this._templateToLoad) {
            this.ref.createEmbeddedView(this._templateToLoad, this._contextToLoad);
            this.cdr.detectChanges();
        }
    }
    updateView(template, context = null) {
        this._templateToLoad = template;
        this._contextToLoad = context;
    }
    getTransform() {
        return 'translate(' + this.left + 'px, ' + this.top + 'px';
    }
}
DragAndDropGhostComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DragAndDropGhostComponent, deps: [{ token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
DragAndDropGhostComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: DragAndDropGhostComponent, selector: "tablejs-drag-and-drop-ghost", host: { classAttribute: "drag-and-drop-ghost" }, viewQueries: [{ propertyName: "ref", first: true, predicate: ["ref"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: "<div class=\"drag-and-drop-ghost\" [ngStyle]=\"{ 'transform': getTransform() }\">\n    <div #ref style=\"display: none;\"></div>\n</div>\n", styles: [".drag-and-drop-ghost{position:fixed;display:block;width:100%;height:100px;top:0;left:0;padding:0;margin:0;align-items:center;cursor:move!important;font-size:14px;overflow:visible;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;z-index:10;opacity:1}.drag-and-drop-ghost img{pointer-events:none;position:inherit;border:1px solid #dddddd}\n"], dependencies: [{ kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DragAndDropGhostComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-drag-and-drop-ghost', encapsulation: ViewEncapsulation.None, host: { class: 'drag-and-drop-ghost' }, template: "<div class=\"drag-and-drop-ghost\" [ngStyle]=\"{ 'transform': getTransform() }\">\n    <div #ref style=\"display: none;\"></div>\n</div>\n", styles: [".drag-and-drop-ghost{position:fixed;display:block;width:100%;height:100px;top:0;left:0;padding:0;margin:0;align-items:center;cursor:move!important;font-size:14px;overflow:visible;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;z-index:10;opacity:1}.drag-and-drop-ghost img{pointer-events:none;position:inherit;border:1px solid #dddddd}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { ref: [{
                type: ViewChild,
                args: ['ref', { read: ViewContainerRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1hbmQtZHJvcC1naG9zdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvY29tcG9uZW50cy9kcmFnLWFuZC1kcm9wLWdob3N0L2RyYWctYW5kLWRyb3AtZ2hvc3QuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2NvbXBvbmVudHMvZHJhZy1hbmQtZHJvcC1naG9zdC9kcmFnLWFuZC1kcm9wLWdob3N0LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0MsU0FBUyxFQUFlLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBU3pJLE1BQU0sT0FBTyx5QkFBeUI7SUFRcEMsWUFBbUIsZ0JBQWtDLEVBQVMsR0FBc0I7UUFBakUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBTDdFLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsUUFBRyxHQUFXLENBQUMsQ0FBQztRQUVmLG1CQUFjLEdBQWtCLElBQUksQ0FBQztJQUUyQyxDQUFDO0lBRXpGLGVBQWU7UUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2pCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRU0sVUFBVSxDQUFDLFFBQTBCLEVBQUUsVUFBeUIsSUFBSTtRQUN6RSxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztJQUNoQyxDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQzdELENBQUM7O3NIQXpCVSx5QkFBeUI7MEdBQXpCLHlCQUF5QiwyTEFFWCxnQkFBZ0IsNkJDWDNDLDRJQUdBOzJGRE1hLHlCQUF5QjtrQkFQckMsU0FBUzsrQkFDRSw2QkFBNkIsaUJBR3hCLGlCQUFpQixDQUFDLElBQUksUUFDL0IsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUU7dUlBSWEsR0FBRztzQkFBckQsU0FBUzt1QkFBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0YWJsZWpzLWRyYWctYW5kLWRyb3AtZ2hvc3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vZHJhZy1hbmQtZHJvcC1naG9zdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RyYWctYW5kLWRyb3AtZ2hvc3QuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDogeyBjbGFzczogJ2RyYWctYW5kLWRyb3AtZ2hvc3QnIH1cbn0pXG5leHBvcnQgY2xhc3MgRHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBWaWV3Q2hpbGQoJ3JlZicsIHtyZWFkOiBWaWV3Q29udGFpbmVyUmVmfSkgcHVibGljIHJlZjogYW55O1xuICBwdWJsaWMgbGVmdDogbnVtYmVyID0gMDtcbiAgcHVibGljIHRvcDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBfdGVtcGxhdGVUb0xvYWQ6IFRlbXBsYXRlUmVmPGFueT47XG4gIHByaXZhdGUgX2NvbnRleHRUb0xvYWQ6IG9iamVjdCB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwdWJsaWMgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMucmVmLmNsZWFyKCk7XG4gICAgaWYgKHRoaXMuX3RlbXBsYXRlVG9Mb2FkKSB7XG4gICAgICB0aGlzLnJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5fdGVtcGxhdGVUb0xvYWQsIHRoaXMuX2NvbnRleHRUb0xvYWQpO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVWaWV3KHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LCBjb250ZXh0OiBvYmplY3QgfCBudWxsID0gbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3RlbXBsYXRlVG9Mb2FkID0gdGVtcGxhdGU7XG4gICAgdGhpcy5fY29udGV4dFRvTG9hZCA9IGNvbnRleHQ7XG4gIH1cblxuICBnZXRUcmFuc2Zvcm0oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdGhpcy5sZWZ0ICsgJ3B4LCAnICsgdGhpcy50b3AgKyAncHgnO1xuICB9XG5cbn1cbiIsIjxkaXYgY2xhc3M9XCJkcmFnLWFuZC1kcm9wLWdob3N0XCIgW25nU3R5bGVdPVwieyAndHJhbnNmb3JtJzogZ2V0VHJhbnNmb3JtKCkgfVwiPlxuICAgIDxkaXYgI3JlZiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+PC9kaXY+XG48L2Rpdj5cbiJdfQ==