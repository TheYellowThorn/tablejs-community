import { Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export class InfiniteScrollDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
    }
    ngAfterViewInit() {
        this.registerColumnOnGridDirective();
    }
    registerColumnOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null) {
            el['gridDirective'].addInfiniteScrollViewport(this.elementRef.nativeElement);
        }
    }
}
InfiniteScrollDirective.decorators = [
    { type: Directive, args: [{
                selector: `[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],
  [tablejsViewport], [tablejsviewport], [tablejs-viewport]`,
                host: { class: 'tablejs-infinite-scroll-viewport tablejs-table-width' }
            },] }
];
InfiniteScrollDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5maW5pdGUtc2Nyb2xsLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9kaXJlY3RpdmVzL2luZmluaXRlLXNjcm9sbC9pbmZpbml0ZS1zY3JvbGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFPakUsTUFBTSxPQUFPLHVCQUF1QjtJQUVsQyxZQUFtQixVQUFzQixFQUFTLFdBQXdCO1FBQXZELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMxRSxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCw2QkFBNkI7UUFDM0IsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDZixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM5RTtJQUNILENBQUM7OztZQW5CRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFOzJEQUMrQztnQkFDekQsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLHNEQUFzRCxFQUFFO2FBQ3hFOzs7WUFQa0MsVUFBVTtZQUNwQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbdGFibGVqc0luZmluaXRlU2Nyb2xsXSwgW3RhYmxlanNpbmZpbml0ZXNjcm9sbF0sIFt0YWJsZWpzLWluZmluaXRlLXNjcm9sbF0sXG4gIFt0YWJsZWpzVmlld3BvcnRdLCBbdGFibGVqc3ZpZXdwb3J0XSwgW3RhYmxlanMtdmlld3BvcnRdYCxcbiAgaG9zdDogeyBjbGFzczogJ3RhYmxlanMtaW5maW5pdGUtc2Nyb2xsLXZpZXdwb3J0IHRhYmxlanMtdGFibGUtd2lkdGgnIH1cbn0pXG5leHBvcnQgY2xhc3MgSW5maW5pdGVTY3JvbGxEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJDb2x1bW5PbkdyaWREaXJlY3RpdmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29sdW1uT25HcmlkRGlyZWN0aXZlKCkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkSW5maW5pdGVTY3JvbGxWaWV3cG9ydCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==