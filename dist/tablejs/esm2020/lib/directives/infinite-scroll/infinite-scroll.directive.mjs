import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
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
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].addInfiniteScrollViewport(this.elementRef.nativeElement);
        }
    }
}
InfiniteScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InfiniteScrollDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
InfiniteScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: InfiniteScrollDirective, selector: "[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],\n  [tablejsViewport], [tablejsviewport], [tablejs-viewport]", host: { classAttribute: "tablejs-infinite-scroll-viewport tablejs-table-width" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InfiniteScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],
  [tablejsViewport], [tablejsviewport], [tablejs-viewport]`,
                    host: { class: 'tablejs-infinite-scroll-viewport tablejs-table-width' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5maW5pdGUtc2Nyb2xsLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9kaXJlY3RpdmVzL2luZmluaXRlLXNjcm9sbC9pbmZpbml0ZS1zY3JvbGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLE1BQU0sZUFBZSxDQUFDOzs7QUFRckUsTUFBTSxPQUFPLHVCQUF1QjtJQUVsQyxZQUFtQixVQUFzQixFQUFTLFdBQXdCO1FBQXZELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMxRSxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCw2QkFBNkI7UUFDM0IsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQzs7b0hBZFUsdUJBQXVCO3dHQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFMbkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUU7MkRBQytDO29CQUN6RCxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsc0RBQXNELEVBQUU7aUJBQ3hFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbdGFibGVqc0luZmluaXRlU2Nyb2xsXSwgW3RhYmxlanNpbmZpbml0ZXNjcm9sbF0sIFt0YWJsZWpzLWluZmluaXRlLXNjcm9sbF0sXG4gIFt0YWJsZWpzVmlld3BvcnRdLCBbdGFibGVqc3ZpZXdwb3J0XSwgW3RhYmxlanMtdmlld3BvcnRdYCxcbiAgaG9zdDogeyBjbGFzczogJ3RhYmxlanMtaW5maW5pdGUtc2Nyb2xsLXZpZXdwb3J0IHRhYmxlanMtdGFibGUtd2lkdGgnIH1cbn0pXG5leHBvcnQgY2xhc3MgSW5maW5pdGVTY3JvbGxEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJDb2x1bW5PbkdyaWREaXJlY3RpdmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29sdW1uT25HcmlkRGlyZWN0aXZlKCkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoZWwgIT09IG51bGwgJiYgZWxbJ2dyaWREaXJlY3RpdmUnXSkge1xuICAgICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5hZGRJbmZpbml0ZVNjcm9sbFZpZXdwb3J0KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxufVxuIl19