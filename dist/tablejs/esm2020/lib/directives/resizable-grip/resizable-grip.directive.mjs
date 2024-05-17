import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
export class ResizableGripDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
    }
    ngAfterViewInit() {
        this.registerGripOnGridDirective();
    }
    registerGripOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].addResizableGrip(this.elementRef.nativeElement);
        }
    }
}
ResizableGripDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ResizableGripDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
ResizableGripDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ResizableGripDirective, selector: "[tablejsResizableGrip], [resizableGrip], [resizablegrip]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ResizableGripDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsResizableGrip], [resizableGrip], [resizablegrip]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLWdyaXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvcmVzaXphYmxlLWdyaXAvcmVzaXphYmxlLWdyaXAuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLE1BQU0sZUFBZSxDQUFDOzs7QUFNckUsTUFBTSxPQUFPLHNCQUFzQjtJQUVqQyxZQUFtQixVQUFzQixFQUFTLFdBQXdCO1FBQXZELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMxRSxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCwyQkFBMkI7UUFDekIsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQzs7bUhBZFUsc0JBQXNCO3VHQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFIbEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsMERBQTBEO2lCQUNyRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNSZXNpemFibGVHcmlwXSwgW3Jlc2l6YWJsZUdyaXBdLCBbcmVzaXphYmxlZ3JpcF0nXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6YWJsZUdyaXBEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJHcmlwT25HcmlkRGlyZWN0aXZlKCk7XG4gIH1cblxuICByZWdpc3RlckdyaXBPbkdyaWREaXJlY3RpdmUoKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmIChlbCAhPT0gbnVsbCAmJiBlbFsnZ3JpZERpcmVjdGl2ZSddKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZFJlc2l6YWJsZUdyaXAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=