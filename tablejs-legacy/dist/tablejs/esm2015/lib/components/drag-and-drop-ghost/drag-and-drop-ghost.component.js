import { ChangeDetectorRef, Component, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
export class DragAndDropGhostComponent {
    constructor(viewContainerRef, cdr) {
        this.viewContainerRef = viewContainerRef;
        this.cdr = cdr;
        this.left = 0;
        this.top = 0;
        this._contextToLoad = null;
    }
    ngAfterViewInit() {
        this.ref.clear();
        if (this._templateToLoad) {
            this.ref.createEmbeddedView(this._templateToLoad, this._contextToLoad);
            this.cdr.detectChanges();
        }
    }
    updateView(template, context = null) {
        this._templateToLoad = template;
        this._contextToLoad = context;
    }
    getTransform() {
        return 'translate(' + this.left + 'px, ' + this.top + 'px';
    }
}
DragAndDropGhostComponent.decorators = [
    { type: Component, args: [{
                selector: 'tablejs-drag-and-drop-ghost',
                template: "<div class=\"drag-and-drop-ghost\" [ngStyle]=\"{ 'transform': getTransform() }\">\n    <div #ref style=\"display: none;\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                host: { class: 'drag-and-drop-ghost' },
                styles: [".drag-and-drop-ghost{position:fixed;display:block;width:100%;height:100px;top:0px;left:0px;padding:0;margin:0;align-items:center;cursor:move!important;font-size:14px;overflow:visible;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;z-index:10;opacity:1}.drag-and-drop-ghost img{pointer-events:none;position:inherit;border:1px solid #dddddd}\n"]
            },] }
];
DragAndDropGhostComponent.ctorParameters = () => [
    { type: ViewContainerRef },
    { type: ChangeDetectorRef }
];
DragAndDropGhostComponent.propDecorators = {
    ref: [{ type: ViewChild, args: ['ref', { read: ViewContainerRef },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1hbmQtZHJvcC1naG9zdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvY29tcG9uZW50cy9kcmFnLWFuZC1kcm9wLWdob3N0L2RyYWctYW5kLWRyb3AtZ2hvc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsaUJBQWlCLEVBQUUsU0FBUyxFQUFlLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVN6SSxNQUFNLE9BQU8seUJBQXlCO0lBUXBDLFlBQW1CLGdCQUFrQyxFQUFTLEdBQXNCO1FBQWpFLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUw3RSxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFFBQUcsR0FBVyxDQUFDLENBQUM7UUFFZixtQkFBYyxHQUFrQixJQUFJLENBQUM7SUFFMkMsQ0FBQztJQUV6RixlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVNLFVBQVUsQ0FBQyxRQUEwQixFQUFFLFVBQXlCLElBQUk7UUFDekUsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVELFlBQVk7UUFDVixPQUFPLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztJQUM3RCxDQUFDOzs7WUFoQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLHNKQUFtRDtnQkFFbkQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRTs7YUFDdkM7OztZQVI2RSxnQkFBZ0I7WUFBdEUsaUJBQWlCOzs7a0JBV3RDLFNBQVMsU0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0YWJsZWpzLWRyYWctYW5kLWRyb3AtZ2hvc3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vZHJhZy1hbmQtZHJvcC1naG9zdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RyYWctYW5kLWRyb3AtZ2hvc3QuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDogeyBjbGFzczogJ2RyYWctYW5kLWRyb3AtZ2hvc3QnIH1cbn0pXG5leHBvcnQgY2xhc3MgRHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBWaWV3Q2hpbGQoJ3JlZicsIHtyZWFkOiBWaWV3Q29udGFpbmVyUmVmfSkgcHVibGljIHJlZjogYW55O1xuICBwdWJsaWMgbGVmdDogbnVtYmVyID0gMDtcbiAgcHVibGljIHRvcDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBfdGVtcGxhdGVUb0xvYWQ6IFRlbXBsYXRlUmVmPGFueT47XG4gIHByaXZhdGUgX2NvbnRleHRUb0xvYWQ6IG9iamVjdCB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwdWJsaWMgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMucmVmLmNsZWFyKCk7XG4gICAgaWYgKHRoaXMuX3RlbXBsYXRlVG9Mb2FkKSB7XG4gICAgICB0aGlzLnJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5fdGVtcGxhdGVUb0xvYWQsIHRoaXMuX2NvbnRleHRUb0xvYWQpO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVWaWV3KHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LCBjb250ZXh0OiBvYmplY3QgfCBudWxsID0gbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3RlbXBsYXRlVG9Mb2FkID0gdGVtcGxhdGU7XG4gICAgdGhpcy5fY29udGV4dFRvTG9hZCA9IGNvbnRleHQ7XG4gIH1cblxuICBnZXRUcmFuc2Zvcm0oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdGhpcy5sZWZ0ICsgJ3B4LCAnICsgdGhpcy50b3AgKyAncHgnO1xuICB9XG5cbn1cbiJdfQ==