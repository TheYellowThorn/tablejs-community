import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
export class ScrollPrevSpacerComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9jb21wb25lbnRzL3Njcm9sbC1wcmV2LXNwYWNlci9zY3JvbGwtcHJldi1zcGFjZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2NvbXBvbmVudHMvc2Nyb2xsLXByZXYtc3BhY2VyL3Njcm9sbC1wcmV2LXNwYWNlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFPakUsTUFBTSxPQUFPLHlCQUF5QjtJQUdwQyxZQUFtQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQUksQ0FBQzs7c0hBSG5DLHlCQUF5QjswR0FBekIseUJBQXlCLHNMQ1B0Qyw0SEFJQTsyRkRHYSx5QkFBeUI7a0JBTHJDLFNBQVM7K0JBQ0UsNEJBQTRCO2lHQU1RLFFBQVE7c0JBQXJELFNBQVM7dUJBQUMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RhYmxlanMtc2Nyb2xsLXByZXYtc3BhY2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Njcm9sbC1wcmV2LXNwYWNlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Njcm9sbC1wcmV2LXNwYWNlci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnQge1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlJywge3N0YXRpYzogdHJ1ZX0pIHB1YmxpYyB0ZW1wbGF0ZTogYW55O1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG5cbn1cbiIsIlxuPG5nLXRlbXBsYXRlICN0ZW1wbGF0ZT5cbiAgICA8dHIgdGFibGVqc1ByZXZTcGFjZXIgc3R5bGU9XCJkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IHJlbGF0aXZlO1wiPjwvdHI+XG48L25nLXRlbXBsYXRlPlxuIl19