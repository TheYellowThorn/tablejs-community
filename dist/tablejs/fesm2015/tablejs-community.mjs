import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ViewContainerRef, ViewChild, Injectable, Directive, Input, EventEmitter, Inject, ContentChild, Output, InjectionToken, ElementRef, Injector, HostListener, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { ResizeSensor } from 'css-element-queries';
import * as i3 from '@angular/cdk/overlay';
import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BrowserModule } from '@angular/platform-browser';

class HorizResizeGripComponent {
    constructor() { }
}
HorizResizeGripComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: HorizResizeGripComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
HorizResizeGripComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: HorizResizeGripComponent, selector: "tablejs-horiz-resize-grip", host: { classAttribute: "resize-grip" }, ngImport: i0, template: "<i class=\"fas fa-angle-left fa-xs\"></i><i class=\"fas fa-angle-right fa-xs\"></i>", styles: [".resize-grip{cursor:ew-resize;position:absolute;right:0;top:0;height:100%;width:30px;padding:0;margin:0;display:block}.resize-grip i{left:.5px;color:#fff;position:relative;top:50%;transform:translateY(-8px)}\n"], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: HorizResizeGripComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-horiz-resize-grip', host: { class: 'resize-grip' }, encapsulation: ViewEncapsulation.None, template: "<i class=\"fas fa-angle-left fa-xs\"></i><i class=\"fas fa-angle-right fa-xs\"></i>", styles: [".resize-grip{cursor:ew-resize;position:absolute;right:0;top:0;height:100%;width:30px;padding:0;margin:0;display:block}.resize-grip i{left:.5px;color:#fff;position:relative;top:50%;transform:translateY(-8px)}\n"] }]
        }], ctorParameters: function () { return []; } });

class ReorderGripComponent {
    constructor() { }
}
ReorderGripComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderGripComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ReorderGripComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: ReorderGripComponent, selector: "tablejs-reorder-grip", host: { classAttribute: "col-dots-container" }, ngImport: i0, template: "<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>", styles: ["@charset \"UTF-8\";.col-dots-container{cursor:move;cursor:grab;position:absolute;display:block;left:0;top:0;height:100%;width:30px;z-index:5}.col-dots-container .dots-3{display:inline-block;opacity:.5}th:hover .dots-3{display:inline-block;opacity:1}.dots-3{position:relative;top:50%;width:4px;display:inline-block;overflow:hidden;transform:translateY(-50%)}.dots-3:after{content:\"\\2807\";font-size:14px}\n"], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderGripComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-reorder-grip', host: { class: 'col-dots-container' }, encapsulation: ViewEncapsulation.None, template: "<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>", styles: ["@charset \"UTF-8\";.col-dots-container{cursor:move;cursor:grab;position:absolute;display:block;left:0;top:0;height:100%;width:30px;z-index:5}.col-dots-container .dots-3{display:inline-block;opacity:.5}th:hover .dots-3{display:inline-block;opacity:1}.dots-3{position:relative;top:50%;width:4px;display:inline-block;overflow:hidden;transform:translateY(-50%)}.dots-3:after{content:\"\\2807\";font-size:14px}\n"] }]
        }], ctorParameters: function () { return []; } });

class DragAndDropGhostComponent {
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
DragAndDropGhostComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DragAndDropGhostComponent, deps: [{ token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
DragAndDropGhostComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: DragAndDropGhostComponent, selector: "tablejs-drag-and-drop-ghost", host: { classAttribute: "drag-and-drop-ghost" }, viewQueries: [{ propertyName: "ref", first: true, predicate: ["ref"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: "<div class=\"drag-and-drop-ghost\" [ngStyle]=\"{ 'transform': getTransform() }\">\n    <div #ref style=\"display: none;\"></div>\n</div>\n", styles: [".drag-and-drop-ghost{position:fixed;display:block;width:100%;height:100px;top:0;left:0;padding:0;margin:0;align-items:center;cursor:move!important;font-size:14px;overflow:visible;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;z-index:10;opacity:1}.drag-and-drop-ghost img{pointer-events:none;position:inherit;border:1px solid #dddddd}\n"], dependencies: [{ kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DragAndDropGhostComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-drag-and-drop-ghost', encapsulation: ViewEncapsulation.None, host: { class: 'drag-and-drop-ghost' }, template: "<div class=\"drag-and-drop-ghost\" [ngStyle]=\"{ 'transform': getTransform() }\">\n    <div #ref style=\"display: none;\"></div>\n</div>\n", styles: [".drag-and-drop-ghost{position:fixed;display:block;width:100%;height:100px;top:0;left:0;padding:0;margin:0;align-items:center;cursor:move!important;font-size:14px;overflow:visible;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;z-index:10;opacity:1}.drag-and-drop-ghost img{pointer-events:none;position:inherit;border:1px solid #dddddd}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { ref: [{
                type: ViewChild,
                args: ['ref', { read: ViewContainerRef }]
            }] } });

class TablejsGridProxy {
    constructor() {
    }
}
TablejsGridProxy.GRID_COUNT = 0;

class ColumnReorderEvent {
    constructor() { }
}
ColumnReorderEvent.ON_REORDER = 'onReorder';
ColumnReorderEvent.ON_REORDER_START = 'onReorderStart';
ColumnReorderEvent.ON_REORDER_END = 'onReorderEnd';

class ColumnResizeEvent {
}
ColumnResizeEvent.ON_RESIZE = 'onResize';
ColumnResizeEvent.ON_RESIZE_START = 'onResizeStart';
ColumnResizeEvent.ON_RESIZE_END = 'onResizeEnd';

class GridEvent {
}
GridEvent.ON_INITIALIZED = 'onInitialized';

class GridService {
    constructor() {
        this.linkedDirectiveObjs = {};
        this.containsInitialWidthSettings = new BehaviorSubject(undefined);
    }
    getParentTablejsGridDirective(el) {
        while (el !== null && el.getAttribute('tablejsGrid') === null) {
            el = el.parentElement;
        }
        return el;
    }
    triggerHasInitialWidths(hasWidths) {
        this.containsInitialWidthSettings.next(hasWidths);
    }
}
GridService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
GridService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class DirectiveRegistrationService {
    constructor(gridService) {
        this.gridService = gridService;
        this.nexuses = [];
    }
    setVirtualNexus(virtualForDirective, scrollViewportDirective) {
        const nexus = {
            scrollViewportDirective,
            virtualForDirective
        };
        this.nexuses.push(nexus);
        return nexus;
    }
    getVirtualNexusFromViewport(scrollViewportDirective) {
        return this.nexuses.filter((nexus) => nexus.scrollViewportDirective === scrollViewportDirective)[0];
    }
    registerNodeAttributes(node) {
        if (node.getAttribute) {
            if (node.getAttribute('reordergrip') !== null) {
                this.registerReorderGripOnGridDirective(node, true);
            }
            if (node.getAttribute('resizablegrip') !== null) {
                this.registerResizableGripOnGridDirective(node, true);
            }
            if (node.getAttribute('tablejsDataColClasses') !== null) {
                this.registerDataColClassesOnGridDirective(node, true);
            }
            if (node.getAttribute('tablejsDataColClass') !== null) {
                this.registerDataColClassOnGridDirective(node, true);
            }
            if (node.getAttribute('tablejsGridRow') !== null) {
                this.registerRowsOnGridDirective(node, true);
            }
        }
    }
    registerReorderGripOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].addReorderGrip(node, fromMutation);
        }
    }
    registerResizableGripOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].addResizableGrip(node, fromMutation);
        }
    }
    registerDataColClassesOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        node.dataClasses = node.getAttribute('tablejsdatacolclasses').replace(new RegExp(' ', 'g'), '').split(',');
        el['gridDirective'].addColumnsWithDataClasses(node, fromMutation);
    }
    registerDataColClassOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (!el) {
            return;
        }
        const cls = node.getAttribute('tablejsDataColClass');
        if (cls) {
            node.classList.add(cls);
        }
        const initialWidth = node.getAttribute('initialWidth');
        this.gridService.triggerHasInitialWidths(initialWidth ? true : false);
        el['gridDirective'].initialWidths[cls] = initialWidth;
    }
    registerRowsOnGridDirective(node, fromMutation = false) {
        node.classList.add('reorderable-table-row');
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].addRow(node, fromMutation);
        }
    }
    registerViewportOnGridDirective(node) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].infiniteScrollViewports = [node];
        }
    }
}
DirectiveRegistrationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DirectiveRegistrationService, deps: [{ token: GridService }], target: i0.ɵɵFactoryTarget.Injectable });
DirectiveRegistrationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DirectiveRegistrationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DirectiveRegistrationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: GridService }]; } });

class TablejsForOfContext {
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
class VirtualForDirective {
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
VirtualForDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: VirtualForDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: i0.ElementRef }, { token: DirectiveRegistrationService }], target: i0.ɵɵFactoryTarget.Directive });
VirtualForDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: VirtualForDirective, selector: "[tablejsVirtualFor][tablejsVirtualForOf]", inputs: { tablejsVirtualForOf: "tablejsVirtualForOf", tablejsVirtualForTemplate: "tablejsVirtualForTemplate", tablejsVirtualForTrackBy: "tablejsVirtualForTrackBy" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: VirtualForDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[tablejsVirtualFor][tablejsVirtualForOf]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: i0.ElementRef }, { type: DirectiveRegistrationService }]; }, propDecorators: { tablejsVirtualForOf: [{
                type: Input
            }], tablejsVirtualForTemplate: [{
                type: Input
            }], tablejsVirtualForTrackBy: [{
                type: Input
            }] } });

class ScrollPrevSpacerComponent {
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

class ScrollViewportEvent {
}
ScrollViewportEvent.ON_ITEM_ADDED = 'onItemAdded';
ScrollViewportEvent.ON_ITEM_REMOVED = 'onItemRemoved';
ScrollViewportEvent.ON_ITEM_UPDATED = 'onItemUpdated';
ScrollViewportEvent.ON_RANGE_UPDATED = 'onRangeUpdated';
ScrollViewportEvent.ON_VIEWPORT_SCROLLED = 'onViewportScrolled';
ScrollViewportEvent.ON_VIEWPORT_READY = 'onViewportReady';
ScrollViewportEvent.ON_VIEWPORT_INITIALIZED = 'onViewportInitialized';

class ScrollDispatcherService {
    constructor() { }
    dispatchAddItemEvents(eventEmitter, element, i, viewport, viewportElement) {
        eventEmitter.emit({
            element,
            index: i,
            viewport,
            viewportElement
        });
        const itemAddedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_ADDED, {
            detail: {
                element,
                index: i,
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(itemAddedEvent);
    }
    dispatchUpdateItemEvents(eventEmitter, element, index, viewport, viewportElement) {
        eventEmitter.emit({
            element,
            index,
            viewport,
            viewportElement
        });
        const itemUpdatedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_UPDATED, {
            detail: {
                element,
                index,
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(itemUpdatedEvent);
    }
    dispatchRemoveItemEvents(eventEmitter, element, i, viewport, viewportElement) {
        eventEmitter.emit({
            element,
            index: i,
            viewport,
            viewportElement
        });
        const itemRemovedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_REMOVED, {
            detail: {
                element,
                index: i,
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(itemRemovedEvent);
    }
    dispatchViewportReadyEvents(eventEmitter, viewport, viewportElement) {
        eventEmitter.emit({
            viewport,
            viewportElement
        });
        const viewportReadyEvent = new CustomEvent(ScrollViewportEvent.ON_VIEWPORT_READY, {
            detail: {
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(viewportReadyEvent);
    }
    dispatchViewportInitializedEvents(eventEmitter, viewport, viewportElement) {
        eventEmitter.emit({
            viewport,
            viewportElement
        });
        const viewportInitializedEvent = new CustomEvent(ScrollViewportEvent.ON_VIEWPORT_INITIALIZED, {
            detail: {
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(viewportInitializedEvent);
    }
    dispatchRangeUpdateEvents(eventEmitter, range, viewport, viewportElement) {
        eventEmitter.emit({
            range,
            viewport,
            viewportElement
        });
        const rangeUpdatedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_ADDED, {
            detail: {
                range,
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(rangeUpdatedEvent);
    }
    dispatchViewportScrolledEvents(eventEmitter, scrollTop, overflow, viewport, viewportElement) {
        eventEmitter.emit({
            scrollTop,
            firstItemOverflow: overflow,
            viewport,
            viewportElement
        });
        const viewportScrolledEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_ADDED, {
            detail: {
                scrollTop,
                firstItemOverflow: overflow,
                viewport,
                viewportElement
            }
        });
        viewportElement.dispatchEvent(viewportScrolledEvent);
    }
}
ScrollDispatcherService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollDispatcherService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ScrollDispatcherService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollDispatcherService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollDispatcherService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class OperatingSystemService {
    constructor() { }
    getOS() {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        let os = null;
        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        }
        else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        }
        else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        }
        else if (/Android/.test(userAgent)) {
            os = 'Android';
        }
        else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }
        return os;
    }
    isMac() {
        return this.getOS() === 'Mac OS' || this.getOS() === 'iOS';
    }
    isPC() {
        return this.getOS() === 'Windows';
    }
}
OperatingSystemService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: OperatingSystemService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OperatingSystemService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: OperatingSystemService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: OperatingSystemService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class ScrollViewportDirective {
    get arrowUpSpeed() {
        return Number(this._arrowUpSpeed);
    }
    set arrowUpSpeed(value) {
        this._arrowUpSpeed = Number(value);
    }
    get arrowDownSpeed() {
        return Number(this._arrowDownSpeed);
    }
    set arrowDownSpeed(value) {
        this._arrowDownSpeed = Number(value);
    }
    get preItemOverflow() {
        return Number(this._preItemOverflow);
    }
    set preItemOverflow(value) {
        this._preItemOverflow = Number(value);
    }
    get postItemOverflow() {
        return Number(this._postItemOverflow);
    }
    set postItemOverflow(value) {
        this._postItemOverflow = Number(value);
    }
    get itemLoadLimit() {
        return Number(this._itemLoadLimit);
    }
    set itemLoadLimit(value) {
        this._itemLoadLimit = Number(value);
    }
    constructor(elementRef, gridService, document, directiveRegistrationService, scrollDispatcherService, operatingSystem, cdr, rendererFactory) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.document = document;
        this.directiveRegistrationService = directiveRegistrationService;
        this.scrollDispatcherService = scrollDispatcherService;
        this.operatingSystem = operatingSystem;
        this.cdr = cdr;
        this.rendererFactory = rendererFactory;
        this.templateRef = null;
        this.templateID = '';
        this.generateCloneMethod = null;
        this._arrowUpSpeed = 1;
        this._arrowDownSpeed = 1;
        this._preItemOverflow = 1;
        this._postItemOverflow = 1;
        this._itemLoadLimit = Infinity;
        this.items = null;
        // Custom Elements Inputs
        this.templateid = null;
        this.preitemoverflow = 1;
        this.postitemoverflow = 1;
        this.arrowupspeed = 1;
        this.arrowdownspeed = 1;
        this.itemloadlimit = Infinity;
        this.itemAdded = new EventEmitter();
        this.itemRemoved = new EventEmitter();
        this.itemUpdated = new EventEmitter();
        this.rangeUpdated = new EventEmitter();
        this.viewportScrolled = new EventEmitter();
        this.viewportReady = new EventEmitter();
        this.viewportInitialized = new EventEmitter();
        this.containerHeight = null;
        this.heightLookup = {};
        this.itemVisibilityLookup = {};
        this.listElm = null;
        this.listContent = null;
        this.prevSpacer = null;
        this.postSpacer = null;
        this.gridDirective = null;
        this.pauseViewportRenderUpdates = false;
        this.range = { startIndex: 0, endIndex: 1, extendedStartIndex: 0, extendedEndIndex: 1 };
        this.lastRange = { startIndex: this.range.startIndex, endIndex: this.range.endIndex, extendedStartIndex: this.range.extendedStartIndex, extendedEndIndex: this.range.extendedEndIndex };
        this.lastScrollTop = 0;
        this.currentScrollTop = 0;
        this.currentScrollChange = 0;
        this.template = null;
        this.estimatedFullContentHeight = 0;
        this.estimatedPreListHeight = 0;
        this.estimatedPostListHeight = 0;
        this.totalItemsCounted = 0;
        this.totalHeightCount = 0;
        this.itemName = '';
        this.overflowHeightCount = 0;
        this.scrollChangeByFirstIndexedItem = 0;
        this.lastVisibleItemHeight = Infinity;
        this.adjustedStartIndex = null;
        this.forcedEndIndex = undefined;
        this.placeholderObject = {};
        this.postItemOverflowCount = -1;
        this.preItemOverflowCount = -1;
        this.lastVisibleItemOverflow = 0;
        this.preOverflowHeight = 0;
        this.mouseIsOverViewport = false;
        this.lastHeight = 0;
        this.observer = null;
        this.handleMouseOver = null;
        this.handleMouseOut = null;
        this.handleKeyDown = null;
        this.cloneFromTemplateRef = false;
        this.viewportHasScrolled = false;
        this.templateContext = null;
        this.virtualNexus = null;
        this._cloneMethod = null;
        this.onTransitionEnd = (e) => {
        };
        this.onTransitionRun = (e) => {
        };
        this.onTransitionStart = (e) => {
        };
        this.onTransitionCancel = (e) => {
        };
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.elementRef.nativeElement.scrollViewportDirective = this;
    }
    handleScroll(e) {
        e.preventDefault();
        this.currentScrollTop = this.listContent.scrollTop;
        this.currentScrollChange = this.currentScrollTop - this.lastScrollTop;
        this.scrollChangeByFirstIndexedItem += this.currentScrollChange;
        this.lastVisibleItemOverflow -= this.currentScrollChange;
        const newRange = this.getRangeChange(this.scrollChangeByFirstIndexedItem);
        this.updateScrollFromRange(newRange);
        this.scrollDispatcherService.dispatchViewportScrolledEvents(this.viewportScrolled, this.lastScrollTop, this.scrollChangeByFirstIndexedItem, this, this.elementRef.nativeElement);
    }
    registerViewportToElement() {
        this.elementRef.nativeElement.scrollViewport = this;
    }
    attachMutationObserver() {
        const ths = this;
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                ths.updateMutations(mutation);
            });
        });
        this.observer.observe(this.listContent, {
            // configure it to listen to attribute changes
            attributes: true,
            subtree: true,
            childList: true
        });
    }
    updateMutations(mutation) {
        if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            addedNodes.forEach(node => {
                this.directiveRegistrationService.registerNodeAttributes(node);
                this.getChildNodes(node);
            });
        }
    }
    getChildNodes(node) {
        node.childNodes.forEach(childNode => {
            this.directiveRegistrationService.registerNodeAttributes(childNode);
            if (childNode.childNodes) {
                this.getChildNodes(childNode);
            }
        });
    }
    registerCustomElementsInputs(viewport) {
        this.templateID = viewport.getAttribute('templateID');
        this.preItemOverflow = Number(viewport.getAttribute('preItemOverflow'));
        this.postItemOverflow = Number(viewport.getAttribute('postItemOverflow'));
        this.itemLoadLimit = Number(viewport.getAttribute('itemLoadLimit'));
        this.arrowUpSpeed = Number(viewport.getAttribute('arrowUpSpeed'));
        this.arrowDownSpeed = Number(viewport.getAttribute('arrowDownSpeed'));
        this.fillViewportScrolling = viewport.getAttribute('fillViewportScrolling');
    }
    convertCustomElementsVariables() {
        if (this.templateid) {
            this.templateID = this.templateid;
        }
        if (this.preitemoverflow) {
            this.preItemOverflow = Number(this.preitemoverflow);
        }
        if (this.postitemoverflow) {
            this.postItemOverflow = Number(this.postitemoverflow);
        }
        if (this.arrowdownspeed) {
            this.arrowDownSpeed = Number(this.arrowdownspeed);
        }
        if (this.arrowupspeed) {
            this.arrowUpSpeed = Number(this.arrowupspeed);
        }
        if (this.itemloadlimit !== null) {
            this.itemLoadLimit = Number(this.itemloadlimit);
        }
    }
    createTBodies() {
        this.listElm = this.elementRef.nativeElement;
        let body = this.listElm.getElementsByTagName('tbody')[0];
        if (body) {
            body = body.getAttribute('tablejsViewport') !== null ? body : null;
        }
        this.listContent = body ? body : document.createElement('tbody');
        this.listContent.setAttribute('tablejsListContent', '');
        this.listContent.setAttribute('tablejsViewport', '');
        this.listContent.style.display = 'block';
        this.listContent.style.position = 'relative';
        this.listContent.style.height = '350px';
        this.listContent.style.overflowY = 'auto';
        this.listElm.appendChild(this.listContent);
        if (this.fillViewportScrolling !== undefined && this.fillViewportScrolling !== null) {
            const coverBody = document.createElement('tbody');
            coverBody.style.display = 'block';
            coverBody.style.position = 'absolute';
            coverBody.style.width = '100%';
            coverBody.style.height = '100%';
            coverBody.style.overflow = 'auto';
            coverBody.style.pointerEvents = 'none';
            coverBody.style.visibility = 'false';
            this.listElm.appendChild(coverBody);
        }
        this.directiveRegistrationService.registerViewportOnGridDirective(this.listContent);
        const componentRef = this.virtualNexus.virtualForDirective._viewContainer.createComponent(ScrollPrevSpacerComponent);
        this.virtualNexus.virtualForDirective._viewContainer.detach(0);
        const ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(componentRef.instance.template, undefined, 0);
        this.prevSpacer = ref.rootNodes[0];
        this.postSpacer = document.createElement('tr');
        this.postSpacer.setAttribute('tablejsPostSpacer', '');
        this.postSpacer.style.display = 'block';
        this.postSpacer.style.position = 'relative';
        this.listContent.appendChild(this.postSpacer);
    }
    addScrollHandler() {
        this.listContent.addEventListener('scroll', this.handleListContentScroll = (e) => {
            this.handleScroll(e);
        });
    }
    rerenderRowAt(index, updateScrollPosition = false) {
        if (!this.viewportHasScrolled) {
            return;
        }
        const ind = index - this.adjustedStartIndex;
        const itemName = 'item' + index;
        if (ind > this.items.length - 1 || this.itemVisibilityLookup[this.itemName] !== true) {
            return;
        }
        const indexMap = {};
        for (let i = 1; i < this.virtualNexus.virtualForDirective._viewContainer.length; i++) {
            indexMap[this.virtualNexus.virtualForDirective._viewContainer.get(i).rootNodes[0].index] = i;
        }
        ;
        const detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(indexMap[index]);
        const child = detachedRef.rootNodes[0];
        detachedRef.destroy();
        this.templateContext = new TablejsForOfContext(this.items[index], this.virtualNexus.virtualForDirective._tablejsForOf, index, this.items.length);
        const ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus.virtualForDirective._template, this.templateContext, indexMap[index]);
        this.virtualNexus.virtualForDirective._viewContainer.move(ref, indexMap[index]);
        let clone = ref.rootNodes[0];
        clone.index = index;
        this.cdr.detectChanges();
        this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, child, index, this, this.elementRef.nativeElement);
        const lookupHeight = clone.offsetHeight;
        const oldHeight = this.heightLookup[itemName];
        this.heightLookup[itemName] = lookupHeight;
        clone.lastHeight = lookupHeight;
        this.addResizeSensor(clone, index);
        if (oldHeight) {
            this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
        }
        else {
            this.updateEstimatedHeight(lookupHeight);
        }
        if (updateScrollPosition) {
            this.refreshViewport();
        }
        this.scrollDispatcherService.dispatchUpdateItemEvents(this.itemUpdated, clone, index, this, this.elementRef.nativeElement);
        this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, clone, index, this, this.elementRef.nativeElement);
    }
    viewportRendered() {
        this.virtualNexus = this.directiveRegistrationService.getVirtualNexusFromViewport(this);
        if (this.virtualNexus && this.virtualNexus.virtualForDirective) {
            this.items = this.virtualNexus.virtualForDirective._tablejsForOf;
            this.virtualForChangesSubscription$ = this.virtualNexus.virtualForDirective.changes.subscribe(item => {
                const isTheSameArray = this.items === item.tablejsForOf;
                this.items = item.tablejsForOf;
                const scrollToOptions = { index: 0, scrollAfterIndexedItem: 0 };
                if (isTheSameArray) {
                    scrollToOptions.index = this.range.startIndex;
                    scrollToOptions.scrollAfterIndexedItem = this.scrollChangeByFirstIndexedItem;
                    // array has changed...rerender current elements
                    const listChildren = Array.from(this.listContent.childNodes);
                }
                else {
                    this.updateItems(item.tablejsForOf, scrollToOptions);
                }
            });
        }
        // this.convertCustomElementsVariables();
        this.createTBodies();
        this.addScrollHandler();
        // this.attachMutationObserver();
        if (this.items && (this.generateCloneMethod || this.virtualNexus.virtualForDirective._template)) {
            this.initScroll({
                items: this.items,
                generateCloneMethod: this._cloneMethod
            });
        }
        this.scrollDispatcherService.dispatchViewportReadyEvents(this.viewportReady, this, this.elementRef.nativeElement);
    }
    scrollToBottom() {
        this.range.startIndex = this.items.length;
        this.scrollToExact(this.range.startIndex, 0);
    }
    scrollToTop() {
        this.scrollToExact(0, 0);
    }
    pageUp() {
        let heightCount = this.scrollChangeByFirstIndexedItem;
        if (this.range.startIndex === 0) {
            this.scrollToExact(0, 0);
            return;
        }
        for (let i = this.range.startIndex - 1; i >= 0; i--) {
            const lookupHeight = this.heightLookup['item' + i] ? this.heightLookup['item' + i] : this.avgItemHeight;
            heightCount += lookupHeight;
            if (heightCount >= this.containerHeight || i === 0) {
                const overflowDifference = heightCount >= this.containerHeight ? heightCount - this.containerHeight : 0;
                this.scrollToExact(i, overflowDifference);
                break;
            }
        }
    }
    pageDown() {
        this.range.startIndex = this.range.endIndex - 1;
        const overflowDifference = this.heightLookup['item' + (this.range.endIndex - 1).toString()] - this.lastVisibleItemOverflow;
        this.scrollToExact(this.range.startIndex, overflowDifference);
    }
    addArrowListeners() {
        this.elementRef.nativeElement.addEventListener('mouseenter', this.handleMouseOver = (e) => {
            this.mouseIsOverViewport = true;
        });
        this.elementRef.nativeElement.addEventListener('mouseleave', this.handleMouseOut = (e) => {
            this.mouseIsOverViewport = false;
        });
        document.addEventListener('keydown', this.handleKeyDown = (e) => {
            if (this.mouseIsOverViewport) {
                const isMac = this.operatingSystem.isMac();
                switch (e.code) {
                    case 'ArrowDown':
                        if (isMac && e.metaKey) {
                            e.preventDefault();
                            this.scrollToBottom();
                        }
                        else {
                            e.preventDefault();
                            this.range.startIndex += Number(this.arrowDownSpeed);
                            this.scrollToExact(this.range.startIndex, 0);
                        }
                        break;
                    case 'ArrowUp':
                        if (isMac && e.metaKey) {
                            e.preventDefault();
                            this.scrollToTop();
                        }
                        else {
                            if (this.scrollChangeByFirstIndexedItem === 0) {
                                e.preventDefault();
                                this.range.startIndex -= Number(this.arrowUpSpeed);
                                this.scrollToExact(this.range.startIndex, 0);
                            }
                            else {
                                e.preventDefault();
                                this.scrollChangeByFirstIndexedItem = 0;
                                this.scrollToExact(this.range.startIndex, 0);
                            }
                        }
                        break;
                    case 'PageDown':
                        e.preventDefault();
                        this.pageDown();
                        break;
                    case 'PageUp':
                        e.preventDefault();
                        this.pageUp();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.scrollToBottom();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.scrollToTop();
                        break;
                }
            }
        });
    }
    ngAfterViewInit() {
        this.gridDirective = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement)['gridDirective'];
        this.gridDirective.scrollViewportDirective = this;
        this.gridDirective.preGridInitialize.pipe(take(1)).subscribe(res => {
            this.cdr.detectChanges();
            this.refreshContainerHeight();
            this.refreshViewport();
            // placeholder object is used only to initialize first grid render
            if (this.items[0] === this.placeholderObject) {
                this.items.shift();
            }
        });
        this.viewportRendered();
        this.addArrowListeners();
    }
    ngOnInit() {
        this.registerViewportToElement();
        this._cloneMethod = this.generateCloneMethod;
    }
    ngOnDestroy() {
        clearTimeout(this.timeoutID);
        this.elementRef.nativeElement.removeEventListener('mouseenter', this.handleMouseOver);
        this.elementRef.nativeElement.removeEventListener('mouseleave', this.handleMouseOut);
        if (this.listContent) {
            this.listContent.removeEventListener('scroll', this.handleListContentScroll);
        }
        document.removeEventListener('keydown', this.handleKeyDown);
        if (this.virtualForChangesSubscription$) {
            this.virtualForChangesSubscription$.unsubscribe();
        }
        this.elementRef.nativeElement.scrollViewportDirective = null;
        this.elementRef.nativeElement.scrollViewport = null;
    }
    setScrollSpacers() {
        const numItemsAfterShownList = this.items.length - this.range.extendedEndIndex;
        const numItemsBeforeShownList = this.adjustedStartIndex;
        const totalUnshownItems = numItemsBeforeShownList + numItemsAfterShownList;
        const beforeItemHeightPercent = totalUnshownItems !== 0 ? numItemsBeforeShownList / totalUnshownItems : 0;
        const afterItemHeightPercent = totalUnshownItems !== 0 ? numItemsAfterShownList / totalUnshownItems : 0;
        const remainingHeight = this.estimatedFullContentHeight - this.lastHeight;
        this.estimatedPreListHeight = Math.round(beforeItemHeightPercent * remainingHeight);
        this.estimatedPostListHeight = Math.round(afterItemHeightPercent * remainingHeight);
        // account for rounding both up
        this.estimatedPostListHeight = this.estimatedPostListHeight - (afterItemHeightPercent * remainingHeight) === 0.5 ? this.estimatedPostListHeight - 1 : this.estimatedPostListHeight;
        if (this.forcedEndIndex) {
            this.estimatedPreListHeight = 0;
            this.estimatedPostListHeight = 0;
        }
        this.prevSpacer.style.height = this.estimatedPreListHeight.toString() + 'px';
        this.postSpacer.style.height = this.estimatedPostListHeight.toString() + 'px';
    }
    setHeightByListHeightDifference(liHeight, listHeight) {
        return liHeight - listHeight;
    }
    removePreScrollItems(lastIndex, index) {
        if (lastIndex < index) {
            for (let i = lastIndex; i < index; i++) {
                const firstRef = this.virtualNexus.virtualForDirective._viewContainer.get(1);
                if (firstRef) {
                    const firstChild = firstRef.rootNodes[0];
                    const itemName = 'item' + i;
                    this.itemVisibilityLookup[itemName] = false;
                    const detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(1);
                    detachedRef.destroy();
                    this.cdr.detectChanges();
                    this.removeResizeSensor(firstChild, i);
                    this.lastHeight -= this.heightLookup[itemName];
                    this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, firstChild, i, this, this.elementRef.nativeElement);
                }
            }
        }
    }
    removePostScrollItems(lastEndIndex, endIndex) {
        if (lastEndIndex >= this.items.length) {
            lastEndIndex = this.items.length - 1;
        }
        for (let i = lastEndIndex; i >= endIndex; i--) {
            const lastChild = this.getPreviousSibling(this.listContent.lastElementChild);
            if (lastChild) {
                const itemName = 'item' + i;
                this.itemVisibilityLookup[itemName] = false;
                const detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(this.virtualNexus.virtualForDirective._viewContainer.length - 1);
                detachedRef.destroy();
                this.cdr.detectChanges();
                this.removeResizeSensor(lastChild, i);
                this.lastHeight -= this.heightLookup[itemName];
                this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, detachedRef.rootNodes[0], i, this, this.elementRef.nativeElement);
            }
        }
    }
    updateItems(items, scrollToOptions = { index: -1, scrollAfterIndexedItem: 0 }) {
        if (this.pauseViewportRenderUpdates) {
            return;
        }
        for (let i = this.virtualNexus.virtualForDirective._viewContainer.length - 1; i > 0; i--) {
            const detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(i);
            detachedRef.destroy();
        }
        this.cdr.detectChanges();
        this.resetToInitialValues();
        this.items = items;
        if (this.virtualNexus) {
            this.virtualNexus.virtualForDirective._tablejsForOf = items;
        }
        if (scrollToOptions.index !== -1) {
            this.scrollToExact(scrollToOptions.index, scrollToOptions.scrollAfterIndexedItem);
        }
    }
    resetToInitialValues() {
        this.lastScrollTop = 0;
        this.currentScrollTop = 0;
        this.currentScrollChange = 0;
        this.estimatedFullContentHeight = 0;
        this.estimatedPreListHeight = 0;
        this.estimatedPostListHeight = 0;
        this.totalItemsCounted = 0;
        this.totalHeightCount = 0;
        this.avgItemHeight = undefined;
        this.heightLookup = {};
        this.itemVisibilityLookup = {};
        this.overflowHeightCount = 0;
        this.scrollChangeByFirstIndexedItem = 0;
        this.lastVisibleItemHeight = Infinity;
        this.preOverflowHeight = 0;
        this.lastHeight = 0;
        this.range.startIndex = 0;
        this.range.endIndex = 0;
        this.range.extendedStartIndex = 0;
        this.range.extendedEndIndex = 0;
        this.lastRange.startIndex = this.range.startIndex;
        this.lastRange.endIndex = this.range.endIndex;
        this.lastRange.extendedStartIndex = this.range.extendedStartIndex;
        this.lastRange.extendedEndIndex = this.range.extendedEndIndex;
        this.forcedEndIndex = undefined;
    }
    recalculateRowHeight(index) {
        const itemName = 'item' + index;
        const indexMap = {};
        for (let i = 1; i < this.virtualNexus.virtualForDirective._viewContainer.length; i++) {
            indexMap[this.virtualNexus.virtualForDirective._viewContainer.get(i).rootNodes[0].index] = i;
        }
        ;
        const rowRef = this.virtualNexus.virtualForDirective._viewContainer.get(indexMap[index]);
        const rowEl = rowRef.rootNodes[0];
        const lookupHeight = rowEl.offsetHeight;
        const heightDifference = lookupHeight - this.heightLookup[itemName];
        this.updateEstimatedHeightFromResize(this.heightLookup[itemName], lookupHeight);
        this.heightLookup[itemName] = lookupHeight;
        rowEl.lastHeight = lookupHeight;
        this.lastHeight += heightDifference;
    }
    updateEstimatedHeightFromResize(oldHeight, newHeight) {
        this.totalHeightCount += (newHeight - oldHeight);
        this.avgItemHeight = (this.totalHeightCount / this.totalItemsCounted);
        this.estimatedFullContentHeight = this.avgItemHeight * this.items.length;
    }
    updateEstimatedHeight(height) {
        this.totalHeightCount += height;
        this.totalItemsCounted++;
        this.avgItemHeight = (this.totalHeightCount / this.totalItemsCounted);
        this.estimatedFullContentHeight = this.avgItemHeight * this.items.length;
    }
    getPreviousSibling(el) {
        if (!el) {
            return null;
        }
        let prev = el.previousSibling;
        while (prev !== null && prev !== undefined && prev.nodeType !== 1) {
            prev = prev.previousSibling;
        }
        return prev;
    }
    getNextSibling(el) {
        if (!el) {
            return null;
        }
        let next = el.nextSibling;
        while (next !== null && next !== undefined && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    }
    getEstimatedChildInsertions(remainingHeight) {
        return Math.ceil(remainingHeight / this.avgItemHeight);
    }
    setLastRangeToCurrentRange() {
        this.lastRange.startIndex = this.range.startIndex;
        this.lastRange.endIndex = this.range.endIndex;
        this.lastRange.extendedStartIndex = this.range.extendedStartIndex;
        this.lastRange.extendedEndIndex = this.range.extendedEndIndex;
    }
    resetLastHeight() {
        if (!this.lastHeight) {
            this.lastHeight = 0;
        }
    }
    maintainIndexInBounds(index) {
        if (index > this.items.length - 1) {
            index = this.items.length - 1;
        }
        else if (index < 0) {
            index = 0;
        }
        return index;
    }
    maintainEndIndexInBounds(index) {
        if (index > this.items.length) {
            index = this.items.length;
        }
        else if (index < 0) {
            index = 0;
        }
        return index;
    }
    showRange(startIndex, endIndex, overflow = 0) {
        this.updateItems(this.items, { index: startIndex, scrollAfterIndexedItem: endIndex });
        startIndex = this.maintainIndexInBounds(startIndex);
        endIndex = this.maintainEndIndexInBounds(endIndex);
        if (endIndex <= startIndex) {
            endIndex = startIndex + 1;
        }
        const oldContainerHeight = this.containerHeight;
        const oldPreItemOverflow = Number(this.preItemOverflow);
        const oldPostItemOverflow = Number(this.postItemOverflow);
        this.preItemOverflow = 0;
        this.postItemOverflow = 0;
        this.containerHeight = 100000;
        this.forcedEndIndex = endIndex;
        this.scrollToExact(startIndex, overflow);
        const rangeToKeep = Object.assign({}, this.range);
        const lastRangeToKeep = Object.assign({}, this.lastRange);
        this.preItemOverflow = oldPreItemOverflow;
        this.postItemOverflow = oldPostItemOverflow;
        this.containerHeight = oldContainerHeight;
        this.forcedEndIndex = undefined;
        this.range = rangeToKeep;
        this.lastRange = lastRangeToKeep;
    }
    getDisplayedContentsHeight() {
        return this.lastHeight;
    }
    refreshContainerHeight() {
        this.containerHeight = this.listContent.clientHeight;
    }
    allItemsFitViewport(recalculateContainerHeight = false, refreshViewport = false) {
        if (recalculateContainerHeight) {
            this.cdr.detectChanges();
            this.refreshContainerHeight();
        }
        if (refreshViewport) {
            this.refreshViewport(true);
        }
        return this.range.startIndex === this.range.extendedStartIndex &&
            this.range.endIndex === this.range.extendedEndIndex &&
            this.lastHeight <= this.containerHeight;
    }
    getCurrentScrollPosition() {
        return {
            index: this.range.startIndex,
            overflow: this.scrollChangeByFirstIndexedItem,
            lastItemOverflow: this.lastVisibleItemOverflow > 0 ? 0 : this.lastVisibleItemOverflow
        };
    }
    setHeightsForOverflowCalculations(itemIndex, scrollToIndex, itemHeight) {
        this.lastHeight += itemHeight;
        if (itemIndex < scrollToIndex) {
            this.preOverflowHeight += itemHeight;
        }
        if (itemIndex >= scrollToIndex) {
            this.overflowHeightCount += itemHeight;
            if (this.overflowHeightCount >= this.containerHeight) {
                this.postItemOverflowCount++;
                if (this.postItemOverflowCount === 0) {
                    this.lastVisibleItemHeight = this.heightLookup['item' + itemIndex];
                }
            }
        }
    }
    addResizeSensor(el, index) {
    }
    removeResizeSensor(el, index) {
    }
    getCloneFromTemplateRef(index) {
        let clone;
        this.templateContext = new TablejsForOfContext(this.items[index], this.virtualNexus.virtualForDirective._tablejsForOf, index, this.items.length);
        const viewRef = this.virtualNexus.virtualForDirective._template.createEmbeddedView(this.templateContext);
        viewRef.detectChanges();
        clone = viewRef.rootNodes[0];
        return clone;
    }
    addScrollItems(index, overflow) {
        const scrollingUp = index < this.lastRange.startIndex;
        this.range.extendedStartIndex = this.adjustedStartIndex;
        this.range.startIndex = index;
        this.overflowHeightCount = -overflow;
        this.preOverflowHeight = 0;
        const firstEl = this.getNextSibling(this.listContent.firstElementChild);
        this.lastHeight = 0;
        let batchSize = this.avgItemHeight !== undefined && isNaN(this.avgItemHeight) === false ? this.getEstimatedChildInsertions(this.containerHeight - this.lastHeight) + Number(this.preItemOverflow) + Number(this.postItemOverflow) : 1;
        let itemsToBatch = [];
        let itemBefore;
        let indexBefore;
        const firstRef = this.virtualNexus.virtualForDirective._viewContainer.get(1);
        const appendToEnd = firstRef === null;
        for (let i = this.adjustedStartIndex; i < this.adjustedStartIndex + Number(this.itemLoadLimit); i++) {
            if (i < 0) {
                continue;
            }
            if (i > this.items.length - 1) {
                break;
            }
            this.itemName = 'item' + i;
            // only insert item if it is not already visible
            const itemIsInvisible = this.itemVisibilityLookup[this.itemName] !== true;
            if (itemIsInvisible) {
                itemBefore = !scrollingUp ? this.postSpacer : firstEl;
                indexBefore = !scrollingUp || appendToEnd ? this.virtualNexus.virtualForDirective._viewContainer.length : this.virtualNexus.virtualForDirective._viewContainer.indexOf(firstRef);
                this.itemVisibilityLookup[this.itemName] = true;
                this.templateContext = new TablejsForOfContext(this.items[i], this.virtualNexus.virtualForDirective._tablejsForOf, i, this.items.length);
                const ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus.virtualForDirective._template, this.templateContext, indexBefore);
                this.virtualNexus.virtualForDirective._viewContainer.move(ref, indexBefore);
                const prev = ref.rootNodes[0];
                prev.index = i;
                itemsToBatch.push({ index: i, name: this.itemName, item: prev, before: itemBefore });
                this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, prev, i, this, this.elementRef.nativeElement);
            }
            else {
                itemsToBatch.push({ index: i, name: this.itemName, item: null, before: null });
                this.setHeightsForOverflowCalculations(i, index, this.heightLookup[this.itemName]);
            }
            if (itemsToBatch.length === batchSize || i === this.items.length - 1 || this.postItemOverflowCount >= Number(this.postItemOverflow)) {
                for (let j = 0; j < itemsToBatch.length; j++) {
                    const batchObj = itemsToBatch[j];
                    const name = batchObj.name;
                    const ind = batchObj.index;
                    const oldHeight = this.heightLookup[name];
                    if (batchObj.item === null) {
                        continue;
                    }
                    this.cdr.detectChanges();
                    const lookupHeight = batchObj.item.offsetHeight;
                    this.heightLookup[name] = lookupHeight;
                    batchObj.item.lastHeight = lookupHeight;
                    this.addResizeSensor(batchObj.item, batchObj.index);
                    if (oldHeight) {
                        this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
                    }
                    else {
                        this.updateEstimatedHeight(lookupHeight);
                    }
                    this.setHeightsForOverflowCalculations(ind, index, lookupHeight);
                }
                batchSize = this.getEstimatedChildInsertions(this.containerHeight - this.lastHeight) + Number(this.preItemOverflow) + Number(this.postItemOverflow);
                if (batchSize <= 0) {
                    batchSize = Number(this.postItemOverflow);
                }
                itemsToBatch = [];
            }
            if (this.postItemOverflowCount <= 0) {
                this.range.endIndex = i + 1;
            }
            this.range.extendedEndIndex = i + 1;
            // if item height is lower than the bottom of the container area, stop adding items
            if (this.forcedEndIndex === undefined) {
                if (this.postItemOverflowCount >= Number(this.postItemOverflow)) {
                    break;
                }
            }
            else {
                if (i === this.forcedEndIndex - 1) {
                    break;
                }
            }
        }
        let itemName;
        let endIndexFound = false;
        let heightCount = -overflow;
        for (let i = this.range.startIndex; i < this.range.extendedEndIndex; i++) {
            itemName = 'item' + i;
            heightCount += this.heightLookup[itemName];
            if (this.forcedEndIndex !== undefined) {
                if (i === this.forcedEndIndex - 1) {
                    this.range.endIndex = i + 1;
                    this.lastVisibleItemOverflow = heightCount - this.containerHeight;
                    endIndexFound = true;
                    break;
                }
            }
            else {
                if (heightCount >= this.containerHeight && !endIndexFound) {
                    this.range.endIndex = i + 1;
                    this.lastVisibleItemOverflow = heightCount - this.containerHeight;
                    endIndexFound = true;
                    break;
                }
            }
        }
    }
    addMissingPostScrollItemsAndUpdateOverflow(index, overflow) {
        let firstEl;
        let itemsToBatch = [];
        let batchSize;
        if (this.overflowHeightCount <= this.containerHeight) {
            batchSize = this.getEstimatedChildInsertions(this.containerHeight) + Number(this.preItemOverflow);
            this.preItemOverflowCount = -1;
            this.preOverflowHeight = 0;
            firstEl = this.getNextSibling(this.listContent.firstElementChild);
            let heightCount = 0;
            let count = 0;
            for (let i = this.range.endIndex - 1; i >= 0; i--) {
                this.itemName = 'item' + i;
                count++;
                if (i <= this.range.extendedStartIndex && this.itemVisibilityLookup[this.itemName] !== true) {
                    this.itemVisibilityLookup[this.itemName] = true;
                    this.templateContext = new TablejsForOfContext(this.items[i], this.virtualNexus.virtualForDirective._tablejsForOf, i, this.items.length);
                    const ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus.virtualForDirective._template, this.templateContext, 1);
                    this.virtualNexus.virtualForDirective._viewContainer.move(ref, 1);
                    const prev = ref.rootNodes[0];
                    prev.index = i;
                    this.cdr.detectChanges();
                    itemsToBatch.push({ index: i, name: this.itemName, item: prev, before: firstEl });
                    this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, prev, i, this, this.elementRef.nativeElement);
                    firstEl = prev;
                    this.range.extendedStartIndex = i;
                    this.adjustedStartIndex = i;
                }
                else {
                    itemsToBatch.push({ index: i, name: this.itemName, item: null, before: null });
                    heightCount += this.heightLookup[this.itemName];
                    if (heightCount > this.containerHeight) {
                        this.preItemOverflowCount++;
                        if (this.preItemOverflowCount === 0) {
                            overflow = heightCount - this.containerHeight;
                            this.range.startIndex = i;
                            index = i;
                        }
                        else {
                            this.preOverflowHeight += this.heightLookup[this.itemName];
                        }
                        this.range.extendedStartIndex = i;
                        this.adjustedStartIndex = i;
                    }
                }
                if (itemsToBatch.length === batchSize || i === 0) {
                    for (let j = 0; j < itemsToBatch.length; j++) {
                        const batchObj = itemsToBatch[j];
                        if (batchObj.item === null) {
                            continue;
                        }
                        const name = batchObj.name;
                        const ind = batchObj.index;
                        const lookupHeight = batchObj.item.offsetHeight;
                        const oldHeight = this.heightLookup[name];
                        this.heightLookup[name] = lookupHeight;
                        batchObj.item.lastHeight = lookupHeight;
                        this.addResizeSensor(batchObj.item, batchObj.index);
                        if (oldHeight) {
                            this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
                        }
                        else {
                            this.updateEstimatedHeight(lookupHeight);
                        }
                        heightCount += lookupHeight;
                        if (heightCount > this.containerHeight) {
                            this.preItemOverflowCount++;
                            if (this.preItemOverflowCount === 0) {
                                overflow = heightCount - this.containerHeight;
                                this.range.startIndex = batchObj.index;
                                index = batchObj.index;
                            }
                            else {
                                this.preOverflowHeight += lookupHeight;
                            }
                            this.range.extendedStartIndex = batchObj.index;
                            this.adjustedStartIndex = batchObj.index;
                        }
                    }
                    batchSize = this.getEstimatedChildInsertions(this.containerHeight - this.lastHeight) + Number(this.preItemOverflow);
                    if (batchSize <= 0) {
                        batchSize = Number(this.preItemOverflow);
                    }
                    itemsToBatch = [];
                }
                if (this.preItemOverflowCount >= this.preItemOverflow) {
                    break;
                }
            }
        }
        return overflow;
    }
    scrollToExact(index, overflow = 0) {
        if (!this.items || this.items.length === 0) {
            return;
        }
        this.resetLastHeight();
        index = this.maintainIndexInBounds(index);
        overflow = index === 0 && overflow < 0 ? 0 : overflow;
        this.adjustedStartIndex = index - Number(this.preItemOverflow) <= 0 ? 0 : index - Number(this.preItemOverflow);
        this.preItemOverflowCount = -1;
        this.postItemOverflowCount = -1;
        this.lastVisibleItemOverflow = 0;
        this.range.endIndex = 0;
        this.range.extendedEndIndex = 0;
        this.removePreScrollItems(this.lastRange.extendedStartIndex, Math.min(this.adjustedStartIndex, this.lastRange.extendedEndIndex));
        this.addScrollItems(index, overflow);
        this.removePostScrollItems(this.lastRange.extendedEndIndex - 1, Math.max(this.lastRange.extendedStartIndex, this.range.extendedEndIndex));
        if (!this.forcedEndIndex) {
            overflow = this.addMissingPostScrollItemsAndUpdateOverflow(index, overflow);
        }
        this.setLastRangeToCurrentRange();
        this.setScrollSpacers();
        this.lastScrollTop = this.preOverflowHeight + overflow + this.estimatedPreListHeight;
        this.listContent.scrollTop = this.lastScrollTop;
        this.currentScrollTop = this.lastScrollTop;
        this.scrollChangeByFirstIndexedItem = overflow;
        this.scrollDispatcherService.dispatchRangeUpdateEvents(this.rangeUpdated, this.range, this, this.elementRef.nativeElement);
        this.viewportHasScrolled = true;
    }
    getRangeChange(scrollChange) {
        let heightCount = 0;
        let rangeStartCount = 0;
        let overflow = 0;
        const newRange = { startIndex: null, endIndex: null, extendedStartIndex: null, extendedEndIndex: null };
        let itemName;
        if (scrollChange > 0) {
            for (let i = this.range.startIndex; i <= this.range.endIndex + Number(this.itemLoadLimit); i++) {
                overflow = scrollChange - heightCount;
                itemName = 'item' + i;
                if (this.heightLookup[itemName]) {
                    heightCount += this.heightLookup[itemName];
                }
                else {
                    heightCount += this.avgItemHeight;
                }
                if (heightCount >= scrollChange) {
                    break;
                }
                rangeStartCount++;
            }
            newRange.startIndex = this.range.startIndex + rangeStartCount;
            newRange.endIndex = rangeStartCount < this.range.endIndex - this.range.startIndex ? this.range.endIndex : newRange.startIndex + 1;
        }
        if (scrollChange < 0) {
            rangeStartCount = -1;
            overflow = scrollChange;
            for (let i = this.range.startIndex - 1; i >= 0; i--) {
                itemName = 'item' + i;
                if (this.heightLookup[itemName]) {
                    overflow += this.heightLookup[itemName];
                    heightCount += this.heightLookup[itemName];
                }
                else {
                    overflow += this.avgItemHeight;
                    heightCount += this.avgItemHeight;
                }
                if (overflow >= 0) {
                    break;
                }
                rangeStartCount--;
            }
            newRange.startIndex = this.range.startIndex + rangeStartCount >= 0 ? this.range.startIndex + rangeStartCount : 0;
            newRange.endIndex = rangeStartCount < this.range.endIndex - this.range.startIndex ? this.range.endIndex : newRange.startIndex + 1;
        }
        this.scrollChangeByFirstIndexedItem = overflow;
        return newRange;
    }
    refreshViewport(recalculateRows = false) {
        if (recalculateRows) {
            for (let i = this.range.extendedStartIndex; i < this.range.extendedEndIndex; i++) {
                this.recalculateRowHeight(i);
            }
        }
        this.scrollToExact(this.range.startIndex, this.scrollChangeByFirstIndexedItem);
    }
    updateScrollFromRange(newRange) {
        if (newRange.startIndex !== null) {
            if (this.range.startIndex !== newRange.startIndex || this.lastVisibleItemOverflow < 0) {
                this.range.startIndex = newRange.startIndex;
                this.range.endIndex = newRange.endIndex;
                this.refreshViewport();
            }
            else {
                this.lastScrollTop = this.currentScrollTop;
            }
        }
        this.lastScrollTop = this.currentScrollTop;
    }
    initScroll(options) {
        this.items = options.items;
        this._cloneMethod = options.generateCloneMethod;
        const itemsAreEmpty = this.items.length === 0;
        let index = options.initialIndex ? options.initialIndex : 0;
        if (this.virtualNexus && this.virtualNexus.virtualForDirective._template) {
            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
                this.cloneFromTemplateRef = true;
                this.verifyViewportIsReady();
                this.initFirstScroll(index);
            });
        }
        else {
            this.template = document.getElementById(this.templateID);
            this.verifyViewportIsReady();
            this.initFirstScroll(index);
        }
    }
    verifyViewportIsReady() {
        if (this.templateID === '' && !this.templateIsSet()) {
            throw Error('Scroll viewport template ID is not set.');
        }
        if (!this.itemsAreSet()) {
            throw new Error('Scroll viewport requires an array of items.  Please supply an items array.');
        }
        if (!this.cloneMethodIsSet() && !this.templateIsSet()) {
            throw new Error('Scroll viewport requires a cloning method or a template.  Please supply a method as follows:\n\n (template: HTMLElement, items: any[], index: number) => Node\n\n or supply a tablejsVirtualFor');
        }
    }
    initFirstScroll(index) {
        const itemsAreEmpty = this.items.length === 0;
        this.refreshContainerHeight();
        if (itemsAreEmpty) {
            this.items.push(this.placeholderObject);
            this.scrollToExact(index, 0);
            const node = this.virtualNexus.virtualForDirective._viewContainer.get(1).rootNodes[0];
            this.renderer.setStyle(node, 'height', '0px');
            this.renderer.setStyle(node, 'minHeight', '0px');
            this.renderer.setStyle(node, 'overflow', 'hidden');
        }
        else {
            this.scrollToExact(index, 0);
        }
        this.scrollDispatcherService.dispatchViewportInitializedEvents(this.viewportInitialized, this, this.elementRef.nativeElement);
    }
    itemsAreSet() {
        return !!this.items;
    }
    cloneMethodIsSet() {
        return !!this._cloneMethod;
    }
    templateIsSet() {
        return this.virtualNexus.virtualForDirective._template !== undefined && this.virtualNexus.virtualForDirective._template !== null;
    }
}
ScrollViewportDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollViewportDirective, deps: [{ token: i0.ElementRef }, { token: GridService }, { token: DOCUMENT }, { token: DirectiveRegistrationService }, { token: ScrollDispatcherService }, { token: OperatingSystemService }, { token: i0.ChangeDetectorRef }, { token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Directive });
ScrollViewportDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ScrollViewportDirective, selector: "[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]", inputs: { templateID: "templateID", generateCloneMethod: "generateCloneMethod", arrowUpSpeed: "arrowUpSpeed", arrowDownSpeed: "arrowDownSpeed", preItemOverflow: "preItemOverflow", postItemOverflow: "postItemOverflow", itemLoadLimit: "itemLoadLimit", templateid: "templateid", preitemoverflow: "preitemoverflow", postitemoverflow: "postitemoverflow", arrowupspeed: "arrowupspeed", arrowdownspeed: "arrowdownspeed", itemloadlimit: "itemloadlimit", fillViewportScrolling: "fillViewportScrolling" }, outputs: { itemAdded: "itemAdded", itemRemoved: "itemRemoved", itemUpdated: "itemUpdated", rangeUpdated: "rangeUpdated", viewportScrolled: "viewportScrolled", viewportReady: "viewportReady", viewportInitialized: "viewportInitialized" }, host: { styleAttribute: "contain: content;" }, queries: [{ propertyName: "templateRef", first: true, predicate: ["templateRef"], descendants: true, static: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollViewportDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]',
                    host: { style: 'contain: content;' }
                }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: GridService }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: DirectiveRegistrationService }, { type: ScrollDispatcherService }, { type: OperatingSystemService }, { type: i0.ChangeDetectorRef }, { type: i0.RendererFactory2 }];
    }, propDecorators: { templateRef: [{
                type: ContentChild,
                args: ['templateRef', { static: true }]
            }], templateID: [{
                type: Input
            }], generateCloneMethod: [{
                type: Input
            }], arrowUpSpeed: [{
                type: Input
            }], arrowDownSpeed: [{
                type: Input
            }], preItemOverflow: [{
                type: Input
            }], postItemOverflow: [{
                type: Input
            }], itemLoadLimit: [{
                type: Input
            }], templateid: [{
                type: Input
            }], preitemoverflow: [{
                type: Input
            }], postitemoverflow: [{
                type: Input
            }], arrowupspeed: [{
                type: Input
            }], arrowdownspeed: [{
                type: Input
            }], itemloadlimit: [{
                type: Input
            }], fillViewportScrolling: [{
                type: Input
            }], itemAdded: [{
                type: Output
            }], itemRemoved: [{
                type: Output
            }], itemUpdated: [{
                type: Output
            }], rangeUpdated: [{
                type: Output
            }], viewportScrolled: [{
                type: Output
            }], viewportReady: [{
                type: Output
            }], viewportInitialized: [{
                type: Output
            }] } });

class GridDirective extends TablejsGridProxy {
    constructor(elementRef, resolver, gridService, directiveRegistrationService, document, overlay, scrollDispatcherService, operatingSystem, rendererFactory) {
        super();
        this.elementRef = elementRef;
        this.resolver = resolver;
        this.gridService = gridService;
        this.directiveRegistrationService = directiveRegistrationService;
        this.document = document;
        this.overlay = overlay;
        this.scrollDispatcherService = scrollDispatcherService;
        this.operatingSystem = operatingSystem;
        this.rendererFactory = rendererFactory;
        this.dragging = false;
        this.reordering = false;
        this.startX = 0;
        this.startY = 0;
        this.stylesByClass = [];
        this.id = null;
        this.viewport = null;
        this.viewportID = null;
        this.currentClassesToResize = [];
        this.startingWidths = [];
        this.minWidths = [];
        this.totalComputedMinWidth = 0;
        this.totalComputedWidth = 0;
        this.defaultTableMinWidth = 25;
        this.gridTemplateClasses = [];
        this.gridOrder = [];
        this.classWidths = [];
        this.gridTemplateTypes = [];
        this.draggingColumn = null;
        this.colRangeGroups = [];
        this.lastDraggedOverElement = null;
        this.lastDraggedGroupIndex = -1;
        this.lastDraggedOverRect = null;
        this.lastDraggedGroupBoundingRects = null;
        this.lastMoveDirection = -1;
        this.resizableColumns = [];
        this.resizableGrips = [];
        this.reorderGrips = [];
        this.reorderableColumns = [];
        this.columnsWithDataClasses = [];
        this.rows = [];
        this.infiniteScrollViewports = [];
        this.mutationResizableColumns = [];
        this.mutationResizableGrips = [];
        this.mutationReorderGrips = [];
        this.mutationReorderableColumns = [];
        this.mutationColumnsWithDataClasses = [];
        this.mutationRows = [];
        this.mutationInfiniteScrollViewports = [];
        this.headTag = this.document.getElementsByTagName('head')[0];
        this.styleContent = '';
        this.headStyle = null;
        this.styleList = [];
        this.initialWidths = [];
        this.initialWidthsAreSet = undefined;
        this.lastColumns = [];
        this.contentResizeSensor = null;
        this.observer = null;
        this.isCustomElement = false;
        this.parentGroups = [];
        this.colData = null;
        this.colDataGroups = [];
        this.elementsWithHighlight = [];
        this.dragAndDropGhostComponent = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.reorderHandleColOffset = 0;
        this.scrollbarWidth = 0;
        // class used for setting order
        this.reorderableClass = 'reorderable-table-row';
        // fragments
        this.widthStyle = null;
        this.widthStyleFragment = null;
        this.reorderHighlightStyle = null;
        this.reorderHighlightStyleFragment = null;
        this.subGroupStyles = [];
        this.subGroupFragments = [];
        this.gridOrderStyles = [];
        this.gridOrderFragments = [];
        this.subGroupStyleObjs = {};
        this.scrollbarAdjustmentFragment = null;
        this.scrollbarAdjustmentStyle = null;
        this.resizeMakeUpPercent = 0;
        this.resizeMakeUpPerColPercent = 0;
        this.scrollViewportDirective = null;
        this.hiddenColumnIndices = [];
        this.hiddenColumnChanges = new Subject();
        this.HIDDEN_COLUMN_CLASS = 'column-is-hidden';
        this.DRAG_AND_DROP_GHOST_OVERLAY_DATA = new InjectionToken('DRAG_AND_DROP_GHOST_OVERLAY_DATA');
        this.animationFrameIDs = [];
        this.linkClass = undefined;
        this.resizeColumnWidthByPercent = false;
        this.columnResizeStart = new EventEmitter();
        this.columnResize = new EventEmitter();
        this.columnResizeEnd = new EventEmitter();
        this.columnReorder = new EventEmitter();
        this.columnReorderStart = new EventEmitter();
        this.dragOver = new EventEmitter();
        this.columnReorderEnd = new EventEmitter();
        this.preGridInitialize = new EventEmitter(true);
        this.gridInitialize = new EventEmitter(true);
        this.registerDirectiveToElement();
        this.attachMutationObserver();
    }
    registerDirectiveToElement() {
        this.elementRef.nativeElement.gridDirective = this;
        this.elementRef.nativeElement.parentElement.gridDirective = this;
    }
    attachMutationObserver() {
        if (!this.observer) {
            const ths = this;
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    ths.updateMutations(mutation);
                });
            });
            this.observer.observe(this.elementRef.nativeElement, {
                // configure it to listen to attribute changes
                attributes: true,
                subtree: true,
                childList: true,
                characterData: false
            });
        }
    }
    updateMutations(mutation) {
        if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            addedNodes.forEach(node => {
                this.directiveRegistrationService.registerNodeAttributes(node);
                this.getChildNodes(node);
            });
        }
    }
    getChildNodes(node) {
        node.childNodes.forEach((childNode) => {
            this.directiveRegistrationService.registerNodeAttributes(childNode);
            if (childNode.getAttribute) {
                this.getChildNodes(childNode);
            }
        });
    }
    ngAfterViewInit() {
        const viewport = this.elementRef.nativeElement.querySelector('*[tablejsScrollViewport]');
        if (viewport !== null && (viewport.scrollViewportDirective === null || viewport.scrollViewportDirective === undefined)) {
            // attach directive
            const viewportRef = new ElementRef(viewport);
            this.scrollViewportDirective = new ScrollViewportDirective(viewportRef, this.gridService, this.document, this.directiveRegistrationService, this.scrollDispatcherService, this.operatingSystem, null, this.rendererFactory);
            this.scrollViewportDirective.registerCustomElementsInputs(viewport);
            this.scrollViewportDirective.ngOnInit();
            this.scrollViewportDirective.ngAfterViewInit();
        }
        // Close observer if directives are registering
        this.elementRef.nativeElement.directive = this;
        if (!this.document['hasPointerDownListener']) {
            this.pointerListenerFunc = (e) => {
                let el = e.target;
                if (el) {
                    while (el !== null && el.getAttribute('tablejsGrid') === null) {
                        el = el.parentElement;
                    }
                    if (el) {
                        el['directive'].onPointerDown(e);
                    }
                }
            };
            this.document.addEventListener('pointerdown', this.pointerListenerFunc);
            this.document['hasPointerDownListener'] = true;
        }
        const animationFrameID = window.requestAnimationFrame((timestamp) => {
            this.onEnterFrame(this, timestamp);
        });
        this.animationFrameIDs.push(animationFrameID);
    }
    onEnterFrame(ths, timestamp) {
        var _a;
        if (this.columnsWithDataClasses.length > 0) {
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        }
        if (this.columnsWithDataClasses.length === 0 && this.mutationColumnsWithDataClasses.length === 0) {
            const animationFrameID = window.requestAnimationFrame((tmstamp) => {
                ths.onEnterFrame(ths, tmstamp);
            });
            this.animationFrameIDs.push(animationFrameID);
            return;
        }
        if (this.columnsWithDataClasses.length === 0 && this.mutationColumnsWithDataClasses.length !== 0) {
            this.isCustomElement = true;
            this.resizableColumns = this.mutationResizableColumns.concat();
            this.resizableGrips = this.mutationResizableGrips.concat();
            this.reorderGrips = this.mutationReorderGrips.concat();
            this.reorderableColumns = this.mutationReorderableColumns.concat();
            this.columnsWithDataClasses = this.mutationColumnsWithDataClasses.concat();
            this.rows = this.mutationRows.concat();
            this.infiniteScrollViewports = this.mutationInfiniteScrollViewports.concat();
            this.mutationResizableColumns = [];
            this.mutationResizableGrips = [];
            this.mutationReorderGrips = [];
            this.mutationReorderableColumns = [];
            this.mutationColumnsWithDataClasses = [];
            this.mutationRows = [];
            this.mutationInfiniteScrollViewports = [];
        }
        const allElementsWithDataResizable = this.columnsWithDataClasses;
        const el = allElementsWithDataResizable[0];
        const resizeClasses = this.getResizableClasses(el);
        const resizeCls = resizeClasses[0];
        const firstEl = this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];
        if (!this.initialWidthSettingsSubscription$) {
            this.initialWidthSettingsSubscription$ = this.gridService.containsInitialWidthSettings.subscribe(hasWidths => {
                this.initialWidthsAreSet = hasWidths;
            });
        }
        if (!this.hiddenColumnChangesSubscription$) {
            this.hiddenColumnChangesSubscription$ = this.hiddenColumnChanges.subscribe((change) => {
                if (change) {
                    const relatedHeader = this.getRelatedHeader(change.hierarchyColumn.element);
                    relatedHeader.hideColumn = change.hidden;
                    if (change.wasTriggeredByThisColumn) {
                        this.updateHiddenColumnIndices();
                        const hideColumnIf = change.hierarchyColumn.element.hideColumnIf;
                        hideColumnIf.updateHeadersThatCanHide();
                    }
                    if (!change.hidden) {
                        if (change.wasTriggeredByThisColumn) {
                            this.currentClassesToResize = this.getResizableClasses(relatedHeader);
                            const avgWidthPerColumn = this.getAverageColumnWidth();
                            this.setMinimumWidths();
                            const totalTableWidth = this.viewport.clientWidth;
                            let newWidth = avgWidthPerColumn * this.currentClassesToResize.length;
                            this.currentClassesToResize.forEach(className => {
                                const classIndex = this.gridTemplateClasses.indexOf(className);
                                if (this.resizeColumnWidthByPercent) {
                                    this.classWidths[classIndex] = (avgWidthPerColumn / totalTableWidth * 100).toString() + '%';
                                    // average all percentages
                                }
                                else {
                                    this.classWidths[classIndex] = Math.max(avgWidthPerColumn, this.minWidths[classIndex]);
                                }
                            });
                            if (this.resizeColumnWidthByPercent) {
                                this.fitWidthsToOneHundredPercent();
                            }
                            this.updateWidths(newWidth);
                        }
                    }
                    this.setGridOrder();
                }
            });
        }
        if (this.parentGroups.length === 0) {
            this.setParentGroups(allElementsWithDataResizable);
        }
        const maxColumnsPerRow = this.parentGroups[this.parentGroups.length - 1].length;
        if (firstEl === undefined || firstEl === null) {
            const animationFrameID = window.requestAnimationFrame((tmstamp) => {
                ths.onEnterFrame(ths, tmstamp);
            });
            this.animationFrameIDs.push(animationFrameID);
        }
        else {
            const keys = Object.keys(this.initialWidths);
            if (this.initialWidthsAreSet === true && keys.length < maxColumnsPerRow) {
                const animationFrameID = window.requestAnimationFrame((tmstamp) => {
                    ths.awaitWidths(ths, tmstamp);
                });
                this.animationFrameIDs.push(animationFrameID);
            }
            else {
                this.checkForGridInitReady();
            }
        }
    }
    canHideColumn(column) {
        return column.hideColumnIf.canHide;
    }
    getFlattenedHierarchy() {
        const hierarchy = this.getColumnHierarchy();
        return hierarchy.columnGroups.reduce((prev, curr) => {
            let arr = [curr];
            if (curr.subColumns) {
                arr = arr.concat(this.getSubColumns(curr));
            }
            return prev.concat(arr);
        }, []);
    }
    getSubColumns(item) {
        if (item.subColumns.length === 0) {
            return [];
        }
        let arr = [];
        for (let i = 0; i < item.subColumns.length; i++) {
            const subItem = item.subColumns[i];
            arr = arr.concat(subItem);
            if (subItem.subColumns.length > 0) {
                arr = arr.concat(this.getSubColumns(subItem));
            }
        }
        return arr;
    }
    getColumnHierarchy() {
        const hierarchy = {
            columnGroups: []
        };
        const highestLevelGroup = this.colDataGroups[0];
        const hierarchyGroup = highestLevelGroup.map((item) => {
            let levelCount = 0;
            return {
                level: levelCount,
                element: item.child,
                parent: item.parent,
                parentColumn: null,
                subColumns: this.getHierarchySubColumns(item, levelCount)
            };
        });
        hierarchy.columnGroups = hierarchyGroup;
        return hierarchy;
    }
    getHierarchySubColumns(item, levelCount) {
        levelCount++;
        if (!item.subGroups || item.subGroups.length === 0) {
            return [];
        }
        const subColumns = item.subGroups.map((subItem) => {
            return {
                level: levelCount,
                element: subItem.child,
                parent: subItem.parent,
                parentColumn: item.child,
                subColumns: this.getHierarchySubColumns(subItem, levelCount)
            };
        });
        return subColumns;
    }
    checkForGridInitReady() {
        const allElementsWithDataResizable = this.columnsWithDataClasses;
        const el = allElementsWithDataResizable[0];
        const resizeClasses = this.getResizableClasses(el);
        const resizeCls = resizeClasses[0];
        const keys = Object.keys(this.initialWidths);
        const maxColumnsPerRow = this.parentGroups[this.parentGroups.length - 1].length;
        if (this.initialWidthsAreSet === true && (keys.length < maxColumnsPerRow || !this.initialWidths[resizeCls])) {
            const animationFrameID = window.requestAnimationFrame((tmstamp) => {
                this.awaitWidths(this, tmstamp);
            });
            this.animationFrameIDs.push(animationFrameID);
        }
        else if (this.initialWidthsAreSet === undefined) {
            const animationFrameID = window.requestAnimationFrame((tmstamp) => {
                this.awaitWidths(this, tmstamp);
            });
            this.animationFrameIDs.push(animationFrameID);
        }
        else {
            if (!this.linkClass) {
                this.initGrid();
            }
            else {
                const animationFrameID = window.requestAnimationFrame((tmstamp) => {
                    this.awaitSingleFrame(this, tmstamp);
                });
                this.animationFrameIDs.push(animationFrameID);
            }
        }
    }
    awaitWidths(ths, timestamp) {
        this.checkForGridInitReady();
    }
    awaitSingleFrame(ths, timestamp) {
        this.initGrid();
    }
    onPointerDown(event) {
        this.addPointerListeners();
        if (!this.getResizeGripUnderPoint(event)) {
            return;
        }
        // only drag on left mouse button
        if (event.button !== 0) {
            return;
        }
        // disables unwanted drag and drop functionality for selected text in browsers
        this.clearSelection();
        const el = this.elementRef.nativeElement;
        let resizeHandles;
        if (this.elementRef.nativeElement.reordering) {
            return;
        }
        const reorderHandlesUnderPoint = this.getReorderHandlesUnderPoint(event);
        const colsUnderPoint = this.getReorderColsUnderPoint(event);
        if (reorderHandlesUnderPoint.length > 0 && colsUnderPoint.length > 0) {
            this.elementRef.nativeElement.reordering = true;
            this.draggingColumn = colsUnderPoint[0];
            this.columnReorderStart.emit({
                pointerEvent: event,
                columnDragged: this.draggingColumn,
                columnHovered: this.draggingColumn
            });
            const customReorderStartEvent = new CustomEvent(ColumnReorderEvent.ON_REORDER_START, {
                detail: {
                    pointerEvent: event,
                    columnDragged: this.draggingColumn,
                    columnHovered: this.draggingColumn
                }
            });
            this.elementRef.nativeElement.parentElement.dispatchEvent(customReorderStartEvent);
            const elRect = this.draggingColumn.getBoundingClientRect();
            this.dragOffsetX = (event.pageX - elRect.left) - window.scrollX;
            this.dragOffsetY = (event.pageY - elRect.top) - window.scrollY;
            this.removeDragAndDropComponent();
            this.createDragAndDropComponent();
            const dragNDropX = event.pageX - this.dragOffsetX;
            const dragNDropY = event.pageY - this.dragOffsetY;
            this.setDragAndDropPosition(dragNDropX, dragNDropY);
            this.attachReorderGhost(this.draggingColumn);
            this.setReorderHighlightHeight(this.draggingColumn);
            this.lastDraggedOverElement = this.draggingColumn;
            this.parentGroups.forEach((arr, index) => {
                if (arr.indexOf(this.lastDraggedOverElement) !== -1) {
                    this.lastDraggedGroupIndex = index;
                }
            });
            this.reorderHandleColOffset = reorderHandlesUnderPoint[0].getBoundingClientRect().left - this.draggingColumn.getBoundingClientRect().left;
            this.lastDraggedGroupBoundingRects = this.parentGroups[this.lastDraggedGroupIndex].map(item => {
                const boundingRect = item.getBoundingClientRect();
                const rect = {
                    left: item.getBoundingClientRect().left + this.getContainerScrollCount(item),
                    right: boundingRect.right + window.scrollX,
                    top: boundingRect.top,
                    bottom: boundingRect.bottom,
                    width: boundingRect.width,
                    height: boundingRect.height
                };
                rect.x = rect.left;
                rect.y = rect.top;
                rect.toJSON = {};
                return rect;
            });
        }
        resizeHandles = this.resizableGrips;
        if (resizeHandles.length === 0) {
            return;
        }
        // if no handle exists, allow whole row to be resizable
        if (resizeHandles.length > 0) {
            const resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
            const els = resizableElements.filter(item => {
                let handleItem = null;
                resizeHandles.forEach(resizeHandle => {
                    if (item === resizeHandle) {
                        handleItem = resizeHandle;
                    }
                });
                return handleItem !== null;
            });
            if (els.length === 0) {
                return;
            }
        }
        this.dragging = true;
        const elements = this.getResizableElements(event);
        if (elements.length === 0) {
            return;
        }
        this.totalComputedMinWidth = 0;
        this.totalComputedWidth = 0;
        this.minWidths = [];
        this.startingWidths = [];
        this.currentClassesToResize = this.getResizableClasses(elements[0]);
        // disallow resizing the rightmost column with percent sizing
        if (this.resizeColumnWidthByPercent) {
            const lastColumnClass = this.getLastVisibleColumnClass();
            if (this.currentClassesToResize.indexOf(lastColumnClass) !== -1) {
                this.dragging = false;
            }
        }
        this.currentClassesToResize.forEach((className) => {
            const wdth = this.getClassWidthInPixels(className);
            if (!this.columnIsHiddenWithClass(className)) {
                this.totalComputedWidth += wdth;
            }
            this.startingWidths.push(wdth);
        });
        this.setMinimumWidths();
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.columnResizeStart.emit({
            pointerEvent: event,
            columnWidth: this.totalComputedWidth,
            columnMinWidth: this.totalComputedMinWidth,
            classesBeingResized: this.currentClassesToResize
        });
        const customResizeStartEvent = new CustomEvent(ColumnResizeEvent.ON_RESIZE_START, {
            detail: {
                pointerEvent: event,
                columnWidth: this.totalComputedWidth,
                columnMinWidth: this.totalComputedMinWidth,
                classesBeingResized: this.currentClassesToResize
            }
        });
        this.elementRef.nativeElement.parentElement.dispatchEvent(customResizeStartEvent);
        // stop interference with reordering columns
        event.preventDefault();
        event.stopImmediatePropagation();
    }
    getClassWidthInPixels(className) {
        const classIndex = this.gridTemplateClasses.indexOf(className);
        let wdth = this.classWidths[classIndex];
        if (this.resizeColumnWidthByPercent) {
            wdth = wdth.replace('%', ''); // remove px
            let totalTableWidth = this.viewport.clientWidth;
            wdth = (Number(wdth) / 100 * totalTableWidth).toString();
        }
        return Number(wdth);
    }
    setMinimumWidths() {
        this.gridTemplateClasses.forEach(className => {
            const firstEl = this.elementRef.nativeElement.querySelector('.' + className);
            const minWidth = window.getComputedStyle(firstEl).getPropertyValue('min-width');
            let wdth = Number(minWidth.substring(0, minWidth.length - 2)); // remove px
            wdth = Number(wdth) < this.defaultTableMinWidth ? this.defaultTableMinWidth : wdth; // account for minimum TD size in tables
            if (this.currentClassesToResize.indexOf(className) !== -1 && !this.columnIsHiddenWithClass(className)) {
                this.totalComputedMinWidth += wdth;
            }
            this.minWidths.push(wdth);
        });
    }
    attachReorderGhost(column) {
        var _a;
        (_a = this.dragAndDropGhostComponent) === null || _a === void 0 ? void 0 : _a.updateView(column.reorderGhost, column.reorderGhostContext);
    }
    getContainerScrollCount(el) {
        if (!el) {
            return 0;
        }
        let scrollXCount = el.scrollLeft;
        while (el !== document.body) {
            el = el.parentElement;
            scrollXCount += el.scrollLeft;
        }
        // include scrolling on tablejs-grid component
        scrollXCount += el.parentElement.scrollLeft;
        return scrollXCount;
    }
    onPointerMove(event) {
        const ths = document['currentGridDirective'];
        if (ths.elementRef.nativeElement.reordering) {
            ths.clearSelection();
            const dragNDropX = event.pageX - ths.dragOffsetX;
            const dragNDropY = event.pageY - ths.dragOffsetY;
            ths.setDragAndDropPosition(dragNDropX, dragNDropY);
            const trueMouseX = event.pageX - ths.reorderHandleColOffset + ths.getContainerScrollCount(ths.draggingColumn);
            if (!ths.lastDraggedOverElement) {
                return;
            }
            ths.columnReorder.emit({
                pointerEvent: event,
                columnDragged: ths.draggingColumn,
                columnHovered: ths.lastDraggedOverElement
            });
            const customReorderEvent = new CustomEvent(ColumnReorderEvent.ON_REORDER, {
                detail: {
                    pointerEvent: event,
                    columnDragged: ths.draggingColumn,
                    columnHovered: ths.lastDraggedOverElement
                }
            });
            ths.elementRef.nativeElement.parentElement.dispatchEvent(customReorderEvent);
            let moveDirection = 0;
            let currentRect;
            let currentColIndex;
            for (const rect of ths.lastDraggedGroupBoundingRects) {
                if (trueMouseX > rect.left && trueMouseX < rect.left + rect.width) {
                    const elX = rect.left;
                    const elW = rect.width;
                    if ((trueMouseX - elX) >= elW / 2) {
                        moveDirection = 1;
                    }
                    else {
                        moveDirection = 0;
                    }
                    currentRect = rect;
                    currentColIndex = ths.lastDraggedGroupBoundingRects.indexOf(rect);
                    break;
                }
            }
            if (currentColIndex === undefined) {
                return;
            }
            if (ths.lastDraggedOverRect === currentRect && ths.lastMoveDirection === moveDirection) {
                return;
            }
            ths.lastMoveDirection = moveDirection;
            ths.lastDraggedOverRect = currentRect;
            ths.removeElementHighlight(ths.lastDraggedOverElement);
            ths.removeHighlights(ths.lastDraggedOverElement, moveDirection);
            const draggableInColumn = ths.parentGroups[ths.lastDraggedGroupIndex][currentColIndex];
            ths.lastDraggedOverElement = draggableInColumn;
            let colRangeDraggedParentInd = -1;
            let colRangeDraggedChildInd = -1;
            let colRangeDroppedParentInd = -1;
            let colRangeDroppedChildInd = -1;
            let draggedInd = -1;
            let droppedInd = -1;
            let draggedGroup = null;
            const pGroup = ths.colDataGroups.forEach((group, groupInd) => group.forEach((columnData, index) => {
                const item = columnData.child;
                if (item === ths.getRelatedHeader(ths.draggingColumn)) {
                    colRangeDraggedParentInd = groupInd;
                    colRangeDraggedChildInd = ths.getRangePosition(columnData); // index;
                    draggedInd = index;
                    draggedGroup = group;
                }
                if (item === ths.getRelatedHeader(ths.lastDraggedOverElement)) {
                    colRangeDroppedParentInd = groupInd;
                    colRangeDroppedChildInd = ths.getRangePosition(columnData); // index;
                    droppedInd = index;
                }
            }));
            if (ths.draggingColumn === ths.lastDraggedOverElement) {
                return;
            }
            let parentRanges = null;
            const tempRanges = ths.colRangeGroups.concat();
            let parentRangeIndex = -1;
            tempRanges.sort((a, b) => b.length - a.length);
            tempRanges.forEach((item, index) => {
                if (!parentRanges && item.length < draggedGroup.length) {
                    parentRanges = item;
                    parentRangeIndex = ths.colRangeGroups.indexOf(item);
                }
            });
            const fromOrder = (colRangeDraggedChildInd + 1);
            const toOrder = (colRangeDroppedChildInd + 1);
            // if has to stay within ranges, get ranges and swap
            if (parentRanges !== null) {
                ths.colRangeGroups[parentRangeIndex].forEach(range => {
                    const lowRange = range[0];
                    const highRange = range[1];
                    if (fromOrder >= lowRange && fromOrder < highRange && toOrder >= lowRange && toOrder < highRange) {
                        if (colRangeDraggedParentInd === colRangeDroppedParentInd) {
                            if (moveDirection === 1) {
                                ths.lastDraggedOverElement.classList.add('highlight-right');
                            }
                            else {
                                ths.lastDraggedOverElement.classList.add('highlight-left');
                            }
                            ths.elementsWithHighlight.push({ el: ths.lastDraggedOverElement, moveDirection });
                        }
                    }
                });
            }
            else {
                if (colRangeDraggedParentInd === colRangeDroppedParentInd) {
                    if (moveDirection === 1) {
                        ths.lastDraggedOverElement.classList.add('highlight-right');
                    }
                    else {
                        ths.lastDraggedOverElement.classList.add('highlight-left');
                    }
                    ths.elementsWithHighlight.push({ el: ths.lastDraggedOverElement, moveDirection });
                }
            }
        }
        if (!ths.dragging) {
            return;
        }
        let mouseOffset = Math.round(event.clientX) - Math.round(ths.startX);
        const widthsNeedUpdating = Math.round(event.clientX) !== ths.startX;
        ths.startX = Math.round(event.clientX); // reset starting X
        let newWidth = ths.totalComputedWidth + mouseOffset;
        const allowableWidthChange = newWidth - ths.totalComputedMinWidth;
        if (allowableWidthChange <= 0) {
            return;
        }
        if (widthsNeedUpdating) {
            ths.updateWidths(newWidth);
        }
        ths.columnResize.emit({
            pointerEvent: event,
            columnWidth: ths.totalComputedWidth,
            columnMinWidth: ths.totalComputedMinWidth
        });
        const customResizeEvent = new CustomEvent(ColumnResizeEvent.ON_RESIZE, {
            detail: {
                pointerEvent: event,
                columnWidth: ths.totalComputedWidth,
                columnMinWidth: ths.totalComputedMinWidth
            }
        });
        ths.elementRef.nativeElement.parentElement.dispatchEvent(customResizeEvent);
    }
    getLastVisibleColumnClass() {
        let highestOrderIndex = 0;
        let lastVisibleColumnClass = '';
        this.gridTemplateClasses.forEach(className => {
            const classNameIndex = this.gridTemplateClasses.indexOf(className);
            const gridOrderIndex = this.gridOrder.indexOf(classNameIndex + 1);
            if (this.hiddenColumnIndices.indexOf(gridOrderIndex + 1) === -1) {
                if (gridOrderIndex > highestOrderIndex) {
                    highestOrderIndex = gridOrderIndex;
                    lastVisibleColumnClass = className;
                }
            }
        });
        return lastVisibleColumnClass;
    }
    getRangePosition(columnData) {
        let subGroups = columnData.subGroups;
        let child = columnData;
        while (subGroups.length > 0) {
            child = subGroups[0];
            subGroups = child.subGroups;
        }
        return child.nthChild - 1;
    }
    columnIsHiddenWithClass(className) {
        const classNameIndex = this.gridTemplateClasses.indexOf(className);
        const gridOrderIndex = this.gridOrder.indexOf(classNameIndex + 1);
        return this.hiddenColumnIndices.indexOf(gridOrderIndex + 1) !== -1;
    }
    getTotalGroupedColumnsVisible(sortableWidths) {
        const len = sortableWidths.length;
        let totalGroupedColumnsVisible = 0;
        for (let i = 0; i < len; i++) {
            const item = sortableWidths[i];
            if (!this.columnIsHiddenWithClass(item.className)) {
                totalGroupedColumnsVisible++;
            }
        }
        return totalGroupedColumnsVisible;
    }
    getFirstGridOrderIndexAfterColumnGroup(sortableWidthGroup) {
        let maxIndex = -1;
        sortableWidthGroup.forEach(classItem => {
            const columnIndx = this.gridTemplateClasses.indexOf(classItem.className);
            const gridOrderIndex = this.gridOrder.indexOf(columnIndx + 1);
            if (maxIndex < gridOrderIndex) {
                maxIndex = gridOrderIndex;
            }
        });
        return maxIndex + 1;
    }
    // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
    getPostColumnWidthTotal(startingIndex) {
        let count = 0;
        for (let i = startingIndex; i < this.gridOrder.length; i++) {
            const clsIndex = this.gridOrder[i] - 1;
            let perc = Number(this.classWidths[clsIndex].toString().replace('%', ''));
            if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
                count += perc;
            }
        }
        return count;
    }
    // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
    getPostColumnMinimumWidthTotal(startingIndex) {
        let count = 0;
        for (let i = startingIndex; i < this.gridOrder.length; i++) {
            const clsIndex = this.gridOrder[i] - 1;
            let perc = Number(this.minWidths[clsIndex].toString().replace('%', ''));
            if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
                count += perc;
            }
        }
        return count;
    }
    // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
    getPreviousColumnWidthTotal(sortableWidthGroup) {
        let count = 0;
        let minIndex = Infinity;
        sortableWidthGroup.forEach(classItem => {
            const columnIndx = this.gridTemplateClasses.indexOf(classItem.className);
            const gridOrderIndex = this.gridOrder.indexOf(columnIndx + 1);
            if (minIndex > gridOrderIndex) {
                minIndex = gridOrderIndex;
            }
        });
        for (let i = 0; i < minIndex; i++) {
            const classIndx = this.gridOrder[i] - 1;
            const wdth = Number(this.classWidths[classIndx].toString().replace('%', ''));
            count += wdth;
        }
        return count;
    }
    updateWidthsInPercent(newWidth, sortableWidths, totalGroupedColumnsVisible, sortableWidthGroup) {
        let totalTableWidth = this.viewport.clientWidth;
        let newWidthInPercent = newWidth / totalTableWidth * 100;
        const classMinWidths = sortableWidths.map((item) => item.minWidth);
        const groupMinWidthCalc = classMinWidths.reduce((prev, curr) => prev + curr);
        const firstGridOrderIndexAfterColumnGroup = this.getFirstGridOrderIndexAfterColumnGroup(sortableWidthGroup);
        const colsPastMinWidthCalc = this.getPostColumnMinimumWidthTotal(firstGridOrderIndexAfterColumnGroup);
        const colsPastMinWidthInPercent = colsPastMinWidthCalc / totalTableWidth * 100;
        const colsPastWidthPerc = this.getPostColumnWidthTotal(firstGridOrderIndexAfterColumnGroup);
        let prevColPercentTotal = 0;
        prevColPercentTotal = this.getPreviousColumnWidthTotal(sortableWidthGroup);
        const percentMoved = (prevColPercentTotal + newWidthInPercent + colsPastWidthPerc) - 100;
        if (prevColPercentTotal + newWidthInPercent + colsPastMinWidthInPercent > 100) {
            const actualPerCanMove = 100 - (prevColPercentTotal + colsPastMinWidthInPercent);
            newWidthInPercent = actualPerCanMove;
        }
        if (newWidth < groupMinWidthCalc) {
            newWidthInPercent = groupMinWidthCalc / totalTableWidth * 100;
        }
        sortableWidths.sort((item1, item2) => {
            const wdth1 = item1.width;
            const wdth2 = item2.width;
            if (wdth1 === wdth2) {
                return 0;
            }
            return wdth1 < wdth2 ? -1 : 1;
        });
        const mappedGroupWidthsInPixels = sortableWidths.map(item => item.width);
        const totalPrevGroupWidths = mappedGroupWidthsInPixels.reduce((prev, curr) => prev + curr);
        const dispersedPercs = sortableWidths.map(item => item.width / totalPrevGroupWidths);
        const totalPercMoved = newWidthInPercent - (totalPrevGroupWidths / totalTableWidth * 100);
        let additionalPercentFromColumnsToSmall = 0;
        const sortableWidthsLen = sortableWidths.length;
        sortableWidths.forEach((item, index) => {
            const classIndex = this.gridTemplateClasses.indexOf(item.className);
            const minWidthInPercent = this.minWidths[classIndex] / totalTableWidth * 100;
            let calculatedPercent = dispersedPercs[index] * newWidthInPercent;
            if (calculatedPercent < minWidthInPercent) {
                additionalPercentFromColumnsToSmall += minWidthInPercent - calculatedPercent;
                calculatedPercent = minWidthInPercent;
            }
            else {
                const itemsRemaining = sortableWidthsLen - index - 1;
                if (itemsRemaining !== 0) {
                    const extraAmtToRemove = additionalPercentFromColumnsToSmall / itemsRemaining;
                    calculatedPercent -= extraAmtToRemove;
                    additionalPercentFromColumnsToSmall -= extraAmtToRemove;
                }
            }
            const colWidthInPercent = calculatedPercent.toString() + '%';
            this.classWidths[classIndex] = colWidthInPercent;
        });
        let remainingPercToDisperse = totalPercMoved + additionalPercentFromColumnsToSmall;
        const maxPercsCanMovePerCol = [];
        for (let i = firstGridOrderIndexAfterColumnGroup; i < this.gridOrder.length; i++) {
            const clsIndex = this.gridOrder[i] - 1;
            let perc = Number(this.classWidths[clsIndex].toString().replace('%', ''));
            let minWidthPerc = (this.minWidths[clsIndex] / totalTableWidth * 100);
            if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
                maxPercsCanMovePerCol.push({
                    moveAmt: percentMoved > 0 ? perc - minWidthPerc : perc,
                    classIndex: clsIndex
                });
            }
        }
        const totalPercsCanMove = maxPercsCanMovePerCol.reduce((prev, curr) => prev + curr.moveAmt, 0.0000001);
        maxPercsCanMovePerCol.forEach((item) => {
            const percOfTotalMovementAllowed = item.moveAmt / totalPercsCanMove;
            const percOfRemainingDispersement = percOfTotalMovementAllowed * remainingPercToDisperse;
            const perc = Number(this.classWidths[item.classIndex].toString().replace('%', ''));
            const dispersedWidth = perc - percOfRemainingDispersement;
            this.classWidths[item.classIndex] = dispersedWidth + '%';
        });
        newWidth = newWidthInPercent / 100 * totalTableWidth;
        let amountMoved = newWidth - totalPrevGroupWidths;
        amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points
        this.totalComputedWidth += amountMoved;
        const gridTemplateColumns = this.constructGridTemplateColumns();
        this.gridTemplateTypes.forEach(styleObj => {
            styleObj.style.innerHTML = this.id + ' .' + this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
            this.setStyleContent();
        });
    }
    updateWidthsInPixels(newWidth, sortableWidths, totalGroupedColumnsVisible) {
        let remainingWidth = this.totalComputedWidth - newWidth;
        sortableWidths.forEach((item) => {
            const maxPercOfRemaining = 1 / totalGroupedColumnsVisible;
            let amountMoved = 0;
            const resizeID = this.id + ' .' + item.className;
            if (item.width - item.minWidth < maxPercOfRemaining * remainingWidth) {
                amountMoved = item.width - item.minWidth;
            }
            else {
                amountMoved = maxPercOfRemaining * remainingWidth;
            }
            amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points
            const classIndex = this.gridTemplateClasses.indexOf(item.className);
            this.classWidths[classIndex] = (item.width - amountMoved);
            const markupItem = this.stylesByClass.filter(style => style.id === resizeID)[0];
            let markup = resizeID + ' { width: ' + (item.width - amountMoved) + 'px }';
            markupItem.markup = markup;
            markupItem.width = (item.width - amountMoved).toString();
            this.totalComputedWidth -= amountMoved;
        });
        const gridTemplateColumns = this.constructGridTemplateColumns();
        this.gridTemplateTypes.forEach(styleObj => {
            styleObj.style.innerHTML = this.id + ' .' + this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
            this.setStyleContent();
        });
    }
    fitWidthsToOneHundredPercent() {
        const numericalWidths = this.classWidths.map((wdth, index) => Number(wdth.replace('%', '')));
        const widthTotal = numericalWidths.reduce((prev, wdth) => {
            return prev + wdth;
        }, 0);
        const scaledWidths = numericalWidths.map((wdth, index) => {
            return {
                width: wdth / widthTotal * 100,
                index: index
            };
        });
        scaledWidths.forEach((item, index) => {
            this.classWidths[item.index] = scaledWidths[item.index].width.toString() + '%';
        });
    }
    updateWidths(newWidth) {
        const currentWidths = this.currentClassesToResize.map((resizeClass) => {
            return this.getClassWidthInPixels(resizeClass);
        });
        const sortableWidths = currentWidths.map((w, index) => {
            return {
                minWidth: this.minWidths[index],
                width: w,
                className: this.currentClassesToResize[index]
            };
        });
        const visibleSortableWidths = sortableWidths.filter(item => {
            return !this.columnIsHiddenWithClass(item.className);
        });
        const totalGroupedColumnsVisible = this.getTotalGroupedColumnsVisible(visibleSortableWidths);
        if (this.resizeColumnWidthByPercent) {
            this.updateWidthsInPercent(newWidth, visibleSortableWidths, totalGroupedColumnsVisible, sortableWidths);
        }
        else {
            this.updateWidthsInPixels(newWidth, visibleSortableWidths, totalGroupedColumnsVisible);
        }
        this.generateWidthStyle();
    }
    generateWidthStyle() {
        let innerHTML = '';
        this.stylesByClass.forEach(item => {
            innerHTML += item.markup;
        });
        this.widthStyle.innerHTML = innerHTML;
        this.setStyleContent();
    }
    getResizableClasses(el) {
        return el ? el['dataClasses'] : null;
    }
    setResizableStyles() {
        const allElementsWithDataResizable = this.columnsWithDataClasses;
        let el;
        const classesUsed = [];
        let fragment;
        let style;
        let styleText = '';
        if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
            fragment = document.createDocumentFragment();
            style = document.createElement('style');
            style.type = 'text/css';
        }
        else {
            fragment = this.gridService.linkedDirectiveObjs[this.linkClass].widthStyleFragment;
            style = this.gridService.linkedDirectiveObjs[this.linkClass].widthStyle;
        }
        let markup;
        if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
            for (let i = 0; i < allElementsWithDataResizable.length; i++) {
                el = allElementsWithDataResizable[i];
                const resizeClasses = this.getResizableClasses(el);
                resizeClasses.forEach((resizeCls) => {
                    if (classesUsed.indexOf(resizeCls) === -1) {
                        const firstEl = this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];
                        const startingWidth = !!this.initialWidths[resizeCls] ? this.initialWidths[resizeCls] : firstEl.offsetWidth;
                        // Override percentage if we have widthPercent enabled
                        const startingWidthPercent = this.initialWidths[resizeCls];
                        const resizeID = this.id + ' .' + resizeCls;
                        if (this.resizeColumnWidthByPercent || startingWidth.toString().includes('%')) {
                            markup = resizeID + ' { width: ' + 100 + '%}';
                            this.resizeColumnWidthByPercent = true;
                            this.attachContentResizeSensor();
                        }
                        else {
                            markup = resizeID + ' { width: ' + startingWidth + 'px }';
                        }
                        styleText += markup;
                        this.stylesByClass.push({ style, id: resizeID, resizeClass: resizeCls, markup, width: startingWidth });
                        classesUsed.push(resizeCls);
                    }
                });
            }
        }
        else {
            this.stylesByClass = this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass;
        }
        if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
            style.innerHTML = styleText;
        }
        fragment.appendChild(style);
        this.widthStyle = style;
        this.widthStyleFragment = fragment;
        this.addStyle(style, false);
        if (this.linkClass) {
            if (this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
                this.gridService.linkedDirectiveObjs[this.linkClass] = {};
                this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective = this;
                this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass = this.stylesByClass;
            }
            this.gridService.linkedDirectiveObjs[this.linkClass].widthStyleFragment = fragment;
            this.gridService.linkedDirectiveObjs[this.linkClass].widthStyle = style;
        }
    }
    addStyle(style, addToContent = true) {
        if (this.styleList.indexOf(style) === -1) {
            this.styleList.push(style);
        }
        if (addToContent) {
            this.setStyleContent();
        }
    }
    setStyleContent() {
        this.styleContent = '';
        this.styleList.forEach(style => {
            this.styleContent += style.innerHTML;
        });
        this.headStyle.innerHTML = this.styleContent;
    }
    moveStyleContentToProminent() {
        this.headTag.appendChild(this.headStyle);
    }
    setReorderStyles() {
        if (this.linkClass === undefined || (this.gridService.linkedDirectiveObjs[this.linkClass] && this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle === undefined)) {
            const fragment = document.createDocumentFragment();
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = this.id + ' .highlight-left div:after, ' + this.id + ' .highlight-right div:after { height: 200px !important }';
            fragment.appendChild(style);
            this.reorderHighlightStyle = style;
            this.reorderHighlightStyleFragment = fragment;
            this.addStyle(style, false);
            if (this.linkClass) {
                this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle = this.reorderHighlightStyle;
                this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyleFragment = this.reorderHighlightStyleFragment;
            }
        }
        else {
            this.reorderHighlightStyle = this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle;
            this.reorderHighlightStyleFragment = this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyleFragment;
        }
    }
    getColSpan(element) {
        const colSpan = element.getAttribute('colspan');
        return colSpan === null ? 1 : Number(colSpan);
    }
    validateColumnSpansAreTheSame(colSpans) {
        if (colSpans.length === 0) {
            throw Error('No columns appear to exist.');
        }
        const colLength = colSpans[0];
        const invalidColLengths = colSpans.filter(item => item !== colLength);
        if (invalidColLengths.length > 0) {
            throw Error('Grid column lengths do not match.  Please check your colspans.');
        }
    }
    onPointerUp(event) {
        const ths = document['currentGridDirective'];
        ths.removePointerListeners();
        if (ths.elementRef.nativeElement.reordering) {
            ths.elementRef.nativeElement.reordering = false;
            ths.removeDragAndDropComponent();
            if (!ths.lastDraggedOverElement) {
                return;
            }
            ths.removeElementHighlight(ths.lastDraggedOverElement);
            ths.removeHighlights();
            if (ths.reorderGrips.length !== 0) {
                ths.reorderColumns(event);
            }
            ths.columnReorderEnd.emit({
                pointerEvent: event,
                columnDragged: ths.draggingColumn,
                columnHovered: ths.lastDraggedOverElement
            });
            const customReorderEndEvent = new CustomEvent(ColumnReorderEvent.ON_REORDER_END, {
                detail: {
                    pointerEvent: event,
                    columnDragged: ths.draggingColumn,
                    columnHovered: ths.lastDraggedOverElement
                }
            });
            ths.elementRef.nativeElement.parentElement.dispatchEvent(customReorderEndEvent);
            ths.lastDraggedOverElement = null;
            ths.lastMoveDirection = -1;
            ths.draggingColumn.classList.remove('dragging');
            ths.draggingColumn = null;
        }
        if (!ths.dragging) {
            return;
        }
        ths.columnResizeEnd.emit({
            pointerEvent: event,
            columnWidth: ths.totalComputedWidth,
            columnMinWidth: ths.totalComputedMinWidth,
            classesBeingResized: ths.currentClassesToResize
        });
        const customResizeEndEvent = new CustomEvent(ColumnResizeEvent.ON_RESIZE_END, {
            detail: {
                pointerEvent: event,
                columnWidth: ths.totalComputedWidth,
                columnMinWidth: ths.totalComputedMinWidth,
                classesBeingResized: ths.currentClassesToResize
            }
        });
        ths.elementRef.nativeElement.parentElement.dispatchEvent(customResizeEndEvent);
        ths.endDrag(event);
    }
    addPointerListeners() {
        this.document['currentGridDirective'] = this;
        this.document.addEventListener('pointermove', this.onPointerMove);
        this.document.addEventListener('pointerup', this.onPointerUp);
    }
    removePointerListeners() {
        this.document['currentGridDirective'] = null;
        this.document.removeEventListener('pointermove', this.onPointerMove);
        this.document.removeEventListener('pointerup', this.onPointerUp);
    }
    endDrag(event) {
        if (!this.dragging) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
        this.totalComputedMinWidth = 0;
        this.totalComputedWidth = 0;
        this.currentClassesToResize = [];
        this.minWidths = [];
        this.startingWidths = [];
        this.dragging = false;
    }
    initGrid() {
        if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
            this.headStyle = document.createElement('style');
            this.headStyle.type = 'text/css';
            this.headTag.appendChild(this.headStyle);
        }
        else {
            this.headStyle = this.gridService.linkedDirectiveObjs[this.linkClass].headStyle;
        }
        this.generateContainerID();
        this.generateViewportID();
        this.attachContentResizeSensor();
        this.setResizableStyles();
        this.setReorderStyles();
        this.generateColumnGroups();
        this.setGridTemplateClasses();
        if (this.linkClass !== undefined && this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass) {
            this.stylesByClass = this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass;
            this.classWidths = this.gridService.linkedDirectiveObjs[this.linkClass].classWidths;
        }
        if (this.linkClass !== undefined && this.gridService.linkedDirectiveObjs[this.linkClass].classWidths) {
            this.classWidths = this.gridService.linkedDirectiveObjs[this.linkClass].classWidths;
        }
        else {
            this.classWidths = this.calculateWidthsFromStyles();
            if (this.linkClass) {
                this.gridService.linkedDirectiveObjs[this.linkClass].classWidths = this.classWidths;
            }
        }
        this.setGridOrder();
        this.emitGridInitialization();
    }
    setGridTemplateClasses() {
        let ind = -1;
        let highestLen = 0;
        let group;
        for (let index = 0; index < this.parentGroups.length; index++) {
            group = this.parentGroups[index];
            if (group.length > highestLen) {
                highestLen = group.length;
                ind = index;
            }
        }
        if (this.parentGroups.length !== 0) {
            this.parentGroups[ind].forEach((item2, index) => {
                this.gridTemplateClasses.push(this.getResizableClasses(item2)[0]);
            });
        }
        if (this.linkClass) {
            if (!this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses) {
                this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses = this.gridTemplateClasses;
            }
            else {
                this.verifyLinkedTemplateClassesMatch();
            }
        }
    }
    verifyLinkedTemplateClassesMatch() {
        let columnsAreTheSame = true;
        this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses.forEach((item, index) => {
            if (item !== this.gridTemplateClasses[index]) {
                columnsAreTheSame = false;
            }
        });
        if (!columnsAreTheSame) {
            throw Error(`Column classes must match for linked tables:\n\n ${this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses}\n   does not match\n ${this.gridTemplateClasses}\n`);
        }
    }
    calculateWidthsFromStyles() {
        if (!this.stylesByClass[0].width.toString().includes('%') && this.classWidths.length === 0 && this.resizeColumnWidthByPercent) {
            return this.stylesByClass.map((styleObj, index) => {
                return (Math.round((1 / this.stylesByClass.length) * 10000) / 100).toString() + '%';
            });
        }
        else {
            return this.stylesByClass.map((styleObj, index) => {
                if (styleObj.width.toString().includes('%')) {
                    return styleObj.width;
                }
                else {
                    return Number(styleObj.width);
                }
            });
        }
        return [];
    }
    emitGridInitialization() {
        const emitterObj = {
            gridComponent: this,
            gridElement: this.elementRef.nativeElement
        };
        this.preGridInitialize.emit(emitterObj);
        this.gridInitialize.emit(emitterObj);
        const customGridInitializedEvent = new CustomEvent(GridEvent.ON_INITIALIZED, {
            detail: {
                gridComponent: emitterObj.gridComponent,
                gridElement: emitterObj.gridComponent,
                type: GridEvent.ON_INITIALIZED
            }
        });
        this.elementRef.nativeElement.parentElement.dispatchEvent(customGridInitializedEvent);
    }
    createDragAndDropComponent() {
        const componentRef = this.openModal(DragAndDropGhostComponent, this.DRAG_AND_DROP_GHOST_OVERLAY_DATA, {});
        this.dragAndDropGhostComponent = componentRef.instance;
    }
    openModal(componentType, token, data, positionStrategy = null, overlayConfig = null) {
        if (!positionStrategy) {
            positionStrategy = this.overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically();
        }
        if (!overlayConfig) {
            overlayConfig = new OverlayConfig({
                hasBackdrop: true,
                backdropClass: 'modal-bg',
                panelClass: 'modal-container',
                scrollStrategy: this.overlay.scrollStrategies.block(),
                positionStrategy
            });
        }
        this.overlayRef = this.overlay.create(overlayConfig);
        this.injector = this.createInjector(data, token);
        const containerPortal = new ComponentPortal(componentType, null, this.injector);
        const containerRef = this.overlayRef.attach(containerPortal);
        return containerRef;
    }
    createInjector(dataToPass, token) {
        return Injector.create({
            parent: this.injector,
            providers: [
                { provide: token, useValue: dataToPass }
            ]
        });
    }
    setDragAndDropPosition(x, y) {
        this.dragAndDropGhostComponent.left = x;
        this.dragAndDropGhostComponent.top = y;
    }
    removeDragAndDropComponent() {
        if (this.overlayRef) {
            this.overlayRef.detach();
        }
    }
    setParentGroups(allElementsWithDataResizable) {
        const colSpans = [];
        let currSpanCount = 0;
        let lastParent = null;
        let children;
        let columnStart = 1;
        let colRanges = [];
        this.colRangeGroups.push(colRanges);
        let item;
        for (let index = 0; index < allElementsWithDataResizable.length; index++) {
            const item = allElementsWithDataResizable[index];
            const span = this.getColSpan(item);
            if (item.parentElement !== lastParent) {
                if (index !== 0) {
                    colSpans.push(currSpanCount);
                    columnStart = 1;
                    colRanges = [];
                    this.colRangeGroups.push(colRanges);
                }
                currSpanCount = 0;
                lastParent = item.parentElement;
                children = [];
                this.parentGroups.push(children);
            }
            colRanges.push([columnStart, (span + columnStart)]);
            currSpanCount += span;
            columnStart += span;
            children.push(item);
        }
        colSpans.push(currSpanCount);
        this.validateColumnSpansAreTheSame(colSpans);
    }
    generateColumnGroups() {
        const allElementsWithDataResizable = this.columnsWithDataClasses;
        const arr = allElementsWithDataResizable;
        let colOrder = 1;
        let lastParent = null;
        let lastGroup = null;
        let lastOrder = 0;
        let lastIndex = 0;
        let spanCount = 0;
        let colDataGroup = [];
        this.colDataGroups.push(colDataGroup);
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            if (item.parentElement !== lastParent) {
                if (index !== 0) {
                    colOrder = 1;
                    lastGroup = colDataGroup;
                    lastOrder = index;
                    lastIndex = 0;
                    colDataGroup = [];
                    this.colDataGroups.push(colDataGroup);
                }
                lastParent = item.parentElement;
            }
            colOrder = index + 1 - lastOrder;
            if (lastGroup !== null) {
                if (lastGroup[lastIndex].span < (colOrder - spanCount)) {
                    spanCount += lastGroup[lastIndex].span;
                    lastIndex++;
                }
            }
            this.colData = {
                order: colOrder,
                lastDataSpan: (colOrder - spanCount),
                nthChild: colOrder,
                span: this.getColSpan(item),
                subGroups: [],
                parent: item.parentElement,
                child: item,
                linkedChildren: [],
                subColumnLength: 0
            };
            colDataGroup.push(this.colData);
        }
        let groupsWereSet = false;
        if (this.linkClass && this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups) {
            this.verifyLinkedGroupStructuresMatch(this.colDataGroups, this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups);
            groupsWereSet = true;
            this.colDataGroups = this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups;
            this.colDataGroups = this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups;
        }
        if (this.linkClass) {
            this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups = this.colDataGroups;
        }
        if (!groupsWereSet) {
            let columnGroup;
            for (let index = 0, len = this.colDataGroups.length; index < len; index++) {
                columnGroup = this.colDataGroups[index];
                if (index < this.colDataGroups.length - 1) {
                    this.generateSubGroup(columnGroup, this.colDataGroups[index + 1]);
                }
                if (index === len - 1) {
                    this.orderSubGroups(columnGroup);
                }
            }
        }
        else {
            this.setLinkedHeaderContainerClasses();
            this.setLinkedChildren();
            if (this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs) {
                this.gridTemplateTypes = this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateTypes;
                this.styleList = this.gridService.linkedDirectiveObjs[this.linkClass].styleList;
                this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs;
                this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles;
                this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments;
                this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder;
            }
        }
    }
    verifyLinkedGroupStructuresMatch(colDataGroups1, colDataGroups2) {
        let columnGroupsAreTheSame = true;
        if (colDataGroups1.length !== colDataGroups2.length) {
            columnGroupsAreTheSame = false;
        }
        for (let i = 0; i < colDataGroups1.length; i++) {
            const colDataGroup1 = colDataGroups1[i];
            const colDataGroup2 = colDataGroups2[i];
            if (colDataGroup1.length !== colDataGroup2.length) {
                columnGroupsAreTheSame = false;
            }
        }
        if (!columnGroupsAreTheSame) {
            throw Error(`The header structure for linked tables does not match.\nPlease check your column spans.`);
        }
    }
    setHiddenClassForAllLinkedParentHeaders() {
        const flattenedHierarchy = this.getFlattenedHierarchy();
        const flattenedHeirarchyLenMin1 = flattenedHierarchy.length - 1;
        // start at the end to get the deepest child possible
        for (let i = flattenedHeirarchyLenMin1; i >= 0; i--) {
            const columnHierarchy = flattenedHierarchy[i];
        }
        const elementsReshown = [];
        const startIndex = this.colDataGroups.length - 2;
        for (let i = startIndex; i >= 0; i--) {
            const colDataGroup = this.colDataGroups[i];
            for (let j = 0; j < colDataGroup.length; j++) {
                const columnData = colDataGroup[j];
                const parentElement = columnData.child;
                const parentWasHidden = parentElement.hideColumn;
                let hiddenChildCount = 0;
                for (let k = 0; k < columnData.subGroups.length; k++) {
                    const subGroup = columnData.subGroups[k];
                    if (subGroup.child.hideColumn) {
                        hiddenChildCount++;
                    }
                }
                if (columnData.subGroups.length !== 0) {
                    if (!parentWasHidden && hiddenChildCount === columnData.subGroups.length) {
                        parentElement.hideColumn = true;
                        this.setHiddenClassForColumnGroup(columnData.child, colDataGroup[j]);
                    }
                    else if (parentWasHidden && hiddenChildCount < columnData.subGroups.length) {
                        parentElement.hideColumn = false;
                        elementsReshown.push(parentElement);
                    }
                }
            }
        }
        return elementsReshown;
    }
    setHiddenClassForAllLinkedHeaders(element) {
        for (let i = 0; i < this.colDataGroups.length; i++) {
            const colDataGroup = this.colDataGroups[i];
            for (let j = 0; j < colDataGroup.length; j++) {
                this.setHiddenClassForColumnGroup(element, colDataGroup[j]);
            }
        }
    }
    setHiddenClassForColumnGroup(element, columnGroup) {
        const columnData = columnGroup;
        if (columnData.child === element) {
            element.classList.remove(this.HIDDEN_COLUMN_CLASS);
            const hideColumn = element.hideColumn;
            if (hideColumn) {
                element.classList.add(this.HIDDEN_COLUMN_CLASS);
            }
            columnData.linkedChildren.forEach((header) => {
                header.hideColumn = hideColumn;
                header.classList.remove(this.HIDDEN_COLUMN_CLASS);
                if (hideColumn) {
                    header.classList.add(this.HIDDEN_COLUMN_CLASS);
                }
            });
            for (let i = 0; i < columnData.subGroups.length; i++) {
                const subGroup = columnData.subGroups[i];
                subGroup.child.hideColumn = hideColumn;
                this.setHiddenClassForColumnGroup(subGroup.child, subGroup);
            }
        }
    }
    getRelatedHeaders(element) {
        if (element.relatedElements) {
            return element.relatedElements;
        }
        let relatedElements = [];
        for (let i = 0; i < this.colDataGroups.length; i++) {
            const colDataGroup = this.colDataGroups[i];
            for (let j = 0; j < colDataGroup.length; j++) {
                const columnData = colDataGroup[j];
                if (element === columnData.child || this.getRelatedHeader(element) === columnData.child) {
                    relatedElements.push(columnData.child);
                    columnData.linkedChildren.forEach(child => {
                        relatedElements.push(child);
                    });
                }
            }
        }
        return relatedElements;
    }
    getRelatedHeader(element) {
        if (element.relatedElement) {
            return element.relatedElement;
        }
        let relatedElement = null;
        for (let i = 0; i < this.colDataGroups.length; i++) {
            const colDataGroup = this.colDataGroups[i];
            for (let j = 0; j < colDataGroup.length; j++) {
                const columnData = colDataGroup[j];
                const filteredChildren = columnData.linkedChildren.filter(child => child === element);
                if (filteredChildren.length > 0) {
                    relatedElement = columnData.child;
                }
            }
        }
        element.relatedElement = relatedElement ? relatedElement : element;
        return element.relatedElement;
    }
    setLinkedChildren() {
        let dataIndex = 0;
        for (let i = 0; i < this.colDataGroups.length; i++) {
            const colDataGroup = this.colDataGroups[i];
            for (let j = 0; j < colDataGroup.length; j++) {
                const columnData = colDataGroup[j];
                const column = this.columnsWithDataClasses[dataIndex + j];
                columnData.linkedChildren.push(column);
            }
            dataIndex += colDataGroup.length;
        }
    }
    setLinkedHeaderContainerClasses() {
        let dataIndex = 0;
        for (let i = 0; i < this.colDataGroups.length; i++) {
            const colDataGroup = this.colDataGroups[i];
            const column = this.columnsWithDataClasses[dataIndex];
            dataIndex += colDataGroup.length;
            const containerClass = 'column-container-' + i;
            this.addClassToLinkedHeader(column.parentElement, containerClass);
        }
    }
    addClassToLinkedHeader(element, cls) {
        if (!element.classList.contains(cls)) {
            element.classList.add(cls);
        }
    }
    generateSubGroup(currentGroup, subGroup) {
        let indexCount = 0;
        currentGroup.forEach((group, index) => {
            const classLen = group.child.dataClasses.length;
            let subClassCount = 0;
            let numOfSubColumns = 0;
            while (subClassCount < classLen) {
                subClassCount += subGroup[indexCount].child.dataClasses.length;
                group.subGroups.push(subGroup[indexCount]);
                indexCount++;
                numOfSubColumns++;
            }
            currentGroup[index].subColumnLength = numOfSubColumns;
        });
    }
    orderSubGroups(columnGroup, columnPlacement = 1, placementStart = 0, order = 1) {
        let style;
        let containerID;
        let fragment;
        let selector;
        if (this.linkClass) {
            if (this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs) {
                this.headStyle = this.gridService.linkedDirectiveObjs[this.linkClass].headStyle;
                this.gridTemplateTypes = this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateTypes;
                this.styleList = this.gridService.linkedDirectiveObjs[this.linkClass].styleList;
                this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs;
                this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles;
                this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments;
                this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder;
            }
            else {
                this.gridService.linkedDirectiveObjs[this.linkClass].headStyle = this.headStyle;
                this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateTypes = this.gridTemplateTypes;
                this.gridService.linkedDirectiveObjs[this.linkClass].styleList = this.styleList;
                this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs = this.subGroupStyleObjs;
                this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles = this.subGroupStyles;
                this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments = this.subGroupFragments;
                this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder = this.gridOrder;
            }
        }
        placementStart = columnPlacement - 1;
        columnGroup.sort((columnData1, columnData2) => {
            return columnData1.order - columnData2.order;
        });
        columnGroup.forEach((columnData) => {
            columnData.order = columnPlacement;
            const tagName = columnData.child.tagName.toLowerCase();
            containerID = 'column-container-' + Array.from(columnData.parent.parentElement.children).indexOf(columnData.parent);
            const parentIndex = Array.from(columnData.parent.parentElement.children).indexOf(columnData.parent);
            this.addClassToLinkedHeader(columnData.parent, containerID);
            selector = this.id + ' .' + containerID + ' ' + tagName + ':nth-child(' + (columnData.nthChild).toString() + ')';
            fragment = document.createDocumentFragment();
            if (this.subGroupStyleObjs[selector]) {
                style = this.subGroupStyleObjs[selector];
            }
            else {
                style = document.createElement('style');
                style.type = 'text/css';
                this.subGroupStyles.push(style);
                this.subGroupFragments.push(fragment);
            }
            this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
            if (this.parentGroups[parentIndex]) {
                if ((this.parentGroups[parentIndex].length) === (columnData.order)) {
                    this.lastColumns[parentIndex] = columnData;
                }
            }
            if (columnData.subGroups.length > 0) {
                this.orderSubGroups(columnData.subGroups, columnPlacement, placementStart, order++);
            }
            else {
                selector = this.id + ' ' + tagName + ':nth-child(' + (columnData.nthChild).toString() + ')';
                fragment = document.createDocumentFragment();
                if (this.subGroupStyleObjs[selector]) {
                    style = this.subGroupStyleObjs[selector];
                }
                else {
                    style = document.createElement('style');
                    style.type = 'text/css';
                    this.subGroupStyles.push(style);
                    this.subGroupFragments.push(fragment);
                }
                this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
                this.gridOrder[columnPlacement - 1] = columnData.nthChild;
                const hasSisterTag = tagName === 'th' || tagName === 'td';
                let sisterTag = null;
                if (hasSisterTag) {
                    sisterTag = tagName === 'th' ? 'td' : 'th';
                    selector = this.id + ' ' + sisterTag + ':nth-child(' + (columnData.nthChild).toString() + ')';
                    fragment = document.createDocumentFragment();
                    if (this.subGroupStyleObjs[selector]) {
                        style = this.subGroupStyleObjs[selector];
                    }
                    else {
                        style = document.createElement('style');
                        style.type = 'text/css';
                        this.subGroupStyles.push(style);
                        this.subGroupFragments.push(fragment);
                    }
                    this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
                }
            }
            columnPlacement += columnData.span;
        });
    }
    setColumnStyle(style, fragment, selector, gridStart, gridEnd, order) {
        style.innerHTML = selector + ' { grid-column-start: ' + (gridStart).toString() + '; grid-column-end: ' + (gridEnd).toString() + '; order: ' + (order).toString() + '; }';
        fragment.appendChild(style);
        this.addStyle(style);
        this.subGroupStyleObjs[selector] = style;
    }
    setGridOrder() {
        const gridTemplateColumns = this.constructGridTemplateColumns();
        if (this.colDataGroups[0].length === 0) {
            return;
        }
        const reqiresNewStyleObjects = this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles === undefined;
        this.colDataGroups.forEach((columnGroup, index) => {
            let style;
            let fragment;
            const selector = this.id + ' .' + this.reorderableClass;
            let styleAlreadyExisted = false;
            if (this.subGroupStyleObjs[selector]) {
                style = this.subGroupStyleObjs[selector];
                styleAlreadyExisted = true;
            }
            else if (reqiresNewStyleObjects) {
                fragment = document.createDocumentFragment();
                style = document.createElement('style');
                style.type = 'text/css';
                fragment.appendChild(style);
            }
            else {
                fragment = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderFragments[index];
                style = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles[index];
                fragment.appendChild(style);
            }
            style.innerHTML = selector + ' { display: grid; grid-template-columns: ' + gridTemplateColumns + '; }';
            if (!this.subGroupStyleObjs[selector] && reqiresNewStyleObjects) {
                this.gridOrderStyles.push(style);
                this.gridOrderFragments.push(fragment);
            }
            this.subGroupStyleObjs[selector] = style;
            this.addStyle(style);
            if (!styleAlreadyExisted) {
                this.moveStyleContentToProminent();
                this.gridTemplateTypes.push({ style });
            }
            if (index === 0) {
                this.orderSubGroups(columnGroup);
            }
        });
        if (this.linkClass && this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles === undefined) {
            this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderFragments = this.gridOrderFragments;
            this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles = this.gridOrderStyles;
        }
    }
    getOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }
    getParentTablejsGridDirective(el) {
        while (el !== null && el.getAttribute('tablejsGrid') === null) {
            el = el.parentElement;
        }
        return el;
    }
    elementRefUnderPoint(event) {
        const elements = document.elementsFromPoint(event.clientX, event.clientY);
        return elements.filter(item => item === this.elementRef.nativeElement).length > 0;
    }
    getResizeGripUnderPoint(event) {
        const resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
        const elements = resizableElements.filter(item => {
            return item.getAttribute('resizableGrip') !== null;
        });
        return elements;
    }
    getReorderColsUnderPoint(event) {
        const reorderColElements = document.elementsFromPoint(event.clientX, event.clientY);
        const elements = reorderColElements.filter(item => {
            return item.getAttribute('reorderCol') !== null;
        });
        return elements;
    }
    getReorderHandlesUnderPoint(event) {
        const reorderGripElements = document.elementsFromPoint(event.clientX, event.clientY);
        const elements = reorderGripElements.filter(item => {
            return item.getAttribute('reorderGrip') !== null;
        });
        return elements;
    }
    getResizableElements(event) {
        const resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
        let elements = resizableElements.filter(item => {
            return item.getAttribute('tablejsDataColClasses') !== null;
        });
        const noElementsFound = elements.length === 0;
        const iterationLen = noElementsFound ? 1 : elements.length;
        for (let i = 0; i < iterationLen; i++) {
            const item = resizableElements[0];
            let parentElement = item.parentElement;
            while (parentElement !== null) {
                const foundGripParent = !noElementsFound && parentElement === elements[i];
                const foundParentWithColClasses = noElementsFound && parentElement.getAttribute('tablejsDataColClasses') !== null;
                if (foundGripParent || foundParentWithColClasses) {
                    elements = [parentElement];
                    parentElement = null;
                }
                else {
                    parentElement = parentElement.parentElement;
                }
            }
        }
        return elements;
    }
    removeHighlights(elToExclude = null, moveDirection = -2) {
        this.elementsWithHighlight.forEach(item => {
            if (item.el !== elToExclude || item.moveDirection !== moveDirection) {
                this.removeElementHighlight(item.el);
            }
        });
    }
    removeElementHighlight(el) {
        el.classList.remove('highlight-left');
        el.classList.remove('highlight-right');
    }
    reorderColumns(event) {
        const draggableElement = this.lastDraggedOverElement;
        const elRect = draggableElement.getBoundingClientRect();
        const elX = elRect.left;
        const elW = elRect.width;
        this.removeElementHighlight(draggableElement);
        if (this.draggingColumn === draggableElement) {
            return;
        }
        let moveDirection = 0;
        if ((event.clientX - elX) >= elW / 2) {
            moveDirection = 1;
        }
        else {
            moveDirection = 0;
        }
        let colRangeDraggedParentInd = -1;
        let colRangeDraggedChildInd = -1;
        let colRangeDroppedParentInd = -1;
        let colRangeDroppedChildInd = -1;
        let draggedInd = -1;
        let droppedInd = -1;
        let draggedGroup = null;
        const pGroup = this.parentGroups.forEach((group, groupInd) => group.forEach((item, index) => {
            if (item === this.draggingColumn) {
                colRangeDraggedParentInd = groupInd;
                colRangeDraggedChildInd = index;
                draggedInd = index;
                draggedGroup = group;
            }
            if (item === draggableElement) {
                colRangeDroppedParentInd = groupInd;
                colRangeDroppedChildInd = index;
                droppedInd = index;
            }
        }));
        let parentRanges = null;
        const tempRanges = this.colRangeGroups.concat();
        let parentRangeIndex = -1;
        tempRanges.sort((a, b) => b.length - a.length);
        tempRanges.forEach((item, index) => {
            if (!parentRanges && item.length < draggedGroup.length) {
                parentRanges = item;
                parentRangeIndex = this.colRangeGroups.indexOf(item);
            }
        });
        const fromOrder = (colRangeDraggedChildInd + 1);
        const toOrder = (colRangeDroppedChildInd + 1);
        // if has to stay within ranges, get ranges and swap
        if (parentRangeIndex === this.colRangeGroups.length - 1) {
            this.colRangeGroups[parentRangeIndex].forEach(range => {
                const lowRange = range[0];
                const highRange = range[1];
                if (fromOrder >= lowRange && fromOrder < highRange && toOrder >= lowRange && toOrder < highRange) {
                    const data1 = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === fromOrder)[0];
                    const data2 = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === toOrder)[0];
                    const rangeGroup = this.colDataGroups[colRangeDraggedParentInd].slice(range[0] - 1, range[1] - 1);
                    rangeGroup.sort((item1, item2) => {
                        return item1.order - item2.order;
                    });
                    rangeGroup.splice(rangeGroup.indexOf(data1), 1);
                    rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
                    rangeGroup.forEach((item, index) => {
                        item.order = index + 1;
                    });
                }
            });
        }
        else {
            const data1 = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === fromOrder)[0];
            const data2 = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === toOrder)[0];
            const rangeGroup = this.colDataGroups[colRangeDraggedParentInd].concat();
            rangeGroup.sort((item1, item2) => {
                return item1.order - item2.order;
            });
            rangeGroup.splice(rangeGroup.indexOf(data1), 1);
            rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
            rangeGroup.forEach((item, index) => {
                item.order = index + 1;
            });
        }
        this.setGridOrder();
        // need to set a class to resize - default to first so column widths are updated
        const firstItemWidth = this.getFirstVisibleItemWidth();
        this.setMinimumWidths();
        // update widths by first item
        this.totalComputedWidth = firstItemWidth;
        this.updateWidths(firstItemWidth);
    }
    getAverageColumnWidth() {
        let totalTableWidth = this.viewport.clientWidth;
        return totalTableWidth / this.classWidths.length;
    }
    getFirstVisibleItemWidth() {
        let firstVisibleItemIndex = 0;
        for (let i = 0; i < this.gridOrder.length; i++) {
            const classIndex = this.gridOrder[i] - 1;
            if (!this.columnIsHiddenWithClass(this.gridTemplateClasses[classIndex])) {
                firstVisibleItemIndex = i;
                break;
            }
        }
        this.currentClassesToResize = [this.stylesByClass[this.gridOrder[firstVisibleItemIndex] - 1].resizeClass];
        return this.currentClassesToResize.map((resizeClass) => {
            return this.getClassWidthInPixels(resizeClass);
        })[0];
    }
    setLinkedColumnIndicesFromMaster() {
        if (this.linkClass) {
            this.hiddenColumnIndices = this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective.hiddenColumnIndices;
        }
    }
    updateMasterColumnIndices() {
        if (this.linkClass) {
            this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective.hiddenColumnIndices = this.hiddenColumnIndices;
        }
    }
    updateHiddenColumnIndices() {
        this.setLinkedColumnIndicesFromMaster();
        this.hiddenColumnIndices = this.getHiddenColumnIndices();
        this.updateMasterColumnIndices();
    }
    constructGridTemplateColumns() {
        this.updateHiddenColumnIndices();
        this.resizeMakeUpPercent = 0;
        this.resizeMakeUpPerColPercent = 0;
        let remainingCols = this.gridOrder.length - this.hiddenColumnIndices.length;
        this.hiddenColumnIndices.forEach((index) => {
            const classWidthIndex = this.gridOrder[index - 1];
            const amt = this.classWidths[classWidthIndex - 1].toString();
            if (amt.includes('%')) {
                this.resizeMakeUpPercent += Number(amt.replace('%', ''));
            }
        });
        if (this.resizeMakeUpPercent !== 0) {
            this.resizeMakeUpPerColPercent = this.resizeMakeUpPercent / remainingCols;
        }
        let str = '';
        this.gridOrder.forEach((order, index) => {
            let wdth = Number(this.classWidths[order - 1].toString().replace('%', ''));
            wdth = wdth < 0 ? 0 : wdth;
            if (this.classWidths[order - 1].toString().includes('%')) {
                if (this.hiddenColumnIndices.indexOf(index + 1) !== -1) {
                    str += ' 0%';
                    this.classWidths[order - 1] = '0%';
                }
                else {
                    str += ' ' + (wdth + this.resizeMakeUpPerColPercent).toString() + '%';
                    this.classWidths[order - 1] = (wdth + this.resizeMakeUpPerColPercent).toString() + '%';
                }
            }
            else {
                if (this.hiddenColumnIndices.indexOf(index + 1) !== -1) {
                    str += ' 0px';
                }
                else {
                    str += ' ' + wdth.toString() + 'px';
                }
            }
        });
        return str;
    }
    getHiddenColumnIndices() {
        const hiddenColumnIndices = [];
        this.colDataGroups.forEach((columnGroup, index) => {
            if (index === 0) {
                this.orderSubCols(hiddenColumnIndices, columnGroup);
            }
        });
        return hiddenColumnIndices;
    }
    orderSubCols(arr, columnGroup, columnPlacement = 1, placementStart = 0, parentIsHidden = false) {
        placementStart = columnPlacement - 1;
        columnGroup.sort((columnData1, columnData2) => {
            return columnData1.order - columnData2.order;
        });
        columnGroup.forEach(columnData => {
            const startIndex = columnPlacement;
            const columnElement = this.getRelatedHeader(columnData.child);
            const hasSubGroups = columnData.subGroups.length > 0;
            if ((columnElement.hideColumn || parentIsHidden) && !hasSubGroups && arr.indexOf(startIndex) === -1) {
                arr.push(startIndex);
            }
            if (hasSubGroups) {
                this.orderSubCols(arr, columnData.subGroups, columnPlacement, placementStart, columnElement.hideColumn);
            }
            columnPlacement += columnData.span;
        });
    }
    setReorderHighlightHeight(draggableElement) {
        const draggableTop = this.getOffset(draggableElement).top;
        const containerTop = this.getOffset(this.elementRef.nativeElement).top;
        const containerHeightStr = window.getComputedStyle(this.elementRef.nativeElement).getPropertyValue('height');
        const containerHeight = Number(containerHeightStr.substr(0, containerHeightStr.length - 2));
        const highlightHeight = containerHeight - (draggableTop - containerTop) - 1;
        this.reorderHighlightStyle.innerHTML = this.id + ' .highlight-left div:after, ' + this.id + ' .highlight-right div:after { height: ' + highlightHeight + 'px !important }';
        this.setStyleContent();
    }
    retrieveOrCreateElementID(el, hasLinkClass = false) {
        let id = document.body.getAttribute('id');
        if (id === undefined || id === null) {
            id = 'tablejs-body-id';
        }
        document.body.setAttribute('id', id);
        const someID = hasLinkClass ? '' : this.generateGridID(el);
        return '#' + id + someID;
    }
    generateGridID(el) {
        let gridID = el.getAttribute('id');
        if (gridID === null) {
            let i = 0;
            while (document.getElementById('grid-id-' + i.toString()) !== null) {
                i++;
            }
            gridID = 'grid-id-' + i.toString();
            el.classList.add(gridID);
            el.setAttribute('id', gridID);
        }
        return ' .' + gridID; // ' #' + gridID;
    }
    generateContainerID() {
        TablejsGridProxy.GRID_COUNT++;
        const hasLinkClass = this.linkClass !== undefined;
        if (!hasLinkClass) {
            this.id = this.retrieveOrCreateElementID(this.elementRef.nativeElement);
        }
        else {
            this.id = '.' + this.linkClass;
        }
        const parentGridID = this.getParentTablejsGridDirective(this.elementRef.nativeElement.parentElement);
        if (parentGridID !== null) {
            this.id = this.retrieveOrCreateElementID(parentGridID, hasLinkClass) + ' ' + this.id;
        }
    }
    generateViewportID() {
        const viewports = this.infiniteScrollViewports;
        if (viewports.length > 0) {
            this.viewport = viewports[0];
            this.viewportID = this.viewport.getAttribute('id');
            let i = 0;
            while (document.getElementById('scroll-viewport-id-' + i.toString()) !== null) {
                i++;
            }
            this.viewportID = 'scroll-viewport-id-' + i.toString();
            this.viewport.setAttribute('id', this.viewportID);
        }
    }
    attachContentResizeSensor() {
        if (this.resizeColumnWidthByPercent) {
            if (this.viewport === undefined || this.viewport === null) {
                throw Error('A viewport has not be declared.  Try adding the tablejsViewport directive to your tbody tag.');
            }
            if (!this.contentResizeSensor) {
                this.contentResizeSensor = new ResizeSensor(this.viewport.firstElementChild, () => {
                    this.setScrollbarAdjustmentStyle();
                });
                this.scrollbarAdjustmentFragment = document.createDocumentFragment();
                this.scrollbarAdjustmentStyle = document.createElement('style');
                this.setScrollbarAdjustmentStyle();
                this.scrollbarAdjustmentFragment.appendChild(this.scrollbarAdjustmentStyle);
                this.addStyle(this.scrollbarAdjustmentStyle, false);
            }
        }
    }
    setScrollbarAdjustmentStyle() {
        this.scrollbarWidth = this.viewport.offsetWidth - this.viewport.clientWidth;
        this.scrollbarAdjustmentStyle.innerHTML = '#' + this.viewportID + ' .reorderable-table-row { margin-right: -' + this.scrollbarWidth + 'px; }';
        this.setStyleContent();
    }
    clearSelection() {
        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
        }
        else if (this.document['selection']) {
            this.document['selection'].empty();
        }
    }
    addResizableGrip(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationResizableGrips.push(el);
        }
        else {
            this.resizableGrips.push(el);
        }
    }
    addResizableColumn(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationResizableColumns.push(el);
        }
        else {
            this.resizableColumns.push(el);
        }
    }
    addReorderGrip(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationReorderGrips.push(el);
        }
        else {
            this.reorderGrips.push(el);
        }
    }
    addReorderableColumn(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationReorderableColumns.push(el);
        }
        else {
            this.reorderableColumns.push(el);
        }
    }
    addColumnsWithDataClasses(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationColumnsWithDataClasses.push(el);
        }
        else {
            this.columnsWithDataClasses.push(el);
        }
    }
    addRow(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationRows.push(el);
        }
        else {
            this.rows.push(el);
        }
    }
    addInfiniteScrollViewport(el, fromMutation = false) {
        if (fromMutation && !this.isCustomElement) {
            this.mutationInfiniteScrollViewports.push(el);
        }
        else {
            this.infiniteScrollViewports.push(el);
        }
    }
    removeStylesFromHead() {
        this.styleList = [];
        if (this.headTag.contains(this.headStyle)) {
            this.headTag.removeChild(this.headStyle);
            this.headStyle = null;
        }
        if (this.widthStyleFragment && this.widthStyleFragment.contains(this.widthStyle)) {
            this.widthStyleFragment.removeChild(this.widthStyle);
            this.widthStyleFragment = null;
            this.widthStyle = null;
        }
        if (this.reorderHighlightStyleFragment && this.reorderHighlightStyleFragment.contains(this.reorderHighlightStyle)) {
            this.reorderHighlightStyleFragment.removeChild(this.reorderHighlightStyle);
            this.reorderHighlightStyleFragment = null;
            this.reorderHighlightStyle = null;
        }
        for (let i = 0, len = this.subGroupFragments.length; i < len; i++) {
            if (this.subGroupFragments[i] && this.subGroupFragments[i].contains(this.subGroupStyles[i])) {
                this.subGroupFragments[i].removeChild(this.subGroupStyles[i]);
                this.subGroupFragments[i] = null;
                this.subGroupStyles[i] = null;
            }
        }
        for (let i = 0, len = this.gridOrderFragments.length; i < len; i++) {
            if (this.gridOrderFragments[i] && this.gridOrderFragments[i].contains(this.gridOrderStyles[i])) {
                this.gridOrderFragments[i].removeChild(this.gridOrderStyles[i]);
                this.gridOrderFragments[i] = null;
                this.gridOrderStyles[i] = null;
            }
        }
    }
    ngOnDestroy() {
        this.removePointerListeners();
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.linkClass === undefined) {
            this.removeStylesFromHead();
        }
        if (this.initialWidthSettingsSubscription$) {
            this.initialWidthSettingsSubscription$.unsubscribe();
        }
        if (this.hiddenColumnChangesSubscription$) {
            this.hiddenColumnChangesSubscription$.unsubscribe();
        }
        for (let i = 0; i < this.animationFrameIDs.length; i++) {
            const id = this.animationFrameIDs[i];
            window.cancelAnimationFrame(id);
        }
        if (this.document['selection']) {
            this.document['selection'].empty();
        }
        if (document['currentGridDirective'] === this) {
            document['currentGridDirective'] = null;
        }
        if (this.document['hasPointerDownListener']) {
            this.document.removeEventListener('pointerdown', this.pointerListenerFunc);
            this.document['hasPointerDownListener'] = false;
        }
        if (this.elementRef.nativeElement.gridDirective === this) {
            this.elementRef.nativeElement.gridDirective = null;
        }
        if (this.elementRef.nativeElement.parentElement.gridDirective === this) {
            this.elementRef.nativeElement.parentElement.gridDirective = null;
        }
        ;
        if (this.elementRef.nativeElement.directive === this) {
            this.elementRef.nativeElement.directive = null;
        }
        if (this.contentResizeSensor) {
            this.contentResizeSensor.detach();
            this.contentResizeSensor = null;
        }
        if (this.linkClass) {
            this.gridTemplateTypes = [];
            this.styleList = [];
            this.subGroupStyleObjs = null;
            this.subGroupStyles = [];
            this.subGroupFragments = [];
            this.gridOrder = [];
        }
        this.widthStyle = null;
        this.gridOrderStyles = [];
        this.gridOrderFragments = [];
        this.scrollbarAdjustmentFragment = null;
        this.scrollbarAdjustmentStyle = null;
        this.stylesByClass = [];
        this.currentClassesToResize = [];
        this.startingWidths = [];
        this.minWidths = [];
        this.resizableGrips = [];
        this.resizableColumns = [];
        this.reorderGrips = [];
        this.reorderableColumns = [];
        this.columnsWithDataClasses = [];
        this.rows = [];
        this.infiniteScrollViewports = [];
        this.gridTemplateClasses = [];
        this.gridOrder = [];
        this.classWidths = [];
        this.gridTemplateTypes = [];
        this.draggingColumn = null;
        this.colRangeGroups = [];
        this.lastDraggedOverElement = null;
        this.mutationResizableColumns = [];
        this.mutationResizableGrips = [];
        this.mutationReorderGrips = [];
        this.mutationReorderableColumns = [];
        this.mutationColumnsWithDataClasses = [];
        this.mutationRows = [];
        this.mutationInfiniteScrollViewports = [];
        this.headStyle = null;
        this.styleList = [];
        this.initialWidths = [];
        this.lastColumns = [];
        this.pointerListenerFunc = null;
        this.parentGroups = [];
        this.colData = null;
        this.colDataGroups = [];
        this.elementsWithHighlight = [];
    }
}
GridDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridDirective, deps: [{ token: i0.ElementRef }, { token: i0.ComponentFactoryResolver }, { token: GridService }, { token: DirectiveRegistrationService }, { token: DOCUMENT }, { token: i3.Overlay }, { token: ScrollDispatcherService }, { token: OperatingSystemService }, { token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Directive });
GridDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: GridDirective, selector: "[tablejsGrid],[tablejsgrid]", inputs: { linkClass: "linkClass", resizeColumnWidthByPercent: "resizeColumnWidthByPercent" }, outputs: { columnResizeStart: "columnResizeStart", columnResize: "columnResize", columnResizeEnd: "columnResizeEnd", columnReorder: "columnReorder", columnReorderStart: "columnReorderStart", dragOver: "dragOver", columnReorderEnd: "columnReorderEnd", preGridInitialize: "preGridInitialize", gridInitialize: "gridInitialize" }, host: { classAttribute: "tablejs-table-container tablejs-table-width" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsGrid],[tablejsgrid]',
                    host: { class: 'tablejs-table-container tablejs-table-width' }
                }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: i0.ComponentFactoryResolver }, { type: GridService }, { type: DirectiveRegistrationService }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: i3.Overlay }, { type: ScrollDispatcherService }, { type: OperatingSystemService }, { type: i0.RendererFactory2 }];
    }, propDecorators: { linkClass: [{
                type: Input
            }], resizeColumnWidthByPercent: [{
                type: Input
            }], columnResizeStart: [{
                type: Output
            }], columnResize: [{
                type: Output
            }], columnResizeEnd: [{
                type: Output
            }], columnReorder: [{
                type: Output
            }], columnReorderStart: [{
                type: Output
            }], dragOver: [{
                type: Output
            }], columnReorderEnd: [{
                type: Output
            }], preGridInitialize: [{
                type: Output
            }], gridInitialize: [{
                type: Output
            }] } });

class GridRowDirective {
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
GridRowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridRowDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
GridRowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: GridRowDirective, selector: "[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]", host: { classAttribute: "reorderable-table-row" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridRowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]',
                    host: { class: 'reorderable-table-row' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; } });

class ResizableGripDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
    }
    ngAfterViewInit() {
        this.registerGripOnGridDirective();
    }
    registerGripOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].addResizableGrip(this.elementRef.nativeElement);
        }
    }
}
ResizableGripDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ResizableGripDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
ResizableGripDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ResizableGripDirective, selector: "[tablejsResizableGrip], [resizableGrip], [resizablegrip]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ResizableGripDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsResizableGrip], [resizableGrip], [resizablegrip]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; } });

class InfiniteScrollDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
    }
    ngAfterViewInit() {
        this.registerColumnOnGridDirective();
    }
    registerColumnOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].addInfiniteScrollViewport(this.elementRef.nativeElement);
        }
    }
}
InfiniteScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InfiniteScrollDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
InfiniteScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: InfiniteScrollDirective, selector: "[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],\n  [tablejsViewport], [tablejsviewport], [tablejs-viewport]", host: { classAttribute: "tablejs-infinite-scroll-viewport tablejs-table-width" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InfiniteScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],
  [tablejsViewport], [tablejsviewport], [tablejs-viewport]`,
                    host: { class: 'tablejs-infinite-scroll-viewport tablejs-table-width' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; } });

class GridComponent {
    get gridDirective() {
        return this.elementRef.nativeElement.gridDirective;
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.linkClass = undefined;
        this.resizeColumnWidthByPercent = false;
        this.columnResizeStart = new EventEmitter();
        this.columnResize = new EventEmitter();
        this.columnResizeEnd = new EventEmitter();
        this.columnReorder = new EventEmitter();
        this.columnReorderStart = new EventEmitter();
        this.columnReorderEnd = new EventEmitter();
        this.gridInitialize = new EventEmitter();
    }
    ngOnInit() {
        if (this.linkClass !== undefined) {
            this.elementRef.nativeElement.classList.add(this.linkClass);
        }
    }
    columnResizeStarted(e) {
        e.type = ColumnResizeEvent.ON_RESIZE_START;
        this.columnResizeStart.emit(e);
    }
    columnResized(e) {
        e.type = ColumnResizeEvent.ON_RESIZE;
        this.columnResize.emit(e);
    }
    columnResizeEnded(e) {
        e.type = ColumnResizeEvent.ON_RESIZE_END;
        this.columnResizeEnd.emit(e);
    }
    columnReorderStarted(e) {
        e.type = ColumnReorderEvent.ON_REORDER_START;
        this.columnReorderStart.emit(e);
    }
    columnReordered(e) {
        e.type = ColumnReorderEvent.ON_REORDER;
        this.columnReorder.emit(e);
    }
    columnReorderEnded(e) {
        e.type = ColumnReorderEvent.ON_REORDER_END;
        this.columnReorderEnd.emit(e);
    }
    gridInitialized(e) {
        e.type = GridEvent.ON_INITIALIZED;
        this.gridInitialize.emit(e);
    }
}
GridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
GridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.5", type: GridComponent, selector: "tablejs-grid", inputs: { linkClass: "linkClass", resizeColumnWidthByPercent: "resizeColumnWidthByPercent" }, outputs: { columnResizeStart: "columnResizeStart", columnResize: "columnResize", columnResizeEnd: "columnResizeEnd", columnReorder: "columnReorder", columnReorderStart: "columnReorderStart", columnReorderEnd: "columnReorderEnd", gridInitialize: "gridInitialize" }, ngImport: i0, template: "<div tablejsGrid class=\"grid-component\" [linkClass]=\"linkClass\" [resizeColumnWidthByPercent]=\"resizeColumnWidthByPercent\"\n(columnResizeStart)=\"columnResizeStarted($event)\"\n(columnResize)=\"columnResized($event)\"\n(columnResizeEnd)=\"columnResizeEnded($event)\"\n(columnReorderStart)=\"columnReorderStarted($event)\"\n(columnReorder)=\"columnReordered($event)\"\n(columnReorderEnd)=\"columnReorderEnded($event)\"\n(gridInitialize)=\"gridInitialized($event)\"\n>\n\n\t<ng-content></ng-content>\n</div>\n", styles: [".tablejs-table-container{display:inline-block;padding:0!important;vertical-align:top}.tablejs-infinite-scroll-viewport{position:relative;height:301px;overflow:hidden;overflow-y:auto}.example-viewport table{overflow:visible}.tablejs-table-width{width:auto}.tablejs-table-container tr td,.tablejs-table-container tr th{padding:0rem}.grid-component tr td div,.grid-component tr th div{padding:.75rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tablejs-resizeable{cursor:ew-resize}.tablejs-editable-cell{display:inline-block;width:100%;padding:5px;margin:-5px;border:1px solid rgba(0,0,0,.1);box-shadow:inset 0 0 2px 1px #0000000d}.tablejs-editable-cell div{position:absolute;display:block;left:-3px;top:-3px;width:100%}.tablejs-editable-cell input{position:relative;top:0;left:0;display:block;width:100%}.tablejs-editable-cell input.error{outline-color:#900}\n"], dependencies: [{ kind: "directive", type: GridDirective, selector: "[tablejsGrid],[tablejsgrid]", inputs: ["linkClass", "resizeColumnWidthByPercent"], outputs: ["columnResizeStart", "columnResize", "columnResizeEnd", "columnReorder", "columnReorderStart", "dragOver", "columnReorderEnd", "preGridInitialize", "gridInitialize"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tablejs-grid', encapsulation: ViewEncapsulation.None, template: "<div tablejsGrid class=\"grid-component\" [linkClass]=\"linkClass\" [resizeColumnWidthByPercent]=\"resizeColumnWidthByPercent\"\n(columnResizeStart)=\"columnResizeStarted($event)\"\n(columnResize)=\"columnResized($event)\"\n(columnResizeEnd)=\"columnResizeEnded($event)\"\n(columnReorderStart)=\"columnReorderStarted($event)\"\n(columnReorder)=\"columnReordered($event)\"\n(columnReorderEnd)=\"columnReorderEnded($event)\"\n(gridInitialize)=\"gridInitialized($event)\"\n>\n\n\t<ng-content></ng-content>\n</div>\n", styles: [".tablejs-table-container{display:inline-block;padding:0!important;vertical-align:top}.tablejs-infinite-scroll-viewport{position:relative;height:301px;overflow:hidden;overflow-y:auto}.example-viewport table{overflow:visible}.tablejs-table-width{width:auto}.tablejs-table-container tr td,.tablejs-table-container tr th{padding:0rem}.grid-component tr td div,.grid-component tr th div{padding:.75rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tablejs-resizeable{cursor:ew-resize}.tablejs-editable-cell{display:inline-block;width:100%;padding:5px;margin:-5px;border:1px solid rgba(0,0,0,.1);box-shadow:inset 0 0 2px 1px #0000000d}.tablejs-editable-cell div{position:absolute;display:block;left:-3px;top:-3px;width:100%}.tablejs-editable-cell input{position:relative;top:0;left:0;display:block;width:100%}.tablejs-editable-cell input.error{outline-color:#900}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { linkClass: [{
                type: Input
            }], resizeColumnWidthByPercent: [{
                type: Input
            }], columnResizeStart: [{
                type: Output
            }], columnResize: [{
                type: Output
            }], columnResizeEnd: [{
                type: Output
            }], columnReorder: [{
                type: Output
            }], columnReorderStart: [{
                type: Output
            }], columnReorderEnd: [{
                type: Output
            }], gridInitialize: [{
                type: Output
            }] } });

class EditableCellDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.validator = null;
        this.validatorParams = [];
        this.regExp = null;
        this.regExpFlags = 'gi';
        this.list = [];
        this.cellInput = new EventEmitter();
        this.cellFocusOut = new EventEmitter();
        this.cellValidation = new EventEmitter();
        this.option = null;
        this.lastText = null;
        this.originalText = null;
        this.lastValidInput = null;
        this.hasInputListener = false;
        this.containerDiv = document.createElement('div');
        this.input = document.createElement('input'); // Create an <input> node
        this.input.type = 'text';
        this.dataList = document.createElement('datalist');
    }
    onKeyDownHandler(event) {
        if (document.activeElement === this.input) {
            this.input.blur();
            this.input.removeEventListener('focusout', this.onFocusOut);
        }
    }
    onClick(event) {
        let hasInput = false;
        if (this.elementRef.nativeElement.children) {
            for (let i = 0; i < this.elementRef.nativeElement.children.length; i++) {
                if (this.elementRef.nativeElement.children[i] === this.containerDiv) {
                    hasInput = true;
                }
            }
        }
        if (!hasInput) {
            this.input.value = this.elementRef.nativeElement.innerText;
            this.lastText = this.input.value;
            this.originalText = this.elementRef.nativeElement.innerText;
            this.elementRef.nativeElement.appendChild(this.containerDiv);
            this.containerDiv.appendChild(this.input);
            if (this.list.length > 0) {
                this.createDataList();
            }
            this.validateInput();
            this.input.focus();
            this.onFocusOut = () => {
                if (this.elementRef.nativeElement.contains(this.containerDiv)) {
                    this.elementRef.nativeElement.removeChild(this.containerDiv);
                }
                this.cellInput.emit(this.getCellObject());
                this.cellFocusOut.emit(this.getCellObject());
                this.input.removeEventListener('focusout', this.onFocusOut);
            };
            this.input.addEventListener('focusout', this.onFocusOut);
        }
        this.cellInput.emit(this.getCellObject());
    }
    createDataList() {
        let count = 0;
        let id = 'data-list-' + count.toString();
        while (document.getElementById(id) !== null && document.getElementById(id) !== undefined) {
            count++;
            id = 'data-list-' + count.toString();
        }
        this.dataList.setAttribute('id', id);
        this.elementRef.nativeElement.appendChild(this.containerDiv);
        this.containerDiv.appendChild(this.dataList);
        this.list.forEach(value => {
            const filteredDataList = Array.from(this.dataList.options).filter(option => option.value === value);
            if (filteredDataList.length === 0) {
                this.option = document.createElement('option');
                this.dataList.appendChild(this.option);
                this.option.value = value;
            }
        });
        this.input.setAttribute('list', id);
    }
    ngOnInit() {
        this.input.value = this.elementRef.nativeElement.innerText;
    }
    ngAfterViewInit() {
        this.input.value = this.elementRef.nativeElement.innerText;
        this.lastText = this.input.value;
        this.inputListener = () => {
            if (this.regExp) {
                const regEx = new RegExp(this.regExp, this.regExpFlags);
                if (regEx.test(this.input.value)) {
                    this.validateInput();
                    this.lastText = this.input.value;
                    this.cellInput.emit(this.getCellObject());
                }
                else {
                    this.input.value = this.lastText;
                }
            }
            else {
                this.validateInput();
                this.cellInput.emit(this.getCellObject());
            }
        };
        this.input.addEventListener('input', this.inputListener);
        this.hasInputListener = true;
    }
    getCellObject() {
        return {
            currentValue: this.input.value,
            lastValidInput: this.lastValidInput,
            originalValue: this.originalText,
            inputHasFocus: document.activeElement === this.input
        };
    }
    validateInput() {
        const validationOk = this.validator ? this.validator.apply(null, [this.input.value].concat(this.validatorParams)) : true;
        if (validationOk) {
            this.input.classList.remove('error');
            this.lastValidInput = this.input.value;
        }
        else {
            this.input.classList.add('error');
        }
        this.cellValidation.emit(validationOk);
    }
    ngOnDestroy() {
        if (this.hasInputListener) {
            this.input.removeEventListener('input', this.inputListener);
            this.hasInputListener = false;
        }
    }
}
EditableCellDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: EditableCellDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
EditableCellDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: EditableCellDirective, selector: "[tablejsEditableCell], [tablejseditablecell], [tablejs-editable-cell]", inputs: { initialData: ["tablejsEditableCell", "initialData"], validator: "validator", validatorParams: "validatorParams", regExp: "regExp", regExpFlags: "regExpFlags", list: "list" }, outputs: { cellInput: "cellInput", cellFocusOut: "cellFocusOut", cellValidation: "cellValidation" }, host: { listeners: { "document:keydown.enter": "onKeyDownHandler($event)", "click": "onClick($event)" }, classAttribute: "tablejs-editable-cell" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: EditableCellDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsEditableCell], [tablejseditablecell], [tablejs-editable-cell]',
                    host: { class: 'tablejs-editable-cell' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { initialData: [{
                type: Input,
                args: ['tablejsEditableCell']
            }], validator: [{
                type: Input
            }], validatorParams: [{
                type: Input
            }], regExp: [{
                type: Input
            }], regExpFlags: [{
                type: Input
            }], list: [{
                type: Input
            }], cellInput: [{
                type: Output
            }], cellFocusOut: [{
                type: Output
            }], cellValidation: [{
                type: Output
            }], onKeyDownHandler: [{
                type: HostListener,
                args: ['document:keydown.enter', ['$event']]
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class ReorderGripDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
    }
    ngAfterViewInit() {
        this.registerGripOnGridDirective();
    }
    registerGripOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].addReorderGrip(this.elementRef.nativeElement);
        }
    }
}
ReorderGripDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderGripDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
ReorderGripDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ReorderGripDirective, selector: "[reorderGrip]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderGripDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[reorderGrip]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; } });

class ReorderColDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.reorderGhost = null;
        this.reorderGhostContext = null;
    }
    ngAfterViewInit() {
        this.registerColumnOnGridDirective();
    }
    registerColumnOnGridDirective() {
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null) {
            this.elementRef.nativeElement.reorderGhost = this.reorderGhost;
            this.elementRef.nativeElement.reorderGhostContext = this.reorderGhostContext;
            el['gridDirective'].addReorderableColumn(this.elementRef.nativeElement);
        }
    }
    ngOnDestroy() {
        this.elementRef.nativeElement.reorderGhost = null;
        this.elementRef.nativeElement.reorderGhostContext = null;
        this.reorderGhost = null;
        this.reorderGhostContext = null;
    }
}
ReorderColDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderColDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
ReorderColDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ReorderColDirective, selector: "[reorderCol], [reordercol]", inputs: { reorderGhost: "reorderGhost", reorderGhostContext: "reorderGhostContext" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ReorderColDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[reorderCol], [reordercol]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; }, propDecorators: { reorderGhost: [{
                type: Input
            }], reorderGhostContext: [{
                type: Input
            }] } });

class DataColClassesDirective {
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
DataColClassesDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassesDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
DataColClassesDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: DataColClassesDirective, selector: "[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]", inputs: { tablejsDataColClasses: "tablejsDataColClasses" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassesDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; }, propDecorators: { tablejsDataColClasses: [{
                type: Input
            }] } });

class DataColClassDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.tablejsDataColClass = '';
    }
    ngAfterViewInit() {
        if (this.tablejsDataColClass !== '') {
            this.elementRef.nativeElement.classList.add(this.tablejsDataColClass);
            this.elementRef.nativeElement.setAttribute('tablejsDataColClass', this.tablejsDataColClass);
            if (this.initialWidth) {
                this.elementRef.nativeElement.setAttribute('initialWidth', this.initialWidth);
            }
        }
        else {
            throw Error('A class name must be supplied to the tablejsDataColClass directive.');
        }
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(() => {
            this.registerInitialColumnWidthOnGridDirective();
        }, 1);
    }
    registerInitialColumnWidthOnGridDirective() {
        if (this.initialWidth === undefined) {
            this.gridService.triggerHasInitialWidths(false);
            console.log('[Performance Alert] Add an initialWidth value on the tablejsDataColClass directive for a significant performance boost.');
            return;
        }
        this.gridService.triggerHasInitialWidths(true);
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null && el['gridDirective']) {
            el['gridDirective'].initialWidths[this.tablejsDataColClass] = this.initialWidth;
        }
    }
    ngOnDestroy() {
        clearTimeout(this.timeoutID);
    }
}
DataColClassDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
DataColClassDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: DataColClassDirective, selector: "[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]", inputs: { tablejsDataColClass: "tablejsDataColClass", initialWidth: "initialWidth" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DataColClassDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; }, propDecorators: { tablejsDataColClass: [{
                type: Input
            }], initialWidth: [{
                type: Input
            }] } });

class HideColumnIfDirective {
    set tablejsHideColumnIf(hide) {
        const wasLimited = this.showOffspringLimited;
        const wasTriggeredBy = this.changeTriggeredBy;
        this.showOffspringLimited = false;
        this.changeTriggeredBy = null;
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null) {
            this.gridDirective = el['gridDirective'];
            const columnVisibilityChanged = this._hideColumn !== hide;
            if (!columnVisibilityChanged) {
                this.gridDirective.hiddenColumnChanges.next(null);
                return;
            }
            this._hideColumn = hide;
            const flattenedColumnHierarchy = this.gridDirective.getFlattenedHierarchy();
            const currentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === this.gridDirective.getRelatedHeader(this.elementRef.nativeElement);
            })[0];
            if (!wasTriggeredBy) {
                this.changeTriggeredBy = currentColumnHierarchy;
            }
            if (hide) {
                const lowestLevelColHierarchiesVisible = this.getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy);
                const allLowestLevelColumnsHidden = lowestLevelColHierarchiesVisible.length === 0;
                if (allLowestLevelColumnsHidden || this.allColumnsShareTheSameAncestor(currentColumnHierarchy, lowestLevelColHierarchiesVisible, flattenedColumnHierarchy)) {
                    this._hideColumn = false;
                    this.gridDirective.hiddenColumnChanges.next(null);
                    return;
                }
                this.gridDirective.getRelatedHeaders(this.elementRef.nativeElement).forEach((element) => {
                    element.classList.add(this.HIDDEN_COLUMN_CLASS);
                });
                this.hideAllOffspring(currentColumnHierarchy);
                if (this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy)) {
                    this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, true);
                }
            }
            else {
                this.gridDirective.getRelatedHeaders(this.elementRef.nativeElement).forEach((element) => {
                    element.classList.remove(this.HIDDEN_COLUMN_CLASS);
                });
                this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, false);
                if (!wasLimited) {
                    this.showAllOffspring(currentColumnHierarchy);
                }
            }
            const triggerHierarchy = !wasTriggeredBy ? currentColumnHierarchy : null;
            this.changeTriggeredBy = null;
            this.gridDirective.hiddenColumnChanges.next({ hierarchyColumn: currentColumnHierarchy, wasTriggeredByThisColumn: triggerHierarchy !== null, hidden: this._hideColumn === true });
        }
    }
    get tablejsHideColumnIf() {
        return this._hideColumn;
    }
    getVisibleSiblingsByColumn(hierarchyList, level) {
        const visibleSiblings = hierarchyList.filter((hierarchy) => {
            return hierarchy.level === level && hierarchy.element.hideColumnIf.tablejsHideColumnIf === false;
        });
        return visibleSiblings;
    }
    updateHeadersThatCanHide() {
        const flattenedColumnHierarchy = this.gridDirective.getFlattenedHierarchy();
        for (let i = 0; i < flattenedColumnHierarchy.length; i++) {
            const columnHierarchy = flattenedColumnHierarchy[i];
            const element = columnHierarchy.element;
            const hideColumnIf = element.hideColumnIf;
            hideColumnIf.canHide = true;
        }
        let visibleSiblings = this.getVisibleSiblingsByColumn(flattenedColumnHierarchy, 0);
        if (visibleSiblings.length === 1) {
            let solitarySibling = visibleSiblings[0];
            solitarySibling.element.hideColumnIf.canHide = false;
            let subColumns = solitarySibling.subColumns;
            let count = 0;
            while (solitarySibling && subColumns.length !== 0) {
                visibleSiblings = this.getVisibleSiblingsByColumn(subColumns, ++count);
                solitarySibling = visibleSiblings.length === 1 ? visibleSiblings[0] : null;
                if (solitarySibling) {
                    solitarySibling.element.hideColumnIf.canHide = false;
                    subColumns = solitarySibling.subColumns;
                }
            }
        }
    }
    getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy) {
        const lowestLevelColHierarchiesVisible = [];
        const sortedByLevelColumnHierarchy = flattenedColumnHierarchy.concat().sort((colHier1, colHier2) => {
            return colHier2.level - colHier1.level;
        });
        const baseLevel = sortedByLevelColumnHierarchy[0].level;
        for (let i = 0; i < sortedByLevelColumnHierarchy.length; i++) {
            const hierarchy = sortedByLevelColumnHierarchy[i];
            if (hierarchy.level !== baseLevel) {
                break;
            }
            if (!hierarchy.element.hideColumnIf.tablejsHideColumnIf) {
                lowestLevelColHierarchiesVisible.push(hierarchy);
            }
        }
        return lowestLevelColHierarchiesVisible;
    }
    allColumnsShareTheSameAncestor(commonAncestor, columnHierarchies, flattenedColumnHierarchy) {
        const hierarchiesWithCommonAncestor = [];
        for (let i = 0; i < columnHierarchies.length; i++) {
            const currentColumnHierarchy = columnHierarchies[i];
            let parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === currentColumnHierarchy.parentColumn;
            })[0];
            while (parentColumnHierarchy) {
                if (parentColumnHierarchy === commonAncestor) {
                    hierarchiesWithCommonAncestor.push(currentColumnHierarchy);
                    break;
                }
                const columnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                    return hierarchy.element === parentColumnHierarchy.element;
                })[0];
                parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                    return hierarchy.element === columnHierarchy.parentColumn;
                })[0];
            }
        }
        return columnHierarchies.length === hierarchiesWithCommonAncestor.length;
    }
    hideAllOffspring(columnHierarchy) {
        for (let i = 0; i < columnHierarchy.subColumns.length; i++) {
            const child = this.gridDirective.getRelatedHeader(columnHierarchy.subColumns[i].element);
            child.hideColumnIf.changeTriggeredBy = columnHierarchy;
            child.hideColumnIf.tablejsHideColumnIf = true;
        }
    }
    showAllOffspring(columnHierarchy) {
        for (let i = 0; i < columnHierarchy.subColumns.length; i++) {
            const child = this.gridDirective.getRelatedHeader(columnHierarchy.subColumns[i].element);
            child.hideColumnIf.changeTriggeredBy = columnHierarchy;
            child.hideColumnIf.tablejsHideColumnIf = false;
            child.hideColumnIf.canHide = true;
        }
    }
    allSiblingsAreHidden(columnHierarchy, flattenedColumnHierarchy) {
        let parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
            return hierarchy.element === columnHierarchy.parentColumn;
        })[0];
        let hiddenSiblingCount = 0;
        let totalSiblings;
        if (parentColumnHierarchy) {
            totalSiblings = parentColumnHierarchy.subColumns.length;
            parentColumnHierarchy.subColumns.forEach((subColumn) => {
                if (this.gridDirective.getRelatedHeader(subColumn.element).hideColumnIf.tablejsHideColumnIf) {
                    hiddenSiblingCount++;
                }
            });
        }
        else {
            const topLevelSiblings = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.level === 0;
            });
            totalSiblings = topLevelSiblings.length;
            for (let i = 0; i < topLevelSiblings.length; i++) {
                const topLevelSibling = topLevelSiblings[i];
                if (this.gridDirective.getRelatedHeader(topLevelSibling.element).hideColumnIf.tablejsHideColumnIf) {
                    hiddenSiblingCount++;
                }
            }
        }
        return hiddenSiblingCount === totalSiblings;
    }
    setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, hidden) {
        let parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
            return hierarchy.element === currentColumnHierarchy.parentColumn;
        })[0];
        const allSiblingsHidden = this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy);
        let parentSiblingsAreAllHidden = hidden ? allSiblingsHidden : true;
        while (parentColumnHierarchy && parentSiblingsAreAllHidden) {
            const parentElement = parentColumnHierarchy.element;
            parentElement.hideColumnIf.changeTriggeredBy = currentColumnHierarchy;
            parentElement.hideColumnIf.showOffspringLimited = true;
            parentElement.hideColumnIf.tablejsHideColumnIf = hidden;
            parentElement.hideColumnIf.canHide = true;
            const columnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === parentColumnHierarchy.element;
            })[0];
            parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === columnHierarchy.parentColumn;
            })[0];
        }
    }
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this._hideColumn = false;
        this.HIDDEN_COLUMN_CLASS = 'column-is-hidden';
        this.showOffspringLimited = false;
        this.changeTriggeredBy = null;
        this.canHide = true;
        this.elementRef.nativeElement.hideColumnIf = this;
    }
    ngOnDestroy() {
        this.elementRef.nativeElement.hideColumnIf = null;
    }
}
HideColumnIfDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: HideColumnIfDirective, deps: [{ token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive });
HideColumnIfDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: HideColumnIfDirective, selector: "[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]", inputs: { tablejsHideColumnIf: "tablejsHideColumnIf" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: HideColumnIfDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridService }]; }, propDecorators: { tablejsHideColumnIf: [{
                type: Input
            }] } });

class TablejsModule {
}
TablejsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TablejsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, declarations: [GridDirective,
        GridRowDirective,
        ResizableGripDirective,
        InfiniteScrollDirective,
        HorizResizeGripComponent,
        ReorderGripComponent,
        GridComponent,
        EditableCellDirective,
        DragAndDropGhostComponent,
        ReorderGripDirective,
        ReorderColDirective,
        DataColClassesDirective,
        DataColClassDirective,
        VirtualForDirective,
        ScrollViewportDirective,
        ScrollPrevSpacerComponent,
        HideColumnIfDirective], imports: [CommonModule], exports: [GridDirective,
        GridRowDirective,
        ResizableGripDirective,
        InfiniteScrollDirective,
        HorizResizeGripComponent,
        ReorderGripComponent,
        GridComponent,
        EditableCellDirective,
        DragAndDropGhostComponent,
        ReorderGripDirective,
        ReorderColDirective,
        DataColClassesDirective,
        DataColClassDirective,
        VirtualForDirective,
        ScrollViewportDirective,
        HideColumnIfDirective] });
TablejsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, providers: [
        GridService,
        OperatingSystemService,
        DirectiveRegistrationService,
        ScrollDispatcherService
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: TablejsModule, decorators: [{
            type: NgModule,
            args: [{
                    entryComponents: [
                        DragAndDropGhostComponent,
                        ScrollPrevSpacerComponent
                    ],
                    declarations: [
                        GridDirective,
                        GridRowDirective,
                        ResizableGripDirective,
                        InfiniteScrollDirective,
                        HorizResizeGripComponent,
                        ReorderGripComponent,
                        GridComponent,
                        EditableCellDirective,
                        DragAndDropGhostComponent,
                        ReorderGripDirective,
                        ReorderColDirective,
                        DataColClassesDirective,
                        DataColClassDirective,
                        VirtualForDirective,
                        ScrollViewportDirective,
                        ScrollPrevSpacerComponent,
                        HideColumnIfDirective
                    ],
                    imports: [
                        CommonModule
                    ],
                    providers: [
                        GridService,
                        OperatingSystemService,
                        DirectiveRegistrationService,
                        ScrollDispatcherService
                    ],
                    exports: [
                        GridDirective,
                        GridRowDirective,
                        ResizableGripDirective,
                        InfiniteScrollDirective,
                        HorizResizeGripComponent,
                        ReorderGripComponent,
                        GridComponent,
                        EditableCellDirective,
                        DragAndDropGhostComponent,
                        ReorderGripDirective,
                        ReorderColDirective,
                        DataColClassesDirective,
                        DataColClassDirective,
                        VirtualForDirective,
                        ScrollViewportDirective,
                        HideColumnIfDirective
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                }]
        }] });

class Comparator {
    static getCurrentSortOptions() {
        return Comparator.filterSortService.currentSortOptions;
    }
    static getCurrentFilterOptions() {
        return Comparator.filterSortService.currentFilterOptions;
    }
    static isString(val) {
        return typeof val === 'string' || val instanceof String;
    }
}
Comparator.filterSortService = null;

var SortDirection;
(function (SortDirection) {
    SortDirection.DESCENDING = -1;
    SortDirection.NONE = 0;
    SortDirection.ASCENDING = 1;
})(SortDirection || (SortDirection = {}));

class FilterSortService {
    get currentFilterOptions() {
        return this._currentFilterOptions;
    }
    get currentSortOptions() {
        return this._currentSortOptions;
    }
    get itemsBeingFilteredAndSorted() {
        return this._items;
    }
    constructor() {
        this.autoDefineUnsetProperties = false;
        Comparator.filterSortService = this;
    }
    filterAndSortItems(items, filterOptions, sortOptions) {
        let filteredItems;
        this._items = items;
        filteredItems = items;
        if (filterOptions) {
            if (Array.isArray(filterOptions)) {
                const filterOptionsLen = filterOptions.length;
                for (let i = 0; i < filterOptionsLen; i++) {
                    const options = filterOptions[i];
                    this._currentFilterOptions = options;
                    filteredItems = this.filterItemsByVarNames(filteredItems, options);
                }
            }
            else {
                filteredItems = this.filterItemsByVarNames(filteredItems, filterOptions);
            }
        }
        if (sortOptions) {
            if (Array.isArray(sortOptions)) {
                filteredItems = this.multiSortItemsByVarName(filteredItems, sortOptions);
            }
            else {
                filteredItems = this.sortItemsByVarName(filteredItems, sortOptions);
            }
        }
        return filteredItems;
    }
    isString(val) {
        return typeof val === 'string' || val instanceof String;
    }
    filterItemsByVarNames(items, filterOptions) {
        this._currentFilterOptions = filterOptions;
        if (!filterOptions) {
            throw Error('A FilterOptions object is not defined. Please supply filter options to sort items by.');
        }
        const varNames = this.isString(filterOptions.variableIdentifiers)
            ? [filterOptions.variableIdentifiers]
            : filterOptions.variableIdentifiers;
        this.ignoreCase = filterOptions.ignoreCase;
        if (items === null || items === undefined) {
            throw Error('Item array is not defined. Please supply a defined array to filter.');
        }
        if (items.length === 0) {
            return items;
        }
        this.filterSplits = [];
        const numOfVarNames = varNames && varNames.length > 0 ? varNames.length : 0;
        for (let i = 0; i < numOfVarNames; i++) {
            this.splitVariablesFromIdentifier(varNames[i]);
            this.filterSplits.push(this.splits);
        }
        this.filterSplitsLen = this.filterSplits.length;
        items = items.concat();
        items = items.filter(filterOptions.comparator);
        return items;
    }
    splitVariablesFromIdentifier(varName) {
        if (varName === null || varName === undefined || varName === '') {
            this.splits = [];
            this.splitsLen = this.splits.length;
            return;
        }
        const containsBrackets = varName.includes('[');
        this.splits = varName.split('.');
        this.splitsLen = this.splits.length;
        if (containsBrackets) {
            const bracketSplits = [];
            for (let i = 0; i < this.splitsLen; i++) {
                let split = this.splits[i];
                let startBracketIndex = split.indexOf('[');
                if (startBracketIndex !== -1) {
                    while (split !== '') {
                        const endBracketIndex = split.indexOf(']') + 1;
                        const preBracketVar = split.substring(0, startBracketIndex);
                        const brackets = split.substring(startBracketIndex + 1, endBracketIndex - 1);
                        const postBracketVar = split.substring(endBracketIndex, split.length);
                        split = postBracketVar;
                        startBracketIndex = split.indexOf('[');
                        if (preBracketVar !== '') {
                            bracketSplits.push(preBracketVar);
                        }
                        bracketSplits.push(brackets);
                    }
                }
                else {
                    bracketSplits.push(split);
                }
            }
            this.splits = bracketSplits;
        }
        this.splitsLen = this.splits.length;
        let varStr = '(array item)';
        this.varNames = [varStr];
        for (let i = 0; i < this.splitsLen; i++) {
            this.vName = this.splits[i];
            if (isNaN(Number(this.vName))) {
                varStr += '.' + this.vName;
            }
            else {
                varStr += '[' + this.vName + ']';
            }
            this.varNames.push(varStr);
        }
    }
    sortItemsByVarName(items, sortOptions) {
        this._currentSortOptions = sortOptions;
        if (!sortOptions) {
            throw Error('A SortOptions object is not defined. Please supply filter options to sort items by.');
        }
        const varName = sortOptions.variableIdentifier;
        this.sortDirection = sortOptions.sortDirection;
        this.ignoreCase = sortOptions.ignoreCase;
        if (items === null || items === undefined) {
            throw Error('Item array is not defined. Please supply a defined array to sort.');
        }
        if (items.length === 0) {
            return items;
        }
        this.splitVariablesFromIdentifier(varName);
        items = items.concat();
        if (this.sortDirection !== SortDirection.NONE) {
            items.sort(sortOptions.comparator);
        }
        return items;
    }
    multiSortItemsByVarName(items, sortOptionsGroup) {
        sortOptionsGroup.sort((sortOptionsA, sortOptionsB) => {
            if (!sortOptionsA || !sortOptionsB) {
                return 0;
            }
            const orderA = sortOptionsA.sortOrder;
            const orderB = sortOptionsB.sortOrder;
            if (orderA === orderB) {
                return 0;
            }
            return orderA > orderB ? 1 : -1;
        });
        sortOptionsGroup.forEach((sortOptions) => {
            items = this.sortItemsByVarName(items, sortOptions);
        });
        return items;
    }
    getFilterValuesFromPropertyIndentifiers(value) {
        this.filterSplitsLen = this.filterSplits.length;
        const vals = this.filterSplitsLen === 0 ? [value] : [];
        for (let j = 0; j < this.filterSplitsLen; j++) {
            let varA = value;
            const splits = this.filterSplits[j];
            const splitsLen = splits.length;
            for (let i = 0; i < splitsLen; i++) {
                this.vName = splits[i];
                if (!varA.hasOwnProperty(this.vName)) {
                    if (!this.autoDefineUnsetProperties) {
                        throw Error(`Property ${this.vName} not found on ${this.varNames[i]}`);
                    }
                    this.defineProperty(varA, this.vName);
                }
                else {
                    varA = varA[this.vName];
                }
            }
            vals.push(varA);
        }
        return vals;
    }
    defineProperty(obj, propName, value = undefined, writable = true) {
        Object.defineProperty(obj, propName, {
            value: value,
            writable: writable
        });
    }
    getSortValuesFromPropertyIdentifiers(valueA, valueB) {
        let varA = valueA;
        let varB = valueB;
        for (let i = 0; i < this.splitsLen; i++) {
            this.vName = this.splits[i];
            if (!varA.hasOwnProperty(this.vName) ||
                !varB.hasOwnProperty(this.vName)) {
                throw Error(`Property ${this.vName} not found on ${this.varNames[i]}`);
            }
            varA = varA[this.vName];
            varB = varB[this.vName];
        }
        return [varA, varB];
    }
}
FilterSortService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterSortService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FilterSortService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterSortService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterSortService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return []; } });

class SortOptions {
    get directionOrder() {
        return this._directionOrder;
    }
    set directionOrder(order) {
        this._sortDirectionIndex = -1;
        this._directionOrder = order;
    }
    get sortDirection() {
        return this._sortDirectionIndex === -1
            ? SortDirection.NONE
            : this._directionOrder[this._sortDirectionIndex];
    }
    set sortDirection(direction) {
        this._sortDirectionIndex = this._directionOrder.indexOf(direction);
    }
    constructor(variableIdentifier, comparator, initialSortDirection = SortDirection.NONE, ignoreCase = true, sortOrder = 0, useLocalCompare = false, localeCompareOptions = null) {
        this.ignoreTimeOfDay = true;
        this._directionOrder = [SortDirection.ASCENDING, SortDirection.DESCENDING, SortDirection.NONE];
        this._sortDirectionIndex = -1;
        this.variableIdentifier = variableIdentifier;
        this.comparator = comparator;
        this.initialSortDirection = initialSortDirection;
        this.ignoreCase = ignoreCase;
        this.sortOrder = sortOrder;
        this.useLocaleCompare = useLocalCompare;
        this.localeCompareOptions = localeCompareOptions;
        this.sortDirection = this.initialSortDirection;
    }
    nextSortDirection() {
        this._sortDirectionIndex++;
        if (this._sortDirectionIndex >= this._directionOrder.length) {
            this._sortDirectionIndex = 0;
        }
    }
}

var MatchType;
(function (MatchType) {
    MatchType.ALL = 'all';
    MatchType.ANY = 'any';
})(MatchType || (MatchType = {}));

class FilterOptions {
    constructor(variableIdentifiers, comparator, filterValue = null, matchType = MatchType.ANY, ignoreCase = true) {
        this.ignoreTimeOfDay = true;
        this.variableIdentifiers = variableIdentifiers;
        this.comparator = comparator;
        this.ignoreCase = ignoreCase;
        this.filterValue = filterValue;
        this.matchType = matchType;
    }
}

class SortComparator extends Comparator {
    static DATE(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        if (currentSortOptions.ignoreTimeOfDay) {
            varA = new Date(varA);
            varB = new Date(varB);
            varA.setHours(0, 0, 0, 0);
            varB.setHours(0, 0, 0, 0);
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (varA === varB) {
            return 0;
        }
        return Comparator.filterSortService.sortDirection === 1
            ? varA - varB
            : varB - varA;
    }
    static NUMERIC(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (varA === varB) {
            return 0;
        }
        return varA > varB
            ? 1 * Comparator.filterSortService.sortDirection
            : -1 * Comparator.filterSortService.sortDirection;
    }
    static BOOLEAN(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (varA === varB) {
            return 0;
        }
        return Comparator.filterSortService.sortDirection === 1
            ? varA - varB
            : varB - varA;
    }
    static TRUTHY(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        const varAIsFalsy = varA ? 1 : 0;
        const varBIsFalsy = varB ? 1 : 0;
        if (varAIsFalsy === varBIsFalsy) {
            return 0;
        }
        return Comparator.filterSortService.sortDirection === 1
            ? varAIsFalsy - varBIsFalsy
            : varBIsFalsy - varAIsFalsy;
    }
    static ALPHABETICAL(valueA, valueB) {
        const values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
        let varA = values[0];
        let varB = values[1];
        const currentSortOptions = Comparator.getCurrentSortOptions();
        if (!currentSortOptions) {
            this.triggerNoSortOptionsError();
        }
        const modifier = currentSortOptions.variableMapper;
        if (modifier !== null && modifier !== undefined) {
            varA = modifier.apply(null, [varA]);
            varB = modifier.apply(null, [varB]);
        }
        if (Comparator.filterSortService.ignoreCase) {
            if ((typeof varA === 'string' || varA instanceof String) &&
                (typeof varB === 'string' || varB instanceof String)) {
                varA = varA.toLowerCase();
                varB = varB.toLowerCase();
            }
        }
        varA = varA.toString();
        varB = varB.toString();
        if (varA == varB || !Comparator.filterSortService.currentSortOptions) {
            return 0;
        }
        if (Comparator.filterSortService.currentSortOptions.useLocaleCompare) {
            if (Comparator.filterSortService.currentSortOptions.localeCompareOptions) {
                const locales = Comparator.filterSortService.currentSortOptions
                    .localeCompareOptions[0];
                const options = Comparator.filterSortService.currentSortOptions.localeCompareOptions.length > 1 ? Comparator.filterSortService.currentSortOptions.localeCompareOptions[1] : null;
                if (options) {
                    return (varA.localeCompare(varB, locales, options) *
                        Comparator.filterSortService.sortDirection);
                }
                else {
                    return varA.localeCompare(varB, locales) *
                        Comparator.filterSortService.sortDirection;
                }
            }
            else {
                return (varA.localeCompare(varB) * Comparator.filterSortService.sortDirection);
            }
        }
        else {
            return varA > varB
                ? Comparator.filterSortService.sortDirection * 1
                : Comparator.filterSortService.sortDirection * -1;
        }
    }
    static triggerNoSortOptionsError() {
        throw Error(`Please supply a SortOptions object to sort your array by.`);
    }
}

class FilterComparator extends Comparator {
    static getRequiredMatches(numOfValues) {
        if (!Comparator.filterSortService.currentFilterOptions) {
            return 1;
        }
        else {
            return Comparator.filterSortService.currentFilterOptions.matchType ===
                MatchType.ANY
                ? 1
                : numOfValues;
        }
    }
    static escapeRegExp(str) {
        const regExp = /[.*+?^${}()|[\]\\]/g;
        return str.replace(regExp, '\\$&'); // $& means the whole matched string
    }
    static getModifiedValue(value, variableMappers, index) {
        if (Array.isArray(variableMappers)) {
            if (index > variableMappers.length - 1) {
                throw Error(`${value} does not have a variable mapper assigned to it.`);
            }
        }
        let modifier;
        modifier = Array.isArray(variableMappers)
            ? variableMappers[index]
            : variableMappers;
        if (modifier !== null && modifier !== undefined) {
            return modifier.apply(null, [value]);
        }
        return value;
    }
    static CONTAINS_STRING(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let containsString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toString().toLowerCase() : val.toString();
            if (val.includes(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    containsString = true;
                }
            }
        }
        return containsString;
    }
    static DOES_NOT_CONTAIN_STRING(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotContainString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toString().toLowerCase() : val.toString();
            if (!val.includes(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotContainString = true;
                }
            }
        }
        return doesNotContainString;
    }
    static CONTAINS_WORD(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let startsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const regex = new RegExp(startsWithOrSpace +
            '(' +
            escapedValue +
            '$|' +
            escapedValue +
            '(\\s|' +
            punctuation +
            '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    startsWithString = true;
                }
            }
        }
        return startsWithString;
    }
    static DOES_NOT_CONTAIN_WORD(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotContainWord = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const regex = new RegExp(startsWithOrSpace +
            '(' +
            escapedValue +
            '$|' +
            escapedValue +
            '(\\s|' +
            punctuation +
            '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (!found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotContainWord = true;
                }
            }
        }
        return doesNotContainWord;
    }
    static STARTS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let startsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val.toString().substring(0, filterValue.length) === filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    startsWithString = true;
                }
            }
        }
        return startsWithString;
    }
    static DOES_NOT_START_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotStartWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val.toString().substring(0, filterValue.length) !== filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotStartWithString = true;
                }
            }
        }
        return doesNotStartWithString;
    }
    static ENDS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let endsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val
                .toString()
                .substr(val.length - filterValue.length, filterValue.length) ===
                filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    endsWithString = true;
                }
            }
        }
        return endsWithString;
    }
    static DOES_NOT_END_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotEndWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = ignoreCase ? val.toLowerCase() : val;
            if (val
                .toString()
                .substr(val.length - filterValue.length, filterValue.length) !==
                filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotEndWithString = true;
                }
            }
        }
        return doesNotEndWithString;
    }
    static WORD_STARTS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let startsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    startsWithString = true;
                }
            }
        }
        return startsWithString;
    }
    static WORD_DOES_NOT_START_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotStartsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
        const regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (!found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotStartsWithString = true;
                }
            }
        }
        return doesNotStartsWithString;
    }
    static WORD_ENDS_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let endsWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const regex = new RegExp('(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    endsWithString = true;
                }
            }
        }
        return endsWithString;
    }
    static WORD_DOES_NOT_END_WITH(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let doesNotEndWithString = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        const regExFlags = currentFilterOptions.ignoreCase
            ? 'mi'
            : 'm';
        const escapedValue = FilterComparator.escapeRegExp(filterValue);
        const punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
            + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
        const regex = new RegExp('(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))', regExFlags);
        filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            const found = regex.test(val);
            if (!found) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    doesNotEndWithString = true;
                }
            }
        }
        return doesNotEndWithString;
    }
    static EQUALS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let equals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val == filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    equals = true;
                }
            }
        }
        return equals;
    }
    static NOT_EQUAL(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let notEquals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val != filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    notEquals = true;
                }
            }
        }
        return notEquals;
    }
    static STRICT_EQUALS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let equals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val === filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    equals = true;
                }
            }
        }
        return equals;
    }
    static NOT_STRICT_EQUALS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let notStrictEquals = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        const ignoreCase = currentFilterOptions.ignoreCase;
        filterValue =
            Comparator.isString(filterValue) && ignoreCase
                ? filterValue.toLowerCase()
                : filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val =
                Comparator.isString(val) && ignoreCase
                    ? val.toString().toLowerCase()
                    : val;
            if (val !== filterValue) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    notStrictEquals = true;
                }
            }
        }
        return notStrictEquals;
    }
    static LESS_THAN(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let lessThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val < Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    lessThan = true;
                }
            }
        }
        return lessThan;
    }
    static GREATER_THAN(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let greaterThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val > Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    greaterThan = true;
                }
            }
        }
        return greaterThan;
    }
    static LESS_THAN_OR_EQUAL(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let lessThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val <= Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    lessThan = true;
                }
            }
        }
        return lessThan;
    }
    static GREATER_THAN_OR_EQUAL(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let greaterThan = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        const filterValue = currentFilterOptions.filterValue;
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            val = Number(val);
            if (val >= Number(filterValue)) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    greaterThan = true;
                }
            }
        }
        return greaterThan;
    }
    static IS_AFTER_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let afterDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() > filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    afterDate = true;
                }
            }
        }
        return afterDate;
    }
    static IS_BEFORE_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let beforeDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() < filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    beforeDate = true;
                }
            }
        }
        return beforeDate;
    }
    static DATE_IS(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let beforeDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() === filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    beforeDate = true;
                }
            }
        }
        return beforeDate;
    }
    static DATE_IS_NOT(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isNotDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() !== filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isNotDate = true;
                }
            }
        }
        return isNotDate;
    }
    static IS_ON_OR_AFTER_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let afterDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() >= filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    afterDate = true;
                }
            }
        }
        return afterDate;
    }
    static IS_ON_OR_BEFORE_DATE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let beforeDate = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        let filterValue = currentFilterOptions.filterValue;
        if (currentFilterOptions.ignoreTimeOfDay) {
            filterValue = new Date(filterValue);
            filterValue.setHours(0, 0, 0, 0);
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = new Date(vals[i]);
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (currentFilterOptions.ignoreTimeOfDay) {
                val = new Date(val);
                val.setHours(0, 0, 0, 0);
            }
            if (val.getTime() <= filterValue.getTime()) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    beforeDate = true;
                }
            }
        }
        return beforeDate;
    }
    static IS_TRUE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isTrue = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (val === true) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isTrue = true;
                }
            }
        }
        return isTrue;
    }
    static IS_FALSE(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isFalse = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (val === false) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isFalse = true;
                }
            }
        }
        return isFalse;
    }
    static IS_TRUTHY(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isTruthy = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (val) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isTruthy = true;
                }
            }
        }
        return isTruthy;
    }
    static IS_FALSY(value, index, array) {
        const vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
        const numOfValues = vals.length;
        const requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
        let matchCount = 0;
        let isFalsy = false;
        const currentFilterOptions = Comparator.getCurrentFilterOptions();
        if (!currentFilterOptions) {
            this.triggerNoFilterOptionsError();
        }
        for (let i = 0; i < numOfValues; i++) {
            let val = vals[i];
            val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
            if (!val) {
                matchCount++;
                if (matchCount === requiredMatches) {
                    isFalsy = true;
                }
            }
        }
        return isFalsy;
    }
    static triggerNoFilterOptionsError() {
        throw Error(`Please supply a FilterOptions object to filter your array by.`);
    }
}

class FilterAndSortModule {
}
FilterAndSortModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FilterAndSortModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, imports: [BrowserModule] });
FilterAndSortModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, providers: [FilterSortService], imports: [BrowserModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: FilterAndSortModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [BrowserModule],
                    declarations: [],
                    providers: [FilterSortService],
                    exports: [],
                    bootstrap: [],
                }]
        }] });

class Range {
}

/*
 * Public API Surface of tablejs
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ColumnReorderEvent, ColumnResizeEvent, Comparator, DataColClassDirective, DataColClassesDirective, DirectiveRegistrationService, DragAndDropGhostComponent, EditableCellDirective, FilterAndSortModule, FilterComparator, FilterOptions, FilterSortService, GridComponent, GridDirective, GridEvent, GridRowDirective, GridService, HideColumnIfDirective, HorizResizeGripComponent, InfiniteScrollDirective, MatchType, OperatingSystemService, Range, ReorderColDirective, ReorderGripComponent, ReorderGripDirective, ResizableGripDirective, ScrollDispatcherService, ScrollPrevSpacerComponent, ScrollViewportDirective, ScrollViewportEvent, SortComparator, SortDirection, SortOptions, TablejsForOfContext, TablejsModule, VirtualForDirective };
//# sourceMappingURL=tablejs-community.mjs.map
