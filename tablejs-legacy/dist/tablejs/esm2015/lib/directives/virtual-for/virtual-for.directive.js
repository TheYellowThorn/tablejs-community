import { Directive, ElementRef, Input, IterableDiffers, TemplateRef, ViewContainerRef } from '@angular/core';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { Subject } from 'rxjs';
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
            catch (_a) {
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
VirtualForDirective.decorators = [
    { type: Directive, args: [{ selector: '[tablejsVirtualFor][tablejsVirtualForOf]' },] }
];
VirtualForDirective.ctorParameters = () => [
    { type: ViewContainerRef },
    { type: TemplateRef },
    { type: IterableDiffers },
    { type: ElementRef },
    { type: DirectiveRegistrationService }
];
VirtualForDirective.propDecorators = {
    tablejsVirtualForOf: [{ type: Input }],
    tablejsVirtualForTemplate: [{ type: Input }],
    tablejsVirtualForTrackBy: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvdmlydHVhbC1mb3IvdmlydHVhbC1mb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQVcsVUFBVSxFQUFFLEtBQUssRUFBbUMsZUFBZSxFQUF5QixXQUFXLEVBQW1CLGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlMLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHdFQUF3RSxDQUFDO0FBRXRILE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBSTdDLE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsWUFBbUIsU0FBWSxFQUFTLG1CQUFzQixFQUFTLEtBQWEsRUFBUyxLQUFhO1FBQXZGLGNBQVMsR0FBVCxTQUFTLENBQUc7UUFBUyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQUc7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUFHLENBQUM7SUFFOUcsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBR0QsTUFBTSxPQUFPLG1CQUFtQjtJQXlEOUIsWUFDVyxjQUFnQyxFQUNo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QUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7YUFDekU7U0FDRjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQy9DLENBQUM7OztZQTVJRixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsMENBQTBDLEVBQUM7OztZQTNCc0YsZ0JBQWdCO1lBQTlDLFdBQVc7WUFBbkQsZUFBZTtZQUFuRSxVQUFVO1lBQzlCLDRCQUE0Qjs7O2tDQWlDbEMsS0FBSzt3Q0E0QkwsS0FBSzt1Q0FXTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBEaXJlY3RpdmUsIERvQ2hlY2ssIEVsZW1lbnRSZWYsIElucHV0LCBJdGVyYWJsZUNoYW5nZXMsIEl0ZXJhYmxlRGlmZmVyLCBJdGVyYWJsZURpZmZlcnMsIE5nSXRlcmFibGUsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYsIFRyYWNrQnlGdW5jdGlvbiwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBJVmlydHVhbE5leHVzIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9pLXZpcnR1YWwtbmV4dXMnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vc2Nyb2xsLXZpZXdwb3J0L3Njcm9sbC12aWV3cG9ydC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL3Njcm9sbGluZy9yYW5nZSc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZWpzRm9yT2ZDb250ZXh0PFQsIFUgZXh0ZW5kcyBOZ0l0ZXJhYmxlPFQ+ID0gTmdJdGVyYWJsZTxUPj4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgJGltcGxpY2l0OiBULCBwdWJsaWMgdGFibGVqc1ZpcnR1YWxGb3JPZjogVSwgcHVibGljIGluZGV4OiBudW1iZXIsIHB1YmxpYyBjb3VudDogbnVtYmVyKSB7fVxuXG4gIGdldCBmaXJzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCA9PT0gMDtcbiAgfVxuXG4gIGdldCBsYXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZGV4ID09PSB0aGlzLmNvdW50IC0gMTtcbiAgfVxuXG4gIGdldCBldmVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZGV4ICUgMiA9PT0gMDtcbiAgfVxuXG4gIGdldCBvZGQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmV2ZW47XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbdGFibGVqc1ZpcnR1YWxGb3JdW3RhYmxlanNWaXJ0dWFsRm9yT2ZdJ30pXG5leHBvcnQgY2xhc3MgVmlydHVhbEZvckRpcmVjdGl2ZTxULCBVIGV4dGVuZHMgTmdJdGVyYWJsZTxUPiA9IE5nSXRlcmFibGU8VD4+IGltcGxlbWVudHMgRG9DaGVjaywgT25EZXN0cm95IHtcblxuICBwdWJsaWMgdmlydHVhbE5leHVzOiBJVmlydHVhbE5leHVzO1xuICBwdWJsaWMgY2hhbmdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwdWJsaWMgcmFuZ2VVcGRhdGVkU3Vic2NyaXB0aW9uJDogU3Vic2NyaXB0aW9uO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB0YWJsZWpzVmlydHVhbEZvck9mKHRhYmxlanNWaXJ0dWFsRm9yT2Y6IFV8dW5kZWZpbmVkfG51bGwpIHtcbiAgICB0aGlzLl90YWJsZWpzRm9yT2YgPSB0YWJsZWpzVmlydHVhbEZvck9mO1xuICAgIHRoaXMuX29uUmVuZGVyZWREYXRhQ2hhbmdlKCk7XG4gIH1cblxuICBwdWJsaWMgX3RhYmxlanNGb3JPZjogVXx1bmRlZmluZWR8bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2xhc3RUYWJsZWpzRm9yT2Y6IFV8dW5kZWZpbmVkfG51bGw7XG4gIHByaXZhdGUgX2RpZmZlcjogSXRlcmFibGVEaWZmZXI8VD58bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3RhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeTogVHJhY2tCeUZ1bmN0aW9uPFQ+IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIF9zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmU7XG4gIHByaXZhdGUgX2xhc3RSYW5nZTogUmFuZ2U7XG4gIHByaXZhdGUgX3JlbmRlcmVkSXRlbXM6IGFueVtdO1xuICAvKipcbiAgICogQXNzZXJ0cyB0aGUgY29ycmVjdCB0eXBlIG9mIHRoZSBjb250ZXh0IGZvciB0aGUgdGVtcGxhdGUgdGhhdCBgVGFibGVqc0Zvck9mYCB3aWxsIHJlbmRlci5cbiAgICpcbiAgICogVGhlIHByZXNlbmNlIG9mIHRoaXMgbWV0aG9kIGlzIGEgc2lnbmFsIHRvIHRoZSBJdnkgdGVtcGxhdGUgdHlwZS1jaGVjayBjb21waWxlciB0aGF0IHRoZVxuICAgKiBgVGFibGVqc0Zvck9mYCBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZSByZW5kZXJzIGl0cyB0ZW1wbGF0ZSB3aXRoIGEgc3BlY2lmaWMgY29udGV4dCB0eXBlLlxuICAgKi9cbiAgc3RhdGljIG5nVGVtcGxhdGVDb250ZXh0R3VhcmQ8VCwgVSBleHRlbmRzIE5nSXRlcmFibGU8VD4+KGRpcjogVmlydHVhbEZvckRpcmVjdGl2ZTxULCBVPiwgY3R4OiBhbnkpOlxuICAgICAgY3R4IGlzIFRhYmxlanNGb3JPZkNvbnRleHQ8VCwgVT4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVmZXJlbmNlIHRvIHRoZSB0ZW1wbGF0ZSB0aGF0IGlzIHN0YW1wZWQgb3V0IGZvciBlYWNoIGl0ZW0gaW4gdGhlIGl0ZXJhYmxlLlxuICAgKiBAc2VlIFt0ZW1wbGF0ZSByZWZlcmVuY2UgdmFyaWFibGVdKGd1aWRlL3RlbXBsYXRlLXJlZmVyZW5jZS12YXJpYWJsZXMpXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdGFibGVqc1ZpcnR1YWxGb3JUZW1wbGF0ZSh2YWx1ZTogVGVtcGxhdGVSZWY8VGFibGVqc0Zvck9mQ29udGV4dDxULCBVPj4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxUYWJsZWpzRm9yT2ZDb250ZXh0PFQsIFU+PiB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IHRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeSgpOiBUcmFja0J5RnVuY3Rpb248VD4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl90YWJsZWpzVmlydHVhbEZvclRyYWNrQnk7XG4gIH1cbiAgc2V0IHRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeShmbjogVHJhY2tCeUZ1bmN0aW9uPFQ+IHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fdGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5ID0gZm4gP1xuICAgICAgICAoaW5kZXgsIGl0ZW0pID0+IGZuKGluZGV4ICsgKHRoaXMuX2xhc3RSYW5nZSA/IHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghIDogMCksIGl0ZW0pIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5fb25SZW5kZXJlZERhdGFDaGFuZ2UoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIF92aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgcHVibGljIF90ZW1wbGF0ZTogVGVtcGxhdGVSZWY8VGFibGVqc0Zvck9mQ29udGV4dDxULCBVPj4sXG4gICAgICBwcml2YXRlIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBwcml2YXRlIGRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2U6IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgd2hpbGUgKHBhcmVudCAhPT0gbnVsbCAmJiBwYXJlbnQgIT09IHVuZGVmaW5lZCAmJiBwYXJlbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwgfHwgcGFyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignTm8gc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgZm91bmQgZm9yIHRhYmxlanNGb3JPZi4gIERlY2xhcmUgYSBzY3JvbGxWaWV3cG9ydCB1c2luZyB0aGUgc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSBwYXJlbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmU7XG4gICAgICAgICAgdGhpcy52aXJ0dWFsTmV4dXMgPSB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2Uuc2V0VmlydHVhbE5leHVzKHRoaXMsIHRoaXMuX3Njcm9sbFZpZXdwb3J0RGlyZWN0aXZlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0UmFuZ2UgPSB0aGlzLl9zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZS5yYW5nZTtcblxuICAgICAgICAgIHRoaXMucmFuZ2VVcGRhdGVkU3Vic2NyaXB0aW9uJCA9IHRoaXMuX3Njcm9sbFZpZXdwb3J0RGlyZWN0aXZlLnJhbmdlVXBkYXRlZC5zdWJzY3JpYmUocmFuZ2VPYmogPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VJc0RpZmZlcmVudCh0aGlzLl9sYXN0UmFuZ2UsIHJhbmdlT2JqLnJhbmdlKSkge1xuICAgICAgICAgICAgICB0aGlzLl9sYXN0UmFuZ2UgPSByYW5nZU9iai5yYW5nZTtcbiAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyZWRJdGVtcyA9IEFycmF5LmZyb20odGhpcy5fdGFibGVqc0Zvck9mIGFzIEl0ZXJhYmxlPGFueT4pLnNsaWNlKHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghLCB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEpO1xuICAgICAgICAgICAgICB0aGlzLl9vblJlbmRlcmVkRGF0YUNoYW5nZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICByYW5nZUlzRGlmZmVyZW50KHJhbmdlMTogUmFuZ2UsIHJhbmdlMjogUmFuZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcmFuZ2UxLmVuZEluZGV4ID09PSByYW5nZTIuZW5kSW5kZXggJiYgcmFuZ2UxLmV4dGVuZGVkRW5kSW5kZXggPT09IHJhbmdlMi5leHRlbmRlZEVuZEluZGV4ICYmIHJhbmdlMS5zdGFydEluZGV4ID09PSByYW5nZTIuc3RhcnRJbmRleCAmJiByYW5nZTEuZXh0ZW5kZWRTdGFydEluZGV4ID09PSByYW5nZTIuZXh0ZW5kZWRTdGFydEluZGV4O1xuICB9XG5cbiAgcmVuZGVyZWRJdGVtc05lZWRVcGRhdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlcmVkSXRlbXMubGVuZ3RoICE9PSB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEgLSB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ITtcbiAgfVxuXG4gIHByaXZhdGUgX29uUmVuZGVyZWREYXRhQ2hhbmdlKHVwZGF0ZVJlbmRlcmVkSXRlbXM6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLl9yZW5kZXJlZEl0ZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1cGRhdGVSZW5kZXJlZEl0ZW1zKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlZEl0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLl90YWJsZWpzRm9yT2YgYXMgSXRlcmFibGU8YW55Pikuc2xpY2UodGhpcy5fbGFzdFJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCEsIHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZEVuZEluZGV4ISk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGlmZmVyKSB7XG4gICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fcmVuZGVyZWRJdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZWpzVmlydHVhbEZvclRyYWNrQnkgPyB0aGlzLnRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeShpbmRleCwgaXRlbSkgOiBpdGVtO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgdGhpcy51cGRhdGVJdGVtcygpO1xuICB9XG5cbiAgdXBkYXRlSXRlbXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2RpZmZlcikge1xuICAgICAgY29uc3Qgc2Nyb2xsVG9PcmlnaW4gPSB0aGlzLl90YWJsZWpzRm9yT2YgIT09IHRoaXMuX2xhc3RUYWJsZWpzRm9yT2Y7XG4gICAgICBsZXQgZGlmZkNoYW5nZXM6IEl0ZXJhYmxlQ2hhbmdlczxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlcmVkSXRlbXNOZWVkVXBkYXRlKCkpIHtcbiAgICAgICAgdGhpcy5fb25SZW5kZXJlZERhdGFDaGFuZ2UoKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgZGlmZkNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9yZW5kZXJlZEl0ZW1zKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fcmVuZGVyZWRJdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeSA/IHRoaXMudGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5KGluZGV4LCBpdGVtKSA6IGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9PcmlnaW4pIHtcbiAgICAgICAgdGhpcy5fbGFzdFRhYmxlanNGb3JPZiA9IHRoaXMuX3RhYmxlanNGb3JPZjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWZmQ2hhbmdlcyB8fCBzY3JvbGxUb09yaWdpbikge1xuICAgICAgICB0aGlzLmNoYW5nZXMubmV4dCh7IHRhYmxlanNGb3JPZjogdGhpcy5fdGFibGVqc0Zvck9mLCBzY3JvbGxUb09yaWdpbiB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnJhbmdlVXBkYXRlZFN1YnNjcmlwdGlvbiQudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19