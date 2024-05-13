import { Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
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
        if (el !== null) {
            el['gridDirective'].addResizableGrip(this.elementRef.nativeElement);
        }
    }
}
ResizableGripDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tablejsResizableGrip], [resizableGrip], [resizablegrip]'
            },] }
];
ResizableGripDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLWdyaXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvcmVzaXphYmxlLWdyaXAvcmVzaXphYmxlLWdyaXAuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFLakUsTUFBTSxPQUFPLHNCQUFzQjtJQUVqQyxZQUFtQixVQUFzQixFQUFTLFdBQXdCO1FBQXZELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMxRSxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCwyQkFBMkI7UUFDekIsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDZixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyRTtJQUNILENBQUM7OztZQWpCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBEQUEwRDthQUNyRTs7O1lBTGtDLFVBQVU7WUFDcEMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNSZXNpemFibGVHcmlwXSwgW3Jlc2l6YWJsZUdyaXBdLCBbcmVzaXphYmxlZ3JpcF0nXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6YWJsZUdyaXBEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJHcmlwT25HcmlkRGlyZWN0aXZlKCk7XG4gIH1cblxuICByZWdpc3RlckdyaXBPbkdyaWREaXJlY3RpdmUoKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmIChlbCAhPT0gbnVsbCkge1xuICAgICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5hZGRSZXNpemFibGVHcmlwKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxufVxuIl19