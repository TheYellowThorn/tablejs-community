import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
export class GridRowDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
    }
    ngAfterViewInit() {
        this.registerRowsOnGridDirective();
    }
    registerRowsOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].addRow(this.elementRef.nativeElement);
        }
    }
}
GridRowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridRowDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
GridRowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: GridRowDirective, selector: "[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]", host: { classAttribute: "reorderable-table-row" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridRowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]',
                    host: { class: 'reorderable-table-row' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1yb3cuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvZ3JpZC1yb3cvZ3JpZC1yb3cuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLE1BQU0sZUFBZSxDQUFDOzs7QUFRckUsTUFBTSxPQUFPLGdCQUFnQjtJQUUzQixZQUFtQixVQUFzQixFQUFTLFdBQXdCO1FBQXZELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMxRSxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCwyQkFBMkI7UUFDekIsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUM7OzZHQWRVLGdCQUFnQjtpR0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBTDVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdEQUF3RDtvQkFDbEUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFO2lCQUN6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNHcmlkUm93XSwgW3RhYmxlanNncmlkcm93XSwgW3RhYmxlanMtZ3JpZC1yb3ddJyxcbiAgaG9zdDogeyBjbGFzczogJ3Jlb3JkZXJhYmxlLXRhYmxlLXJvdycgfVxufSlcblxuZXhwb3J0IGNsYXNzIEdyaWRSb3dEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJSb3dzT25HcmlkRGlyZWN0aXZlKCk7XG4gIH1cblxuICByZWdpc3RlclJvd3NPbkdyaWREaXJlY3RpdmUoKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmIChlbCAhPT0gbnVsbCAmJiBlbFsnZ3JpZERpcmVjdGl2ZSddKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZFJvdyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==