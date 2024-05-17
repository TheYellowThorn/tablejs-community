import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
export class ScrollPrevSpacerComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngOnDestroy() {
        this.template = null;
    }
}
ScrollPrevSpacerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollPrevSpacerComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
ScrollPrevSpacerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: ScrollPrevSpacerComponent, selector: "tablejs-scroll-prev-spacer", viewQueries: [{ propertyName: "template", first: true, predicate: ["template"], descendants: true, static: true }], ngImport: i0, template: "\n<ng-template #template>\n    <tr tablejsPrevSpacer style=\"display: block; position: relative;\"></tr>\n</ng-template>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollPrevSpacerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-scroll-prev-spacer', template: "\n<ng-template #template>\n    <tr tablejsPrevSpacer style=\"display: block; position: relative;\"></tr>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { template: [{
                type: ViewChild,
                args: ['template', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9jb21wb25lbnRzL3Njcm9sbC1wcmV2LXNwYWNlci9zY3JvbGwtcHJldi1zcGFjZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2NvbXBvbmVudHMvc2Nyb2xsLXByZXYtc3BhY2VyL3Njcm9sbC1wcmV2LXNwYWNlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUF5QixTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTzVFLE1BQU0sT0FBTyx5QkFBeUI7SUFHcEMsWUFBbUIsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFJLENBQUM7SUFFOUMsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7O3NIQVBVLHlCQUF5QjswR0FBekIseUJBQXlCLHNMQ1B0Qyw0SEFJQTsyRkRHYSx5QkFBeUI7a0JBTHJDLFNBQVM7K0JBQ0UsNEJBQTRCO2lHQU1RLFFBQVE7c0JBQXJELFNBQVM7dUJBQUMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndGFibGVqcy1zY3JvbGwtcHJldi1zcGFjZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGUnLCB7c3RhdGljOiB0cnVlfSkgcHVibGljIHRlbXBsYXRlOiBhbnk7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gbnVsbDtcbiAgfVxuXG59XG4iLCJcbjxuZy10ZW1wbGF0ZSAjdGVtcGxhdGU+XG4gICAgPHRyIHRhYmxlanNQcmV2U3BhY2VyIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiByZWxhdGl2ZTtcIj48L3RyPlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==