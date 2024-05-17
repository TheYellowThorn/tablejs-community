import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
export class DataColClassDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.tablejsDataColClass = '';
    }
    ngAfterViewInit() {
        if (this.tablejsDataColClass !== '') {
            this.elementRef.nativeElement.classList.add(this.tablejsDataColClass);
            this.elementRef.nativeElement.setAttribute('tablejsDataColClass', this.tablejsDataColClass);
            if (this.initialWidth) {
                this.elementRef.nativeElement.setAttribute('initialWidth', this.initialWidth);
            }
        }
        else {
            throw Error('A class name must be supplied to the tablejsDataColClass directive.');
        }
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(() => {
            this.registerInitialColumnWidthOnGridDirective();
        }, 1);
    }
    registerInitialColumnWidthOnGridDirective() {
        if (this.initialWidth === undefined) {
            this.gridService.triggerHasInitialWidths(false);
            console.log('[Performance Alert] Add an initialWidth value on the tablejsDataColClass directive for a significant performance boost.');
            return;
        }
        this.gridService.triggerHasInitialWidths(true);
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].initialWidths[this.tablejsDataColClass] = this.initialWidth;
        }
    }
    ngOnDestroy() {
        clearTimeout(this.timeoutID);
    }
}
DataColClassDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
DataColClassDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: DataColClassDirective, selector: "[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]", inputs: { tablejsDataColClass: "tablejsDataColClass", initialWidth: "initialWidth" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; }, propDecorators: { tablejsDataColClass: [{
                type: Input
            }], initialWidth: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jb2wtY2xhc3MuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvZGF0YS1jb2wtY2xhc3MvZGF0YS1jb2wtY2xhc3MuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLEtBQUssRUFBYSxNQUFNLGVBQWUsQ0FBQzs7O0FBTXZGLE1BQU0sT0FBTyxxQkFBcUI7SUFPaEMsWUFBbUIsVUFBc0IsRUFBUyxXQUF3QjtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFMakUsd0JBQW1CLEdBQThCLEVBQUUsQ0FBQztJQUtpQixDQUFDO0lBRS9FLGVBQWU7UUFDYixJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQ3hDLHFCQUFxQixFQUNyQixJQUFJLENBQUMsbUJBQW1CLENBQ3pCLENBQUM7WUFDRixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDeEMsY0FBYyxFQUNkLElBQUksQ0FBQyxZQUFZLENBQ2xCLENBQUM7YUFDSDtTQUNGO2FBQU07WUFDTCxNQUFNLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1NBQ3BGO1FBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDL0IsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLENBQUM7UUFDbkQsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELHlDQUF5QztRQUN2QyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5SEFBeUgsQ0FBQyxDQUFDO1lBQ3ZJLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFvQixDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUNsRjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvQixDQUFDOztrSEEvQ1UscUJBQXFCO3NHQUFyQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFIakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0VBQXdFO2lCQUNuRjsySEFHVSxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBQ0csWUFBWTtzQkFBcEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNEYXRhQ29sQ2xhc3NdLCBbdGFibGVqc2RhdGFjb2xjbGFzc10sIFt0YWJsZWpzLWRhdGEtY29sLWNsYXNzXSdcbn0pXG5leHBvcnQgY2xhc3MgRGF0YUNvbENsYXNzRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoKSB0YWJsZWpzRGF0YUNvbENsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsID0gJyc7XG4gIEBJbnB1dCgpIGluaXRpYWxXaWR0aDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbDtcblxuICBwdWJsaWMgdGltZW91dElEOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHB1YmxpYyBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHsgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy50YWJsZWpzRGF0YUNvbENsYXNzICE9PSAnJykge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLnRhYmxlanNEYXRhQ29sQ2xhc3MpO1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAndGFibGVqc0RhdGFDb2xDbGFzcycsXG4gICAgICAgIHRoaXMudGFibGVqc0RhdGFDb2xDbGFzc1xuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmluaXRpYWxXaWR0aCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgJ2luaXRpYWxXaWR0aCcsXG4gICAgICAgICAgdGhpcy5pbml0aWFsV2lkdGhcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoJ0EgY2xhc3MgbmFtZSBtdXN0IGJlIHN1cHBsaWVkIHRvIHRoZSB0YWJsZWpzRGF0YUNvbENsYXNzIGRpcmVjdGl2ZS4nKTtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEKTtcbiAgICB0aGlzLnRpbWVvdXRJRCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RlckluaXRpYWxDb2x1bW5XaWR0aE9uR3JpZERpcmVjdGl2ZSgpO1xuICAgIH0sIDEpO1xuICB9XG5cbiAgcmVnaXN0ZXJJbml0aWFsQ29sdW1uV2lkdGhPbkdyaWREaXJlY3RpdmUoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbFdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZ3JpZFNlcnZpY2UudHJpZ2dlckhhc0luaXRpYWxXaWR0aHMoZmFsc2UpO1xuICAgICAgY29uc29sZS5sb2coJ1tQZXJmb3JtYW5jZSBBbGVydF0gQWRkIGFuIGluaXRpYWxXaWR0aCB2YWx1ZSBvbiB0aGUgdGFibGVqc0RhdGFDb2xDbGFzcyBkaXJlY3RpdmUgZm9yIGEgc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2UgYm9vc3QuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ncmlkU2VydmljZS50cmlnZ2VySGFzSW5pdGlhbFdpZHRocyh0cnVlKTtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKGVsICE9PSBudWxsICYmIGVsWydncmlkRGlyZWN0aXZlJ10pIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uaW5pdGlhbFdpZHRoc1t0aGlzLnRhYmxlanNEYXRhQ29sQ2xhc3MhXSA9IHRoaXMuaW5pdGlhbFdpZHRoO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJRCk7XG4gIH1cbn1cbiJdfQ==