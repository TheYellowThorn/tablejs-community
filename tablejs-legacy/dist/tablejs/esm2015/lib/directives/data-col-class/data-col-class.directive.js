import { Directive, ElementRef, Input } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
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
        setTimeout(() => {
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
        if (el !== null) {
            el['gridDirective'].initialWidths[this.tablejsDataColClass] = this.initialWidth;
        }
    }
}
DataColClassDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]'
            },] }
];
DataColClassDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService }
];
DataColClassDirective.propDecorators = {
    tablejsDataColClass: [{ type: Input }],
    initialWidth: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jb2wtY2xhc3MuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvZGF0YS1jb2wtY2xhc3MvZGF0YS1jb2wtY2xhc3MuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBS2pFLE1BQU0sT0FBTyxxQkFBcUI7SUFLaEMsWUFBbUIsVUFBc0IsRUFBUyxXQUF3QjtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFIakUsd0JBQW1CLEdBQThCLEVBQUUsQ0FBQztJQUdpQixDQUFDO0lBRS9FLGVBQWU7UUFDYixJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQ3hDLHFCQUFxQixFQUNyQixJQUFJLENBQUMsbUJBQW1CLENBQ3pCLENBQUM7WUFDRixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDeEMsY0FBYyxFQUNkLElBQUksQ0FBQyxZQUFZLENBQ2xCLENBQUM7YUFDSDtTQUNGO2FBQU07WUFDTCxNQUFNLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1NBQ3BGO1FBQ0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxDQUFDO1FBQ25ELENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFRCx5Q0FBeUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMseUhBQXlILENBQUMsQ0FBQztZQUN2SSxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLE1BQU0sRUFBRSxHQUE2QixJQUFJLENBQUMsV0FBVyxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkgsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2YsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsbUJBQW9CLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ2xGO0lBQ0gsQ0FBQzs7O1lBM0NGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0VBQXdFO2FBQ25GOzs7WUFMa0MsVUFBVTtZQUNwQyxXQUFXOzs7a0NBT2pCLEtBQUs7MkJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9ncmlkL2dyaWQuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t0YWJsZWpzRGF0YUNvbENsYXNzXSwgW3RhYmxlanNkYXRhY29sY2xhc3NdLCBbdGFibGVqcy1kYXRhLWNvbC1jbGFzc10nXG59KVxuZXhwb3J0IGNsYXNzIERhdGFDb2xDbGFzc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHRhYmxlanNEYXRhQ29sQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwgPSAnJztcbiAgQElucHV0KCkgaW5pdGlhbFdpZHRoOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwdWJsaWMgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlKSB7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMudGFibGVqc0RhdGFDb2xDbGFzcyAhPT0gJycpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy50YWJsZWpzRGF0YUNvbENsYXNzKTtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ3RhYmxlanNEYXRhQ29sQ2xhc3MnLFxuICAgICAgICB0aGlzLnRhYmxlanNEYXRhQ29sQ2xhc3NcbiAgICAgICk7XG4gICAgICBpZiAodGhpcy5pbml0aWFsV2lkdGgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICdpbml0aWFsV2lkdGgnLFxuICAgICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCdBIGNsYXNzIG5hbWUgbXVzdCBiZSBzdXBwbGllZCB0byB0aGUgdGFibGVqc0RhdGFDb2xDbGFzcyBkaXJlY3RpdmUuJyk7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RlckluaXRpYWxDb2x1bW5XaWR0aE9uR3JpZERpcmVjdGl2ZSgpO1xuICAgIH0sIDEpO1xuICB9XG5cbiAgcmVnaXN0ZXJJbml0aWFsQ29sdW1uV2lkdGhPbkdyaWREaXJlY3RpdmUoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbFdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZ3JpZFNlcnZpY2UudHJpZ2dlckhhc0luaXRpYWxXaWR0aHMoZmFsc2UpO1xuICAgICAgY29uc29sZS5sb2coJ1tQZXJmb3JtYW5jZSBBbGVydF0gQWRkIGFuIGluaXRpYWxXaWR0aCB2YWx1ZSBvbiB0aGUgdGFibGVqc0RhdGFDb2xDbGFzcyBkaXJlY3RpdmUgZm9yIGEgc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2UgYm9vc3QuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ncmlkU2VydmljZS50cmlnZ2VySGFzSW5pdGlhbFdpZHRocyh0cnVlKTtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmluaXRpYWxXaWR0aHNbdGhpcy50YWJsZWpzRGF0YUNvbENsYXNzIV0gPSB0aGlzLmluaXRpYWxXaWR0aDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==