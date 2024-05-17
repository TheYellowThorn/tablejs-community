import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
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
DataColClassesDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassesDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
DataColClassesDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: DataColClassesDirective, selector: "[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]", inputs: { tablejsDataColClasses: "tablejsDataColClasses" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassesDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; }, propDecorators: { tablejsDataColClasses: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jb2wtY2xhc3Nlcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvZGlyZWN0aXZlcy9kYXRhLWNvbC1jbGFzc2VzL2RhdGEtY29sLWNsYXNzZXMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBTTVFLE1BQU0sT0FBTyx1QkFBdUI7SUFJbEMsWUFBbUIsVUFBc0IsRUFBUyxXQUF3QjtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFGakUsMEJBQXFCLEdBQVcsRUFBRSxDQUFDO0lBRWtDLENBQUM7SUFFL0UsZUFBZTtRQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUN4Qyx1QkFBdUIsRUFDdkIsSUFBSSxDQUFDLHFCQUFxQixDQUMzQixDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0osQ0FBQztJQUVELDZDQUE2QztRQUMzQyxNQUFNLEVBQUUsR0FBNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ILElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtZQUNmLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQzs7b0hBMUJVLHVCQUF1Qjt3R0FBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBSG5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDhFQUE4RTtpQkFDekY7MkhBR1UscUJBQXFCO3NCQUE3QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNEYXRhQ29sQ2xhc3Nlc10sIFt0YWJsZWpzZGF0YWNvbGNsYXNzZXNdLCBbdGFibGVqcy1kYXRhLWNvbC1jbGFzc2VzXSdcbn0pXG5leHBvcnQgY2xhc3MgRGF0YUNvbENsYXNzZXNEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSB0YWJsZWpzRGF0YUNvbENsYXNzZXM6IHN0cmluZyA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwdWJsaWMgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlKSB7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5jYWNoZUNsYXNzZXNPbkVsZW1lbnQoKTtcbiAgICB0aGlzLnJlZ2lzdGVyQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlc09uR3JpZERpcmVjdGl2ZSgpO1xuICB9XG5cbiAgY2FjaGVDbGFzc2VzT25FbGVtZW50KCkge1xuICAgIGlmICh0aGlzLnRhYmxlanNEYXRhQ29sQ2xhc3Nlcykge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAndGFibGVqc0RhdGFDb2xDbGFzc2VzJyxcbiAgICAgICAgdGhpcy50YWJsZWpzRGF0YUNvbENsYXNzZXNcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRhdGFDbGFzc2VzID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJsZWpzRGF0YUNvbENsYXNzZXMnKS5yZXBsYWNlKG5ldyBSZWdFeHAoJyAnLCAnZycpLCAnJykuc3BsaXQoJywnKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlc09uR3JpZERpcmVjdGl2ZSgpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZENvbHVtbnNXaXRoRGF0YUNsYXNzZXModGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=