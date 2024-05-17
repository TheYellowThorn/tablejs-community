import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
export class ReorderColDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.reorderGhost = null;
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
    ngOnDestroy() {
        this.elementRef.nativeElement.reorderGhost = null;
        this.elementRef.nativeElement.reorderGhostContext = null;
        this.reorderGhost = null;
        this.reorderGhostContext = null;
    }
}
ReorderColDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderColDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
ReorderColDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ReorderColDirective, selector: "[reorderCol], [reordercol]", inputs: { reorderGhost: "reorderGhost", reorderGhostContext: "reorderGhostContext" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderColDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[reorderCol], [reordercol]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; }, propDecorators: { reorderGhost: [{
                type: Input
            }], reorderGhostContext: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVvcmRlci1jb2wuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvcmVvcmRlci1jb2wvcmVvcmRlci1jb2wuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLEtBQUssRUFBMEIsTUFBTSxlQUFlLENBQUM7OztBQU1wRyxNQUFNLE9BQU8sbUJBQW1CO0lBSzlCLFlBQW1CLFVBQXNCLEVBQVMsV0FBd0I7UUFBdkQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBSDFELGlCQUFZLEdBQTRCLElBQUksQ0FBQztRQUM3Qyx3QkFBbUIsR0FBa0IsSUFBSSxDQUFDO0lBRzFELENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDZCQUE2QjtRQUMzQixNQUFNLEVBQUUsR0FBNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ILElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtZQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQy9ELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUM3RSxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDekQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztJQUNsQyxDQUFDOztnSEExQlUsbUJBQW1CO29HQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFIL0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2lCQUN2QzsySEFHaUIsWUFBWTtzQkFBM0IsS0FBSztnQkFDVSxtQkFBbUI7c0JBQWxDLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBUZW1wbGF0ZVJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcmVvcmRlckNvbF0sIFtyZW9yZGVyY29sXSdcbn0pXG5leHBvcnQgY2xhc3MgUmVvcmRlckNvbERpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgQElucHV0KCkgcHVibGljIHJlb3JkZXJHaG9zdDogVGVtcGxhdGVSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBwdWJsaWMgcmVvcmRlckdob3N0Q29udGV4dDogT2JqZWN0IHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHB1YmxpYyBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ29sdW1uT25HcmlkRGlyZWN0aXZlKCk7XG4gIH1cblxuICByZWdpc3RlckNvbHVtbk9uR3JpZERpcmVjdGl2ZSgpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW9yZGVyR2hvc3QgPSB0aGlzLnJlb3JkZXJHaG9zdDtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJHaG9zdENvbnRleHQgPSB0aGlzLnJlb3JkZXJHaG9zdENvbnRleHQ7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZFJlb3JkZXJhYmxlQ29sdW1uKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW9yZGVyR2hvc3QgPSBudWxsO1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJHaG9zdENvbnRleHQgPSBudWxsO1xuICAgIHRoaXMucmVvcmRlckdob3N0ID0gbnVsbDtcbiAgICB0aGlzLnJlb3JkZXJHaG9zdENvbnRleHQgPSBudWxsO1xuICB9XG5cbn1cbiJdfQ==