import { Component, ViewEncapsulation } from '@angular/core';
export class HorizResizeGripComponent {
    constructor() { }
}
HorizResizeGripComponent.decorators = [
    { type: Component, args: [{
                selector: 'tablejs-horiz-resize-grip',
                template: "<i class=\"fas fa-angle-left fa-xs\"></i><i class=\"fas fa-angle-right fa-xs\"></i>",
                host: { class: 'resize-grip' },
                encapsulation: ViewEncapsulation.None,
                styles: [".resize-grip{cursor:ew-resize;position:absolute;right:0px;top:0px;height:100%;width:30px;padding:0;margin:0;display:block}.resize-grip i{left:.5px;color:#fff;position:relative;top:50%;transform:translateY(-8px)}\n"]
            },] }
];
HorizResizeGripComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9yaXotcmVzaXplLWdyaXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2NvbXBvbmVudHMvaG9yaXotcmVzaXplLWdyaXAvaG9yaXotcmVzaXplLWdyaXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFTckUsTUFBTSxPQUFPLHdCQUF3QjtJQUVuQyxnQkFBZ0IsQ0FBQzs7O1lBVGxCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQywrRkFBaUQ7Z0JBRWpELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQzlCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0YWJsZWpzLWhvcml6LXJlc2l6ZS1ncmlwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2hvcml6LXJlc2l6ZS1ncmlwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vaG9yaXotcmVzaXplLWdyaXAuY29tcG9uZW50LnNjc3MnXSxcbiAgaG9zdDogeyBjbGFzczogJ3Jlc2l6ZS1ncmlwJyB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEhvcml6UmVzaXplR3JpcENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxufVxuIl19