import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
export class ReorderGripDirective {
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
            el['gridDirective'].addReorderGrip(this.elementRef.nativeElement);
        }
    }
}
ReorderGripDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderGripDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
ReorderGripDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ReorderGripDirective, selector: "[reorderGrip]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderGripDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[reorderGrip]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVvcmRlci1ncmlwLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9kaXJlY3RpdmVzL3Jlb3JkZXItZ3JpcC9yZW9yZGVyLWdyaXAuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLE1BQU0sZUFBZSxDQUFDOzs7QUFNckUsTUFBTSxPQUFPLG9CQUFvQjtJQUUvQixZQUFtQixVQUFzQixFQUFTLFdBQXdCO1FBQXZELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUFJLENBQUM7SUFFL0UsZUFBZTtRQUNiLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCwyQkFBMkI7UUFDekIsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNuRTtJQUNILENBQUM7O2lIQWJVLG9CQUFvQjtxR0FBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBSGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcmVvcmRlckdyaXBdJ1xufSlcbmV4cG9ydCBjbGFzcyBSZW9yZGVyR3JpcERpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwdWJsaWMgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlKSB7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5yZWdpc3RlckdyaXBPbkdyaWREaXJlY3RpdmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyR3JpcE9uR3JpZERpcmVjdGl2ZSgpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKGVsICE9PSBudWxsICYmIGVsWydncmlkRGlyZWN0aXZlJ10pIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkUmVvcmRlckdyaXAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=