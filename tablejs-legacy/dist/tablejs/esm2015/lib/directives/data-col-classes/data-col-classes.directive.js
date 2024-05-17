import { Directive, ElementRef, Input } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export class DataColClassesDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.tablejsDataColClasses = '';
    }
    ngAfterViewInit() {
        this.cacheClassesOnElement();
        this.registerColumnsWithDataClassesOnGridDirective();
    }
    cacheClassesOnElement() {
        if (this.tablejsDataColClasses) {
            this.elementRef.nativeElement.setAttribute('tablejsDataColClasses', this.tablejsDataColClasses);
        }
        this.elementRef.nativeElement.dataClasses = this.elementRef.nativeElement.getAttribute('tablejsDataColClasses').replace(new RegExp(' ', 'g'), '').split(',');
    }
    registerColumnsWithDataClassesOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null) {
            el['gridDirective'].addColumnsWithDataClasses(this.elementRef.nativeElement);
        }
    }
}
DataColClassesDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]'
            },] }
];
DataColClassesDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService }
];
DataColClassesDirective.propDecorators = {
    tablejsDataColClasses: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jb2wtY2xhc3Nlcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvZGlyZWN0aXZlcy9kYXRhLWNvbC1jbGFzc2VzL2RhdGEtY29sLWNsYXNzZXMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBS2pFLE1BQU0sT0FBTyx1QkFBdUI7SUFJbEMsWUFBbUIsVUFBc0IsRUFBUyxXQUF3QjtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFGakUsMEJBQXFCLEdBQVcsRUFBRSxDQUFDO0lBRWtDLENBQUM7SUFFL0UsZUFBZTtRQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUN4Qyx1QkFBdUIsRUFDdkIsSUFBSSxDQUFDLHFCQUFxQixDQUMzQixDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0osQ0FBQztJQUVELDZDQUE2QztRQUMzQyxNQUFNLEVBQUUsR0FBNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ILElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtZQUNmLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQzs7O1lBN0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsOEVBQThFO2FBQ3pGOzs7WUFMa0MsVUFBVTtZQUNwQyxXQUFXOzs7b0NBT2pCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbdGFibGVqc0RhdGFDb2xDbGFzc2VzXSwgW3RhYmxlanNkYXRhY29sY2xhc3Nlc10sIFt0YWJsZWpzLWRhdGEtY29sLWNsYXNzZXNdJ1xufSlcbmV4cG9ydCBjbGFzcyBEYXRhQ29sQ2xhc3Nlc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHRhYmxlanNEYXRhQ29sQ2xhc3Nlczogc3RyaW5nID0gJyc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHB1YmxpYyBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHsgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmNhY2hlQ2xhc3Nlc09uRWxlbWVudCgpO1xuICAgIHRoaXMucmVnaXN0ZXJDb2x1bW5zV2l0aERhdGFDbGFzc2VzT25HcmlkRGlyZWN0aXZlKCk7XG4gIH1cblxuICBjYWNoZUNsYXNzZXNPbkVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMudGFibGVqc0RhdGFDb2xDbGFzc2VzKSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICd0YWJsZWpzRGF0YUNvbENsYXNzZXMnLFxuICAgICAgICB0aGlzLnRhYmxlanNEYXRhQ29sQ2xhc3Nlc1xuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZGF0YUNsYXNzZXMgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNEYXRhQ29sQ2xhc3NlcycpLnJlcGxhY2UobmV3IFJlZ0V4cCgnICcsICdnJyksICcnKS5zcGxpdCgnLCcpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb2x1bW5zV2l0aERhdGFDbGFzc2VzT25HcmlkRGlyZWN0aXZlKCkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==