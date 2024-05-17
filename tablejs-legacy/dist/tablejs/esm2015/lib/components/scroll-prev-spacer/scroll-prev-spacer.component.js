import { Component, ElementRef, ViewChild } from '@angular/core';
export class ScrollPrevSpacerComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
}
ScrollPrevSpacerComponent.decorators = [
    { type: Component, args: [{
                selector: 'tablejs-scroll-prev-spacer',
                template: "\n<ng-template #template>\n    <tr tablejsPrevSpacer style=\"display: block; position: relative;\"></tr>\n</ng-template>\n",
                styles: [""]
            },] }
];
ScrollPrevSpacerComponent.ctorParameters = () => [
    { type: ElementRef }
];
ScrollPrevSpacerComponent.propDecorators = {
    template: [{ type: ViewChild, args: ['template', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9jb21wb25lbnRzL3Njcm9sbC1wcmV2LXNwYWNlci9zY3JvbGwtcHJldi1zcGFjZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU9qRSxNQUFNLE9BQU8seUJBQXlCO0lBR3BDLFlBQW1CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBSSxDQUFDOzs7WUFSL0MsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLHNJQUFrRDs7YUFFbkQ7OztZQU5tQixVQUFVOzs7dUJBUzNCLFNBQVMsU0FBQyxVQUFVLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndGFibGVqcy1zY3JvbGwtcHJldi1zcGFjZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2Nyb2xsLXByZXYtc3BhY2VyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudCB7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGUnLCB7c3RhdGljOiB0cnVlfSkgcHVibGljIHRlbXBsYXRlOiBhbnk7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cblxufVxuIl19