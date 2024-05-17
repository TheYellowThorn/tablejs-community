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
        this._parent = this._viewContainer.element.nativeElement.parentElement;
        while (this._parent !== null && this._parent !== undefined && this._parent.scrollViewportDirective === undefined) {
            this._parent = this._parent.parentElement;
        }
        if (this._parent === null || this._parent === undefined) {
            throw Error('No scrollViewportDirective found for tablejsForOf.  Declare a scrollViewport using the scrollViewportDirective.');
        }
        else {
            this._scrollViewportDirective = this._parent.scrollViewportDirective;
            this.directiveRegistrationService.setVirtualNexus(this, this._scrollViewportDirective);
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
        this._lastTablejsForOf = null;
        this._tablejsForOf = null;
        this._differ = null;
        this._scrollViewportDirective = null;
        this._renderedItems = [];
        this._template = null;
        this._tablejsVirtualForTrackBy = null;
        if (this._parent) {
            this._parent.scrollViewportDirective = null;
            this._parent = null;
        }
        if (this.rangeUpdatedSubscription$) {
            this.rangeUpdatedSubscription$.unsubscribe();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvdmlydHVhbC1mb3IvdmlydHVhbC1mb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQXVCLEtBQUssRUFBMEgsTUFBTSxlQUFlLENBQUM7QUFHOUwsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7OztBQUk3QyxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFlBQW1CLFNBQVksRUFBUyxtQkFBc0IsRUFBUyxLQUFhLEVBQVMsS0FBYTtRQUF2RixjQUFTLEdBQVQsU0FBUyxDQUFHO1FBQVMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFHO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBRTlHLElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksR0FBRztRQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3BCLENBQUM7Q0FDRjtBQUdELE1BQU0sT0FBTyxtQkFBbUI7SUFNOUIsSUFDSSxtQkFBbUIsQ0FBQyxtQkFBcUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztRQUN6QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBVUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsc0JBQXNCLENBQTZCLEdBQThCLEVBQUUsR0FBUTtRQUVoRyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUNJLHlCQUF5QixDQUFDLEtBQTZDO1FBQ3pFLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQW1ELENBQUM7SUFDbEUsQ0FBQztJQUVELElBQ0ksd0JBQXdCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDO0lBQ3hDLENBQUM7SUFDRCxJQUFJLHdCQUF3QixDQUFDLEVBQXlDO1FBQ3BFLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNqQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hHLFNBQVMsQ0FBQztRQUVkLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxZQUNXLGNBQWdDLEVBQ2hDLFNBQXdELEVBQ3ZELFFBQXlCLEVBQ3pCLFVBQXNCLEVBQ3RCLDRCQUEwRDtRQUozRCxtQkFBYyxHQUFkLGNBQWMsQ0FBa0I7UUFDaEMsY0FBUyxHQUFULFNBQVMsQ0FBK0M7UUFDdkQsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7UUFDekIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixpQ0FBNEIsR0FBNUIsNEJBQTRCLENBQThCO1FBNUQvRCxZQUFPLEdBQWlCLElBQUksT0FBTyxFQUFPLENBQUM7UUFTM0Msa0JBQWEsR0FBcUIsSUFBSSxDQUFDO1FBRXRDLFlBQU8sR0FBMkIsSUFBSSxDQUFDO1FBbUR6QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7UUFFdkUsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSyxJQUFJLENBQUMsT0FBZSxDQUFDLHVCQUF1QixLQUFLLFNBQVMsRUFBRTtZQUN6SCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2RCxNQUFNLEtBQUssQ0FBQyxpSEFBaUgsQ0FBQyxDQUFDO1NBQ2hJO2FBQU07WUFFTCxJQUFJLENBQUMsd0JBQXdCLEdBQUksSUFBSSxDQUFDLE9BQWUsQ0FBQyx1QkFBdUIsQ0FBQztZQUM5RSxJQUFJLENBQUMsNEJBQTRCLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsd0JBQXlCLENBQUMsQ0FBQztZQUV4RixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx3QkFBeUIsQ0FBQyxLQUFLLENBQUM7WUFFdkQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyx3QkFBeUIsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNoRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDMUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO29CQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQThCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBbUIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFpQixDQUFDLENBQUM7b0JBQ3BKLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbkM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVMLGdCQUFnQixDQUFDLE1BQWEsRUFBRSxNQUFhO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsS0FBSyxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsS0FBSyxNQUFNLENBQUMsa0JBQWtCLENBQUM7SUFDMU0sQ0FBQztJQUVELHVCQUF1QjtRQUNyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBbUIsQ0FBQztJQUNoSCxDQUFDO0lBRU8scUJBQXFCLENBQUMsc0JBQStCLElBQUk7UUFDL0QsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBQ0QsSUFBSSxtQkFBbUIsRUFBRTtZQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQThCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBbUIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFpQixDQUFDLENBQUM7U0FDcko7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzVFLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDM0YsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ3JFLElBQUksV0FBVyxHQUFnQyxJQUFJLENBQUM7WUFFcEQsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7YUFDOUI7WUFFRCxJQUFJO2dCQUNGLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDdEQ7WUFBQyxNQUFNO2dCQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtvQkFDNUUsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDM0YsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUVELElBQUksY0FBYyxFQUFFO2dCQUNsQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzthQUM3QztZQUNELElBQUksV0FBVyxJQUFJLGNBQWMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2FBQ3pFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNmLElBQUksQ0FBQyxPQUFlLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7WUFDbEMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzlDO0lBRUgsQ0FBQzs7Z0hBOUpVLG1CQUFtQjtvR0FBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsMENBQTBDLEVBQUM7bU9BUTNELG1CQUFtQjtzQkFEdEIsS0FBSztnQkE4QkYseUJBQXlCO3NCQUQ1QixLQUFLO2dCQVlGLHdCQUF3QjtzQkFEM0IsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgRGlyZWN0aXZlLCBEb0NoZWNrLCBFbGVtZW50UmVmLCBJbnB1dCwgSXRlcmFibGVDaGFuZ2VzLCBJdGVyYWJsZURpZmZlciwgSXRlcmFibGVEaWZmZXJzLCBOZ0l0ZXJhYmxlLCBPbkRlc3Ryb3ksIFRlbXBsYXRlUmVmLCBUcmFja0J5RnVuY3Rpb24sIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSVZpcnR1YWxOZXh1cyB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvaS12aXJ0dWFsLW5leHVzJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgfSBmcm9tICcuLy4uL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy9zY3JvbGxpbmcvcmFuZ2UnO1xuXG5leHBvcnQgY2xhc3MgVGFibGVqc0Zvck9mQ29udGV4dDxULCBVIGV4dGVuZHMgTmdJdGVyYWJsZTxUPiA9IE5nSXRlcmFibGU8VD4+IHtcbiAgY29uc3RydWN0b3IocHVibGljICRpbXBsaWNpdDogVCwgcHVibGljIHRhYmxlanNWaXJ0dWFsRm9yT2Y6IFUsIHB1YmxpYyBpbmRleDogbnVtYmVyLCBwdWJsaWMgY291bnQ6IG51bWJlcikge31cblxuICBnZXQgZmlyc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZXggPT09IDA7XG4gIH1cblxuICBnZXQgbGFzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCA9PT0gdGhpcy5jb3VudCAtIDE7XG4gIH1cblxuICBnZXQgZXZlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCAlIDIgPT09IDA7XG4gIH1cblxuICBnZXQgb2RkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5ldmVuO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW3RhYmxlanNWaXJ0dWFsRm9yXVt0YWJsZWpzVmlydHVhbEZvck9mXSd9KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxGb3JEaXJlY3RpdmU8VCwgVSBleHRlbmRzIE5nSXRlcmFibGU8VD4gPSBOZ0l0ZXJhYmxlPFQ+PiBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIHZpcnR1YWxOZXh1czogSVZpcnR1YWxOZXh1cyB8IG51bGw7XG4gIHB1YmxpYyBjaGFuZ2VzOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHB1YmxpYyByYW5nZVVwZGF0ZWRTdWJzY3JpcHRpb24kOiBTdWJzY3JpcHRpb247XG5cbiAgQElucHV0KClcbiAgc2V0IHRhYmxlanNWaXJ0dWFsRm9yT2YodGFibGVqc1ZpcnR1YWxGb3JPZjogVXx1bmRlZmluZWR8bnVsbCkge1xuICAgIHRoaXMuX3RhYmxlanNGb3JPZiA9IHRhYmxlanNWaXJ0dWFsRm9yT2Y7XG4gICAgdGhpcy5fb25SZW5kZXJlZERhdGFDaGFuZ2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBfdGFibGVqc0Zvck9mOiBVfHVuZGVmaW5lZHxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfbGFzdFRhYmxlanNGb3JPZjogVXx1bmRlZmluZWR8bnVsbDtcbiAgcHJpdmF0ZSBfZGlmZmVyOiBJdGVyYWJsZURpZmZlcjxUPnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfdGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5OiBUcmFja0J5RnVuY3Rpb248VD4gfCB1bmRlZmluZWQgfCBudWxsO1xuICBwcml2YXRlIF9zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgfCB1bmRlZmluZWQgfCBudWxsO1xuICBwcml2YXRlIF9sYXN0UmFuZ2U6IFJhbmdlO1xuICBwcml2YXRlIF9yZW5kZXJlZEl0ZW1zOiBhbnlbXTtcbiAgcHJpdmF0ZSBfcGFyZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB8IG51bGw7XG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoZSBjb3JyZWN0IHR5cGUgb2YgdGhlIGNvbnRleHQgZm9yIHRoZSB0ZW1wbGF0ZSB0aGF0IGBUYWJsZWpzRm9yT2ZgIHdpbGwgcmVuZGVyLlxuICAgKlxuICAgKiBUaGUgcHJlc2VuY2Ugb2YgdGhpcyBtZXRob2QgaXMgYSBzaWduYWwgdG8gdGhlIEl2eSB0ZW1wbGF0ZSB0eXBlLWNoZWNrIGNvbXBpbGVyIHRoYXQgdGhlXG4gICAqIGBUYWJsZWpzRm9yT2ZgIHN0cnVjdHVyYWwgZGlyZWN0aXZlIHJlbmRlcnMgaXRzIHRlbXBsYXRlIHdpdGggYSBzcGVjaWZpYyBjb250ZXh0IHR5cGUuXG4gICAqL1xuICBzdGF0aWMgbmdUZW1wbGF0ZUNvbnRleHRHdWFyZDxULCBVIGV4dGVuZHMgTmdJdGVyYWJsZTxUPj4oZGlyOiBWaXJ0dWFsRm9yRGlyZWN0aXZlPFQsIFU+LCBjdHg6IGFueSk6XG4gICAgICBjdHggaXMgVGFibGVqc0Zvck9mQ29udGV4dDxULCBVPiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIHRlbXBsYXRlIHRoYXQgaXMgc3RhbXBlZCBvdXQgZm9yIGVhY2ggaXRlbSBpbiB0aGUgaXRlcmFibGUuXG4gICAqIEBzZWUgW3RlbXBsYXRlIHJlZmVyZW5jZSB2YXJpYWJsZV0oZ3VpZGUvdGVtcGxhdGUtcmVmZXJlbmNlLXZhcmlhYmxlcylcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB0YWJsZWpzVmlydHVhbEZvclRlbXBsYXRlKHZhbHVlOiBUZW1wbGF0ZVJlZjxUYWJsZWpzRm9yT2ZDb250ZXh0PFQsIFU+Pikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fdGVtcGxhdGUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPFRhYmxlanNGb3JPZkNvbnRleHQ8VCwgVT4+IHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGUgYXMgVGVtcGxhdGVSZWY8VGFibGVqc0Zvck9mQ29udGV4dDxULCBVPj47XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgdGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5KCk6IFRyYWNrQnlGdW5jdGlvbjxUPiB8IHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl90YWJsZWpzVmlydHVhbEZvclRyYWNrQnk7XG4gIH1cbiAgc2V0IHRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeShmbjogVHJhY2tCeUZ1bmN0aW9uPFQ+IHwgdW5kZWZpbmVkIHwgbnVsbCkge1xuICAgIHRoaXMuX3RhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeSA9IGZuID9cbiAgICAgICAgKGluZGV4LCBpdGVtKSA9PiBmbihpbmRleCArICh0aGlzLl9sYXN0UmFuZ2UgPyB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ISA6IDApLCBpdGVtKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX29uUmVuZGVyZWREYXRhQ2hhbmdlKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBfdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgIHB1YmxpYyBfdGVtcGxhdGU6IFRlbXBsYXRlUmVmPFRhYmxlanNGb3JPZkNvbnRleHQ8VCwgVT4+IHwgbnVsbCxcbiAgICAgIHByaXZhdGUgX2RpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIHByaXZhdGUgZGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZTogRGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZSkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdGhpcy5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICAgICAgICB3aGlsZSAodGhpcy5fcGFyZW50ICE9PSBudWxsICYmIHRoaXMuX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmICh0aGlzLl9wYXJlbnQgYXMgYW55KS5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5fcGFyZW50ID0gdGhpcy5fcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCA9PT0gbnVsbCB8fCB0aGlzLl9wYXJlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IEVycm9yKCdObyBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSBmb3VuZCBmb3IgdGFibGVqc0Zvck9mLiAgRGVjbGFyZSBhIHNjcm9sbFZpZXdwb3J0IHVzaW5nIHRoZSBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZS4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLl9zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9ICh0aGlzLl9wYXJlbnQgYXMgYW55KS5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTtcbiAgICAgICAgICB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2Uuc2V0VmlydHVhbE5leHVzKHRoaXMsIHRoaXMuX3Njcm9sbFZpZXdwb3J0RGlyZWN0aXZlISk7XG4gICAgICAgICAgXG4gICAgICAgICAgdGhpcy5fbGFzdFJhbmdlID0gdGhpcy5fc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUhLnJhbmdlO1xuXG4gICAgICAgICAgdGhpcy5yYW5nZVVwZGF0ZWRTdWJzY3JpcHRpb24kID0gdGhpcy5fc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUhLnJhbmdlVXBkYXRlZC5zdWJzY3JpYmUocmFuZ2VPYmogPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VJc0RpZmZlcmVudCh0aGlzLl9sYXN0UmFuZ2UsIHJhbmdlT2JqLnJhbmdlKSkge1xuICAgICAgICAgICAgICB0aGlzLl9sYXN0UmFuZ2UgPSByYW5nZU9iai5yYW5nZTtcbiAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyZWRJdGVtcyA9IEFycmF5LmZyb20odGhpcy5fdGFibGVqc0Zvck9mIGFzIEl0ZXJhYmxlPGFueT4pLnNsaWNlKHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghLCB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEpO1xuICAgICAgICAgICAgICB0aGlzLl9vblJlbmRlcmVkRGF0YUNoYW5nZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICByYW5nZUlzRGlmZmVyZW50KHJhbmdlMTogUmFuZ2UsIHJhbmdlMjogUmFuZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcmFuZ2UxLmVuZEluZGV4ID09PSByYW5nZTIuZW5kSW5kZXggJiYgcmFuZ2UxLmV4dGVuZGVkRW5kSW5kZXggPT09IHJhbmdlMi5leHRlbmRlZEVuZEluZGV4ICYmIHJhbmdlMS5zdGFydEluZGV4ID09PSByYW5nZTIuc3RhcnRJbmRleCAmJiByYW5nZTEuZXh0ZW5kZWRTdGFydEluZGV4ID09PSByYW5nZTIuZXh0ZW5kZWRTdGFydEluZGV4O1xuICB9XG5cbiAgcmVuZGVyZWRJdGVtc05lZWRVcGRhdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlcmVkSXRlbXMubGVuZ3RoICE9PSB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEgLSB0aGlzLl9sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ITtcbiAgfVxuXG4gIHByaXZhdGUgX29uUmVuZGVyZWREYXRhQ2hhbmdlKHVwZGF0ZVJlbmRlcmVkSXRlbXM6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLl9yZW5kZXJlZEl0ZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1cGRhdGVSZW5kZXJlZEl0ZW1zKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlZEl0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLl90YWJsZWpzRm9yT2YgYXMgSXRlcmFibGU8YW55Pikuc2xpY2UodGhpcy5fbGFzdFJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCEsIHRoaXMuX2xhc3RSYW5nZS5leHRlbmRlZEVuZEluZGV4ISk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGlmZmVyKSB7XG4gICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fcmVuZGVyZWRJdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZWpzVmlydHVhbEZvclRyYWNrQnkgPyB0aGlzLnRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeShpbmRleCwgaXRlbSkgOiBpdGVtO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgdGhpcy51cGRhdGVJdGVtcygpO1xuICB9XG5cbiAgdXBkYXRlSXRlbXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2RpZmZlcikge1xuICAgICAgY29uc3Qgc2Nyb2xsVG9PcmlnaW4gPSB0aGlzLl90YWJsZWpzRm9yT2YgIT09IHRoaXMuX2xhc3RUYWJsZWpzRm9yT2Y7XG4gICAgICBsZXQgZGlmZkNoYW5nZXM6IEl0ZXJhYmxlQ2hhbmdlczxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlcmVkSXRlbXNOZWVkVXBkYXRlKCkpIHtcbiAgICAgICAgdGhpcy5fb25SZW5kZXJlZERhdGFDaGFuZ2UoKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgZGlmZkNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9yZW5kZXJlZEl0ZW1zKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fcmVuZGVyZWRJdGVtcykuY3JlYXRlKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRhYmxlanNWaXJ0dWFsRm9yVHJhY2tCeSA/IHRoaXMudGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5KGluZGV4LCBpdGVtKSA6IGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9PcmlnaW4pIHtcbiAgICAgICAgdGhpcy5fbGFzdFRhYmxlanNGb3JPZiA9IHRoaXMuX3RhYmxlanNGb3JPZjtcbiAgICAgIH1cbiAgICAgIGlmIChkaWZmQ2hhbmdlcyB8fCBzY3JvbGxUb09yaWdpbikge1xuICAgICAgICB0aGlzLmNoYW5nZXMubmV4dCh7IHRhYmxlanNGb3JPZjogdGhpcy5fdGFibGVqc0Zvck9mLCBzY3JvbGxUb09yaWdpbiB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9sYXN0VGFibGVqc0Zvck9mID0gbnVsbDtcbiAgICB0aGlzLl90YWJsZWpzRm9yT2YgPSBudWxsO1xuICAgIHRoaXMuX2RpZmZlciA9IG51bGw7XG4gICAgdGhpcy5fc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSBudWxsO1xuICAgIHRoaXMuX3JlbmRlcmVkSXRlbXMgPSBbXTtcbiAgICB0aGlzLl90ZW1wbGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fdGFibGVqc1ZpcnR1YWxGb3JUcmFja0J5ID0gbnVsbDtcbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAodGhpcy5fcGFyZW50IGFzIGFueSkuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSBudWxsO1xuICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB9ICAgXG5cbiAgICBpZiAodGhpcy5yYW5nZVVwZGF0ZWRTdWJzY3JpcHRpb24kKSB7XG4gICAgICB0aGlzLnJhbmdlVXBkYXRlZFN1YnNjcmlwdGlvbiQudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgXG4gIH1cbn1cbiJdfQ==