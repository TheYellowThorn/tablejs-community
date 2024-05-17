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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXZpZXdwb3J0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9kaXJlY3RpdmVzL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFxQixZQUFZLEVBQ25DLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBK0QsTUFBTSxlQUFlLENBQUM7QUFDL0osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBTzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBRzNGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzdHLE9BQU8sRUFBZ0IsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFNMUMsTUFBTSxPQUFPLHVCQUF1QjtJQU9sQyxJQUFJLFlBQVk7UUFDWixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELElBQWEsWUFBWSxDQUFDLEtBQXNCO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFHRCxJQUFJLGNBQWM7UUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELElBQWEsY0FBYyxDQUFDLEtBQXNCO1FBQzlDLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFHRCxJQUFJLGVBQWU7UUFDZixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsSUFB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LG1CQUFtQjtzQkFBNUIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZiwgRW1iZWRkZWRWaWV3UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld1JlZiwgT25EZXN0cm95LCBSZW5kZXJlcjIsIFJlbmRlcmVyRmFjdG9yeTJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24vZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy9zY3JvbGxpbmcvcmFuZ2UnO1xuaW1wb3J0IHsgSVNjcm9sbE9wdGlvbnMgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9pbnRlcmZhY2VzL3Njcm9sbGluZy9pLXNjcm9sbC1vcHRpb25zJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9zY3JvbGwtZGlzcGF0Y2hlci9zY3JvbGwtZGlzcGF0Y2hlci5zZXJ2aWNlJztcbmltcG9ydCB7IEdyaWREaXJlY3RpdmUgfSBmcm9tICcuLy4uLy4uL2RpcmVjdGl2ZXMvZ3JpZC9ncmlkLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBUYWJsZWpzRm9yT2ZDb250ZXh0IH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL3ZpcnR1YWwtZm9yL3ZpcnR1YWwtZm9yLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJVmlydHVhbE5leHVzIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9pLXZpcnR1YWwtbmV4dXMnO1xuaW1wb3J0IHsgT3BlcmF0aW5nU3lzdGVtU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvb3BlcmF0aW5nLXN5c3RlbS9vcGVyYXRpbmctc3lzdGVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc2Nyb2xsLXByZXYtc3BhY2VyL3Njcm9sbC1wcmV2LXNwYWNlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCB0YWtlIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t0YWJsZWpzU2Nyb2xsVmlld3BvcnRdLCBbdGFibGVqc3Njcm9sbHZpZXdwb3J0XSwgW3RhYmxlanMtc2Nyb2xsLXZpZXdwb3J0XScsXG4gIGhvc3Q6IHsgc3R5bGU6ICdjb250YWluOiBjb250ZW50Oyd9XG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBPbkluaXQge1xuXG4gIEBDb250ZW50Q2hpbGQoJ3RlbXBsYXRlUmVmJywgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KCkgdGVtcGxhdGVJRDogc3RyaW5nIHwgbnVsbCA9ICcnO1xuICBASW5wdXQoKSBnZW5lcmF0ZUNsb25lTWV0aG9kOiAoKHRlbXBsYXRlOiBIVE1MRWxlbWVudCwgaXRlbXM6IGFueVtdLCBpbmRleDogbnVtYmVyKSA9PiBOb2RlKSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9hcnJvd1VwU3BlZWQ6IHN0cmluZyB8IG51bWJlciA9IDE7XG4gIGdldCBhcnJvd1VwU3BlZWQoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy5fYXJyb3dVcFNwZWVkKTtcbiAgfVxuICBASW5wdXQoKSBzZXQgYXJyb3dVcFNwZWVkKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIHRoaXMuX2Fycm93VXBTcGVlZCA9IE51bWJlcih2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9hcnJvd0Rvd25TcGVlZDogc3RyaW5nIHwgbnVtYmVyID0gMTtcbiAgZ2V0IGFycm93RG93blNwZWVkKCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuX2Fycm93RG93blNwZWVkKTtcbiAgfVxuICBASW5wdXQoKSBzZXQgYXJyb3dEb3duU3BlZWQodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgdGhpcy5fYXJyb3dEb3duU3BlZWQgPSBOdW1iZXIodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHJlSXRlbU92ZXJmbG93OiBzdHJpbmcgfCBudW1iZXIgPSAxO1xuICBnZXQgcHJlSXRlbU92ZXJmbG93KCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuX3ByZUl0ZW1PdmVyZmxvdyk7XG4gIH1cbiAgQElucHV0KCkgc2V0IHByZUl0ZW1PdmVyZmxvdyh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICB0aGlzLl9wcmVJdGVtT3ZlcmZsb3cgPSBOdW1iZXIodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcG9zdEl0ZW1PdmVyZmxvdzogc3RyaW5nIHwgbnVtYmVyID0gMTtcbiAgZ2V0IHBvc3RJdGVtT3ZlcmZsb3coKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy5fcG9zdEl0ZW1PdmVyZmxvdyk7XG4gIH1cbiAgQElucHV0KCkgc2V0IHBvc3RJdGVtT3ZlcmZsb3codmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgdGhpcy5fcG9zdEl0ZW1PdmVyZmxvdyA9IE51bWJlcih2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9pdGVtTG9hZExpbWl0OiBzdHJpbmcgfCBudW1iZXIgPSBJbmZpbml0eTtcbiAgZ2V0IGl0ZW1Mb2FkTGltaXQoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy5faXRlbUxvYWRMaW1pdCk7XG4gIH1cbiAgQElucHV0KCkgc2V0IGl0ZW1Mb2FkTGltaXQodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgdGhpcy5faXRlbUxvYWRMaW1pdCA9IE51bWJlcih2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdGltZW91dElEOiBhbnk7XG5cbiAgaXRlbXM6IGFueVtdIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gQ3VzdG9tIEVsZW1lbnRzIElucHV0c1xuICBASW5wdXQoKSB0ZW1wbGF0ZWlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcHJlaXRlbW92ZXJmbG93OiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBwb3N0aXRlbW92ZXJmbG93OiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBhcnJvd3Vwc3BlZWQ6IG51bWJlciA9IDE7XG4gIEBJbnB1dCgpIGFycm93ZG93bnNwZWVkOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBpdGVtbG9hZGxpbWl0OiBudW1iZXIgPSBJbmZpbml0eTtcbiAgQElucHV0KCkgZmlsbFZpZXdwb3J0U2Nyb2xsaW5nOiBhbnk7XG5cbiAgQE91dHB1dCgpIGl0ZW1BZGRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGl0ZW1SZW1vdmVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgaXRlbVVwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSByYW5nZVVwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSB2aWV3cG9ydFNjcm9sbGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgdmlld3BvcnRSZWFkeTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHZpZXdwb3J0SW5pdGlhbGl6ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJpdmF0ZSBjb250YWluZXJIZWlnaHQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhlaWdodExvb2t1cDogYW55ID0ge307XG4gIHByaXZhdGUgaXRlbVZpc2liaWxpdHlMb29rdXA6IGFueSA9IHt9O1xuICBwdWJsaWMgbGlzdEVsbTogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIGxpc3RDb250ZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgcHJldlNwYWNlcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHBvc3RTcGFjZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBncmlkRGlyZWN0aXZlOiBHcmlkRGlyZWN0aXZlIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyB2aXJ0dWFsRm9yQ2hhbmdlc1N1YnNjcmlwdGlvbiQ6IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIHBhdXNlVmlld3BvcnRSZW5kZXJVcGRhdGVzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIHJhbmdlOiBSYW5nZSA9IHsgc3RhcnRJbmRleDogMCwgZW5kSW5kZXg6IDEsIGV4dGVuZGVkU3RhcnRJbmRleDogMCwgZXh0ZW5kZWRFbmRJbmRleDogMSB9O1xuICBwdWJsaWMgbGFzdFJhbmdlOiBSYW5nZSA9IHsgc3RhcnRJbmRleDogdGhpcy5yYW5nZS5zdGFydEluZGV4LCBlbmRJbmRleDogdGhpcy5yYW5nZS5lbmRJbmRleCwgZXh0ZW5kZWRTdGFydEluZGV4OiB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCwgZXh0ZW5kZWRFbmRJbmRleDogdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4IH07XG4gIHB1YmxpYyBsYXN0U2Nyb2xsVG9wOiBudW1iZXIgPSAwO1xuICBwdWJsaWMgY3VycmVudFNjcm9sbFRvcDogbnVtYmVyID0gMDtcbiAgcHVibGljIGN1cnJlbnRTY3JvbGxDaGFuZ2U6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0ZW1wbGF0ZTogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBlc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBlc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHRvdGFsSXRlbXNDb3VudGVkOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHRvdGFsSGVpZ2h0Q291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgaXRlbU5hbWU6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIGF2Z0l0ZW1IZWlnaHQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBvdmVyZmxvd0hlaWdodENvdW50OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGxhc3RWaXNpYmxlSXRlbUhlaWdodDogbnVtYmVyID0gSW5maW5pdHk7XG4gIHByaXZhdGUgYWRqdXN0ZWRTdGFydEluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmb3JjZWRFbmRJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIHBsYWNlaG9sZGVyT2JqZWN0OiBhbnkgPSB7fTtcblxuICBwcml2YXRlIHBvc3RJdGVtT3ZlcmZsb3dDb3VudDogbnVtYmVyID0gLTE7XG4gIHByaXZhdGUgcHJlSXRlbU92ZXJmbG93Q291bnQ6IG51bWJlciA9IC0xO1xuICBwcml2YXRlIGxhc3RWaXNpYmxlSXRlbU92ZXJmbG93OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHByZU92ZXJmbG93SGVpZ2h0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIG1vdXNlSXNPdmVyVmlld3BvcnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBsYXN0SGVpZ2h0OiBudW1iZXIgPSAwO1xuXG4gIHByaXZhdGUgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZU92ZXI6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlTW91c2VPdXQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlS2V5RG93bjogKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZUxpc3RDb250ZW50U2Nyb2xsOiAodGhpczogSFRNTEVsZW1lbnQsIGU6IEV2ZW50KSA9PiB2b2lkIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGNsb25lRnJvbVRlbXBsYXRlUmVmOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgdmlld3BvcnRIYXNTY3JvbGxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHRlbXBsYXRlQ29udGV4dDogVGFibGVqc0Zvck9mQ29udGV4dDxhbnksIGFueT4gfCBudWxsID0gbnVsbDtcblxuICBwdWJsaWMgdmlydHVhbE5leHVzOiBJVmlydHVhbE5leHVzIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfY2xvbmVNZXRob2Q6ICgodGVtcGxhdGU6IEhUTUxFbGVtZW50LCBpdGVtczogYW55W10sIGluZGV4OiBudW1iZXIpID0+IE5vZGUpIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIGRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2U6IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzY3JvbGxEaXNwYXRjaGVyU2VydmljZTogU2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvcGVyYXRpbmdTeXN0ZW06IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmIHwgbnVsbCxcbiAgICBwcml2YXRlIHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5MlxuICApIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5yZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVNjcm9sbChlOiBFdmVudCkge1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5saXN0Q29udGVudCEuc2Nyb2xsVG9wO1xuICAgIHRoaXMuY3VycmVudFNjcm9sbENoYW5nZSA9IHRoaXMuY3VycmVudFNjcm9sbFRvcCAtIHRoaXMubGFzdFNjcm9sbFRvcDtcbiAgICB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSArPSB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2U7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyAtPSB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2U7XG5cbiAgICBjb25zdCBuZXdSYW5nZSA9IHRoaXMuZ2V0UmFuZ2VDaGFuZ2UodGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0pO1xuICAgIHRoaXMudXBkYXRlU2Nyb2xsRnJvbVJhbmdlKG5ld1JhbmdlKTtcblxuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hWaWV3cG9ydFNjcm9sbGVkRXZlbnRzKHRoaXMudmlld3BvcnRTY3JvbGxlZCwgdGhpcy5sYXN0U2Nyb2xsVG9wLCB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyVmlld3BvcnRUb0VsZW1lbnQoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVmlld3BvcnQgPSB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hNdXRhdGlvbk9ic2VydmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IHRoczogYW55ID0gdGhpcztcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgICB0aHMudXBkYXRlTXV0YXRpb25zKG11dGF0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMubGlzdENvbnRlbnQhLCB7XG4gICAgICAvLyBjb25maWd1cmUgaXQgdG8gbGlzdGVuIHRvIGF0dHJpYnV0ZSBjaGFuZ2VzXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNdXRhdGlvbnMobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKTogdm9pZCB7XG4gICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICBjb25zdCBhZGRlZE5vZGVzID0gQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzKTtcbiAgICAgIGFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyTm9kZUF0dHJpYnV0ZXMobm9kZSk7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGROb2Rlcyhub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2hpbGROb2Rlcyhub2RlOiBOb2RlKSB7XG4gICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgIHRoaXMuZGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZS5yZWdpc3Rlck5vZGVBdHRyaWJ1dGVzKGNoaWxkTm9kZSk7XG4gICAgICBpZiAoY2hpbGROb2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZE5vZGVzKGNoaWxkTm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJDdXN0b21FbGVtZW50c0lucHV0cyh2aWV3cG9ydDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnRlbXBsYXRlSUQgPSB2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ3RlbXBsYXRlSUQnKTtcbiAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ3ByZUl0ZW1PdmVyZmxvdycpKTtcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSBOdW1iZXIodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdwb3N0SXRlbU92ZXJmbG93JykpO1xuICAgIHRoaXMuaXRlbUxvYWRMaW1pdCA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2l0ZW1Mb2FkTGltaXQnKSk7XG4gICAgdGhpcy5hcnJvd1VwU3BlZWQgPSBOdW1iZXIodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdhcnJvd1VwU3BlZWQnKSk7XG4gICAgdGhpcy5hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2Fycm93RG93blNwZWVkJykpO1xuICAgIHRoaXMuZmlsbFZpZXdwb3J0U2Nyb2xsaW5nID0gdmlld3BvcnQuZ2V0QXR0cmlidXRlKCdmaWxsVmlld3BvcnRTY3JvbGxpbmcnKTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEN1c3RvbUVsZW1lbnRzVmFyaWFibGVzKCkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlaWQpIHtcbiAgICAgIHRoaXMudGVtcGxhdGVJRCA9IHRoaXMudGVtcGxhdGVpZDtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJlaXRlbW92ZXJmbG93KSB7XG4gICAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih0aGlzLnByZWl0ZW1vdmVyZmxvdyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RpdGVtb3ZlcmZsb3cpIHtcbiAgICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvdyA9IE51bWJlcih0aGlzLnBvc3RpdGVtb3ZlcmZsb3cpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hcnJvd2Rvd25zcGVlZCkge1xuICAgICAgdGhpcy5hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih0aGlzLmFycm93ZG93bnNwZWVkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXJyb3d1cHNwZWVkKSB7XG4gICAgICB0aGlzLmFycm93VXBTcGVlZCA9IE51bWJlcih0aGlzLmFycm93dXBzcGVlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLml0ZW1sb2FkbGltaXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaXRlbUxvYWRMaW1pdCA9IE51bWJlcih0aGlzLml0ZW1sb2FkbGltaXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVEJvZGllcygpIHtcbiAgICB0aGlzLmxpc3RFbG0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgYm9keTogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5saXN0RWxtIS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXTtcbiAgICBpZiAoYm9keSkge1xuICAgICAgYm9keSA9IGJvZHkuZ2V0QXR0cmlidXRlKCd0YWJsZWpzVmlld3BvcnQnKSAhPT0gbnVsbCA/IGJvZHkgOiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMubGlzdENvbnRlbnQgPSBib2R5ID8gYm9keSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XG4gICAgdGhpcy5saXN0Q29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmxlanNMaXN0Q29udGVudCcsICcnKTtcbiAgICB0aGlzLmxpc3RDb250ZW50LnNldEF0dHJpYnV0ZSgndGFibGVqc1ZpZXdwb3J0JywgJycpO1xuICAgIHRoaXMubGlzdENvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5saXN0Q29udGVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy5saXN0Q29udGVudC5zdHlsZS5oZWlnaHQgPSAnMzUwcHgnO1xuICAgIHRoaXMubGlzdENvbnRlbnQuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICAgIHRoaXMubGlzdEVsbSEuYXBwZW5kQ2hpbGQodGhpcy5saXN0Q29udGVudCk7XG5cbiAgICBpZiAodGhpcy5maWxsVmlld3BvcnRTY3JvbGxpbmcgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGxWaWV3cG9ydFNjcm9sbGluZyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY292ZXJCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcbiAgICAgIGNvdmVyQm9keS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIGNvdmVyQm9keS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgY292ZXJCb2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xuICAgICAgY292ZXJCb2R5LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUudmlzaWJpbGl0eSA9ICdmYWxzZSc7XG4gICAgICB0aGlzLmxpc3RFbG0hLmFwcGVuZENoaWxkKGNvdmVyQm9keSk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyVmlld3BvcnRPbkdyaWREaXJlY3RpdmUodGhpcy5saXN0Q29udGVudCk7XG5cbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5jcmVhdGVDb21wb25lbnQ8U2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudD4oU2Nyb2xsUHJldlNwYWNlckNvbXBvbmVudCk7XG4gICAgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuZGV0YWNoKDApO1xuICAgIGNvbnN0IHJlZjogRW1iZWRkZWRWaWV3UmVmPGFueT4gPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcoY29tcG9uZW50UmVmLmluc3RhbmNlLnRlbXBsYXRlLCB1bmRlZmluZWQsIDApO1xuICAgIHRoaXMucHJldlNwYWNlciA9IHJlZi5yb290Tm9kZXNbMF07XG5cbiAgICB0aGlzLnBvc3RTcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIHRoaXMucG9zdFNwYWNlci5zZXRBdHRyaWJ1dGUoJ3RhYmxlanNQb3N0U3BhY2VyJywgJycpO1xuICAgIHRoaXMucG9zdFNwYWNlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLnBvc3RTcGFjZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIHRoaXMubGlzdENvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5wb3N0U3BhY2VyKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkU2Nyb2xsSGFuZGxlcigpOiB2b2lkIHtcbiAgICB0aGlzLmxpc3RDb250ZW50IS5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZUxpc3RDb250ZW50U2Nyb2xsID0gKGU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVTY3JvbGwoZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVyZW5kZXJSb3dBdChpbmRleDogbnVtYmVyLCB1cGRhdGVTY3JvbGxQb3NpdGlvbjogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnZpZXdwb3J0SGFzU2Nyb2xsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kID0gaW5kZXggLSB0aGlzLmFkanVzdGVkU3RhcnRJbmRleCE7XG4gICAgY29uc3QgaXRlbU5hbWU6IHN0cmluZyA9ICdpdGVtJyArIGluZGV4O1xuXG4gICAgaWYgKGluZCA+IHRoaXMuaXRlbXMhLmxlbmd0aCAtIDEgfHwgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFt0aGlzLml0ZW1OYW1lXSAhPT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4TWFwOiBhbnkgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbmRleE1hcFsodGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuZ2V0KGkpIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0uaW5kZXhdID0gaTtcbiAgICB9O1xuICAgIGNvbnN0IGRldGFjaGVkUmVmOiBWaWV3UmVmIHwgbnVsbCA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmRldGFjaChpbmRleE1hcFtpbmRleF0pO1xuICAgIGNvbnN0IGNoaWxkOiBIVE1MRWxlbWVudCA9IChkZXRhY2hlZFJlZiBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdO1xuICAgIGRldGFjaGVkUmVmIS5kZXN0cm95KCk7XG4gICAgXG4gICAgdGhpcy50ZW1wbGF0ZUNvbnRleHQgPSBuZXcgVGFibGVqc0Zvck9mQ29udGV4dDxhbnksIGFueT4odGhpcy5pdGVtcyFbaW5kZXhdLCB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGFibGVqc0Zvck9mLCBpbmRleCwgdGhpcy5pdGVtcyEubGVuZ3RoKTtcbiAgICBjb25zdCByZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl90ZW1wbGF0ZSwgdGhpcy50ZW1wbGF0ZUNvbnRleHQsIGluZGV4TWFwW2luZGV4XSk7XG4gICAgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIubW92ZShyZWYsIGluZGV4TWFwW2luZGV4XSk7XG4gICAgbGV0IGNsb25lOiBhbnkgPSByZWYucm9vdE5vZGVzWzBdO1xuICAgIGNsb25lLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5jZHIhLmRldGVjdENoYW5nZXMoKTtcblxuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hSZW1vdmVJdGVtRXZlbnRzKHRoaXMuaXRlbVJlbW92ZWQsIGNoaWxkLCBpbmRleCwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgY29uc3QgbG9va3VwSGVpZ2h0OiBudW1iZXIgPSBjbG9uZS5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3Qgb2xkSGVpZ2h0OiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG4gICAgdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdID0gbG9va3VwSGVpZ2h0O1xuXG4gICAgY2xvbmUubGFzdEhlaWdodCA9IGxvb2t1cEhlaWdodDtcblxuICAgIHRoaXMuYWRkUmVzaXplU2Vuc29yKGNsb25lLCBpbmRleCk7XG5cbiAgICBpZiAob2xkSGVpZ2h0KSB7XG4gICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodEZyb21SZXNpemUob2xkSGVpZ2h0LCBsb29rdXBIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodChsb29rdXBIZWlnaHQpO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGVTY3JvbGxQb3NpdGlvbikge1xuICAgICAgdGhpcy5yZWZyZXNoVmlld3BvcnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoVXBkYXRlSXRlbUV2ZW50cyh0aGlzLml0ZW1VcGRhdGVkLCBjbG9uZSwgaW5kZXgsIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoQWRkSXRlbUV2ZW50cyh0aGlzLml0ZW1BZGRlZCwgY2xvbmUsIGluZGV4LCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIHZpZXdwb3J0UmVuZGVyZWQoKSB7XG4gICAgdGhpcy52aXJ0dWFsTmV4dXMgPSB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UuZ2V0VmlydHVhbE5leHVzRnJvbVZpZXdwb3J0KHRoaXMpO1xuXG4gICAgaWYgKHRoaXMudmlydHVhbE5leHVzICYmIHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUpIHtcbiAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLnZpcnR1YWxOZXh1cy52aXJ0dWFsRm9yRGlyZWN0aXZlLl90YWJsZWpzRm9yT2Y7XG5cbiAgICAgIHRoaXMudmlydHVhbEZvckNoYW5nZXNTdWJzY3JpcHRpb24kID0gdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZS5jaGFuZ2VzLnN1YnNjcmliZShpdGVtID0+IHtcbiAgICAgICAgY29uc3QgaXNUaGVTYW1lQXJyYXkgPSB0aGlzLml0ZW1zID09PSBpdGVtLnRhYmxlanNGb3JPZjtcbiAgICAgICAgdGhpcy5pdGVtcyA9IGl0ZW0udGFibGVqc0Zvck9mO1xuXG4gICAgICAgIGNvbnN0IHNjcm9sbFRvT3B0aW9ucyA9IHsgaW5kZXg6IDAsIHNjcm9sbEFmdGVySW5kZXhlZEl0ZW06IDAgfTtcbiAgICAgICAgaWYgKGlzVGhlU2FtZUFycmF5KSB7XG4gICAgICAgICAgc2Nyb2xsVG9PcHRpb25zLmluZGV4ID0gdGhpcy5yYW5nZS5zdGFydEluZGV4IGFzIG51bWJlcjtcbiAgICAgICAgICBzY3JvbGxUb09wdGlvbnMuc2Nyb2xsQWZ0ZXJJbmRleGVkSXRlbSA9IHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtO1xuXG4gICAgICAgICAgLy8gYXJyYXkgaGFzIGNoYW5nZWQuLi5yZXJlbmRlciBjdXJyZW50IGVsZW1lbnRzXG4gICAgICAgICAgY29uc3QgbGlzdENoaWxkcmVuID0gQXJyYXkuZnJvbSh0aGlzLmxpc3RDb250ZW50IS5jaGlsZE5vZGVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1zKGl0ZW0udGFibGVqc0Zvck9mLCBzY3JvbGxUb09wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLmNvbnZlcnRDdXN0b21FbGVtZW50c1ZhcmlhYmxlcygpO1xuICAgIHRoaXMuY3JlYXRlVEJvZGllcygpO1xuICAgIHRoaXMuYWRkU2Nyb2xsSGFuZGxlcigpO1xuICAgIC8vIHRoaXMuYXR0YWNoTXV0YXRpb25PYnNlcnZlcigpO1xuXG4gICAgaWYgKHRoaXMuaXRlbXMgJiYgKHRoaXMuZ2VuZXJhdGVDbG9uZU1ldGhvZCB8fCB0aGlzLnZpcnR1YWxOZXh1cy52aXJ0dWFsRm9yRGlyZWN0aXZlLl90ZW1wbGF0ZSkpIHtcbiAgICAgIHRoaXMuaW5pdFNjcm9sbCh7XG4gICAgICAgIGl0ZW1zOiB0aGlzLml0ZW1zLFxuICAgICAgICBnZW5lcmF0ZUNsb25lTWV0aG9kOiB0aGlzLl9jbG9uZU1ldGhvZCFcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoVmlld3BvcnRSZWFkeUV2ZW50cyh0aGlzLnZpZXdwb3J0UmVhZHksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb0JvdHRvbSgpOiB2b2lkIHtcbiAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zIS5sZW5ndGg7XG4gICAgdGhpcy5zY3JvbGxUb0V4YWN0KHRoaXMucmFuZ2Uuc3RhcnRJbmRleCwgMCk7XG4gIH1cblxuICBwdWJsaWMgc2Nyb2xsVG9Ub3AoKTogdm9pZCB7XG4gICAgdGhpcy5zY3JvbGxUb0V4YWN0KDAsIDApO1xuICB9XG5cbiAgcHVibGljIHBhZ2VVcCgpOiB2b2lkIHtcbiAgICBsZXQgaGVpZ2h0Q291bnQ6IG51bWJlciA9IHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtO1xuICAgIGlmICh0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPT09IDApIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCgwLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbG9va3VwSGVpZ2h0OiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFsnaXRlbScgKyBpXSA/IHRoaXMuaGVpZ2h0TG9va3VwWydpdGVtJyArIGldIDogdGhpcy5hdmdJdGVtSGVpZ2h0O1xuICAgICAgaGVpZ2h0Q291bnQgKz0gbG9va3VwSGVpZ2h0O1xuICAgICAgaWYgKGhlaWdodENvdW50ID49IHRoaXMuY29udGFpbmVySGVpZ2h0ISB8fCBpID09PSAwKSB7XG4gICAgICAgIGNvbnN0IG92ZXJmbG93RGlmZmVyZW5jZTogbnVtYmVyID0gaGVpZ2h0Q291bnQgPj0gdGhpcy5jb250YWluZXJIZWlnaHQhID8gaGVpZ2h0Q291bnQgLSB0aGlzLmNvbnRhaW5lckhlaWdodCEgOiAwO1xuICAgICAgICB0aGlzLnNjcm9sbFRvRXhhY3QoaSwgb3ZlcmZsb3dEaWZmZXJlbmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhZ2VEb3duKCk6IHZvaWQge1xuICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2UuZW5kSW5kZXghIC0gMTtcbiAgICBjb25zdCBvdmVyZmxvd0RpZmZlcmVuY2U6IG51bWJlciA9IHRoaXMuaGVpZ2h0TG9va3VwWydpdGVtJyArICh0aGlzLnJhbmdlLmVuZEluZGV4ISAtIDEpLnRvU3RyaW5nKCldIC0gdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdztcbiAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4LCBvdmVyZmxvd0RpZmZlcmVuY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBcnJvd0xpc3RlbmVycygpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5oYW5kbGVNb3VzZU92ZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5tb3VzZUlzT3ZlclZpZXdwb3J0ID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5oYW5kbGVNb3VzZU91dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm1vdXNlSXNPdmVyVmlld3BvcnQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5tb3VzZUlzT3ZlclZpZXdwb3J0KSB7XG5cbiAgICAgICAgY29uc3QgaXNNYWMgPSB0aGlzLm9wZXJhdGluZ1N5c3RlbS5pc01hYygpO1xuXG4gICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGlmIChpc01hYyAmJiBlLm1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgKz0gTnVtYmVyKHRoaXMuYXJyb3dEb3duU3BlZWQpO1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4ISwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgIGlmIChpc01hYyAmJiBlLm1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ISAtPSBOdW1iZXIodGhpcy5hcnJvd1VwU3BlZWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCh0aGlzLnJhbmdlLnN0YXJ0SW5kZXghLCAwKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCh0aGlzLnJhbmdlLnN0YXJ0SW5kZXghLCAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnUGFnZURvd24nOlxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5wYWdlRG93bigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnUGFnZVVwJzpcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMucGFnZVVwKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdFbmQnOlxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnSG9tZSc6XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5ncmlkRGlyZWN0aXZlID0gKHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpISBhcyBhbnkpWydncmlkRGlyZWN0aXZlJ107XG4gICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9IHRoaXM7XG5cbiAgICB0aGlzLmdyaWREaXJlY3RpdmUhLnByZUdyaWRJbml0aWFsaXplLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5yZWZyZXNoQ29udGFpbmVySGVpZ2h0KCk7XG5cbiAgICAgIHRoaXMucmVmcmVzaFZpZXdwb3J0KCk7XG4gICAgICAvLyBwbGFjZWhvbGRlciBvYmplY3QgaXMgdXNlZCBvbmx5IHRvIGluaXRpYWxpemUgZmlyc3QgZ3JpZCByZW5kZXJcbiAgICAgIGlmICh0aGlzLml0ZW1zIVswXSA9PT0gdGhpcy5wbGFjZWhvbGRlck9iamVjdCkge1xuICAgICAgICB0aGlzLml0ZW1zIS5zaGlmdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3cG9ydFJlbmRlcmVkKCk7XG4gICAgdGhpcy5hZGRBcnJvd0xpc3RlbmVycygpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIHRoaXMucmVnaXN0ZXJWaWV3cG9ydFRvRWxlbWVudCgpO1xuICAgIHRoaXMuX2Nsb25lTWV0aG9kID0gdGhpcy5nZW5lcmF0ZUNsb25lTWV0aG9kO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJRCk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuaGFuZGxlTW91c2VPdmVyKTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5oYW5kbGVNb3VzZU91dCk7XG4gICAgaWYgKHRoaXMubGlzdENvbnRlbnQpIHtcbiAgICAgIHRoaXMubGlzdENvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVMaXN0Q29udGVudFNjcm9sbCk7XG4gICAgfVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24hKTtcbiAgICBpZiAodGhpcy52aXJ0dWFsRm9yQ2hhbmdlc1N1YnNjcmlwdGlvbiQpIHtcbiAgICAgIHRoaXMudmlydHVhbEZvckNoYW5nZXNTdWJzY3JpcHRpb24kLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlID0gbnVsbDtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxWaWV3cG9ydCA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIHNldFNjcm9sbFNwYWNlcnMoKTogdm9pZCB7XG5cbiAgICBjb25zdCBudW1JdGVtc0FmdGVyU2hvd25MaXN0ID0gdGhpcy5pdGVtcyEubGVuZ3RoIC0gdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ITtcbiAgICBjb25zdCBudW1JdGVtc0JlZm9yZVNob3duTGlzdCA9IHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4O1xuXG4gICAgY29uc3QgdG90YWxVbnNob3duSXRlbXMgPSBudW1JdGVtc0JlZm9yZVNob3duTGlzdCEgKyBudW1JdGVtc0FmdGVyU2hvd25MaXN0O1xuXG4gICAgY29uc3QgYmVmb3JlSXRlbUhlaWdodFBlcmNlbnQgPSB0b3RhbFVuc2hvd25JdGVtcyAhPT0gMCA/IG51bUl0ZW1zQmVmb3JlU2hvd25MaXN0ISAvIHRvdGFsVW5zaG93bkl0ZW1zIDogMDtcbiAgICBjb25zdCBhZnRlckl0ZW1IZWlnaHRQZXJjZW50ID0gdG90YWxVbnNob3duSXRlbXMgIT09IDAgPyBudW1JdGVtc0FmdGVyU2hvd25MaXN0IC8gdG90YWxVbnNob3duSXRlbXMgOiAwO1xuICAgIGNvbnN0IHJlbWFpbmluZ0hlaWdodCA9IHRoaXMuZXN0aW1hdGVkRnVsbENvbnRlbnRIZWlnaHQgLSB0aGlzLmxhc3RIZWlnaHQ7XG5cbiAgICB0aGlzLmVzdGltYXRlZFByZUxpc3RIZWlnaHQgPSBNYXRoLnJvdW5kKGJlZm9yZUl0ZW1IZWlnaHRQZXJjZW50ICogcmVtYWluaW5nSGVpZ2h0KTtcbiAgICB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0ID0gTWF0aC5yb3VuZChhZnRlckl0ZW1IZWlnaHRQZXJjZW50ICogcmVtYWluaW5nSGVpZ2h0KTtcblxuICAgIC8vIGFjY291bnQgZm9yIHJvdW5kaW5nIGJvdGggdXBcbiAgICB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRQb3N0TGlzdEhlaWdodCAtIChhZnRlckl0ZW1IZWlnaHRQZXJjZW50ICogcmVtYWluaW5nSGVpZ2h0KSA9PT0gMC41ID8gdGhpcy5lc3RpbWF0ZWRQb3N0TGlzdEhlaWdodCAtIDEgOiB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0O1xuXG4gICAgaWYgKHRoaXMuZm9yY2VkRW5kSW5kZXgpIHtcbiAgICAgIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodCA9IDA7XG4gICAgICB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0ID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZTcGFjZXIhLnN0eWxlLmhlaWdodCA9IHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodC50b1N0cmluZygpICsgJ3B4JztcbiAgICB0aGlzLnBvc3RTcGFjZXIhLnN0eWxlLmhlaWdodCA9IHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQudG9TdHJpbmcoKSArICdweCc7XG5cbiAgfVxuXG4gIHByaXZhdGUgc2V0SGVpZ2h0QnlMaXN0SGVpZ2h0RGlmZmVyZW5jZShsaUhlaWdodDogbnVtYmVyLCBsaXN0SGVpZ2h0OiBudW1iZXIpIHtcbiAgICByZXR1cm4gbGlIZWlnaHQgLSBsaXN0SGVpZ2h0O1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQcmVTY3JvbGxJdGVtcyhsYXN0SW5kZXg6IG51bWJlciwgaW5kZXg6IG51bWJlcikge1xuICAgIGlmIChsYXN0SW5kZXggPCBpbmRleCkge1xuICAgICAgZm9yIChsZXQgaSA9IGxhc3RJbmRleDsgaSA8IGluZGV4OyBpKyspIHtcbiAgICAgICAgY29uc3QgZmlyc3RSZWY6IFZpZXdSZWYgfCBudWxsID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuZ2V0KDEpO1xuICAgICAgICBpZiAoZmlyc3RSZWYpIHtcbiAgICAgICAgICBjb25zdCBmaXJzdENoaWxkID0gKGZpcnN0UmVmIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF07XG4gICAgICAgICAgY29uc3QgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICAgIHRoaXMuaXRlbVZpc2liaWxpdHlMb29rdXBbaXRlbU5hbWVdID0gZmFsc2U7XG4gIFxuICAgICAgICAgIGNvbnN0IGRldGFjaGVkUmVmOiBWaWV3UmVmIHwgbnVsbCA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmRldGFjaCgxKTtcbiAgICAgICAgICBkZXRhY2hlZFJlZiEuZGVzdHJveSgpO1xuICAgICAgICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgICB0aGlzLnJlbW92ZVJlc2l6ZVNlbnNvcihmaXJzdENoaWxkLCBpKTtcbiAgICAgICAgICB0aGlzLmxhc3RIZWlnaHQgLT0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hSZW1vdmVJdGVtRXZlbnRzKHRoaXMuaXRlbVJlbW92ZWQsIGZpcnN0Q2hpbGQsIGksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBwcml2YXRlIHJlbW92ZVBvc3RTY3JvbGxJdGVtcyhsYXN0RW5kSW5kZXg6IG51bWJlciwgZW5kSW5kZXg6IG51bWJlcikge1xuICAgIGlmIChsYXN0RW5kSW5kZXggPj0gdGhpcy5pdGVtcyEubGVuZ3RoKSB7XG4gICAgICBsYXN0RW5kSW5kZXggPSB0aGlzLml0ZW1zIS5sZW5ndGggLSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBsYXN0RW5kSW5kZXg7IGkgPj0gZW5kSW5kZXg7IGktLSkge1xuICAgICAgY29uc3QgbGFzdENoaWxkID0gdGhpcy5nZXRQcmV2aW91c1NpYmxpbmcodGhpcy5saXN0Q29udGVudCEubGFzdEVsZW1lbnRDaGlsZCk7XG4gICAgICBpZiAobGFzdENoaWxkKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1OYW1lID0gJ2l0ZW0nICsgaTtcbiAgICAgICAgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFtpdGVtTmFtZV0gPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBkZXRhY2hlZFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5kZXRhY2godGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRldGFjaGVkUmVmIS5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVSZXNpemVTZW5zb3IobGFzdENoaWxkLCBpKTtcbiAgICAgICAgdGhpcy5sYXN0SGVpZ2h0IC09IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaFJlbW92ZUl0ZW1FdmVudHModGhpcy5pdGVtUmVtb3ZlZCwgKGRldGFjaGVkUmVmIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0sIGksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6IGFueVtdLCBzY3JvbGxUb09wdGlvbnM6IGFueSA9IHtpbmRleDogLTEsIHNjcm9sbEFmdGVySW5kZXhlZEl0ZW06IDAgfSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhdXNlVmlld3BvcnRSZW5kZXJVcGRhdGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBkZXRhY2hlZFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5kZXRhY2goaSk7XG4gICAgICBkZXRhY2hlZFJlZiEuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgdGhpcy5yZXNldFRvSW5pdGlhbFZhbHVlcygpO1xuICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgICBpZiAodGhpcy52aXJ0dWFsTmV4dXMpIHtcbiAgICAgIHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RhYmxlanNGb3JPZiA9IGl0ZW1zO1xuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb09wdGlvbnMuaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvRXhhY3Qoc2Nyb2xsVG9PcHRpb25zLmluZGV4LCBzY3JvbGxUb09wdGlvbnMuc2Nyb2xsQWZ0ZXJJbmRleGVkSXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc2V0VG9Jbml0aWFsVmFsdWVzKCk6IHZvaWQge1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2UgPSAwO1xuICAgIHRoaXMuZXN0aW1hdGVkRnVsbENvbnRlbnRIZWlnaHQgPSAwO1xuICAgIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodCA9IDA7XG4gICAgdGhpcy5lc3RpbWF0ZWRQb3N0TGlzdEhlaWdodCA9IDA7XG4gICAgdGhpcy50b3RhbEl0ZW1zQ291bnRlZCA9IDA7XG4gICAgdGhpcy50b3RhbEhlaWdodENvdW50ID0gMDtcbiAgICB0aGlzLmF2Z0l0ZW1IZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oZWlnaHRMb29rdXAgPSB7fTtcbiAgICB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwID0ge307XG4gICAgdGhpcy5vdmVyZmxvd0hlaWdodENvdW50ID0gMDtcbiAgICB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSA9IDA7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1IZWlnaHQgPSBJbmZpbml0eTtcbiAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmxhc3RIZWlnaHQgPSAwO1xuICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IDA7XG4gICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9IDA7XG4gICAgdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXggPSAwO1xuICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCA9IDA7XG4gICAgdGhpcy5sYXN0UmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleDtcbiAgICB0aGlzLmxhc3RSYW5nZS5lbmRJbmRleCA9IHRoaXMucmFuZ2UuZW5kSW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleDtcbiAgICB0aGlzLmZvcmNlZEVuZEluZGV4ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHJlY2FsY3VsYXRlUm93SGVpZ2h0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtTmFtZTogc3RyaW5nID0gJ2l0ZW0nICsgaW5kZXg7XG4gICAgY29uc3QgaW5kZXhNYXA6IGFueSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluZGV4TWFwWyh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5nZXQoaSkgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXS5pbmRleF0gPSBpO1xuICAgIH07XG4gICAgY29uc3Qgcm93UmVmOiBFbWJlZGRlZFZpZXdSZWY8YW55PiA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmdldChpbmRleE1hcFtpbmRleF0pIGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+O1xuICAgIGNvbnN0IHJvd0VsOiBIVE1MRWxlbWVudCB8IGFueSA9IHJvd1JlZi5yb290Tm9kZXNbMF07XG5cbiAgICBjb25zdCBsb29rdXBIZWlnaHQ6IG51bWJlciA9IHJvd0VsLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBoZWlnaHREaWZmZXJlbmNlOiBudW1iZXIgPSBsb29rdXBIZWlnaHQgLSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG4gICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXSwgbG9va3VwSGVpZ2h0KTtcbiAgICB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV0gPSBsb29rdXBIZWlnaHQ7XG5cbiAgICByb3dFbC5sYXN0SGVpZ2h0ID0gbG9va3VwSGVpZ2h0O1xuICAgIHRoaXMubGFzdEhlaWdodCArPSBoZWlnaHREaWZmZXJlbmNlO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKG9sZEhlaWdodDogbnVtYmVyLCBuZXdIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudG90YWxIZWlnaHRDb3VudCArPSAobmV3SGVpZ2h0IC0gb2xkSGVpZ2h0KTtcbiAgICB0aGlzLmF2Z0l0ZW1IZWlnaHQgPSAodGhpcy50b3RhbEhlaWdodENvdW50IC8gdGhpcy50b3RhbEl0ZW1zQ291bnRlZCk7XG4gICAgdGhpcy5lc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodCA9IHRoaXMuYXZnSXRlbUhlaWdodCAqIHRoaXMuaXRlbXMhLmxlbmd0aDtcbiAgfVxuICBwcml2YXRlIHVwZGF0ZUVzdGltYXRlZEhlaWdodChoZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMudG90YWxIZWlnaHRDb3VudCArPSBoZWlnaHQ7XG4gICAgdGhpcy50b3RhbEl0ZW1zQ291bnRlZCsrO1xuXG4gICAgdGhpcy5hdmdJdGVtSGVpZ2h0ID0gKHRoaXMudG90YWxIZWlnaHRDb3VudCAvIHRoaXMudG90YWxJdGVtc0NvdW50ZWQpO1xuICAgIHRoaXMuZXN0aW1hdGVkRnVsbENvbnRlbnRIZWlnaHQgPSB0aGlzLmF2Z0l0ZW1IZWlnaHQgKiB0aGlzLml0ZW1zIS5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgZ2V0UHJldmlvdXNTaWJsaW5nKGVsOiBOb2RlIHwgRWxlbWVudCB8IG51bGwpOiBhbnkge1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgcHJldiA9IGVsLnByZXZpb3VzU2libGluZztcbiAgICB3aGlsZSAocHJldiAhPT0gbnVsbCAmJiBwcmV2ICE9PSB1bmRlZmluZWQgJiYgcHJldi5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgcHJldiA9IHByZXYucHJldmlvdXNTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcHJldjtcbiAgfVxuICBwdWJsaWMgZ2V0TmV4dFNpYmxpbmcoZWw6IEVsZW1lbnQgfCBudWxsKTogYW55IHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IG5leHQgPSBlbC5uZXh0U2libGluZztcbiAgICB3aGlsZSAobmV4dCAhPT0gbnVsbCAmJiBuZXh0ICE9PSB1bmRlZmluZWQgJiYgbmV4dC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgbmV4dCA9IG5leHQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFc3RpbWF0ZWRDaGlsZEluc2VydGlvbnMocmVtYWluaW5nSGVpZ2h0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLmNlaWwocmVtYWluaW5nSGVpZ2h0IC8gdGhpcy5hdmdJdGVtSGVpZ2h0ISk7XG4gIH1cblxuICBwcml2YXRlIHNldExhc3RSYW5nZVRvQ3VycmVudFJhbmdlKCkge1xuICAgIHRoaXMubGFzdFJhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZW5kSW5kZXggPSB0aGlzLnJhbmdlLmVuZEluZGV4O1xuICAgIHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4O1xuICAgIHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkRW5kSW5kZXggPSB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXg7XG4gIH1cblxuICBwcml2YXRlIHJlc2V0TGFzdEhlaWdodCgpIHtcbiAgICBpZiAoIXRoaXMubGFzdEhlaWdodCkge1xuICAgICAgdGhpcy5sYXN0SGVpZ2h0ID0gMDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1haW50YWluSW5kZXhJbkJvdW5kcyhpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGluZGV4ID4gdGhpcy5pdGVtcyEubGVuZ3RoIC0gMSkge1xuICAgICAgaW5kZXggPSB0aGlzLml0ZW1zIS5sZW5ndGggLSAxO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgbWFpbnRhaW5FbmRJbmRleEluQm91bmRzKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoaW5kZXggPiB0aGlzLml0ZW1zIS5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gdGhpcy5pdGVtcyEubGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBzaG93UmFuZ2Uoc3RhcnRJbmRleDogbnVtYmVyLCBlbmRJbmRleDogbnVtYmVyLCBvdmVyZmxvdzogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlSXRlbXModGhpcy5pdGVtcyEsIHtpbmRleDogc3RhcnRJbmRleCwgc2Nyb2xsQWZ0ZXJJbmRleGVkSXRlbTogZW5kSW5kZXggfSk7XG4gICAgc3RhcnRJbmRleCA9IHRoaXMubWFpbnRhaW5JbmRleEluQm91bmRzKHN0YXJ0SW5kZXgpO1xuICAgIGVuZEluZGV4ID0gdGhpcy5tYWludGFpbkVuZEluZGV4SW5Cb3VuZHMoZW5kSW5kZXgpO1xuICAgIGlmIChlbmRJbmRleCA8PSBzdGFydEluZGV4KSB7XG4gICAgICBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZENvbnRhaW5lckhlaWdodDogbnVtYmVyID0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuICAgIGNvbnN0IG9sZFByZUl0ZW1PdmVyZmxvdzogbnVtYmVyID0gTnVtYmVyKHRoaXMucHJlSXRlbU92ZXJmbG93KTtcbiAgICBjb25zdCBvbGRQb3N0SXRlbU92ZXJmbG93OiBudW1iZXIgPSBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KTtcblxuICAgIHRoaXMucHJlSXRlbU92ZXJmbG93ID0gMDtcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSAwO1xuICAgIHRoaXMuY29udGFpbmVySGVpZ2h0ID0gMTAwMDAwO1xuICAgIHRoaXMuZm9yY2VkRW5kSW5kZXggPSBlbmRJbmRleDtcblxuICAgIHRoaXMuc2Nyb2xsVG9FeGFjdChzdGFydEluZGV4LCBvdmVyZmxvdyk7XG5cbiAgICBjb25zdCByYW5nZVRvS2VlcDogUmFuZ2UgPSB7IC4uLnRoaXMucmFuZ2V9O1xuICAgIGNvbnN0IGxhc3RSYW5nZVRvS2VlcDogUmFuZ2UgPSB7IC4uLnRoaXMubGFzdFJhbmdlIH07XG5cbiAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IG9sZFByZUl0ZW1PdmVyZmxvdztcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSBvbGRQb3N0SXRlbU92ZXJmbG93O1xuICAgIHRoaXMuY29udGFpbmVySGVpZ2h0ID0gb2xkQ29udGFpbmVySGVpZ2h0O1xuICAgIHRoaXMuZm9yY2VkRW5kSW5kZXggPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnJhbmdlID0gcmFuZ2VUb0tlZXA7XG4gICAgdGhpcy5sYXN0UmFuZ2UgPSBsYXN0UmFuZ2VUb0tlZXA7XG5cbiAgfVxuXG4gIHB1YmxpYyBnZXREaXNwbGF5ZWRDb250ZW50c0hlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmxhc3RIZWlnaHQ7XG4gIH1cblxuICBwdWJsaWMgcmVmcmVzaENvbnRhaW5lckhlaWdodCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lckhlaWdodCA9IHRoaXMubGlzdENvbnRlbnQhLmNsaWVudEhlaWdodDtcbiAgfVxuXG4gIHB1YmxpYyBhbGxJdGVtc0ZpdFZpZXdwb3J0KHJlY2FsY3VsYXRlQ29udGFpbmVySGVpZ2h0OiBib29sZWFuID0gZmFsc2UsIHJlZnJlc2hWaWV3cG9ydDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgaWYgKHJlY2FsY3VsYXRlQ29udGFpbmVySGVpZ2h0KSB7XG4gICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5yZWZyZXNoQ29udGFpbmVySGVpZ2h0KCk7XG4gICAgfVxuICAgIGlmIChyZWZyZXNoVmlld3BvcnQpIHtcbiAgICAgIHRoaXMucmVmcmVzaFZpZXdwb3J0KHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yYW5nZS5zdGFydEluZGV4ID09PSB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCAmJlxuICAgICAgICAgICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9PT0gdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ICYmIFxuICAgICAgICAgICAgdGhpcy5sYXN0SGVpZ2h0IDw9IHRoaXMuY29udGFpbmVySGVpZ2h0ITtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDdXJyZW50U2Nyb2xsUG9zaXRpb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXg6IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCxcbiAgICAgIG92ZXJmbG93OiB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSxcbiAgICAgIGxhc3RJdGVtT3ZlcmZsb3c6IHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3cgPiAwID8gMCA6IHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3dcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldEhlaWdodHNGb3JPdmVyZmxvd0NhbGN1bGF0aW9ucyhpdGVtSW5kZXg6IG51bWJlciwgc2Nyb2xsVG9JbmRleDogbnVtYmVyLCBpdGVtSGVpZ2h0OiBudW1iZXIpIHtcbiAgICB0aGlzLmxhc3RIZWlnaHQgKz0gaXRlbUhlaWdodDtcblxuICAgIGlmIChpdGVtSW5kZXggPCBzY3JvbGxUb0luZGV4KSB7XG4gICAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ICs9IGl0ZW1IZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1JbmRleCA+PSBzY3JvbGxUb0luZGV4KSB7XG4gICAgICB0aGlzLm92ZXJmbG93SGVpZ2h0Q291bnQgKz0gaXRlbUhlaWdodDtcbiAgICAgIGlmICh0aGlzLm92ZXJmbG93SGVpZ2h0Q291bnQgPj0gdGhpcy5jb250YWluZXJIZWlnaHQhKSB7XG4gICAgICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50Kys7XG5cbiAgICAgICAgaWYgKHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1IZWlnaHQgPSB0aGlzLmhlaWdodExvb2t1cFsnaXRlbScgKyBpdGVtSW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRSZXNpemVTZW5zb3IoZWw6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICB9XG4gIHByaXZhdGUgcmVtb3ZlUmVzaXplU2Vuc29yKGVsOiBhbnksIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgfVxuXG4gIHB1YmxpYyBvblRyYW5zaXRpb25FbmQ6IChfZTogYW55KSA9PiB2b2lkID0gKGUpID0+IHtcbiAgfVxuICBwdWJsaWMgb25UcmFuc2l0aW9uUnVuOiAoX2U6IGFueSkgPT4gdm9pZCA9IChlKSA9PiB7XG4gIH1cbiAgcHVibGljIG9uVHJhbnNpdGlvblN0YXJ0OiAoX2U6IGFueSkgPT4gdm9pZCA9IChlKSA9PiB7XG4gIH1cbiAgcHVibGljIG9uVHJhbnNpdGlvbkNhbmNlbDogKF9lOiBhbnkpID0+IHZvaWQgPSAoZSkgPT4ge1xuICB9XG5cbiAgcHVibGljIGdldENsb25lRnJvbVRlbXBsYXRlUmVmKGluZGV4OiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XG4gICAgbGV0IGNsb25lOiBIVE1MRWxlbWVudDtcblxuICAgIHRoaXMudGVtcGxhdGVDb250ZXh0ID0gbmV3IFRhYmxlanNGb3JPZkNvbnRleHQ8YW55LCBhbnk+KHRoaXMuaXRlbXMhW2luZGV4XSwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RhYmxlanNGb3JPZiwgaW5kZXgsIHRoaXMuaXRlbXMhLmxlbmd0aCk7XG4gICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl90ZW1wbGF0ZS5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZUNvbnRleHQpO1xuICAgIHZpZXdSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIGNsb25lID0gdmlld1JlZi5yb290Tm9kZXNbMF07XG5cbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICBwcml2YXRlIGFkZFNjcm9sbEl0ZW1zKGluZGV4OiBudW1iZXIsIG92ZXJmbG93OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBzY3JvbGxpbmdVcCA9IGluZGV4IDwgdGhpcy5sYXN0UmFuZ2Uuc3RhcnRJbmRleCE7XG5cbiAgICB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4O1xuICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IGluZGV4O1xuICAgIHRoaXMub3ZlcmZsb3dIZWlnaHRDb3VudCA9IC1vdmVyZmxvdztcbiAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ID0gMDtcbiAgICBjb25zdCBmaXJzdEVsID0gdGhpcy5nZXROZXh0U2libGluZyh0aGlzLmxpc3RDb250ZW50IS5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgdGhpcy5sYXN0SGVpZ2h0ID0gMDtcbiAgICBsZXQgYmF0Y2hTaXplOiBudW1iZXIgPSB0aGlzLmF2Z0l0ZW1IZWlnaHQgIT09IHVuZGVmaW5lZCAmJiBpc05hTih0aGlzLmF2Z0l0ZW1IZWlnaHQpID09PSBmYWxzZSA/IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISAtIHRoaXMubGFzdEhlaWdodCkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpICsgTnVtYmVyKHRoaXMucG9zdEl0ZW1PdmVyZmxvdykgOiAxO1xuICAgIGxldCBpdGVtc1RvQmF0Y2g6IGFueVtdID0gW107XG4gICAgbGV0IGl0ZW1CZWZvcmU6IE5vZGU7XG4gICAgbGV0IGluZGV4QmVmb3JlOiBudW1iZXI7XG4gICAgY29uc3QgZmlyc3RSZWY6IFZpZXdSZWYgfCBudWxsID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuZ2V0KDEpO1xuICAgIGNvbnN0IGFwcGVuZFRvRW5kOiBib29sZWFuID0gZmlyc3RSZWYgPT09IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ITsgaSA8IHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ISArIE51bWJlcih0aGlzLml0ZW1Mb2FkTGltaXQpOyBpKyspIHtcbiAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpID4gdGhpcy5pdGVtcyEubGVuZ3RoIC0gMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdGhpcy5pdGVtTmFtZSA9ICdpdGVtJyArIGk7XG4gICAgICAvLyBvbmx5IGluc2VydCBpdGVtIGlmIGl0IGlzIG5vdCBhbHJlYWR5IHZpc2libGVcbiAgICAgIGNvbnN0IGl0ZW1Jc0ludmlzaWJsZTogYm9vbGVhbiA9IHRoaXMuaXRlbVZpc2liaWxpdHlMb29rdXBbdGhpcy5pdGVtTmFtZV0gIT09IHRydWU7XG5cbiAgICAgIGlmIChpdGVtSXNJbnZpc2libGUpIHtcbiAgICAgICAgaXRlbUJlZm9yZSA9ICFzY3JvbGxpbmdVcCA/IHRoaXMucG9zdFNwYWNlciA6IGZpcnN0RWw7XG5cbiAgICAgICAgaW5kZXhCZWZvcmUgPSAhc2Nyb2xsaW5nVXAgfHwgYXBwZW5kVG9FbmQgPyB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5sZW5ndGggOiB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5pbmRleE9mKGZpcnN0UmVmISk7XG5cbiAgICAgICAgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFt0aGlzLml0ZW1OYW1lXSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZUNvbnRleHQgPSBuZXcgVGFibGVqc0Zvck9mQ29udGV4dDxhbnksIGFueT4odGhpcy5pdGVtcyFbaV0sIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl90YWJsZWpzRm9yT2YsIGksIHRoaXMuaXRlbXMhLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IHJlZjogRW1iZWRkZWRWaWV3UmVmPGFueT4gPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RlbXBsYXRlLCB0aGlzLnRlbXBsYXRlQ29udGV4dCwgaW5kZXhCZWZvcmUpO1xuICAgICAgICB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5tb3ZlKHJlZiwgaW5kZXhCZWZvcmUpO1xuXG4gICAgICAgIGNvbnN0IHByZXY6IGFueSA9IHJlZi5yb290Tm9kZXNbMF07XG4gICAgICAgIHByZXYuaW5kZXggPSBpO1xuICAgICAgICBcbiAgICAgICAgaXRlbXNUb0JhdGNoLnB1c2goeyBpbmRleDogaSwgbmFtZTogdGhpcy5pdGVtTmFtZSwgaXRlbTogcHJldiwgYmVmb3JlOiBpdGVtQmVmb3JlIH0pO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hBZGRJdGVtRXZlbnRzKHRoaXMuaXRlbUFkZGVkLCBwcmV2LCBpLCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtc1RvQmF0Y2gucHVzaCh7IGluZGV4OiBpLCBuYW1lOiB0aGlzLml0ZW1OYW1lLCBpdGVtOiBudWxsLCBiZWZvcmU6IG51bGwgfSk7XG4gICAgICAgIHRoaXMuc2V0SGVpZ2h0c0Zvck92ZXJmbG93Q2FsY3VsYXRpb25zKGksIGluZGV4LCB0aGlzLmhlaWdodExvb2t1cFt0aGlzLml0ZW1OYW1lXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtc1RvQmF0Y2gubGVuZ3RoID09PSBiYXRjaFNpemUgfHwgaSA9PT0gdGhpcy5pdGVtcyEubGVuZ3RoIC0gMSB8fCB0aGlzLnBvc3RJdGVtT3ZlcmZsb3dDb3VudCA+PSBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1zVG9CYXRjaC5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnN0IGJhdGNoT2JqOiBhbnkgPSBpdGVtc1RvQmF0Y2hbal07XG4gICAgICAgICAgY29uc3QgbmFtZTogc3RyaW5nID0gYmF0Y2hPYmoubmFtZTtcbiAgICAgICAgICBjb25zdCBpbmQ6IG51bWJlciA9IGJhdGNoT2JqLmluZGV4O1xuICAgICAgICAgIGNvbnN0IG9sZEhlaWdodDogbnVtYmVyID0gdGhpcy5oZWlnaHRMb29rdXBbbmFtZV07XG5cbiAgICAgICAgICBpZiAoYmF0Y2hPYmouaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jZHIhLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICBjb25zdCBsb29rdXBIZWlnaHQ6IG51bWJlciA9IGJhdGNoT2JqLml0ZW0ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgdGhpcy5oZWlnaHRMb29rdXBbbmFtZV0gPSBsb29rdXBIZWlnaHQ7XG5cbiAgICAgICAgICBiYXRjaE9iai5pdGVtLmxhc3RIZWlnaHQgPSBsb29rdXBIZWlnaHQ7XG4gICAgICAgICAgdGhpcy5hZGRSZXNpemVTZW5zb3IoYmF0Y2hPYmouaXRlbSwgYmF0Y2hPYmouaW5kZXgpO1xuXG4gICAgICAgICAgaWYgKG9sZEhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKG9sZEhlaWdodCwgbG9va3VwSGVpZ2h0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHQobG9va3VwSGVpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zZXRIZWlnaHRzRm9yT3ZlcmZsb3dDYWxjdWxhdGlvbnMoaW5kLCBpbmRleCwgbG9va3VwSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBiYXRjaFNpemUgPSB0aGlzLmdldEVzdGltYXRlZENoaWxkSW5zZXJ0aW9ucyh0aGlzLmNvbnRhaW5lckhlaWdodCEgLSB0aGlzLmxhc3RIZWlnaHQpICsgTnVtYmVyKHRoaXMucHJlSXRlbU92ZXJmbG93KSArIE51bWJlcih0aGlzLnBvc3RJdGVtT3ZlcmZsb3cpO1xuICAgICAgICBpZiAoYmF0Y2hTaXplIDw9IDApIHtcbiAgICAgICAgICBiYXRjaFNpemUgPSBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtc1RvQmF0Y2ggPSBbXTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50IDw9IDApIHtcbiAgICAgICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ID0gaSArIDE7XG4gICAgICAvLyBpZiBpdGVtIGhlaWdodCBpcyBsb3dlciB0aGFuIHRoZSBib3R0b20gb2YgdGhlIGNvbnRhaW5lciBhcmVhLCBzdG9wIGFkZGluZyBpdGVtc1xuICAgICAgaWYgKHRoaXMuZm9yY2VkRW5kSW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGhpcy5wb3N0SXRlbU92ZXJmbG93Q291bnQgPj0gTnVtYmVyKHRoaXMucG9zdEl0ZW1PdmVyZmxvdykpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGkgPT09IHRoaXMuZm9yY2VkRW5kSW5kZXggLSAxKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGl0ZW1OYW1lOiBzdHJpbmc7XG4gICAgbGV0IGVuZEluZGV4Rm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgaGVpZ2h0Q291bnQ6IG51bWJlciA9IC1vdmVyZmxvdztcbiAgICBmb3IgKGxldCBpID0gdGhpcy5yYW5nZS5zdGFydEluZGV4OyBpIDwgdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ITsgaSsrKSB7XG4gICAgICBpdGVtTmFtZSA9ICdpdGVtJyArIGk7XG4gICAgICBoZWlnaHRDb3VudCArPSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG5cbiAgICAgIGlmICh0aGlzLmZvcmNlZEVuZEluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGkgPT09IHRoaXMuZm9yY2VkRW5kSW5kZXggLSAxKSB7XG4gICAgICAgICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9IGkgKyAxO1xuICAgICAgICAgIHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3cgPSBoZWlnaHRDb3VudCAtIHRoaXMuY29udGFpbmVySGVpZ2h0ITtcblxuICAgICAgICAgIGVuZEluZGV4Rm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaGVpZ2h0Q291bnQgPj0gdGhpcy5jb250YWluZXJIZWlnaHQhICYmICFlbmRJbmRleEZvdW5kKSB7XG4gICAgICAgICAgdGhpcy5yYW5nZS5lbmRJbmRleCA9IGkgKyAxO1xuICAgICAgICAgIHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3cgPSBoZWlnaHRDb3VudCAtIHRoaXMuY29udGFpbmVySGVpZ2h0ITtcblxuICAgICAgICAgIGVuZEluZGV4Rm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRNaXNzaW5nUG9zdFNjcm9sbEl0ZW1zQW5kVXBkYXRlT3ZlcmZsb3coaW5kZXg6IG51bWJlciwgb3ZlcmZsb3c6IG51bWJlcik6IG51bWJlciB7XG5cbiAgICBsZXQgZmlyc3RFbDtcbiAgICBsZXQgaXRlbXNUb0JhdGNoOiBhbnlbXSA9IFtdO1xuICAgIGxldCBiYXRjaFNpemU6IG51bWJlcjtcblxuICAgIGlmICh0aGlzLm92ZXJmbG93SGVpZ2h0Q291bnQgPD0gdGhpcy5jb250YWluZXJIZWlnaHQhKSB7XG4gICAgICBiYXRjaFNpemUgPSB0aGlzLmdldEVzdGltYXRlZENoaWxkSW5zZXJ0aW9ucyh0aGlzLmNvbnRhaW5lckhlaWdodCEpICsgTnVtYmVyKHRoaXMucHJlSXRlbU92ZXJmbG93KTtcbiAgICAgIHRoaXMucHJlSXRlbU92ZXJmbG93Q291bnQgPSAtMTtcbiAgICAgIHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgPSAwO1xuXG4gICAgICBmaXJzdEVsID0gdGhpcy5nZXROZXh0U2libGluZyh0aGlzLmxpc3RDb250ZW50IS5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgIGxldCBoZWlnaHRDb3VudCA9IDA7XG4gICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5yYW5nZS5lbmRJbmRleCEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB0aGlzLml0ZW1OYW1lID0gJ2l0ZW0nICsgaTtcblxuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoaSA8PSB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCEgJiYgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFt0aGlzLml0ZW1OYW1lXSAhPT0gdHJ1ZSkge1xuXG4gICAgICAgICAgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFt0aGlzLml0ZW1OYW1lXSA9IHRydWU7XG5cbiAgICAgICAgICB0aGlzLnRlbXBsYXRlQ29udGV4dCA9IG5ldyBUYWJsZWpzRm9yT2ZDb250ZXh0PGFueSwgYW55Pih0aGlzLml0ZW1zIVtpXSwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RhYmxlanNGb3JPZiwgaSwgdGhpcy5pdGVtcyEubGVuZ3RoKTtcbiAgICAgICAgICBjb25zdCByZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl90ZW1wbGF0ZSwgdGhpcy50ZW1wbGF0ZUNvbnRleHQsIDEpO1xuICAgICAgICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLm1vdmUocmVmLCAxKTtcbiAgICAgICAgICBjb25zdCBwcmV2OiBhbnkgPSByZWYucm9vdE5vZGVzWzBdO1xuICAgICAgICAgIHByZXYuaW5kZXggPSBpO1xuICAgICAgICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgICBpdGVtc1RvQmF0Y2gucHVzaCh7IGluZGV4OiBpLCBuYW1lOiB0aGlzLml0ZW1OYW1lLCBpdGVtOiBwcmV2LCBiZWZvcmU6IGZpcnN0RWwgfSk7XG4gICAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaEFkZEl0ZW1FdmVudHModGhpcy5pdGVtQWRkZWQsIHByZXYsIGksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICBmaXJzdEVsID0gcHJldjtcblxuICAgICAgICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gaTtcbiAgICAgICAgICB0aGlzLmFkanVzdGVkU3RhcnRJbmRleCA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbXNUb0JhdGNoLnB1c2goeyBpbmRleDogaSwgbmFtZTogdGhpcy5pdGVtTmFtZSwgaXRlbTogbnVsbCwgYmVmb3JlOiBudWxsIH0pO1xuXG4gICAgICAgICAgaGVpZ2h0Q291bnQgKz0gdGhpcy5oZWlnaHRMb29rdXBbdGhpcy5pdGVtTmFtZV07XG4gICAgICAgICAgaWYgKGhlaWdodENvdW50ID4gdGhpcy5jb250YWluZXJIZWlnaHQhKSB7XG4gICAgICAgICAgICB0aGlzLnByZUl0ZW1PdmVyZmxvd0NvdW50Kys7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICBvdmVyZmxvdyA9IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuICAgICAgICAgICAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSBpO1xuICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ICs9IHRoaXMuaGVpZ2h0TG9va3VwW3RoaXMuaXRlbU5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXggPSBpO1xuICAgICAgICAgICAgdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXggPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtc1RvQmF0Y2gubGVuZ3RoID09PSBiYXRjaFNpemUgfHwgaSA9PT0gMCkge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaXRlbXNUb0JhdGNoLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBiYXRjaE9iajogYW55ID0gaXRlbXNUb0JhdGNoW2pdO1xuICAgICAgICAgICAgaWYgKGJhdGNoT2JqLml0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBiYXRjaE9iai5uYW1lO1xuICAgICAgICAgICAgY29uc3QgaW5kOiBudW1iZXIgPSBiYXRjaE9iai5pbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gYmF0Y2hPYmouaXRlbS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBvbGRIZWlnaHQ6IG51bWJlciA9IHRoaXMuaGVpZ2h0TG9va3VwW25hbWVdO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHRMb29rdXBbbmFtZV0gPSBsb29rdXBIZWlnaHQ7XG5cbiAgICAgICAgICAgIGJhdGNoT2JqLml0ZW0ubGFzdEhlaWdodCA9IGxvb2t1cEhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuYWRkUmVzaXplU2Vuc29yKGJhdGNoT2JqLml0ZW0sIGJhdGNoT2JqLmluZGV4KTtcbiAgICAgICAgICAgIGlmIChvbGRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKG9sZEhlaWdodCwgbG9va3VwSGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlRXN0aW1hdGVkSGVpZ2h0KGxvb2t1cEhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhlaWdodENvdW50ICs9IGxvb2t1cEhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGhlaWdodENvdW50ID4gdGhpcy5jb250YWluZXJIZWlnaHQhKSB7XG4gICAgICAgICAgICAgIHRoaXMucHJlSXRlbU92ZXJmbG93Q291bnQrKztcbiAgICAgICAgICAgICAgaWYgKHRoaXMucHJlSXRlbU92ZXJmbG93Q291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IGJhdGNoT2JqLmluZGV4O1xuICAgICAgICAgICAgICAgIGluZGV4ID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVPdmVyZmxvd0hlaWdodCArPSBsb29rdXBIZWlnaHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXggPSBiYXRjaE9iai5pbmRleDtcbiAgICAgICAgICAgICAgdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXggPSBiYXRjaE9iai5pbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cbiAgICAgICAgICBiYXRjaFNpemUgPSB0aGlzLmdldEVzdGltYXRlZENoaWxkSW5zZXJ0aW9ucyh0aGlzLmNvbnRhaW5lckhlaWdodCEgLSB0aGlzLmxhc3RIZWlnaHQpICsgTnVtYmVyKHRoaXMucHJlSXRlbU92ZXJmbG93KTtcbiAgICAgICAgICBpZiAoYmF0Y2hTaXplIDw9IDApIHtcbiAgICAgICAgICAgIGJhdGNoU2l6ZSA9IE51bWJlcih0aGlzLnByZUl0ZW1PdmVyZmxvdyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGl0ZW1zVG9CYXRjaCA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJlSXRlbU92ZXJmbG93Q291bnQgPj0gdGhpcy5wcmVJdGVtT3ZlcmZsb3cpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdmVyZmxvdztcbiAgfVxuXG4gIHB1YmxpYyBzY3JvbGxUb0V4YWN0KGluZGV4OiBudW1iZXIsIG92ZXJmbG93OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLml0ZW1zIHx8IHRoaXMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldExhc3RIZWlnaHQoKTtcbiAgICBpbmRleCA9IHRoaXMubWFpbnRhaW5JbmRleEluQm91bmRzKGluZGV4KTtcbiAgICBvdmVyZmxvdyA9IGluZGV4ID09PSAwICYmIG92ZXJmbG93IDwgMCA/IDAgOiBvdmVyZmxvdztcblxuICAgIHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ID0gaW5kZXggLSBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpIDw9IDAgPyAwIDogaW5kZXggLSBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuXG4gICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA9IC0xO1xuICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50ID0gLTE7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA9IDA7XG5cbiAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gMDtcbiAgICB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXggPSAwO1xuXG4gICAgdGhpcy5yZW1vdmVQcmVTY3JvbGxJdGVtcyh0aGlzLmxhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghLCBNYXRoLm1pbih0aGlzLmFkanVzdGVkU3RhcnRJbmRleCwgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEpKTtcblxuICAgIHRoaXMuYWRkU2Nyb2xsSXRlbXMoaW5kZXgsIG92ZXJmbG93KTtcblxuICAgIHRoaXMucmVtb3ZlUG9zdFNjcm9sbEl0ZW1zKHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkRW5kSW5kZXghIC0gMSwgTWF0aC5tYXgodGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ISwgdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4KSk7XG5cbiAgICBpZiAoIXRoaXMuZm9yY2VkRW5kSW5kZXgpIHtcbiAgICAgIG92ZXJmbG93ID0gdGhpcy5hZGRNaXNzaW5nUG9zdFNjcm9sbEl0ZW1zQW5kVXBkYXRlT3ZlcmZsb3coaW5kZXgsIG92ZXJmbG93KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldExhc3RSYW5nZVRvQ3VycmVudFJhbmdlKCk7XG5cbiAgICB0aGlzLnNldFNjcm9sbFNwYWNlcnMoKTtcblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgKyBvdmVyZmxvdyArIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodDtcbiAgICB0aGlzLmxpc3RDb250ZW50IS5zY3JvbGxUb3AgPSB0aGlzLmxhc3RTY3JvbGxUb3A7XG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5sYXN0U2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPSBvdmVyZmxvdztcbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoUmFuZ2VVcGRhdGVFdmVudHModGhpcy5yYW5nZVVwZGF0ZWQsIHRoaXMucmFuZ2UsIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblxuICAgIHRoaXMudmlld3BvcnRIYXNTY3JvbGxlZCA9IHRydWU7XG5cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmFuZ2VDaGFuZ2Uoc2Nyb2xsQ2hhbmdlOiBudW1iZXIpIHtcbiAgICBsZXQgaGVpZ2h0Q291bnQgPSAwO1xuICAgIGxldCByYW5nZVN0YXJ0Q291bnQgPSAwO1xuICAgIGxldCBvdmVyZmxvdyA9IDA7XG4gICAgY29uc3QgbmV3UmFuZ2U6IFJhbmdlID0geyBzdGFydEluZGV4OiBudWxsLCBlbmRJbmRleDogbnVsbCwgZXh0ZW5kZWRTdGFydEluZGV4OiBudWxsLCBleHRlbmRlZEVuZEluZGV4OiBudWxsIH07XG4gICAgbGV0IGl0ZW1OYW1lO1xuXG4gICAgaWYgKHNjcm9sbENoYW5nZSA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXg7IGkhIDw9IHRoaXMucmFuZ2UuZW5kSW5kZXghICsgTnVtYmVyKHRoaXMuaXRlbUxvYWRMaW1pdCk7IGkhKyspIHtcbiAgICAgICAgb3ZlcmZsb3cgPSBzY3JvbGxDaGFuZ2UgLSBoZWlnaHRDb3VudDtcbiAgICAgICAgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdKSB7XG4gICAgICAgICAgaGVpZ2h0Q291bnQgKz0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuYXZnSXRlbUhlaWdodCE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVpZ2h0Q291bnQgPj0gc2Nyb2xsQ2hhbmdlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByYW5nZVN0YXJ0Q291bnQrKztcbiAgICAgIH1cblxuICAgICAgbmV3UmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgKyByYW5nZVN0YXJ0Q291bnQ7XG4gICAgICBuZXdSYW5nZS5lbmRJbmRleCA9IHJhbmdlU3RhcnRDb3VudCA8IHRoaXMucmFuZ2UuZW5kSW5kZXghIC0gdGhpcy5yYW5nZS5zdGFydEluZGV4ISA/IHRoaXMucmFuZ2UuZW5kSW5kZXggOiBuZXdSYW5nZS5zdGFydEluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsQ2hhbmdlIDwgMCkge1xuICAgICAgcmFuZ2VTdGFydENvdW50ID0gLTE7XG4gICAgICBvdmVyZmxvdyA9IHNjcm9sbENoYW5nZTtcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdKSB7XG4gICAgICAgICAgb3ZlcmZsb3cgKz0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdmVyZmxvdyArPSB0aGlzLmF2Z0l0ZW1IZWlnaHQhO1xuICAgICAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuYXZnSXRlbUhlaWdodCE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3ZlcmZsb3cgPj0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmFuZ2VTdGFydENvdW50LS07XG4gICAgICB9XG5cbiAgICAgIG5ld1JhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghICsgcmFuZ2VTdGFydENvdW50ID49IDAgPyB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghICsgcmFuZ2VTdGFydENvdW50IDogMDtcbiAgICAgIG5ld1JhbmdlLmVuZEluZGV4ID0gcmFuZ2VTdGFydENvdW50IDwgdGhpcy5yYW5nZS5lbmRJbmRleCEgLSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghID8gdGhpcy5yYW5nZS5lbmRJbmRleCA6IG5ld1JhbmdlLnN0YXJ0SW5kZXggKyAxO1xuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtID0gb3ZlcmZsb3c7XG5cbiAgICByZXR1cm4gbmV3UmFuZ2U7XG4gIH1cblxuICBwdWJsaWMgcmVmcmVzaFZpZXdwb3J0KHJlY2FsY3VsYXRlUm93czogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHJlY2FsY3VsYXRlUm93cykge1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ITsgaSA8IHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCE7IGkrKykge1xuICAgICAgICB0aGlzLnJlY2FsY3VsYXRlUm93SGVpZ2h0KGkpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4ISwgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0pO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVNjcm9sbEZyb21SYW5nZShuZXdSYW5nZTogUmFuZ2UpOiB2b2lkIHtcbiAgICBpZiAobmV3UmFuZ2Uuc3RhcnRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmFuZ2Uuc3RhcnRJbmRleCAhPT0gbmV3UmFuZ2Uuc3RhcnRJbmRleCB8fCB0aGlzLmxhc3RWaXNpYmxlSXRlbU92ZXJmbG93IDwgMCkge1xuICAgICAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSBuZXdSYW5nZS5zdGFydEluZGV4O1xuICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gbmV3UmFuZ2UuZW5kSW5kZXg7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVmlld3BvcnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRoaXMuY3VycmVudFNjcm9sbFRvcDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5jdXJyZW50U2Nyb2xsVG9wO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0U2Nyb2xsKG9wdGlvbnM6IElTY3JvbGxPcHRpb25zKSB7XG4gICAgdGhpcy5pdGVtcyA9IG9wdGlvbnMuaXRlbXM7XG4gICAgdGhpcy5fY2xvbmVNZXRob2QgPSBvcHRpb25zLmdlbmVyYXRlQ2xvbmVNZXRob2Q7XG4gICAgY29uc3QgaXRlbXNBcmVFbXB0eTogYm9vbGVhbiA9IHRoaXMuaXRlbXMubGVuZ3RoID09PSAwO1xuICAgIGxldCBpbmRleCA9IG9wdGlvbnMuaW5pdGlhbEluZGV4ID8gb3B0aW9ucy5pbml0aWFsSW5kZXggOiAwO1xuXG4gICAgaWYgKHRoaXMudmlydHVhbE5leHVzICYmIHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RlbXBsYXRlKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SUQpO1xuICAgICAgdGhpcy50aW1lb3V0SUQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jbG9uZUZyb21UZW1wbGF0ZVJlZiA9IHRydWU7XG4gICAgICAgIHRoaXMudmVyaWZ5Vmlld3BvcnRJc1JlYWR5KCk7XG4gICAgICAgIHRoaXMuaW5pdEZpcnN0U2Nyb2xsKGluZGV4KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlEISk7XG4gICAgICB0aGlzLnZlcmlmeVZpZXdwb3J0SXNSZWFkeSgpO1xuICAgICAgdGhpcy5pbml0Rmlyc3RTY3JvbGwoaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmVyaWZ5Vmlld3BvcnRJc1JlYWR5KCkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQgPT09ICcnICYmICF0aGlzLnRlbXBsYXRlSXNTZXQoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Njcm9sbCB2aWV3cG9ydCB0ZW1wbGF0ZSBJRCBpcyBub3Qgc2V0LicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXRlbXNBcmVTZXQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY3JvbGwgdmlld3BvcnQgcmVxdWlyZXMgYW4gYXJyYXkgb2YgaXRlbXMuICBQbGVhc2Ugc3VwcGx5IGFuIGl0ZW1zIGFycmF5LicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY2xvbmVNZXRob2RJc1NldCgpICYmICF0aGlzLnRlbXBsYXRlSXNTZXQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY3JvbGwgdmlld3BvcnQgcmVxdWlyZXMgYSBjbG9uaW5nIG1ldGhvZCBvciBhIHRlbXBsYXRlLiAgUGxlYXNlIHN1cHBseSBhIG1ldGhvZCBhcyBmb2xsb3dzOlxcblxcbiAodGVtcGxhdGU6IEhUTUxFbGVtZW50LCBpdGVtczogYW55W10sIGluZGV4OiBudW1iZXIpID0+IE5vZGVcXG5cXG4gb3Igc3VwcGx5IGEgdGFibGVqc1ZpcnR1YWxGb3InKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRGaXJzdFNjcm9sbChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbXNBcmVFbXB0eTogYm9vbGVhbiA9IHRoaXMuaXRlbXMhLmxlbmd0aCA9PT0gMDtcbiAgICB0aGlzLnJlZnJlc2hDb250YWluZXJIZWlnaHQoKTtcbiAgICBpZiAoaXRlbXNBcmVFbXB0eSkge1xuICAgICAgdGhpcy5pdGVtcyEucHVzaCh0aGlzLnBsYWNlaG9sZGVyT2JqZWN0KTtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdChpbmRleCwgMCk7XG4gICAgICBjb25zdCBub2RlOiBIVE1MRWxlbWVudCA9ICh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5nZXQoMSkgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXTtcbiAgICAgIHRoaXMucmVuZGVyZXIhLnNldFN0eWxlKG5vZGUsICdoZWlnaHQnLCAnMHB4Jyk7XG4gICAgICB0aGlzLnJlbmRlcmVyIS5zZXRTdHlsZShub2RlLCAnbWluSGVpZ2h0JywgJzBweCcpO1xuICAgICAgdGhpcy5yZW5kZXJlciEuc2V0U3R5bGUobm9kZSwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjcm9sbFRvRXhhY3QoaW5kZXgsIDApO1xuICAgIH1cbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoVmlld3BvcnRJbml0aWFsaXplZEV2ZW50cyh0aGlzLnZpZXdwb3J0SW5pdGlhbGl6ZWQsIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgaXRlbXNBcmVTZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5pdGVtcztcbiAgfVxuICBwcml2YXRlIGNsb25lTWV0aG9kSXNTZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2xvbmVNZXRob2Q7XG4gIH1cbiAgcHJpdmF0ZSB0ZW1wbGF0ZUlzU2V0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGVtcGxhdGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGVtcGxhdGUgIT09IG51bGw7XG4gIH1cblxufVxuIl19