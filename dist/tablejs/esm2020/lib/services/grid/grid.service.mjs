import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class GridService {
    constructor() {
        this.linkedDirectiveObjs = {};
        this.containsInitialWidthSettings = new BehaviorSubject(undefined);
    }
    getParentTablejsGridDirective(el) {
        while (el !== null && el.getAttribute('tablejsGrid') === null) {
            el = el.parentElement;
        }
        return el;
    }
    triggerHasInitialWidths(hasWidths) {
        this.containsInitialWidthSettings.next(hasWidths);
    }
}
GridService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
GridService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFLdkMsTUFBTSxPQUFPLFdBQVc7SUFLdEI7UUFITyx3QkFBbUIsR0FBUSxFQUFFLENBQUM7UUFDOUIsaUNBQTRCLEdBQXlDLElBQUksZUFBZSxDQUFzQixTQUFTLENBQUMsQ0FBQztJQUVoSCxDQUFDO0lBRWpCLDZCQUE2QixDQUFDLEVBQXNCO1FBQ2xELE9BQU8sRUFBRSxLQUFLLElBQUksSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3RCxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztTQUN2QjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELHVCQUF1QixDQUFDLFNBQWtCO1FBQ3hDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7d0dBaEJVLFdBQVc7NEdBQVgsV0FBVyxjQUZWLE1BQU07MkZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJQ29sdW1uRGF0YSB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvaS1jb2x1bW4tZGF0YSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgR3JpZFNlcnZpY2Uge1xuXG4gIHB1YmxpYyBsaW5rZWREaXJlY3RpdmVPYmpzOiBhbnkgPSB7fTtcbiAgcHVibGljIGNvbnRhaW5zSW5pdGlhbFdpZHRoU2V0dGluZ3M6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuIHwgdW5kZWZpbmVkPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbiB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIGdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKGVsOiBIVE1MRWxlbWVudCB8IG51bGwpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIHdoaWxlIChlbCAhPT0gbnVsbCAmJiBlbC5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNHcmlkJykgPT09IG51bGwpIHtcbiAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgdHJpZ2dlckhhc0luaXRpYWxXaWR0aHMoaGFzV2lkdGhzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluc0luaXRpYWxXaWR0aFNldHRpbmdzLm5leHQoaGFzV2lkdGhzKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgSUxpbmtlZEdyaWQge1xuICBjbGFzc1dpZHRoczogbnVtYmVyW107XG4gIHN0eWxlc0J5Q2xhc3M6IGFueVtdO1xuICB3aWR0aFN0eWxlOiBIVE1MU3R5bGVFbGVtZW50O1xuICB3aWR0aFN0eWxlRnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG4gIHJlb3JkZXJIaWdobGlnaHRTdHlsZTogSFRNTFN0eWxlRWxlbWVudDtcbiAgcmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG4gIHN1Ykdyb3VwU3R5bGVzOiBIVE1MU3R5bGVFbGVtZW50W107XG4gIHN1Ykdyb3VwRnJhZ21lbnRzOiBEb2N1bWVudEZyYWdtZW50W107XG4gIHN1Ykdyb3VwU3R5bGVPYmpzOiBhbnk7XG4gIGdyaWRPcmRlcjogbnVtYmVyW107XG4gIGdyaWRPcmRlclN0eWxlczogSFRNTFN0eWxlRWxlbWVudFtdO1xuICBncmlkT3JkZXJGcmFnbWVudHM6IERvY3VtZW50RnJhZ21lbnRbXTtcbiAgY29sRGF0YUdyb3VwczogSUNvbHVtbkRhdGFbXVtdO1xufVxuIl19