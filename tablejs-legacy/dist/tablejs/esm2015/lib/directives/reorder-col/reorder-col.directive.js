import { Directive, ElementRef, Input } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export class ReorderColDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.reorderGhostContext = null;
    }
    ngAfterViewInit() {
        this.registerColumnOnGridDirective();
    }
    registerColumnOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null) {
            this.elementRef.nativeElement.reorderGhost = this.reorderGhost;
            this.elementRef.nativeElement.reorderGhostContext = this.reorderGhostContext;
            el['gridDirective'].addReorderableColumn(this.elementRef.nativeElement);
        }
    }
}
ReorderColDirective.decorators = [
    { type: Directive, args: [{
                selector: '[reorderCol], [reordercol]'
            },] }
];
ReorderColDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService }
];
ReorderColDirective.propDecorators = {
    reorderGhost: [{ type: Input }],
    reorderGhostContext: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVvcmRlci1jb2wuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvcmVvcmRlci1jb2wvcmVvcmRlci1jb2wuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBS2pFLE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsWUFBbUIsVUFBc0IsRUFBUyxXQUF3QjtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFGMUQsd0JBQW1CLEdBQWdCLElBQUksQ0FBQztJQUd4RCxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCw2QkFBNkI7UUFDM0IsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUMvRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDN0UsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDOzs7WUF0QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7YUFDdkM7OztZQUxrQyxVQUFVO1lBQ3BDLFdBQVc7OzsyQkFPakIsS0FBSztrQ0FDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9ncmlkL2dyaWQuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tyZW9yZGVyQ29sXSwgW3Jlb3JkZXJjb2xdJ1xufSlcbmV4cG9ydCBjbGFzcyBSZW9yZGVyQ29sRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgcHVibGljIHJlb3JkZXJHaG9zdDogVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0KCkgcHVibGljIHJlb3JkZXJHaG9zdENvbnRleHQ6IE9iamVjdHxudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJDb2x1bW5PbkdyaWREaXJlY3RpdmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29sdW1uT25HcmlkRGlyZWN0aXZlKCkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJHaG9zdCA9IHRoaXMucmVvcmRlckdob3N0O1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVvcmRlckdob3N0Q29udGV4dCA9IHRoaXMucmVvcmRlckdob3N0Q29udGV4dDtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkUmVvcmRlcmFibGVDb2x1bW4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=