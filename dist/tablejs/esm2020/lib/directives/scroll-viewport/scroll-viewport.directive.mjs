import { Directive, ContentChild, EventEmitter, Inject, Input, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TablejsForOfContext } from './../../directives/virtual-for/virtual-for.directive';
import { ScrollPrevSpacerComponent } from '../../components/scroll-prev-spacer/scroll-prev-spacer.component';
import { take } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
import * as i2 from "./../../services/directive-registration/directive-registration.service";
import * as i3 from "./../../services/scroll-dispatcher/scroll-dispatcher.service";
import * as i4 from "./../../services/operating-system/operating-system.service";
export class ScrollViewportDirective {
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
        componentRef.destroy();
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
        this.createTBodies();
        this.addScrollHandler();
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
        this.preGridInitializeSubscription$ = this.gridDirective.preGridInitialize.pipe(take(1)).subscribe(res => {
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
        this.listElm = null;
        this.virtualNexus.virtualForDirective._viewContainer.detach(0);
        this.virtualNexus.virtualForDirective._viewContainer.clear();
        this.items = [];
        this.elementRef.nativeElement.scrollViewport = null;
        this.templateRef = null;
        this._cloneMethod = null;
        this.generateCloneMethod = null;
        if (this.virtualNexus) {
            this.directiveRegistrationService.clearVirtualNexus(this.virtualNexus);
            this.virtualNexus.virtualForDirective = null;
            this.virtualNexus.scrollViewportDirective = null;
            this.virtualNexus = null;
        }
        clearTimeout(this.timeoutID);
        this.elementRef.nativeElement.removeEventListener('mouseenter', this.handleMouseOver);
        this.elementRef.nativeElement.removeEventListener('mouseleave', this.handleMouseOut);
        if (this.listContent) {
            this.listContent.removeEventListener('scroll', this.handleListContentScroll);
        }
        this.handleListContentScroll = null;
        document.removeEventListener('keydown', this.handleKeyDown);
        if (this.virtualForChangesSubscription$) {
            this.virtualForChangesSubscription$.unsubscribe();
        }
        if (this.preGridInitializeSubscription$) {
            this.preGridInitializeSubscription$.unsubscribe();
        }
        this.elementRef.nativeElement.scrollViewportDirective = null;
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
        const rangeToKeep = { ...this.range };
        const lastRangeToKeep = { ...this.lastRange };
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
                if (this.preItemOverflowCount >= Number(this.preItemOverflow)) {
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
ScrollViewportDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollViewportDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }, { token: DOCUMENT }, { token: i2.DirectiveRegistrationService }, { token: i3.ScrollDispatcherService }, { token: i4.OperatingSystemService }, { token: i0.ChangeDetectorRef }, { token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Directive });
ScrollViewportDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: ScrollViewportDirective, selector: "[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]", inputs: { templateID: "templateID", generateCloneMethod: "generateCloneMethod", arrowUpSpeed: "arrowUpSpeed", arrowDownSpeed: "arrowDownSpeed", preItemOverflow: "preItemOverflow", postItemOverflow: "postItemOverflow", itemLoadLimit: "itemLoadLimit", templateid: "templateid", preitemoverflow: "preitemoverflow", postitemoverflow: "postitemoverflow", arrowupspeed: "arrowupspeed", arrowdownspeed: "arrowdownspeed", itemloadlimit: "itemloadlimit", fillViewportScrolling: "fillViewportScrolling" }, outputs: { itemAdded: "itemAdded", itemRemoved: "itemRemoved", itemUpdated: "itemUpdated", rangeUpdated: "rangeUpdated", viewportScrolled: "viewportScrolled", viewportReady: "viewportReady", viewportInitialized: "viewportInitialized" }, host: { styleAttribute: "contain: content;" }, queries: [{ propertyName: "templateRef", first: true, predicate: ["templateRef"], descendants: true, static: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollViewportDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]',
                    host: { style: 'contain: content;' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.DirectiveRegistrationService }, { type: i3.ScrollDispatcherService }, { type: i4.OperatingSystemService }, { type: i0.ChangeDetectorRef }, { type: i0.RendererFactory2 }]; }, propDecorators: { templateRef: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXZpZXdwb3J0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9kaXJlY3RpdmVzL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFxQixZQUFZLEVBQ25DLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBK0QsTUFBTSxlQUFlLENBQUM7QUFDL0osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBTzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBRzNGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzdHLE9BQU8sRUFBZ0IsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFNMUMsTUFBTSxPQUFPLHVCQUF1QjtJQU9sQyxJQUFJLFlBQVk7UUFDWixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELElBQWEsWUFBWSxDQUFDLEtBQXNCO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFHRCxJQUFJLGNBQWM7UUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELElBQWEsY0FBYyxDQUFDLEtBQXNCO1FBQzlDLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFHRCxJQUFJLGVBQWU7UUFDZixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsSUFB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QWp0Q1UsdUJBQXVCLHVFQTJIeEIsUUFBUTt3R0EzSFAsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBSm5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZFQUE2RTtvQkFDdkYsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFDO2lCQUNwQzs7MEJBNEhJLE1BQU07MkJBQUMsUUFBUTtpT0F6SG9DLFdBQVc7c0JBQWhFLFlBQVk7dUJBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFFcEMsVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBS08sWUFBWTtzQkFBeEIsS0FBSztnQkFRTyxjQUFjO3NCQUExQixLQUFLO2dCQVFPLGVBQWU7c0JBQTNCLEtBQUs7Z0JBUU8sZ0JBQWdCO3NCQUE1QixLQUFLO2dCQVFPLGFBQWE7c0JBQXpCLEtBQUs7Z0JBU0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBRUksU0FBUztzQkFBbEIsTUFBTTtnQkFDRyxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLFdBQVc7c0JBQXBCLE1BQU07Z0JBQ0csWUFBWTtzQkFBckIsTUFBTTtnQkFDRyxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxtQkFBbUI7c0JBQTVCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIENoYW5nZURldGVjdG9yUmVmLCBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsIEVtYmVkZGVkVmlld1JlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdSZWYsIE9uRGVzdHJveSwgUmVuZGVyZXIyLCBSZW5kZXJlckZhY3RvcnkyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9ncmlkL2dyaWQuc2VydmljZSc7XG5pbXBvcnQgeyBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBSYW5nZSB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2NsYXNzZXMvc2Nyb2xsaW5nL3JhbmdlJztcbmltcG9ydCB7IElTY3JvbGxPcHRpb25zIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9zY3JvbGxpbmcvaS1zY3JvbGwtb3B0aW9ucyc7XG5pbXBvcnQgeyBTY3JvbGxEaXNwYXRjaGVyU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvc2Nyb2xsLWRpc3BhdGNoZXIvc2Nyb2xsLWRpc3BhdGNoZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHcmlkRGlyZWN0aXZlIH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL2dyaWQvZ3JpZC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVGFibGVqc0Zvck9mQ29udGV4dCB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy92aXJ0dWFsLWZvci92aXJ0dWFsLWZvci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSVZpcnR1YWxOZXh1cyB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvaS12aXJ0dWFsLW5leHVzJztcbmltcG9ydCB7IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL29wZXJhdGluZy1zeXN0ZW0vb3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL3Njcm9sbC1wcmV2LXNwYWNlci9zY3JvbGwtcHJldi1zcGFjZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgdGFrZSB9IGZyb20gJ3J4anMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbdGFibGVqc1Njcm9sbFZpZXdwb3J0XSwgW3RhYmxlanNzY3JvbGx2aWV3cG9ydF0sIFt0YWJsZWpzLXNjcm9sbC12aWV3cG9ydF0nLFxuICBob3N0OiB7IHN0eWxlOiAnY29udGFpbjogY29udGVudDsnfVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgT25Jbml0IHtcblxuICBAQ29udGVudENoaWxkKCd0ZW1wbGF0ZVJlZicsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpIHRlbXBsYXRlSUQ6IHN0cmluZyB8IG51bGwgPSAnJztcbiAgQElucHV0KCkgZ2VuZXJhdGVDbG9uZU1ldGhvZDogKCh0ZW1wbGF0ZTogSFRNTEVsZW1lbnQsIGl0ZW1zOiBhbnlbXSwgaW5kZXg6IG51bWJlcikgPT4gTm9kZSkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfYXJyb3dVcFNwZWVkOiBzdHJpbmcgfCBudW1iZXIgPSAxO1xuICBnZXQgYXJyb3dVcFNwZWVkKCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuX2Fycm93VXBTcGVlZCk7XG4gIH1cbiAgQElucHV0KCkgc2V0IGFycm93VXBTcGVlZCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICB0aGlzLl9hcnJvd1VwU3BlZWQgPSBOdW1iZXIodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXJyb3dEb3duU3BlZWQ6IHN0cmluZyB8IG51bWJlciA9IDE7XG4gIGdldCBhcnJvd0Rvd25TcGVlZCgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLl9hcnJvd0Rvd25TcGVlZCk7XG4gIH1cbiAgQElucHV0KCkgc2V0IGFycm93RG93blNwZWVkKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIHRoaXMuX2Fycm93RG93blNwZWVkID0gTnVtYmVyKHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3ByZUl0ZW1PdmVyZmxvdzogc3RyaW5nIHwgbnVtYmVyID0gMTtcbiAgZ2V0IHByZUl0ZW1PdmVyZmxvdygpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLl9wcmVJdGVtT3ZlcmZsb3cpO1xuICB9XG4gIEBJbnB1dCgpIHNldCBwcmVJdGVtT3ZlcmZsb3codmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgdGhpcy5fcHJlSXRlbU92ZXJmbG93ID0gTnVtYmVyKHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Bvc3RJdGVtT3ZlcmZsb3c6IHN0cmluZyB8IG51bWJlciA9IDE7XG4gIGdldCBwb3N0SXRlbU92ZXJmbG93KCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuX3Bvc3RJdGVtT3ZlcmZsb3cpO1xuICB9XG4gIEBJbnB1dCgpIHNldCBwb3N0SXRlbU92ZXJmbG93KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIHRoaXMuX3Bvc3RJdGVtT3ZlcmZsb3cgPSBOdW1iZXIodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXRlbUxvYWRMaW1pdDogc3RyaW5nIHwgbnVtYmVyID0gSW5maW5pdHk7XG4gIGdldCBpdGVtTG9hZExpbWl0KCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuX2l0ZW1Mb2FkTGltaXQpO1xuICB9XG4gIEBJbnB1dCgpIHNldCBpdGVtTG9hZExpbWl0KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIHRoaXMuX2l0ZW1Mb2FkTGltaXQgPSBOdW1iZXIodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRpbWVvdXRJRDogYW55O1xuXG4gIGl0ZW1zOiBhbnlbXSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIEN1c3RvbSBFbGVtZW50cyBJbnB1dHNcbiAgQElucHV0KCkgdGVtcGxhdGVpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHByZWl0ZW1vdmVyZmxvdzogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgcG9zdGl0ZW1vdmVyZmxvdzogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgYXJyb3d1cHNwZWVkOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBhcnJvd2Rvd25zcGVlZDogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgaXRlbWxvYWRsaW1pdDogbnVtYmVyID0gSW5maW5pdHk7XG4gIEBJbnB1dCgpIGZpbGxWaWV3cG9ydFNjcm9sbGluZzogYW55O1xuXG4gIEBPdXRwdXQoKSBpdGVtQWRkZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBpdGVtUmVtb3ZlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGl0ZW1VcGRhdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcmFuZ2VVcGRhdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgdmlld3BvcnRTY3JvbGxlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHZpZXdwb3J0UmVhZHk6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSB2aWV3cG9ydEluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgY29udGFpbmVySGVpZ2h0OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoZWlnaHRMb29rdXA6IGFueSA9IHt9O1xuICBwcml2YXRlIGl0ZW1WaXNpYmlsaXR5TG9va3VwOiBhbnkgPSB7fTtcbiAgcHVibGljIGxpc3RFbG06IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBsaXN0Q29udGVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHByZXZTcGFjZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBwb3N0U3BhY2VyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgZ3JpZERpcmVjdGl2ZTogR3JpZERpcmVjdGl2ZSB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgdmlydHVhbEZvckNoYW5nZXNTdWJzY3JpcHRpb24kOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBwcmVHcmlkSW5pdGlhbGl6ZVN1YnNjcmlwdGlvbiQ6IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIHBhdXNlVmlld3BvcnRSZW5kZXJVcGRhdGVzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIHJhbmdlOiBSYW5nZSA9IHsgc3RhcnRJbmRleDogMCwgZW5kSW5kZXg6IDEsIGV4dGVuZGVkU3RhcnRJbmRleDogMCwgZXh0ZW5kZWRFbmRJbmRleDogMSB9O1xuICBwdWJsaWMgbGFzdFJhbmdlOiBSYW5nZSA9IHsgc3RhcnRJbmRleDogdGhpcy5yYW5nZS5zdGFydEluZGV4LCBlbmRJbmRleDogdGhpcy5yYW5nZS5lbmRJbmRleCwgZXh0ZW5kZWRTdGFydEluZGV4OiB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCwgZXh0ZW5kZWRFbmRJbmRleDogdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4IH07XG4gIHB1YmxpYyBsYXN0U2Nyb2xsVG9wOiBudW1iZXIgPSAwO1xuICBwdWJsaWMgY3VycmVudFNjcm9sbFRvcDogbnVtYmVyID0gMDtcbiAgcHVibGljIGN1cnJlbnRTY3JvbGxDaGFuZ2U6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0ZW1wbGF0ZTogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBlc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBlc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHRvdGFsSXRlbXNDb3VudGVkOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHRvdGFsSGVpZ2h0Q291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgaXRlbU5hbWU6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIGF2Z0l0ZW1IZWlnaHQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBvdmVyZmxvd0hlaWdodENvdW50OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGxhc3RWaXNpYmxlSXRlbUhlaWdodDogbnVtYmVyID0gSW5maW5pdHk7XG4gIHByaXZhdGUgYWRqdXN0ZWRTdGFydEluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmb3JjZWRFbmRJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIHBsYWNlaG9sZGVyT2JqZWN0OiBhbnkgPSB7fTtcblxuICBwcml2YXRlIHBvc3RJdGVtT3ZlcmZsb3dDb3VudDogbnVtYmVyID0gLTE7XG4gIHByaXZhdGUgcHJlSXRlbU92ZXJmbG93Q291bnQ6IG51bWJlciA9IC0xO1xuICBwcml2YXRlIGxhc3RWaXNpYmxlSXRlbU92ZXJmbG93OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHByZU92ZXJmbG93SGVpZ2h0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIG1vdXNlSXNPdmVyVmlld3BvcnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBsYXN0SGVpZ2h0OiBudW1iZXIgPSAwO1xuXG4gIHByaXZhdGUgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZU92ZXI6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlTW91c2VPdXQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlS2V5RG93bjogKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZUxpc3RDb250ZW50U2Nyb2xsOiAoKHRoaXM6IEhUTUxFbGVtZW50LCBlOiBFdmVudCkgPT4gdm9pZCkgfCB1bmRlZmluZWQgfCBudWxsO1xuICBwcml2YXRlIGNsb25lRnJvbVRlbXBsYXRlUmVmOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgdmlld3BvcnRIYXNTY3JvbGxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHRlbXBsYXRlQ29udGV4dDogVGFibGVqc0Zvck9mQ29udGV4dDxhbnksIGFueT4gfCBudWxsID0gbnVsbDtcblxuICBwdWJsaWMgdmlydHVhbE5leHVzOiBJVmlydHVhbE5leHVzIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfY2xvbmVNZXRob2Q6ICgodGVtcGxhdGU6IEhUTUxFbGVtZW50LCBpdGVtczogYW55W10sIGluZGV4OiBudW1iZXIpID0+IE5vZGUpIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIGRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2U6IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzY3JvbGxEaXNwYXRjaGVyU2VydmljZTogU2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvcGVyYXRpbmdTeXN0ZW06IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmIHwgbnVsbCxcbiAgICBwcml2YXRlIHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5MlxuICApIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5yZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVNjcm9sbChlOiBFdmVudCkge1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5saXN0Q29udGVudCEuc2Nyb2xsVG9wO1xuICAgIHRoaXMuY3VycmVudFNjcm9sbENoYW5nZSA9IHRoaXMuY3VycmVudFNjcm9sbFRvcCAtIHRoaXMubGFzdFNjcm9sbFRvcDtcbiAgICB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSArPSB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2U7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyAtPSB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2U7XG5cbiAgICBjb25zdCBuZXdSYW5nZSA9IHRoaXMuZ2V0UmFuZ2VDaGFuZ2UodGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0pO1xuICAgIHRoaXMudXBkYXRlU2Nyb2xsRnJvbVJhbmdlKG5ld1JhbmdlKTtcblxuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hWaWV3cG9ydFNjcm9sbGVkRXZlbnRzKHRoaXMudmlld3BvcnRTY3JvbGxlZCwgdGhpcy5sYXN0U2Nyb2xsVG9wLCB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyVmlld3BvcnRUb0VsZW1lbnQoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVmlld3BvcnQgPSB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hNdXRhdGlvbk9ic2VydmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IHRoczogYW55ID0gdGhpcztcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgICB0aHMudXBkYXRlTXV0YXRpb25zKG11dGF0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMubGlzdENvbnRlbnQhLCB7XG4gICAgICAvLyBjb25maWd1cmUgaXQgdG8gbGlzdGVuIHRvIGF0dHJpYnV0ZSBjaGFuZ2VzXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNdXRhdGlvbnMobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKTogdm9pZCB7XG4gICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICBjb25zdCBhZGRlZE5vZGVzID0gQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzKTtcbiAgICAgIGFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyTm9kZUF0dHJpYnV0ZXMobm9kZSk7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGROb2Rlcyhub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2hpbGROb2Rlcyhub2RlOiBOb2RlKSB7XG4gICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgIHRoaXMuZGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZS5yZWdpc3Rlck5vZGVBdHRyaWJ1dGVzKGNoaWxkTm9kZSk7XG4gICAgICBpZiAoY2hpbGROb2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZE5vZGVzKGNoaWxkTm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJDdXN0b21FbGVtZW50c0lucHV0cyh2aWV3cG9ydDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnRlbXBsYXRlSUQgPSB2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ3RlbXBsYXRlSUQnKTtcbiAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ3ByZUl0ZW1PdmVyZmxvdycpKTtcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSBOdW1iZXIodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdwb3N0SXRlbU92ZXJmbG93JykpO1xuICAgIHRoaXMuaXRlbUxvYWRMaW1pdCA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2l0ZW1Mb2FkTGltaXQnKSk7XG4gICAgdGhpcy5hcnJvd1VwU3BlZWQgPSBOdW1iZXIodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdhcnJvd1VwU3BlZWQnKSk7XG4gICAgdGhpcy5hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2Fycm93RG93blNwZWVkJykpO1xuICAgIHRoaXMuZmlsbFZpZXdwb3J0U2Nyb2xsaW5nID0gdmlld3BvcnQuZ2V0QXR0cmlidXRlKCdmaWxsVmlld3BvcnRTY3JvbGxpbmcnKTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEN1c3RvbUVsZW1lbnRzVmFyaWFibGVzKCkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlaWQpIHtcbiAgICAgIHRoaXMudGVtcGxhdGVJRCA9IHRoaXMudGVtcGxhdGVpZDtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJlaXRlbW92ZXJmbG93KSB7XG4gICAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih0aGlzLnByZWl0ZW1vdmVyZmxvdyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RpdGVtb3ZlcmZsb3cpIHtcbiAgICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvdyA9IE51bWJlcih0aGlzLnBvc3RpdGVtb3ZlcmZsb3cpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hcnJvd2Rvd25zcGVlZCkge1xuICAgICAgdGhpcy5hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih0aGlzLmFycm93ZG93bnNwZWVkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXJyb3d1cHNwZWVkKSB7XG4gICAgICB0aGlzLmFycm93VXBTcGVlZCA9IE51bWJlcih0aGlzLmFycm93dXBzcGVlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLml0ZW1sb2FkbGltaXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaXRlbUxvYWRMaW1pdCA9IE51bWJlcih0aGlzLml0ZW1sb2FkbGltaXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVEJvZGllcygpIHtcbiAgICB0aGlzLmxpc3RFbG0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgYm9keTogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5saXN0RWxtIS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXTtcbiAgICBpZiAoYm9keSkge1xuICAgICAgYm9keSA9IGJvZHkuZ2V0QXR0cmlidXRlKCd0YWJsZWpzVmlld3BvcnQnKSAhPT0gbnVsbCA/IGJvZHkgOiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMubGlzdENvbnRlbnQgPSBib2R5ID8gYm9keSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XG4gICAgdGhpcy5saXN0Q29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmxlanNMaXN0Q29udGVudCcsICcnKTtcbiAgICB0aGlzLmxpc3RDb250ZW50LnNldEF0dHJpYnV0ZSgndGFibGVqc1ZpZXdwb3J0JywgJycpO1xuICAgIHRoaXMubGlzdENvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5saXN0Q29udGVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy5saXN0Q29udGVudC5zdHlsZS5oZWlnaHQgPSAnMzUwcHgnO1xuICAgIHRoaXMubGlzdENvbnRlbnQuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICAgIHRoaXMubGlzdEVsbSEuYXBwZW5kQ2hpbGQodGhpcy5saXN0Q29udGVudCk7XG5cbiAgICBpZiAodGhpcy5maWxsVmlld3BvcnRTY3JvbGxpbmcgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGxWaWV3cG9ydFNjcm9sbGluZyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY292ZXJCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcbiAgICAgIGNvdmVyQm9keS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIGNvdmVyQm9keS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgY292ZXJCb2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xuICAgICAgY292ZXJCb2R5LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUudmlzaWJpbGl0eSA9ICdmYWxzZSc7XG4gICAgICB0aGlzLmxpc3RFbG0hLmFwcGVuZENoaWxkKGNvdmVyQm9keSk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyVmlld3BvcnRPbkdyaWREaXJlY3RpdmUodGhpcy5saXN0Q29udGVudCk7XG5cbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3ZpZXdDb250YWluZXIuY3JlYXRlQ29tcG9uZW50PFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnQ+KFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnQpO1xuICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdmlld0NvbnRhaW5lci5kZXRhY2goMCk7XG4gICAgY29uc3QgcmVmOiBFbWJlZGRlZFZpZXdSZWY8YW55PiA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcoY29tcG9uZW50UmVmLmluc3RhbmNlLnRlbXBsYXRlLCB1bmRlZmluZWQsIDApO1xuICAgIGNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgdGhpcy5wcmV2U3BhY2VyID0gcmVmLnJvb3ROb2Rlc1swXTtcblxuICAgIHRoaXMucG9zdFNwYWNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgdGhpcy5wb3N0U3BhY2VyLnNldEF0dHJpYnV0ZSgndGFibGVqc1Bvc3RTcGFjZXInLCAnJyk7XG4gICAgdGhpcy5wb3N0U3BhY2VyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMucG9zdFNwYWNlci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy5saXN0Q29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnBvc3RTcGFjZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRTY3JvbGxIYW5kbGVyKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdENvbnRlbnQhLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlTGlzdENvbnRlbnRTY3JvbGwgPSAoZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNjcm9sbChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZXJlbmRlclJvd0F0KGluZGV4OiBudW1iZXIsIHVwZGF0ZVNjcm9sbFBvc2l0aW9uOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudmlld3BvcnRIYXNTY3JvbGxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbmQgPSBpbmRleCAtIHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ITtcbiAgICBjb25zdCBpdGVtTmFtZTogc3RyaW5nID0gJ2l0ZW0nICsgaW5kZXg7XG5cbiAgICBpZiAoaW5kID4gdGhpcy5pdGVtcyEubGVuZ3RoIC0gMSB8fCB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdICE9PSB0cnVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXhNYXA6IGFueSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbmRleE1hcFsodGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdLmluZGV4XSA9IGk7XG4gICAgfTtcbiAgICBjb25zdCBkZXRhY2hlZFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3ZpZXdDb250YWluZXIuZGV0YWNoKGluZGV4TWFwW2luZGV4XSk7XG4gICAgY29uc3QgY2hpbGQ6IEhUTUxFbGVtZW50ID0gKGRldGFjaGVkUmVmIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF07XG4gICAgZGV0YWNoZWRSZWYhLmRlc3Ryb3koKTtcbiAgICBcbiAgICB0aGlzLnRlbXBsYXRlQ29udGV4dCA9IG5ldyBUYWJsZWpzRm9yT2ZDb250ZXh0PGFueSwgYW55Pih0aGlzLml0ZW1zIVtpbmRleF0sIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdGFibGVqc0Zvck9mLCBpbmRleCwgdGhpcy5pdGVtcyEubGVuZ3RoKTtcbiAgICBjb25zdCByZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RlbXBsYXRlISwgdGhpcy50ZW1wbGF0ZUNvbnRleHQsIGluZGV4TWFwW2luZGV4XSk7XG4gICAgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLm1vdmUocmVmLCBpbmRleE1hcFtpbmRleF0pO1xuICAgIGxldCBjbG9uZTogYW55ID0gcmVmLnJvb3ROb2Rlc1swXTtcbiAgICBjbG9uZS5pbmRleCA9IGluZGV4O1xuICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoUmVtb3ZlSXRlbUV2ZW50cyh0aGlzLml0ZW1SZW1vdmVkLCBjaGlsZCwgaW5kZXgsIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblxuICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gY2xvbmUub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IG9sZEhlaWdodDogbnVtYmVyID0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgIHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXSA9IGxvb2t1cEhlaWdodDtcblxuICAgIGNsb25lLmxhc3RIZWlnaHQgPSBsb29rdXBIZWlnaHQ7XG5cbiAgICB0aGlzLmFkZFJlc2l6ZVNlbnNvcihjbG9uZSwgaW5kZXgpO1xuXG4gICAgaWYgKG9sZEhlaWdodCkge1xuICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKG9sZEhlaWdodCwgbG9va3VwSGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHQobG9va3VwSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlU2Nyb2xsUG9zaXRpb24pIHtcbiAgICAgIHRoaXMucmVmcmVzaFZpZXdwb3J0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaFVwZGF0ZUl0ZW1FdmVudHModGhpcy5pdGVtVXBkYXRlZCwgY2xvbmUsIGluZGV4LCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaEFkZEl0ZW1FdmVudHModGhpcy5pdGVtQWRkZWQsIGNsb25lLCBpbmRleCwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aWV3cG9ydFJlbmRlcmVkKCkge1xuICAgIHRoaXMudmlydHVhbE5leHVzID0gdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLmdldFZpcnR1YWxOZXh1c0Zyb21WaWV3cG9ydCh0aGlzKTtcblxuICAgIGlmICh0aGlzLnZpcnR1YWxOZXh1cyAmJiB0aGlzLnZpcnR1YWxOZXh1cy52aXJ0dWFsRm9yRGlyZWN0aXZlKSB7XG4gICAgICB0aGlzLml0ZW1zID0gdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZS5fdGFibGVqc0Zvck9mO1xuXG4gICAgICB0aGlzLnZpcnR1YWxGb3JDaGFuZ2VzU3Vic2NyaXB0aW9uJCA9IHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUuY2hhbmdlcy5zdWJzY3JpYmUoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGlzVGhlU2FtZUFycmF5ID0gdGhpcy5pdGVtcyA9PT0gaXRlbS50YWJsZWpzRm9yT2Y7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtLnRhYmxlanNGb3JPZjtcblxuICAgICAgICBjb25zdCBzY3JvbGxUb09wdGlvbnMgPSB7IGluZGV4OiAwLCBzY3JvbGxBZnRlckluZGV4ZWRJdGVtOiAwIH07XG4gICAgICAgIGlmIChpc1RoZVNhbWVBcnJheSkge1xuICAgICAgICAgIHNjcm9sbFRvT3B0aW9ucy5pbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCBhcyBudW1iZXI7XG4gICAgICAgICAgc2Nyb2xsVG9PcHRpb25zLnNjcm9sbEFmdGVySW5kZXhlZEl0ZW0gPSB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbTtcblxuICAgICAgICAgIC8vIGFycmF5IGhhcyBjaGFuZ2VkLi4ucmVyZW5kZXIgY3VycmVudCBlbGVtZW50c1xuICAgICAgICAgIGNvbnN0IGxpc3RDaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5saXN0Q29udGVudCEuY2hpbGROb2Rlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVJdGVtcyhpdGVtLnRhYmxlanNGb3JPZiwgc2Nyb2xsVG9PcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jcmVhdGVUQm9kaWVzKCk7XG4gICAgdGhpcy5hZGRTY3JvbGxIYW5kbGVyKCk7XG5cbiAgICBpZiAodGhpcy5pdGVtcyAmJiAodGhpcy5nZW5lcmF0ZUNsb25lTWV0aG9kIHx8IHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl90ZW1wbGF0ZSkpIHtcbiAgICAgIHRoaXMuaW5pdFNjcm9sbCh7XG4gICAgICAgIGl0ZW1zOiB0aGlzLml0ZW1zLFxuICAgICAgICBnZW5lcmF0ZUNsb25lTWV0aG9kOiB0aGlzLl9jbG9uZU1ldGhvZCFcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoVmlld3BvcnRSZWFkeUV2ZW50cyh0aGlzLnZpZXdwb3J0UmVhZHksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb0JvdHRvbSgpOiB2b2lkIHtcbiAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zIS5sZW5ndGg7XG4gICAgdGhpcy5zY3JvbGxUb0V4YWN0KHRoaXMucmFuZ2Uuc3RhcnRJbmRleCwgMCk7XG4gIH1cblxuICBwdWJsaWMgc2Nyb2xsVG9Ub3AoKTogdm9pZCB7XG4gICAgdGhpcy5zY3JvbGxUb0V4YWN0KDAsIDApO1xuICB9XG5cbiAgcHVibGljIHBhZ2VVcCgpOiB2b2lkIHtcbiAgICBsZXQgaGVpZ2h0Q291bnQ6IG51bWJlciA9IHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtO1xuICAgIGlmICh0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPT09IDApIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCgwLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbG9va3VwSGVpZ2h0OiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFsnaXRlbScgKyBpXSA/IHRoaXMuaGVpZ2h0TG9va3VwWydpdGVtJyArIGldIDogdGhpcy5hdmdJdGVtSGVpZ2h0O1xuICAgICAgaGVpZ2h0Q291bnQgKz0gbG9va3VwSGVpZ2h0O1xuICAgICAgaWYgKGhlaWdodENvdW50ID49IHRoaXMuY29udGFpbmVySGVpZ2h0ISB8fCBpID09PSAwKSB7XG4gICAgICAgIGNvbnN0IG92ZXJmbG93RGlmZmVyZW5jZTogbnVtYmVyID0gaGVpZ2h0Q291bnQgPj0gdGhpcy5jb250YWluZXJIZWlnaHQhID8gaGVpZ2h0Q291bnQgLSB0aGlzLmNvbnRhaW5lckhlaWdodCEgOiAwO1xuICAgICAgICB0aGlzLnNjcm9sbFRvRXhhY3QoaSwgb3ZlcmZsb3dEaWZmZXJlbmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhZ2VEb3duKCk6IHZvaWQge1xuICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2UuZW5kSW5kZXghIC0gMTtcbiAgICBjb25zdCBvdmVyZmxvd0RpZmZlcmVuY2U6IG51bWJlciA9IHRoaXMuaGVpZ2h0TG9va3VwWydpdGVtJyArICh0aGlzLnJhbmdlLmVuZEluZGV4ISAtIDEpLnRvU3RyaW5nKCldIC0gdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdztcbiAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4LCBvdmVyZmxvd0RpZmZlcmVuY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBcnJvd0xpc3RlbmVycygpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5oYW5kbGVNb3VzZU92ZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5tb3VzZUlzT3ZlclZpZXdwb3J0ID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5oYW5kbGVNb3VzZU91dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm1vdXNlSXNPdmVyVmlld3BvcnQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5tb3VzZUlzT3ZlclZpZXdwb3J0KSB7XG5cbiAgICAgICAgY29uc3QgaXNNYWMgPSB0aGlzLm9wZXJhdGluZ1N5c3RlbS5pc01hYygpO1xuXG4gICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGlmIChpc01hYyAmJiBlLm1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgKz0gTnVtYmVyKHRoaXMuYXJyb3dEb3duU3BlZWQpO1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4ISwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgIGlmIChpc01hYyAmJiBlLm1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ISAtPSBOdW1iZXIodGhpcy5hcnJvd1VwU3BlZWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCh0aGlzLnJhbmdlLnN0YXJ0SW5kZXghLCAwKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCh0aGlzLnJhbmdlLnN0YXJ0SW5kZXghLCAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnUGFnZURvd24nOlxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5wYWdlRG93bigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnUGFnZVVwJzpcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMucGFnZVVwKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdFbmQnOlxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnSG9tZSc6XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5ncmlkRGlyZWN0aXZlID0gKHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpISBhcyBhbnkpWydncmlkRGlyZWN0aXZlJ107XG4gICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9IHRoaXM7XG5cbiAgICB0aGlzLnByZUdyaWRJbml0aWFsaXplU3Vic2NyaXB0aW9uJCA9IHRoaXMuZ3JpZERpcmVjdGl2ZSEucHJlR3JpZEluaXRpYWxpemUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLnJlZnJlc2hDb250YWluZXJIZWlnaHQoKTtcblxuICAgICAgdGhpcy5yZWZyZXNoVmlld3BvcnQoKTtcbiAgICAgIC8vIHBsYWNlaG9sZGVyIG9iamVjdCBpcyB1c2VkIG9ubHkgdG8gaW5pdGlhbGl6ZSBmaXJzdCBncmlkIHJlbmRlclxuICAgICAgaWYgKHRoaXMuaXRlbXMhWzBdID09PSB0aGlzLnBsYWNlaG9sZGVyT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuaXRlbXMhLnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXdwb3J0UmVuZGVyZWQoKTtcbiAgICB0aGlzLmFkZEFycm93TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yZWdpc3RlclZpZXdwb3J0VG9FbGVtZW50KCk7XG4gICAgdGhpcy5fY2xvbmVNZXRob2QgPSB0aGlzLmdlbmVyYXRlQ2xvbmVNZXRob2Q7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5saXN0RWxtID0gbnVsbDtcbiAgICB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3ZpZXdDb250YWluZXIuZGV0YWNoKDApO1xuICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxWaWV3cG9ydCA9IG51bGw7XG4gICAgdGhpcy50ZW1wbGF0ZVJlZiA9IG51bGw7XG4gICAgdGhpcy5fY2xvbmVNZXRob2QgPSBudWxsO1xuICAgIHRoaXMuZ2VuZXJhdGVDbG9uZU1ldGhvZCA9IG51bGw7XG4gICAgaWYgKHRoaXMudmlydHVhbE5leHVzKSB7XG4gICAgICB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UuY2xlYXJWaXJ0dWFsTmV4dXModGhpcy52aXJ0dWFsTmV4dXMpO1xuICAgICAgdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZSA9IG51bGw7XG4gICAgICB0aGlzLnZpcnR1YWxOZXh1cy5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9IG51bGw7XG4gICAgICB0aGlzLnZpcnR1YWxOZXh1cyA9IG51bGw7XG4gICAgfVxuICAgIFxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJRCk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuaGFuZGxlTW91c2VPdmVyKTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5oYW5kbGVNb3VzZU91dCk7XG4gICAgXG4gICAgaWYgKHRoaXMubGlzdENvbnRlbnQpIHtcbiAgICAgIHRoaXMubGlzdENvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVMaXN0Q29udGVudFNjcm9sbCEpO1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUxpc3RDb250ZW50U2Nyb2xsID0gbnVsbDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duISk7XG4gICAgaWYgKHRoaXMudmlydHVhbEZvckNoYW5nZXNTdWJzY3JpcHRpb24kKSB7XG4gICAgICB0aGlzLnZpcnR1YWxGb3JDaGFuZ2VzU3Vic2NyaXB0aW9uJC51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcmVHcmlkSW5pdGlhbGl6ZVN1YnNjcmlwdGlvbiQpIHtcbiAgICAgIHRoaXMucHJlR3JpZEluaXRpYWxpemVTdWJzY3JpcHRpb24kLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U2Nyb2xsU3BhY2VycygpOiB2b2lkIHtcblxuICAgIGNvbnN0IG51bUl0ZW1zQWZ0ZXJTaG93bkxpc3QgPSB0aGlzLml0ZW1zIS5sZW5ndGggLSB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXghO1xuICAgIGNvbnN0IG51bUl0ZW1zQmVmb3JlU2hvd25MaXN0ID0gdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXg7XG5cbiAgICBjb25zdCB0b3RhbFVuc2hvd25JdGVtcyA9IG51bUl0ZW1zQmVmb3JlU2hvd25MaXN0ISArIG51bUl0ZW1zQWZ0ZXJTaG93bkxpc3Q7XG5cbiAgICBjb25zdCBiZWZvcmVJdGVtSGVpZ2h0UGVyY2VudCA9IHRvdGFsVW5zaG93bkl0ZW1zICE9PSAwID8gbnVtSXRlbXNCZWZvcmVTaG93bkxpc3QhIC8gdG90YWxVbnNob3duSXRlbXMgOiAwO1xuICAgIGNvbnN0IGFmdGVySXRlbUhlaWdodFBlcmNlbnQgPSB0b3RhbFVuc2hvd25JdGVtcyAhPT0gMCA/IG51bUl0ZW1zQWZ0ZXJTaG93bkxpc3QgLyB0b3RhbFVuc2hvd25JdGVtcyA6IDA7XG4gICAgY29uc3QgcmVtYWluaW5nSGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodCAtIHRoaXMubGFzdEhlaWdodDtcblxuICAgIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodCA9IE1hdGgucm91bmQoYmVmb3JlSXRlbUhlaWdodFBlcmNlbnQgKiByZW1haW5pbmdIZWlnaHQpO1xuICAgIHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQgPSBNYXRoLnJvdW5kKGFmdGVySXRlbUhlaWdodFBlcmNlbnQgKiByZW1haW5pbmdIZWlnaHQpO1xuXG4gICAgLy8gYWNjb3VudCBmb3Igcm91bmRpbmcgYm90aCB1cFxuICAgIHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQgPSB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0IC0gKGFmdGVySXRlbUhlaWdodFBlcmNlbnQgKiByZW1haW5pbmdIZWlnaHQpID09PSAwLjUgPyB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0IC0gMSA6IHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQ7XG5cbiAgICBpZiAodGhpcy5mb3JjZWRFbmRJbmRleCkge1xuICAgICAgdGhpcy5lc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0ID0gMDtcbiAgICAgIHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQgPSAwO1xuICAgIH1cblxuICAgIHRoaXMucHJldlNwYWNlciEuc3R5bGUuaGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgIHRoaXMucG9zdFNwYWNlciEuc3R5bGUuaGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRQb3N0TGlzdEhlaWdodC50b1N0cmluZygpICsgJ3B4JztcblxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZWlnaHRCeUxpc3RIZWlnaHREaWZmZXJlbmNlKGxpSGVpZ2h0OiBudW1iZXIsIGxpc3RIZWlnaHQ6IG51bWJlcikge1xuICAgIHJldHVybiBsaUhlaWdodCAtIGxpc3RIZWlnaHQ7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVByZVNjcm9sbEl0ZW1zKGxhc3RJbmRleDogbnVtYmVyLCBpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGxhc3RJbmRleCA8IGluZGV4KSB7XG4gICAgICBmb3IgKGxldCBpID0gbGFzdEluZGV4OyBpIDwgaW5kZXg7IGkrKykge1xuICAgICAgICBjb25zdCBmaXJzdFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3ZpZXdDb250YWluZXIuZ2V0KDEpO1xuICAgICAgICBpZiAoZmlyc3RSZWYpIHtcbiAgICAgICAgICBjb25zdCBmaXJzdENoaWxkID0gKGZpcnN0UmVmIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF07XG4gICAgICAgICAgY29uc3QgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICAgIHRoaXMuaXRlbVZpc2liaWxpdHlMb29rdXBbaXRlbU5hbWVdID0gZmFsc2U7XG4gIFxuICAgICAgICAgIGNvbnN0IGRldGFjaGVkUmVmOiBWaWV3UmVmIHwgbnVsbCA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdmlld0NvbnRhaW5lci5kZXRhY2goMSk7XG4gICAgICAgICAgZGV0YWNoZWRSZWYhLmRlc3Ryb3koKTtcbiAgICAgICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgICAgdGhpcy5yZW1vdmVSZXNpemVTZW5zb3IoZmlyc3RDaGlsZCwgaSk7XG4gICAgICAgICAgdGhpcy5sYXN0SGVpZ2h0IC09IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcbiAgICAgICAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoUmVtb3ZlSXRlbUV2ZW50cyh0aGlzLml0ZW1SZW1vdmVkLCBmaXJzdENoaWxkLCBpLCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSByZW1vdmVQb3N0U2Nyb2xsSXRlbXMobGFzdEVuZEluZGV4OiBudW1iZXIsIGVuZEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAobGFzdEVuZEluZGV4ID49IHRoaXMuaXRlbXMhLmxlbmd0aCkge1xuICAgICAgbGFzdEVuZEluZGV4ID0gdGhpcy5pdGVtcyEubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gbGFzdEVuZEluZGV4OyBpID49IGVuZEluZGV4OyBpLS0pIHtcbiAgICAgIGNvbnN0IGxhc3RDaGlsZCA9IHRoaXMuZ2V0UHJldmlvdXNTaWJsaW5nKHRoaXMubGlzdENvbnRlbnQhLmxhc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgaWYgKGxhc3RDaGlsZCkge1xuICAgICAgICBjb25zdCBpdGVtTmFtZSA9ICdpdGVtJyArIGk7XG4gICAgICAgIHRoaXMuaXRlbVZpc2liaWxpdHlMb29rdXBbaXRlbU5hbWVdID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgZGV0YWNoZWRSZWY6IFZpZXdSZWYgfCBudWxsID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmRldGFjaCh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3ZpZXdDb250YWluZXIubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRldGFjaGVkUmVmIS5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVSZXNpemVTZW5zb3IobGFzdENoaWxkLCBpKTtcbiAgICAgICAgdGhpcy5sYXN0SGVpZ2h0IC09IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaFJlbW92ZUl0ZW1FdmVudHModGhpcy5pdGVtUmVtb3ZlZCwgKGRldGFjaGVkUmVmIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0sIGksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6IGFueVtdLCBzY3JvbGxUb09wdGlvbnM6IGFueSA9IHtpbmRleDogLTEsIHNjcm9sbEFmdGVySW5kZXhlZEl0ZW06IDAgfSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhdXNlVmlld3BvcnRSZW5kZXJVcGRhdGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3ZpZXdDb250YWluZXIubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3QgZGV0YWNoZWRSZWY6IFZpZXdSZWYgfCBudWxsID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmRldGFjaChpKTtcbiAgICAgIGRldGFjaGVkUmVmIS5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB0aGlzLnJlc2V0VG9Jbml0aWFsVmFsdWVzKCk7XG4gICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgIGlmICh0aGlzLnZpcnR1YWxOZXh1cykge1xuICAgICAgdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RhYmxlanNGb3JPZiA9IGl0ZW1zO1xuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb09wdGlvbnMuaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvRXhhY3Qoc2Nyb2xsVG9PcHRpb25zLmluZGV4LCBzY3JvbGxUb09wdGlvbnMuc2Nyb2xsQWZ0ZXJJbmRleGVkSXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc2V0VG9Jbml0aWFsVmFsdWVzKCk6IHZvaWQge1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2UgPSAwO1xuICAgIHRoaXMuZXN0aW1hdGVkRnVsbENvbnRlbnRIZWlnaHQgPSAwO1xuICAgIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodCA9IDA7XG4gICAgdGhpcy5lc3RpbWF0ZWRQb3N0TGlzdEhlaWdodCA9IDA7XG4gICAgdGhpcy50b3RhbEl0ZW1zQ291bnRlZCA9IDA7XG4gICAgdGhpcy50b3RhbEhlaWdodENvdW50ID0gMDtcbiAgICB0aGlzLmF2Z0l0ZW1IZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oZWlnaHRMb29rdXAgPSB7fTtcbiAgICB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwID0ge307XG4gICAgdGhpcy5vdmVyZmxvd0hlaWdodENvdW50ID0gMDtcbiAgICB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSA9IDA7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1IZWlnaHQgPSBJbmZpbml0eTtcbiAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmxhc3RIZWlnaHQgPSAwO1xuICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IDA7XG4gICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9IDA7XG4gICAgdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXggPSAwO1xuICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCA9IDA7XG4gICAgdGhpcy5sYXN0UmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleDtcbiAgICB0aGlzLmxhc3RSYW5nZS5lbmRJbmRleCA9IHRoaXMucmFuZ2UuZW5kSW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleDtcbiAgICB0aGlzLmZvcmNlZEVuZEluZGV4ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHJlY2FsY3VsYXRlUm93SGVpZ2h0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtTmFtZTogc3RyaW5nID0gJ2l0ZW0nICsgaW5kZXg7XG4gICAgY29uc3QgaW5kZXhNYXA6IGFueSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbmRleE1hcFsodGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdLmluZGV4XSA9IGk7XG4gICAgfTtcbiAgICBjb25zdCByb3dSZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmdldChpbmRleE1hcFtpbmRleF0pIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+O1xuICAgIGNvbnN0IHJvd0VsOiBIVE1MRWxlbWVudCB8IGFueSA9IHJvd1JlZi5yb290Tm9kZXNbMF07XG5cbiAgICBjb25zdCBsb29rdXBIZWlnaHQ6IG51bWJlciA9IHJvd0VsLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBoZWlnaHREaWZmZXJlbmNlOiBudW1iZXIgPSBsb29rdXBIZWlnaHQgLSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG4gICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXSwgbG9va3VwSGVpZ2h0KTtcbiAgICB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV0gPSBsb29rdXBIZWlnaHQ7XG5cbiAgICByb3dFbC5sYXN0SGVpZ2h0ID0gbG9va3VwSGVpZ2h0O1xuICAgIHRoaXMubGFzdEhlaWdodCArPSBoZWlnaHREaWZmZXJlbmNlO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKG9sZEhlaWdodDogbnVtYmVyLCBuZXdIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudG90YWxIZWlnaHRDb3VudCArPSAobmV3SGVpZ2h0IC0gb2xkSGVpZ2h0KTtcbiAgICB0aGlzLmF2Z0l0ZW1IZWlnaHQgPSAodGhpcy50b3RhbEhlaWdodENvdW50IC8gdGhpcy50b3RhbEl0ZW1zQ291bnRlZCk7XG4gICAgdGhpcy5lc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodCA9IHRoaXMuYXZnSXRlbUhlaWdodCAqIHRoaXMuaXRlbXMhLmxlbmd0aDtcbiAgfVxuICBwcml2YXRlIHVwZGF0ZUVzdGltYXRlZEhlaWdodChoZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMudG90YWxIZWlnaHRDb3VudCArPSBoZWlnaHQ7XG4gICAgdGhpcy50b3RhbEl0ZW1zQ291bnRlZCsrO1xuXG4gICAgdGhpcy5hdmdJdGVtSGVpZ2h0ID0gKHRoaXMudG90YWxIZWlnaHRDb3VudCAvIHRoaXMudG90YWxJdGVtc0NvdW50ZWQpO1xuICAgIHRoaXMuZXN0aW1hdGVkRnVsbENvbnRlbnRIZWlnaHQgPSB0aGlzLmF2Z0l0ZW1IZWlnaHQgKiB0aGlzLml0ZW1zIS5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgZ2V0UHJldmlvdXNTaWJsaW5nKGVsOiBOb2RlIHwgRWxlbWVudCB8IG51bGwpOiBhbnkge1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgcHJldiA9IGVsLnByZXZpb3VzU2libGluZztcbiAgICB3aGlsZSAocHJldiAhPT0gbnVsbCAmJiBwcmV2ICE9PSB1bmRlZmluZWQgJiYgcHJldi5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgcHJldiA9IHByZXYucHJldmlvdXNTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcHJldjtcbiAgfVxuICBwdWJsaWMgZ2V0TmV4dFNpYmxpbmcoZWw6IEVsZW1lbnQgfCBudWxsKTogYW55IHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IG5leHQgPSBlbC5uZXh0U2libGluZztcbiAgICB3aGlsZSAobmV4dCAhPT0gbnVsbCAmJiBuZXh0ICE9PSB1bmRlZmluZWQgJiYgbmV4dC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgbmV4dCA9IG5leHQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFc3RpbWF0ZWRDaGlsZEluc2VydGlvbnMocmVtYWluaW5nSGVpZ2h0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLmNlaWwocmVtYWluaW5nSGVpZ2h0IC8gdGhpcy5hdmdJdGVtSGVpZ2h0ISk7XG4gIH1cblxuICBwcml2YXRlIHNldExhc3RSYW5nZVRvQ3VycmVudFJhbmdlKCkge1xuICAgIHRoaXMubGFzdFJhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZW5kSW5kZXggPSB0aGlzLnJhbmdlLmVuZEluZGV4O1xuICAgIHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4O1xuICAgIHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkRW5kSW5kZXggPSB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXg7XG4gIH1cblxuICBwcml2YXRlIHJlc2V0TGFzdEhlaWdodCgpIHtcbiAgICBpZiAoIXRoaXMubGFzdEhlaWdodCkge1xuICAgICAgdGhpcy5sYXN0SGVpZ2h0ID0gMDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1haW50YWluSW5kZXhJbkJvdW5kcyhpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGluZGV4ID4gdGhpcy5pdGVtcyEubGVuZ3RoIC0gMSkge1xuICAgICAgaW5kZXggPSB0aGlzLml0ZW1zIS5sZW5ndGggLSAxO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgbWFpbnRhaW5FbmRJbmRleEluQm91bmRzKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoaW5kZXggPiB0aGlzLml0ZW1zIS5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gdGhpcy5pdGVtcyEubGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBzaG93UmFuZ2Uoc3RhcnRJbmRleDogbnVtYmVyLCBlbmRJbmRleDogbnVtYmVyLCBvdmVyZmxvdzogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlSXRlbXModGhpcy5pdGVtcyEsIHtpbmRleDogc3RhcnRJbmRleCwgc2Nyb2xsQWZ0ZXJJbmRleGVkSXRlbTogZW5kSW5kZXggfSk7XG4gICAgc3RhcnRJbmRleCA9IHRoaXMubWFpbnRhaW5JbmRleEluQm91bmRzKHN0YXJ0SW5kZXgpO1xuICAgIGVuZEluZGV4ID0gdGhpcy5tYWludGFpbkVuZEluZGV4SW5Cb3VuZHMoZW5kSW5kZXgpO1xuICAgIGlmIChlbmRJbmRleCA8PSBzdGFydEluZGV4KSB7XG4gICAgICBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZENvbnRhaW5lckhlaWdodDogbnVtYmVyID0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuICAgIGNvbnN0IG9sZFByZUl0ZW1PdmVyZmxvdzogbnVtYmVyID0gTnVtYmVyKHRoaXMucHJlSXRlbU92ZXJmbG93KTtcbiAgICBjb25zdCBvbGRQb3N0SXRlbU92ZXJmbG93OiBudW1iZXIgPSBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KTtcblxuICAgIHRoaXMucHJlSXRlbU92ZXJmbG93ID0gMDtcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSAwO1xuICAgIHRoaXMuY29udGFpbmVySGVpZ2h0ID0gMTAwMDAwO1xuICAgIHRoaXMuZm9yY2VkRW5kSW5kZXggPSBlbmRJbmRleDtcblxuICAgIHRoaXMuc2Nyb2xsVG9FeGFjdChzdGFydEluZGV4LCBvdmVyZmxvdyk7XG5cbiAgICBjb25zdCByYW5nZVRvS2VlcDogUmFuZ2UgPSB7IC4uLnRoaXMucmFuZ2V9O1xuICAgIGNvbnN0IGxhc3RSYW5nZVRvS2VlcDogUmFuZ2UgPSB7IC4uLnRoaXMubGFzdFJhbmdlIH07XG5cbiAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IG9sZFByZUl0ZW1PdmVyZmxvdztcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSBvbGRQb3N0SXRlbU92ZXJmbG93O1xuICAgIHRoaXMuY29udGFpbmVySGVpZ2h0ID0gb2xkQ29udGFpbmVySGVpZ2h0O1xuICAgIHRoaXMuZm9yY2VkRW5kSW5kZXggPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnJhbmdlID0gcmFuZ2VUb0tlZXA7XG4gICAgdGhpcy5sYXN0UmFuZ2UgPSBsYXN0UmFuZ2VUb0tlZXA7XG5cbiAgfVxuXG4gIHB1YmxpYyBnZXREaXNwbGF5ZWRDb250ZW50c0hlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmxhc3RIZWlnaHQ7XG4gIH1cblxuICBwdWJsaWMgcmVmcmVzaENvbnRhaW5lckhlaWdodCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lckhlaWdodCA9IHRoaXMubGlzdENvbnRlbnQhLmNsaWVudEhlaWdodDtcbiAgfVxuXG4gIHB1YmxpYyBhbGxJdGVtc0ZpdFZpZXdwb3J0KHJlY2FsY3VsYXRlQ29udGFpbmVySGVpZ2h0OiBib29sZWFuID0gZmFsc2UsIHJlZnJlc2hWaWV3cG9ydDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgaWYgKHJlY2FsY3VsYXRlQ29udGFpbmVySGVpZ2h0KSB7XG4gICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5yZWZyZXNoQ29udGFpbmVySGVpZ2h0KCk7XG4gICAgfVxuICAgIGlmIChyZWZyZXNoVmlld3BvcnQpIHtcbiAgICAgIHRoaXMucmVmcmVzaFZpZXdwb3J0KHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yYW5nZS5zdGFydEluZGV4ID09PSB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCAmJlxuICAgICAgICAgICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9PT0gdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ICYmIFxuICAgICAgICAgICAgdGhpcy5sYXN0SGVpZ2h0IDw9IHRoaXMuY29udGFpbmVySGVpZ2h0ITtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDdXJyZW50U2Nyb2xsUG9zaXRpb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXg6IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCxcbiAgICAgIG92ZXJmbG93OiB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSxcbiAgICAgIGxhc3RJdGVtT3ZlcmZsb3c6IHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3cgPiAwID8gMCA6IHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3dcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldEhlaWdodHNGb3JPdmVyZmxvd0NhbGN1bGF0aW9ucyhpdGVtSW5kZXg6IG51bWJlciwgc2Nyb2xsVG9JbmRleDogbnVtYmVyLCBpdGVtSGVpZ2h0OiBudW1iZXIpIHtcbiAgICB0aGlzLmxhc3RIZWlnaHQgKz0gaXRlbUhlaWdodDtcblxuICAgIGlmIChpdGVtSW5kZXggPCBzY3JvbGxUb0luZGV4KSB7XG4gICAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ICs9IGl0ZW1IZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1JbmRleCA+PSBzY3JvbGxUb0luZGV4KSB7XG4gICAgICB0aGlzLm92ZXJmbG93SGVpZ2h0Q291bnQgKz0gaXRlbUhlaWdodDtcbiAgICAgIGlmICh0aGlzLm92ZXJmbG93SGVpZ2h0Q291bnQgPj0gdGhpcy5jb250YWluZXJIZWlnaHQhKSB7XG4gICAgICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50Kys7XG5cbiAgICAgICAgaWYgKHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1IZWlnaHQgPSB0aGlzLmhlaWdodExvb2t1cFsnaXRlbScgKyBpdGVtSW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRSZXNpemVTZW5zb3IoZWw6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICB9XG4gIHByaXZhdGUgcmVtb3ZlUmVzaXplU2Vuc29yKGVsOiBhbnksIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgfVxuXG4gIHB1YmxpYyBvblRyYW5zaXRpb25FbmQ6IChfZTogYW55KSA9PiB2b2lkID0gKGUpID0+IHtcbiAgfVxuICBwdWJsaWMgb25UcmFuc2l0aW9uUnVuOiAoX2U6IGFueSkgPT4gdm9pZCA9IChlKSA9PiB7XG4gIH1cbiAgcHVibGljIG9uVHJhbnNpdGlvblN0YXJ0OiAoX2U6IGFueSkgPT4gdm9pZCA9IChlKSA9PiB7XG4gIH1cbiAgcHVibGljIG9uVHJhbnNpdGlvbkNhbmNlbDogKF9lOiBhbnkpID0+IHZvaWQgPSAoZSkgPT4ge1xuICB9XG5cbiAgcHVibGljIGdldENsb25lRnJvbVRlbXBsYXRlUmVmKGluZGV4OiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XG4gICAgbGV0IGNsb25lOiBIVE1MRWxlbWVudDtcblxuICAgIHRoaXMudGVtcGxhdGVDb250ZXh0ID0gbmV3IFRhYmxlanNGb3JPZkNvbnRleHQ8YW55LCBhbnk+KHRoaXMuaXRlbXMhW2luZGV4XSwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl90YWJsZWpzRm9yT2YsIGluZGV4LCB0aGlzLml0ZW1zIS5sZW5ndGgpO1xuICAgIGNvbnN0IHZpZXdSZWYgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RlbXBsYXRlIS5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZUNvbnRleHQpO1xuICAgIHZpZXdSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIGNsb25lID0gdmlld1JlZi5yb290Tm9kZXNbMF07XG5cbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICBwcml2YXRlIGFkZFNjcm9sbEl0ZW1zKGluZGV4OiBudW1iZXIsIG92ZXJmbG93OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBzY3JvbGxpbmdVcCA9IGluZGV4IDwgdGhpcy5sYXN0UmFuZ2Uuc3RhcnRJbmRleCE7XG5cbiAgICB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4O1xuICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IGluZGV4O1xuICAgIHRoaXMub3ZlcmZsb3dIZWlnaHRDb3VudCA9IC1vdmVyZmxvdztcbiAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ID0gMDtcbiAgICBjb25zdCBmaXJzdEVsID0gdGhpcy5nZXROZXh0U2libGluZyh0aGlzLmxpc3RDb250ZW50IS5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgdGhpcy5sYXN0SGVpZ2h0ID0gMDtcbiAgICBsZXQgYmF0Y2hTaXplOiBudW1iZXIgPSB0aGlzLmF2Z0l0ZW1IZWlnaHQgIT09IHVuZGVmaW5lZCAmJiBpc05hTih0aGlzLmF2Z0l0ZW1IZWlnaHQpID09PSBmYWxzZSA/IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISAtIHRoaXMubGFzdEhlaWdodCkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpICsgTnVtYmVyKHRoaXMucG9zdEl0ZW1PdmVyZmxvdykgOiAxO1xuICAgIGxldCBpdGVtc1RvQmF0Y2g6IGFueVtdID0gW107XG4gICAgbGV0IGl0ZW1CZWZvcmU6IE5vZGU7XG4gICAgbGV0IGluZGV4QmVmb3JlOiBudW1iZXI7XG4gICAgY29uc3QgZmlyc3RSZWY6IFZpZXdSZWYgfCBudWxsID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmdldCgxKTtcbiAgICBjb25zdCBhcHBlbmRUb0VuZDogYm9vbGVhbiA9IGZpcnN0UmVmID09PSBudWxsO1xuICAgIGZvciAobGV0IGkgPSB0aGlzLmFkanVzdGVkU3RhcnRJbmRleCE7IGkgPCB0aGlzLmFkanVzdGVkU3RhcnRJbmRleCEgKyBOdW1iZXIodGhpcy5pdGVtTG9hZExpbWl0KTsgaSsrKSB7XG4gICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoaSA+IHRoaXMuaXRlbXMhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgLy8gb25seSBpbnNlcnQgaXRlbSBpZiBpdCBpcyBub3QgYWxyZWFkeSB2aXNpYmxlXG4gICAgICBjb25zdCBpdGVtSXNJbnZpc2libGU6IGJvb2xlYW4gPSB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdICE9PSB0cnVlO1xuXG4gICAgICBpZiAoaXRlbUlzSW52aXNpYmxlKSB7XG4gICAgICAgIGl0ZW1CZWZvcmUgPSAhc2Nyb2xsaW5nVXAgPyB0aGlzLnBvc3RTcGFjZXIgOiBmaXJzdEVsO1xuXG4gICAgICAgIGluZGV4QmVmb3JlID0gIXNjcm9sbGluZ1VwIHx8IGFwcGVuZFRvRW5kID8gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmxlbmd0aCA6IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdmlld0NvbnRhaW5lci5pbmRleE9mKGZpcnN0UmVmISk7XG5cbiAgICAgICAgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFt0aGlzLml0ZW1OYW1lXSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZUNvbnRleHQgPSBuZXcgVGFibGVqc0Zvck9mQ29udGV4dDxhbnksIGFueT4odGhpcy5pdGVtcyFbaV0sIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdGFibGVqc0Zvck9mLCBpLCB0aGlzLml0ZW1zIS5sZW5ndGgpO1xuICAgICAgICBjb25zdCByZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RlbXBsYXRlISwgdGhpcy50ZW1wbGF0ZUNvbnRleHQsIGluZGV4QmVmb3JlKTtcbiAgICAgICAgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLm1vdmUocmVmLCBpbmRleEJlZm9yZSk7XG5cbiAgICAgICAgY29uc3QgcHJldjogYW55ID0gcmVmLnJvb3ROb2Rlc1swXTtcbiAgICAgICAgcHJldi5pbmRleCA9IGk7XG4gICAgICAgIFxuICAgICAgICBpdGVtc1RvQmF0Y2gucHVzaCh7IGluZGV4OiBpLCBuYW1lOiB0aGlzLml0ZW1OYW1lLCBpdGVtOiBwcmV2LCBiZWZvcmU6IGl0ZW1CZWZvcmUgfSk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaEFkZEl0ZW1FdmVudHModGhpcy5pdGVtQWRkZWQsIHByZXYsIGksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zVG9CYXRjaC5wdXNoKHsgaW5kZXg6IGksIG5hbWU6IHRoaXMuaXRlbU5hbWUsIGl0ZW06IG51bGwsIGJlZm9yZTogbnVsbCB9KTtcbiAgICAgICAgdGhpcy5zZXRIZWlnaHRzRm9yT3ZlcmZsb3dDYWxjdWxhdGlvbnMoaSwgaW5kZXgsIHRoaXMuaGVpZ2h0TG9va3VwW3RoaXMuaXRlbU5hbWVdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1zVG9CYXRjaC5sZW5ndGggPT09IGJhdGNoU2l6ZSB8fCBpID09PSB0aGlzLml0ZW1zIS5sZW5ndGggLSAxIHx8IHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50ID49IE51bWJlcih0aGlzLnBvc3RJdGVtT3ZlcmZsb3cpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaXRlbXNUb0JhdGNoLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgYmF0Y2hPYmo6IGFueSA9IGl0ZW1zVG9CYXRjaFtqXTtcbiAgICAgICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBiYXRjaE9iai5uYW1lO1xuICAgICAgICAgIGNvbnN0IGluZDogbnVtYmVyID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgY29uc3Qgb2xkSGVpZ2h0OiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFtuYW1lXTtcblxuICAgICAgICAgIGlmIChiYXRjaE9iai5pdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gYmF0Y2hPYmouaXRlbS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICB0aGlzLmhlaWdodExvb2t1cFtuYW1lXSA9IGxvb2t1cEhlaWdodDtcblxuICAgICAgICAgIGJhdGNoT2JqLml0ZW0ubGFzdEhlaWdodCA9IGxvb2t1cEhlaWdodDtcbiAgICAgICAgICB0aGlzLmFkZFJlc2l6ZVNlbnNvcihiYXRjaE9iai5pdGVtLCBiYXRjaE9iai5pbmRleCk7XG5cbiAgICAgICAgICBpZiAob2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodEZyb21SZXNpemUob2xkSGVpZ2h0LCBsb29rdXBIZWlnaHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodChsb29rdXBIZWlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldEhlaWdodHNGb3JPdmVyZmxvd0NhbGN1bGF0aW9ucyhpbmQsIGluZGV4LCBsb29rdXBIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGJhdGNoU2l6ZSA9IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISAtIHRoaXMubGFzdEhlaWdodCkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpICsgTnVtYmVyKHRoaXMucG9zdEl0ZW1PdmVyZmxvdyk7XG4gICAgICAgIGlmIChiYXRjaFNpemUgPD0gMCkge1xuICAgICAgICAgIGJhdGNoU2l6ZSA9IE51bWJlcih0aGlzLnBvc3RJdGVtT3ZlcmZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zVG9CYXRjaCA9IFtdO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodGhpcy5wb3N0SXRlbU92ZXJmbG93Q291bnQgPD0gMCkge1xuICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gaSArIDE7XG4gICAgICB9XG4gICAgICB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXggPSBpICsgMTtcbiAgICAgIC8vIGlmIGl0ZW0gaGVpZ2h0IGlzIGxvd2VyIHRoYW4gdGhlIGJvdHRvbSBvZiB0aGUgY29udGFpbmVyIGFyZWEsIHN0b3AgYWRkaW5nIGl0ZW1zXG4gICAgICBpZiAodGhpcy5mb3JjZWRFbmRJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0aGlzLnBvc3RJdGVtT3ZlcmZsb3dDb3VudCA+PSBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaSA9PT0gdGhpcy5mb3JjZWRFbmRJbmRleCAtIDEpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgaXRlbU5hbWU6IHN0cmluZztcbiAgICBsZXQgZW5kSW5kZXhGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBoZWlnaHRDb3VudDogbnVtYmVyID0gLW92ZXJmbG93O1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXg7IGkgPCB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXghOyBpKyspIHtcbiAgICAgIGl0ZW1OYW1lID0gJ2l0ZW0nICsgaTtcbiAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcblxuICAgICAgaWYgKHRoaXMuZm9yY2VkRW5kSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaSA9PT0gdGhpcy5mb3JjZWRFbmRJbmRleCAtIDEpIHtcbiAgICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gaSArIDE7XG4gICAgICAgICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA9IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuXG4gICAgICAgICAgZW5kSW5kZXhGb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChoZWlnaHRDb3VudCA+PSB0aGlzLmNvbnRhaW5lckhlaWdodCEgJiYgIWVuZEluZGV4Rm91bmQpIHtcbiAgICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gaSArIDE7XG4gICAgICAgICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA9IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuXG4gICAgICAgICAgZW5kSW5kZXhGb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZE1pc3NpbmdQb3N0U2Nyb2xsSXRlbXNBbmRVcGRhdGVPdmVyZmxvdyhpbmRleDogbnVtYmVyLCBvdmVyZmxvdzogbnVtYmVyKTogbnVtYmVyIHtcblxuICAgIGxldCBmaXJzdEVsO1xuICAgIGxldCBpdGVtc1RvQmF0Y2g6IGFueVtdID0gW107XG4gICAgbGV0IGJhdGNoU2l6ZTogbnVtYmVyO1xuXG4gICAgaWYgKHRoaXMub3ZlcmZsb3dIZWlnaHRDb3VudCA8PSB0aGlzLmNvbnRhaW5lckhlaWdodCEpIHtcbiAgICAgIGJhdGNoU2l6ZSA9IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuICAgICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA9IC0xO1xuICAgICAgdGhpcy5wcmVPdmVyZmxvd0hlaWdodCA9IDA7XG5cbiAgICAgIGZpcnN0RWwgPSB0aGlzLmdldE5leHRTaWJsaW5nKHRoaXMubGlzdENvbnRlbnQhLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgbGV0IGhlaWdodENvdW50ID0gMDtcbiAgICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLmVuZEluZGV4ISAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHRoaXMuaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuXG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChpIDw9IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ISAmJiB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdICE9PSB0cnVlKSB7XG5cbiAgICAgICAgICB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdID0gdHJ1ZTtcblxuICAgICAgICAgIHRoaXMudGVtcGxhdGVDb250ZXh0ID0gbmV3IFRhYmxlanNGb3JPZkNvbnRleHQ8YW55LCBhbnk+KHRoaXMuaXRlbXMhW2ldLCB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RhYmxlanNGb3JPZiwgaSwgdGhpcy5pdGVtcyEubGVuZ3RoKTtcbiAgICAgICAgICBjb25zdCByZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RlbXBsYXRlISwgdGhpcy50ZW1wbGF0ZUNvbnRleHQsIDEpO1xuICAgICAgICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdmlld0NvbnRhaW5lci5tb3ZlKHJlZiwgMSk7XG4gICAgICAgICAgY29uc3QgcHJldjogYW55ID0gcmVmLnJvb3ROb2Rlc1swXTtcbiAgICAgICAgICBwcmV2LmluZGV4ID0gaTtcbiAgICAgICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgICAgaXRlbXNUb0JhdGNoLnB1c2goeyBpbmRleDogaSwgbmFtZTogdGhpcy5pdGVtTmFtZSwgaXRlbTogcHJldiwgYmVmb3JlOiBmaXJzdEVsIH0pO1xuICAgICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hBZGRJdGVtRXZlbnRzKHRoaXMuaXRlbUFkZGVkLCBwcmV2LCBpLCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgZmlyc3RFbCA9IHByZXY7XG5cbiAgICAgICAgICB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IGk7XG4gICAgICAgICAgdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXggPSBpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1zVG9CYXRjaC5wdXNoKHsgaW5kZXg6IGksIG5hbWU6IHRoaXMuaXRlbU5hbWUsIGl0ZW06IG51bGwsIGJlZm9yZTogbnVsbCB9KTtcblxuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuaGVpZ2h0TG9va3VwW3RoaXMuaXRlbU5hbWVdO1xuICAgICAgICAgIGlmIChoZWlnaHRDb3VudCA+IHRoaXMuY29udGFpbmVySGVpZ2h0ISkge1xuICAgICAgICAgICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCsrO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlSXRlbU92ZXJmbG93Q291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBoZWlnaHRDb3VudCAtIHRoaXMuY29udGFpbmVySGVpZ2h0ITtcbiAgICAgICAgICAgICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5wcmVPdmVyZmxvd0hlaWdodCArPSB0aGlzLmhlaWdodExvb2t1cFt0aGlzLml0ZW1OYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gaTtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ID0gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbXNUb0JhdGNoLmxlbmd0aCA9PT0gYmF0Y2hTaXplIHx8IGkgPT09IDApIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1zVG9CYXRjaC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgYmF0Y2hPYmo6IGFueSA9IGl0ZW1zVG9CYXRjaFtqXTtcbiAgICAgICAgICAgIGlmIChiYXRjaE9iai5pdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmFtZTogc3RyaW5nID0gYmF0Y2hPYmoubmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGluZDogbnVtYmVyID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgICBjb25zdCBsb29rdXBIZWlnaHQ6IG51bWJlciA9IGJhdGNoT2JqLml0ZW0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgY29uc3Qgb2xkSGVpZ2h0OiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFtuYW1lXTtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0TG9va3VwW25hbWVdID0gbG9va3VwSGVpZ2h0O1xuXG4gICAgICAgICAgICBiYXRjaE9iai5pdGVtLmxhc3RIZWlnaHQgPSBsb29rdXBIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmFkZFJlc2l6ZVNlbnNvcihiYXRjaE9iai5pdGVtLCBiYXRjaE9iai5pbmRleCk7XG4gICAgICAgICAgICBpZiAob2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlRXN0aW1hdGVkSGVpZ2h0RnJvbVJlc2l6ZShvbGRIZWlnaHQsIGxvb2t1cEhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodChsb29rdXBIZWlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoZWlnaHRDb3VudCArPSBsb29rdXBIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChoZWlnaHRDb3VudCA+IHRoaXMuY29udGFpbmVySGVpZ2h0ISkge1xuICAgICAgICAgICAgICB0aGlzLnByZUl0ZW1PdmVyZmxvd0NvdW50Kys7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnByZUl0ZW1PdmVyZmxvd0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBoZWlnaHRDb3VudCAtIHRoaXMuY29udGFpbmVySGVpZ2h0ITtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSBiYXRjaE9iai5pbmRleDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGJhdGNoT2JqLmluZGV4O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgKz0gbG9va3VwSGVpZ2h0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgICAgIHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICAgICAgYmF0Y2hTaXplID0gdGhpcy5nZXRFc3RpbWF0ZWRDaGlsZEluc2VydGlvbnModGhpcy5jb250YWluZXJIZWlnaHQhIC0gdGhpcy5sYXN0SGVpZ2h0KSArIE51bWJlcih0aGlzLnByZUl0ZW1PdmVyZmxvdyk7XG4gICAgICAgICAgaWYgKGJhdGNoU2l6ZSA8PSAwKSB7XG4gICAgICAgICAgICBiYXRjaFNpemUgPSBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtc1RvQmF0Y2ggPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByZUl0ZW1PdmVyZmxvd0NvdW50ID49IE51bWJlcih0aGlzLnByZUl0ZW1PdmVyZmxvdykpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdmVyZmxvdztcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb0V4YWN0KGluZGV4OiBudW1iZXIsIG92ZXJmbG93OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLml0ZW1zIHx8IHRoaXMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldExhc3RIZWlnaHQoKTtcbiAgICBpbmRleCA9IHRoaXMubWFpbnRhaW5JbmRleEluQm91bmRzKGluZGV4KTtcbiAgICBvdmVyZmxvdyA9IGluZGV4ID09PSAwICYmIG92ZXJmbG93IDwgMCA/IDAgOiBvdmVyZmxvdztcblxuICAgIHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ID0gaW5kZXggLSBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpIDw9IDAgPyAwIDogaW5kZXggLSBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuXG4gICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA9IC0xO1xuICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50ID0gLTE7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA9IDA7XG5cbiAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gMDtcbiAgICB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXggPSAwO1xuXG4gICAgdGhpcy5yZW1vdmVQcmVTY3JvbGxJdGVtcyh0aGlzLmxhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghLCBNYXRoLm1pbih0aGlzLmFkanVzdGVkU3RhcnRJbmRleCwgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEpKTtcblxuICAgIHRoaXMuYWRkU2Nyb2xsSXRlbXMoaW5kZXgsIG92ZXJmbG93KTtcblxuICAgIHRoaXMucmVtb3ZlUG9zdFNjcm9sbEl0ZW1zKHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkRW5kSW5kZXghIC0gMSwgTWF0aC5tYXgodGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ISwgdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4KSk7XG5cbiAgICBpZiAoIXRoaXMuZm9yY2VkRW5kSW5kZXgpIHtcbiAgICAgIG92ZXJmbG93ID0gdGhpcy5hZGRNaXNzaW5nUG9zdFNjcm9sbEl0ZW1zQW5kVXBkYXRlT3ZlcmZsb3coaW5kZXgsIG92ZXJmbG93KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldExhc3RSYW5nZVRvQ3VycmVudFJhbmdlKCk7XG5cbiAgICB0aGlzLnNldFNjcm9sbFNwYWNlcnMoKTtcblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgKyBvdmVyZmxvdyArIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodDtcbiAgICB0aGlzLmxpc3RDb250ZW50IS5zY3JvbGxUb3AgPSB0aGlzLmxhc3RTY3JvbGxUb3A7XG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5sYXN0U2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPSBvdmVyZmxvdztcbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoUmFuZ2VVcGRhdGVFdmVudHModGhpcy5yYW5nZVVwZGF0ZWQsIHRoaXMucmFuZ2UsIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblxuICAgIHRoaXMudmlld3BvcnRIYXNTY3JvbGxlZCA9IHRydWU7XG5cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmFuZ2VDaGFuZ2Uoc2Nyb2xsQ2hhbmdlOiBudW1iZXIpIHtcbiAgICBsZXQgaGVpZ2h0Q291bnQgPSAwO1xuICAgIGxldCByYW5nZVN0YXJ0Q291bnQgPSAwO1xuICAgIGxldCBvdmVyZmxvdyA9IDA7XG4gICAgY29uc3QgbmV3UmFuZ2U6IFJhbmdlID0geyBzdGFydEluZGV4OiBudWxsLCBlbmRJbmRleDogbnVsbCwgZXh0ZW5kZWRTdGFydEluZGV4OiBudWxsLCBleHRlbmRlZEVuZEluZGV4OiBudWxsIH07XG4gICAgbGV0IGl0ZW1OYW1lO1xuXG4gICAgaWYgKHNjcm9sbENoYW5nZSA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXg7IGkhIDw9IHRoaXMucmFuZ2UuZW5kSW5kZXghICsgTnVtYmVyKHRoaXMuaXRlbUxvYWRMaW1pdCk7IGkhKyspIHtcbiAgICAgICAgb3ZlcmZsb3cgPSBzY3JvbGxDaGFuZ2UgLSBoZWlnaHRDb3VudDtcbiAgICAgICAgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdKSB7XG4gICAgICAgICAgaGVpZ2h0Q291bnQgKz0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuYXZnSXRlbUhlaWdodCE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVpZ2h0Q291bnQgPj0gc2Nyb2xsQ2hhbmdlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByYW5nZVN0YXJ0Q291bnQrKztcbiAgICAgIH1cblxuICAgICAgbmV3UmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgKyByYW5nZVN0YXJ0Q291bnQ7XG4gICAgICBuZXdSYW5nZS5lbmRJbmRleCA9IHJhbmdlU3RhcnRDb3VudCA8IHRoaXMucmFuZ2UuZW5kSW5kZXghIC0gdGhpcy5yYW5nZS5zdGFydEluZGV4ISA/IHRoaXMucmFuZ2UuZW5kSW5kZXggOiBuZXdSYW5nZS5zdGFydEluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsQ2hhbmdlIDwgMCkge1xuICAgICAgcmFuZ2VTdGFydENvdW50ID0gLTE7XG4gICAgICBvdmVyZmxvdyA9IHNjcm9sbENoYW5nZTtcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdKSB7XG4gICAgICAgICAgb3ZlcmZsb3cgKz0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdmVyZmxvdyArPSB0aGlzLmF2Z0l0ZW1IZWlnaHQhO1xuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuYXZnSXRlbUhlaWdodCE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3ZlcmZsb3cgPj0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmFuZ2VTdGFydENvdW50LS07XG4gICAgICB9XG5cbiAgICAgIG5ld1JhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghICsgcmFuZ2VTdGFydENvdW50ID49IDAgPyB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghICsgcmFuZ2VTdGFydENvdW50IDogMDtcbiAgICAgIG5ld1JhbmdlLmVuZEluZGV4ID0gcmFuZ2VTdGFydENvdW50IDwgdGhpcy5yYW5nZS5lbmRJbmRleCEgLSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghID8gdGhpcy5yYW5nZS5lbmRJbmRleCA6IG5ld1JhbmdlLnN0YXJ0SW5kZXggKyAxO1xuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtID0gb3ZlcmZsb3c7XG5cbiAgICByZXR1cm4gbmV3UmFuZ2U7XG4gIH1cblxuICBwdWJsaWMgcmVmcmVzaFZpZXdwb3J0KHJlY2FsY3VsYXRlUm93czogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHJlY2FsY3VsYXRlUm93cykge1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ITsgaSA8IHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCE7IGkrKykge1xuICAgICAgICB0aGlzLnJlY2FsY3VsYXRlUm93SGVpZ2h0KGkpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4ISwgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0pO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVNjcm9sbEZyb21SYW5nZShuZXdSYW5nZTogUmFuZ2UpOiB2b2lkIHtcbiAgICBpZiAobmV3UmFuZ2Uuc3RhcnRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmFuZ2Uuc3RhcnRJbmRleCAhPT0gbmV3UmFuZ2Uuc3RhcnRJbmRleCB8fCB0aGlzLmxhc3RWaXNpYmxlSXRlbU92ZXJmbG93IDwgMCkge1xuICAgICAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSBuZXdSYW5nZS5zdGFydEluZGV4O1xuICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gbmV3UmFuZ2UuZW5kSW5kZXg7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVmlld3BvcnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRoaXMuY3VycmVudFNjcm9sbFRvcDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5jdXJyZW50U2Nyb2xsVG9wO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0U2Nyb2xsKG9wdGlvbnM6IElTY3JvbGxPcHRpb25zKSB7XG4gICAgdGhpcy5pdGVtcyA9IG9wdGlvbnMuaXRlbXM7XG4gICAgdGhpcy5fY2xvbmVNZXRob2QgPSBvcHRpb25zLmdlbmVyYXRlQ2xvbmVNZXRob2Q7XG4gICAgY29uc3QgaXRlbXNBcmVFbXB0eTogYm9vbGVhbiA9IHRoaXMuaXRlbXMubGVuZ3RoID09PSAwO1xuICAgIGxldCBpbmRleCA9IG9wdGlvbnMuaW5pdGlhbEluZGV4ID8gb3B0aW9ucy5pbml0aWFsSW5kZXggOiAwO1xuXG4gICAgaWYgKHRoaXMudmlydHVhbE5leHVzICYmIHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl90ZW1wbGF0ZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEKTtcbiAgICAgIHRoaXMudGltZW91dElEID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2xvbmVGcm9tVGVtcGxhdGVSZWYgPSB0cnVlO1xuICAgICAgICB0aGlzLnZlcmlmeVZpZXdwb3J0SXNSZWFkeSgpO1xuICAgICAgICB0aGlzLmluaXRGaXJzdFNjcm9sbChpbmRleCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCEpO1xuICAgICAgdGhpcy52ZXJpZnlWaWV3cG9ydElzUmVhZHkoKTtcbiAgICAgIHRoaXMuaW5pdEZpcnN0U2Nyb2xsKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZlcmlmeVZpZXdwb3J0SXNSZWFkeSgpIHtcbiAgICBpZiAodGhpcy50ZW1wbGF0ZUlEID09PSAnJyAmJiAhdGhpcy50ZW1wbGF0ZUlzU2V0KCkpIHtcbiAgICAgIHRocm93IEVycm9yKCdTY3JvbGwgdmlld3BvcnQgdGVtcGxhdGUgSUQgaXMgbm90IHNldC4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLml0ZW1zQXJlU2V0KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2Nyb2xsIHZpZXdwb3J0IHJlcXVpcmVzIGFuIGFycmF5IG9mIGl0ZW1zLiAgUGxlYXNlIHN1cHBseSBhbiBpdGVtcyBhcnJheS4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNsb25lTWV0aG9kSXNTZXQoKSAmJiAhdGhpcy50ZW1wbGF0ZUlzU2V0KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2Nyb2xsIHZpZXdwb3J0IHJlcXVpcmVzIGEgY2xvbmluZyBtZXRob2Qgb3IgYSB0ZW1wbGF0ZS4gIFBsZWFzZSBzdXBwbHkgYSBtZXRob2QgYXMgZm9sbG93czpcXG5cXG4gKHRlbXBsYXRlOiBIVE1MRWxlbWVudCwgaXRlbXM6IGFueVtdLCBpbmRleDogbnVtYmVyKSA9PiBOb2RlXFxuXFxuIG9yIHN1cHBseSBhIHRhYmxlanNWaXJ0dWFsRm9yJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0Rmlyc3RTY3JvbGwoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1zQXJlRW1wdHk6IGJvb2xlYW4gPSB0aGlzLml0ZW1zIS5sZW5ndGggPT09IDA7XG4gICAgdGhpcy5yZWZyZXNoQ29udGFpbmVySGVpZ2h0KCk7XG4gICAgaWYgKGl0ZW1zQXJlRW1wdHkpIHtcbiAgICAgIHRoaXMuaXRlbXMhLnB1c2godGhpcy5wbGFjZWhvbGRlck9iamVjdCk7XG4gICAgICB0aGlzLnNjcm9sbFRvRXhhY3QoaW5kZXgsIDApO1xuICAgICAgY29uc3Qgbm9kZTogSFRNTEVsZW1lbnQgPSAodGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUhLl92aWV3Q29udGFpbmVyLmdldCgxKSBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdO1xuICAgICAgdGhpcy5yZW5kZXJlciEuc2V0U3R5bGUobm9kZSwgJ2hlaWdodCcsICcwcHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIhLnNldFN0eWxlKG5vZGUsICdtaW5IZWlnaHQnLCAnMHB4Jyk7XG4gICAgICB0aGlzLnJlbmRlcmVyIS5zZXRTdHlsZShub2RlLCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdChpbmRleCwgMCk7XG4gICAgfVxuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hWaWV3cG9ydEluaXRpYWxpemVkRXZlbnRzKHRoaXMudmlld3BvcnRJbml0aWFsaXplZCwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpdGVtc0FyZVNldCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLml0ZW1zO1xuICB9XG4gIHByaXZhdGUgY2xvbmVNZXRob2RJc1NldCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9jbG9uZU1ldGhvZDtcbiAgfVxuICBwcml2YXRlIHRlbXBsYXRlSXNTZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlIS5fdGVtcGxhdGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZSEuX3RlbXBsYXRlICE9PSBudWxsO1xuICB9XG5cbn1cbiJdfQ==