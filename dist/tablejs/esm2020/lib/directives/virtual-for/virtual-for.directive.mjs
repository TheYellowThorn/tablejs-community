import { Directive, Input } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/directive-registration/directive-registration.service";
export class TablejsForOfContext {
    constructor($implicit, tablejsVirtualForOf, index, count) {
        this.$implicit = $implicit;
        this.tablejsVirtualForOf = tablejsVirtualForOf;
        this.index = index;
        this.count = count;
    }
    get first() {
        return this.index === 0;
    }
    get last() {
        return this.index === this.count - 1;
    }
    get even() {
        return this.index % 2 === 0;
    }
    get odd() {
        return !this.even;
    }
}
export class VirtualForDirective {
    set tablejsVirtualForOf(tablejsVirtualForOf) {
        this._tablejsForOf = tablejsVirtualForOf;
        this._onRenderedDataChange();
    }
    /**
     * Asserts the correct type of the context for the template that `TablejsForOf` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `TablejsForOf` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(dir, ctx) {
        return true;
    }
    /**
     * A reference to the template that is stamped out for each item in the iterable.
     * @see [template reference variable](guide/template-reference-variables)
     */
    set tablejsVirtualForTemplate(value) {
        if (value) {
            this._template = value;
        }
    }
    get template() {
        return this._template;
    }
    get tablejsVirtualForTrackBy() {
        return this._tablejsVirtualForTrackBy;
    }
    set tablejsVirtualForTrackBy(fn) {
        this._tablejsVirtualForTrackBy = fn ?
            (index, item) => fn(index + (this._lastRange ? this._lastRange.extendedStartIndex : 0), item) :
            undefined;
        this._onRenderedDataChange();
    }
    constructor(_viewContainer, _template, _differs, elementRef, directiveRegistrationService) {
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this.elementRef = elementRef;
        this.directiveRegistrationService = directiveRegistrationService;
        this.changes = new Subject();
        this._tablejsForOf = null;
        this._differ = null;
        let parent = this._viewContainer.element.nativeElement.parentElement;
        while (parent !== null && parent !== undefined && parent.scrollViewportDirective === undefined) {
            parent = parent.parentElement;
        }
        if (parent === null || parent === undefined) {
            throw Error('No scrollViewportDirective found for tablejsForOf.  Declare a scrollViewport using the scrollViewportDirective.');
        }
        else {
            this._scrollViewportDirective = parent.scrollViewportDirective;
            this.virtualNexus = this.directiveRegistrationService.setVirtualNexus(this, this._scrollViewportDirective);
            this._lastRange = this._scrollViewportDirective.range;
            this.rangeUpdatedSubscription$ = this._scrollViewportDirective.rangeUpdated.subscribe(rangeObj => {
                if (this.rangeIsDifferent(this._lastRange, rangeObj.range)) {
                    this._lastRange = rangeObj.range;
                    this._renderedItems = Array.from(this._tablejsForOf).slice(this._lastRange.extendedStartIndex, this._lastRange.extendedEndIndex);
                    this._onRenderedDataChange(false);
                }
            });
        }
    }
    rangeIsDifferent(range1, range2) {
        return range1.endIndex === range2.endIndex && range1.extendedEndIndex === range2.extendedEndIndex && range1.startIndex === range2.startIndex && range1.extendedStartIndex === range2.extendedStartIndex;
    }
    renderedItemsNeedUpdate() {
        return this._renderedItems.length !== this._lastRange.extendedEndIndex - this._lastRange.extendedStartIndex;
    }
    _onRenderedDataChange(updateRenderedItems = true) {
        if (!this._renderedItems) {
            return;
        }
        if (updateRenderedItems) {
            this._renderedItems = Array.from(this._tablejsForOf).slice(this._lastRange.extendedStartIndex, this._lastRange.extendedEndIndex);
        }
        if (!this._differ) {
            this._differ = this._differs.find(this._renderedItems).create((index, item) => {
                return this.tablejsVirtualForTrackBy ? this.tablejsVirtualForTrackBy(index, item) : item;
            });
        }
    }
    ngDoCheck() {
        this.updateItems();
    }
    updateItems() {
        if (this._differ) {
            const scrollToOrigin = this._tablejsForOf !== this._lastTablejsForOf;
            let diffChanges = null;
            if (this.renderedItemsNeedUpdate()) {
                this._onRenderedDataChange();
            }
            try {
                diffChanges = this._differ.diff(this._renderedItems);
            }
            catch {
                this._differ = this._differs.find(this._renderedItems).create((index, item) => {
                    return this.tablejsVirtualForTrackBy ? this.tablejsVirtualForTrackBy(index, item) : item;
                });
            }
            if (scrollToOrigin) {
                this._lastTablejsForOf = this._tablejsForOf;
            }
            if (diffChanges || scrollToOrigin) {
                this.changes.next({ tablejsForOf: this._tablejsForOf, scrollToOrigin });
            }
        }
    }
    ngOnDestroy() {
        this.rangeUpdatedSubscription$.unsubscribe();
    }
}
VirtualForDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: VirtualForDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: i0.ElementRef }, { token: i1.DirectiveRegistrationService }], target: i0.ɵɵFactoryTarget.Directive });
VirtualForDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: VirtualForDirective, selector: "[tablejsVirtualFor][tablejsVirtualForOf]", inputs: { tablejsVirtualForOf: "tablejsVirtualForOf", tablejsVirtualForTemplate: "tablejsVirtualForTemplate", tablejsVirtualForTrackBy: "tablejsVirtualForTrackBy" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: VirtualForDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[tablejsVirtualFor][tablejsVirtualForOf]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: i0.ElementRef }, { type: i1.DirectiveRegistrationService }]; }, propDecorators: { tablejsVirtualForOf: [{
                type: Input
            }], tablejsVirtualForTemplate: [{
                type: Input
            }], tablejsVirtualForTrackBy: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvdmlydHVhbC1mb3IvdmlydHVhbC1mb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQXVCLEtBQUssRUFBMEgsTUFBTSxlQUFlLENBQUM7QUFHOUwsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7OztBQUk3QyxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFlBQW1CLFNBQVksRUFBUyxtQkFBc0IsRUFBUyxLQUFhLEVBQVMsS0FBYTtRQUF2RixjQUFTLEdBQVQsU0FBUyxDQUFHO1FBQVMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFHO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBRTlHLElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksR0FBRztRQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQUdELE1BQU0sT0FBTyxtQkFBbUI7SUFNOUIsSUFDSSxtQkFBbUIsQ0FBQyxtQkFBcUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztRQUN6QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQixD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O2FBQ3pFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMvQyxDQUFDOztnSEEzSVUsbUJBQW1CO29HQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSwwQ0FBMEMsRUFBQzttT0FRM0QsbUJBQW1CO3NCQUR0QixLQUFLO2dCQTZCRix5QkFBeUI7c0JBRDVCLEtBQUs7Z0JBWUYsd0JBQXdCO3NCQUQzQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBEaXJlY3RpdmUsIERvQ2hlY2ssIEVsZW1lbnRSZWYsIElucHV0LCBJdGVyYWJsZUNoYW5nZXMsIEl0ZXJhYmxlRGlmZmVyLCBJdGVyYWJsZURpZmZlcnMsIE5nSXRlcmFibGUsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYsIFRyYWNrQnlGdW5jdGlvbiwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBJVmlydHVhbE5leHVzIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9pLXZpcnR1YWwtbmV4dXMnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vc2Nyb2xsLXZpZXdwb3J0L3Njcm9sbC12aWV3cG9ydC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL3Njcm9sbGluZy9yYW5nZSc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZWpzRm9yT2ZDb250ZXh0PFQsIFUgZXh0ZW5kcyBOZ0l0ZXJhYmxlPFQ+ID0gTmdJdGVyYWJsZTxUPj4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgJGltcGxpY2l0OiBULCBwdWJsaWMgdGFibGVqc1ZpcnR1YWxGb3JPZjogVSwgcHVibGljIGluZGV4OiBudW1iZXIsIHB1YmxpYyBjb3VudDogbnVtYmVyKSB7fVxuXG4gIGdldCBmaXJzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCA9PT0gMDtcbiAgfVxuXG4gIGdldCBsYXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZGV4ID09PSB0aGlzLmNvdW50IC0gMTtcbiAgfVxuXG4gIGdldCBldmVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZGV4ICUgMiA9PT0gMDtcbiAgfVxuXG4gIGdldCBvZGQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmV2ZW47XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbdGFibGVqc1ZpcnR1YWxGb3JdW3RhYmxlanNWaXJ0dWFsRm9yT2ZdJ30pXG5leHBvcnQgY2xhc3MgVmlydHVhbEZvckRpcmVjdGl2ZTxULCBVIGV4dGVuZHMgTmdJdGVyYWJsZTxUPiA9IE5nSXRlcmFibGU8VD4+IGltcGxlbWVudHMgRG9DaGVjaywgT25EZXN0cm95IHtcblxuICBwdWJsaWMgdmlydHVhbE5leHVzOiBJVmlydHVhbE5leHVzO1xuICBwdWJsaWMgY2hhbmdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwdWJsaWMgcmFuZ2VVcGRhdGVkU3Vic2NyaXB0aW9uJDogU3Vic2NyaXB0aW9uO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB0YWJsZWpzVmlydHVhbEZvck9mKHRhYmxlanNWaXJ0dWFsRm9yT2Y6IFV8dW5kZWZpbmVkfG51bGwpIHtcbiAgICB0aGlzLl90YWJsZWpzRm9yT2YgPSB0YWJsZWpzVmlydHVhbEZvck9mO1xuICAgIHRoaXMuX29uUmVuZGVyZWREYXRhQ2hhbmdlKCk7XG4gIH1cblxuICBwdWJsaWMgX3RhYmxlanNGb3JPZjogVXx1bmRlZmluZWR8bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2xhc3RUYWJsZWpzRm9yT2Y6IFV8dW5kZWZpbmVkfG51bGw7XG4gIHByaXZhdGUgX2RpZmZlcjogSXRlcmFibGVEaWZmZXI8VD58bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3RhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeTogVHJhY2tCeUZ1bmN0aW9uPFQ+IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIF9zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmU7XG4gIHByaXZhdGUgX2xhc3RSYW5nZTogUmFuZ2U7XG4gIHByaXZhdGUgX3JlbmRlcmVkSXRlbXM6IGFueVtdO1xuICAvKipcbiAgICogQXNzZXJ0cyB0aGUgY29ycmVjdCB0eXBlIG9mIHRoZSBjb250ZXh0IGZvciB0aGUgdGVtcGxhdGUgdGhhdCBgVGFibGVqc0Zvck9mYCB3aWxsIHJlbmRlci5cbiAgICpcbiAgICogVGhlIHByZXNlbmNlIG9mIHRoaXMgbWV0aG9kIGlzIGEgc2lnbmFsIHRvIHRoZSBJdnkgdGVtcGxhdGUgdHlwZS1jaGVjayBjb21waWxlciB0aGF0IHRoZVxuICAgKiBgVGFibGVqc0Zvck9mYCBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZSByZW5kZXJzIGl0cyB0ZW1wbGF0ZSB3aXRoIGEgc3BlY2lmaWMgY29udGV4dCB0eXBlLlxuICAgKi9cbiAgc3RhdGljIG5nVGVtcGxhdGVDb250ZXh0R3VhcmQ8VCwgVSBleHRlbmRzIE5nSXRlcmFibGU8VD4+KGRpcjogVmlydHVhbEZvckRpcmVjdGl2ZTxULCBVPiwgY3R4OiBhbnkpOlxuICAgICAgY3R4IGlzIFRhYmxlanNGb3JPZkNvbnRleHQ8VCwgVT4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVmZXJlbmNlIHRvIHRoZSB0ZW1wbGF0ZSB0aGF0IGlzIHN0YW1wZWQgb3V0IGZvciBlYWNoIGl0ZW0gaW4gdGhlIGl0ZXJhYmxlLlxuICAgKiBAc2VlIFt0ZW1wbGF0ZSByZWZlcmVuY2UgdmFyaWFibGVdKGd1aWRlL3RlbXBsYXRlLXJlZmVyZW5jZS12YXJpYWJsZXMpXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdGFibGVqc1ZpcnR1YWxGb3JUZW1wbGF0ZSh2YWx1ZTogVGVtcGxhdGVSZWY8VGFibGVqc0Zvck9mQ29udGV4dDxULCBVPj4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxUYWJsZWpzRm9yT2ZDb250ZXh0PFQsIFU+PiB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IHRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeSgpOiBUcmFja0J5RnVuY3Rpb248VD4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl90YWJsZWpzVmlydHVhbEZvclRyYWNrQnk7XG4gIH1cbiAgc2V0IHRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeShmbjogVHJhY2tCeUZ1bmN0aW9uPFQ+IHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fdGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5ID0gZm4gP1xuICAgICAgICAoaW5kZXgsIGl0ZW0pID0+IGZuKGluZGV4ICsgKHRoaXMuX2xhc3RSYW5nZSA/IHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghIDogMCksIGl0ZW0pIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5fb25SZW5kZXJlZERhdGFDaGFuZ2UoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIF92aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgcHVibGljIF90ZW1wbGF0ZTogVGVtcGxhdGVSZWY8VGFibGVqc0Zvck9mQ29udGV4dDxULCBVPj4sXG4gICAgICBwcml2YXRlIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBwcml2YXRlIGRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2U6IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgd2hpbGUgKHBhcmVudCAhPT0gbnVsbCAmJiBwYXJlbnQgIT09IHVuZGVmaW5lZCAmJiBwYXJlbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwgfHwgcGFyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignTm8gc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgZm91bmQgZm9yIHRhYmxlanNGb3JPZi4gIERlY2xhcmUgYSBzY3JvbGxWaWV3cG9ydCB1c2luZyB0aGUgc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSBwYXJlbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmU7XG4gICAgICAgICAgdGhpcy52aXJ0dWFsTmV4dXMgPSB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2Uuc2V0VmlydHVhbE5leHVzKHRoaXMsIHRoaXMuX3Njcm9sbFZpZXdwb3J0RGlyZWN0aXZlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0UmFuZ2UgPSB0aGlzLl9zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZS5yYW5nZTtcblxuICAgICAgICAgIHRoaXMucmFuZ2VVcGRhdGVkU3Vic2NyaXB0aW9uJCA9IHRoaXMuX3Njcm9sbFZpZXdwb3J0RGlyZWN0aXZlLnJhbmdlVXBkYXRlZC5zdWJzY3JpYmUocmFuZ2VPYmogPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VJc0RpZmZlcmVudCh0aGlzLl9sYXN0UmFuZ2UsIHJhbmdlT2JqLnJhbmdlKSkge1xuICAgICAgICAgICAgICB0aGlzLl9sYXN0UmFuZ2UgPSByYW5nZU9iai5yYW5nZTtcbiAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyZWRJdGVtcyA9IEFycmF5LmZyb20odGhpcy5fdGFibGVqc0Zvck9mIGFzIEl0ZXJhYmxlPGFueT4pLnNsaWNlKHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghLCB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEpO1xuICAgICAgICAgICAgICB0aGlzLl9vblJlbmRlcmVkRGF0YUNoYW5nZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICByYW5nZUlzRGlmZmVyZW50KHJhbmdlMTogUmFuZ2UsIHJhbmdlMjogUmFuZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcmFuZ2UxLmVuZEluZGV4ID09PSByYW5nZTIuZW5kSW5kZXggJiYgcmFuZ2UxLmV4dGVuZGVkRW5kSW5kZXggPT09IHJhbmdlMi5leHRlbmRlZEVuZEluZGV4ICYmIHJhbmdlMS5zdGFydEluZGV4ID09PSByYW5nZTIuc3RhcnRJbmRleCAmJiByYW5nZTEuZXh0ZW5kZWRTdGFydEluZGV4ID09PSByYW5nZTIuZXh0ZW5kZWRTdGFydEluZGV4O1xuICB9XG5cbiAgcmVuZGVyZWRJdGVtc05lZWRVcGRhdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlcmVkSXRlbXMubGVuZ3RoICE9PSB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEgLSB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ITtcbiAgfVxuXG4gIHByaXZhdGUgX29uUmVuZGVyZWREYXRhQ2hhbmdlKHVwZGF0ZVJlbmRlcmVkSXRlbXM6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLl9yZW5kZXJlZEl0ZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1cGRhdGVSZW5kZXJlZEl0ZW1zKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlZEl0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLl90YWJsZWpzRm9yT2YgYXMgSXRlcmFibGU8YW55Pikuc2xpY2UodGhpcy5fbGFzdFJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCEsIHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZEVuZEluZGV4ISk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGlmZmVyKSB7XG4gICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fcmVuZGVyZWRJdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZWpzVmlydHVhbEZvclRyYWNrQnkgPyB0aGlzLnRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeShpbmRleCwgaXRlbSkgOiBpdGVtO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgdGhpcy51cGRhdGVJdGVtcygpO1xuICB9XG5cbiAgdXBkYXRlSXRlbXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2RpZmZlcikge1xuICAgICAgY29uc3Qgc2Nyb2xsVG9PcmlnaW4gPSB0aGlzLl90YWJsZWpzRm9yT2YgIT09IHRoaXMuX2xhc3RUYWJsZWpzRm9yT2Y7XG4gICAgICBsZXQgZGlmZkNoYW5nZXM6IEl0ZXJhYmxlQ2hhbmdlczxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlcmVkSXRlbXNOZWVkVXBkYXRlKCkpIHtcbiAgICAgICAgdGhpcy5fb25SZW5kZXJlZERhdGFDaGFuZ2UoKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgZGlmZkNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9yZW5kZXJlZEl0ZW1zKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fcmVuZGVyZWRJdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeSA/IHRoaXMudGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5KGluZGV4LCBpdGVtKSA6IGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9PcmlnaW4pIHtcbiAgICAgICAgdGhpcy5fbGFzdFRhYmxlanNGb3JPZiA9IHRoaXMuX3RhYmxlanNGb3JPZjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWZmQ2hhbmdlcyB8fCBzY3JvbGxUb09yaWdpbikge1xuICAgICAgICB0aGlzLmNoYW5nZXMubmV4dCh7IHRhYmxlanNGb3JPZjogdGhpcy5fdGFibGVqc0Zvck9mLCBzY3JvbGxUb09yaWdpbiB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnJhbmdlVXBkYXRlZFN1YnNjcmlwdGlvbiQudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19