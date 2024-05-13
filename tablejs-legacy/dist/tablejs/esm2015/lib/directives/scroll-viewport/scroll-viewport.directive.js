import { Directive, ChangeDetectorRef, ContentChild, ElementRef, EventEmitter, Inject, Input, Output, RendererFactory2, ComponentFactoryResolver } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GridService } from './../../services/grid/grid.service';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { ScrollDispatcherService } from './../../services/scroll-dispatcher/scroll-dispatcher.service';
import { TablejsForOfContext } from './../../directives/virtual-for/virtual-for.directive';
import { OperatingSystemService } from './../../services/operating-system/operating-system.service';
import { ScrollPrevSpacerComponent } from '../../components/scroll-prev-spacer/scroll-prev-spacer.component';
import { take } from 'rxjs/operators';
export class ScrollViewportDirective {
    constructor(elementRef, gridService, document, directiveRegistrationService, scrollDispatcherService, operatingSystem, componentFactoryResolver, cdr, rendererFactory) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.document = document;
        this.directiveRegistrationService = directiveRegistrationService;
        this.scrollDispatcherService = scrollDispatcherService;
        this.operatingSystem = operatingSystem;
        this.componentFactoryResolver = componentFactoryResolver;
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
        const compFactory = this.componentFactoryResolver.resolveComponentFactory(ScrollPrevSpacerComponent);
        const componentRef = this.virtualNexus.virtualForDirective._viewContainer.createComponent(compFactory, null, this.virtualNexus.virtualForDirective._viewContainer.injector);
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
        this.listContent.addEventListener('scroll', (e) => {
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
        this.elementRef.nativeElement.removeEventListener('mouseenter', this.handleMouseOver);
        this.elementRef.nativeElement.removeEventListener('mouseleave', this.handleMouseOut);
        document.removeEventListener('keydown', this.handleKeyDown);
        if (this.virtualForChangesSubscription$) {
            this.virtualForChangesSubscription$.unsubscribe();
        }
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
            setTimeout(() => {
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
ScrollViewportDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]',
                host: { style: 'contain: content;' }
            },] }
];
ScrollViewportDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: DirectiveRegistrationService },
    { type: ScrollDispatcherService },
    { type: OperatingSystemService },
    { type: ComponentFactoryResolver },
    { type: ChangeDetectorRef },
    { type: RendererFactory2 }
];
ScrollViewportDirective.propDecorators = {
    templateRef: [{ type: ContentChild, args: ['templateRef', { static: true },] }],
    templateID: [{ type: Input }],
    generateCloneMethod: [{ type: Input }],
    arrowUpSpeed: [{ type: Input }],
    arrowDownSpeed: [{ type: Input }],
    preItemOverflow: [{ type: Input }],
    postItemOverflow: [{ type: Input }],
    itemLoadLimit: [{ type: Input }],
    templateid: [{ type: Input }],
    preitemoverflow: [{ type: Input }],
    postitemoverflow: [{ type: Input }],
    arrowupspeed: [{ type: Input }],
    arrowdownspeed: [{ type: Input }],
    itemloadlimit: [{ type: Input }],
    fillViewportScrolling: [{ type: Input }],
    itemAdded: [{ type: Output }],
    itemRemoved: [{ type: Output }],
    itemUpdated: [{ type: Output }],
    rangeUpdated: [{ type: Output }],
    viewportScrolled: [{ type: Output }],
    viewportReady: [{ type: Output }],
    viewportInitialized: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXZpZXdwb3J0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9kaXJlY3RpdmVzL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFDaEUsVUFBVSxFQUFtQixZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQThDLGdCQUFnQixFQUFFLHdCQUF3QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pMLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDakUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sd0VBQXdFLENBQUM7QUFHdEgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOERBQThELENBQUM7QUFFdkcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFFM0YsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDcEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFFN0csT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBTXRDLE1BQU0sT0FBTyx1QkFBdUI7SUFvSGxDLFlBQ1MsVUFBc0IsRUFDdEIsV0FBd0IsRUFDTCxRQUFhLEVBQy9CLDRCQUEwRCxFQUMxRCx1QkFBZ0QsRUFDaEQsZUFBdUMsRUFDdkMsd0JBQWtELEVBQ2xELEdBQTZCLEVBQzdCLGVBQWlDO1FBUmxDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDTCxhQUFRLEdB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Q0FBQztJQUN0QixDQUFDO0lBQ08sZ0JBQWdCO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUNPLGFBQWE7UUFDbkIsT0FBTyxJQUFJLENBQUMsWUFBYSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFlBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDO0lBQ3JJLENBQUM7OztZQXpyQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2RUFBNkU7Z0JBQ3ZGLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBQzthQUNwQzs7O1lBbEJDLFVBQVU7WUFFSCxXQUFXOzRDQXdJZixNQUFNLFNBQUMsUUFBUTtZQXZJWCw0QkFBNEI7WUFHNUIsdUJBQXVCO1lBSXZCLHNCQUFzQjtZQVYyRyx3QkFBd0I7WUFEL0gsaUJBQWlCO1lBQ29FLGdCQUFnQjs7OzBCQXFCckksWUFBWSxTQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7eUJBRTVDLEtBQUs7a0NBQ0wsS0FBSzsyQkFLTCxLQUFLOzZCQVFMLEtBQUs7OEJBUUwsS0FBSzsrQkFRTCxLQUFLOzRCQVFMLEtBQUs7eUJBT0wsS0FBSzs4QkFDTCxLQUFLOytCQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7b0NBQ0wsS0FBSzt3QkFFTCxNQUFNOzBCQUNOLE1BQU07MEJBQ04sTUFBTTsyQkFDTixNQUFNOytCQUNOLE1BQU07NEJBQ04sTUFBTTtrQ0FDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLCBFbWJlZGRlZFZpZXdSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3UmVmLCBPbkRlc3Ryb3ksIFJlbmRlcmVyMiwgUmVuZGVyZXJGYWN0b3J5MiwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9ncmlkL2dyaWQuc2VydmljZSc7XG5pbXBvcnQgeyBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBSYW5nZSB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2NsYXNzZXMvc2Nyb2xsaW5nL3JhbmdlJztcbmltcG9ydCB7IElTY3JvbGxPcHRpb25zIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9zY3JvbGxpbmcvaS1zY3JvbGwtb3B0aW9ucyc7XG5pbXBvcnQgeyBTY3JvbGxEaXNwYXRjaGVyU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvc2Nyb2xsLWRpc3BhdGNoZXIvc2Nyb2xsLWRpc3BhdGNoZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHcmlkRGlyZWN0aXZlIH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL2dyaWQvZ3JpZC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVGFibGVqc0Zvck9mQ29udGV4dCB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy92aXJ0dWFsLWZvci92aXJ0dWFsLWZvci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSVZpcnR1YWxOZXh1cyB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvaS12aXJ0dWFsLW5leHVzJztcbmltcG9ydCB7IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL29wZXJhdGluZy1zeXN0ZW0vb3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL3Njcm9sbC1wcmV2LXNwYWNlci9zY3JvbGwtcHJldi1zcGFjZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNTY3JvbGxWaWV3cG9ydF0sIFt0YWJsZWpzc2Nyb2xsdmlld3BvcnRdLCBbdGFibGVqcy1zY3JvbGwtdmlld3BvcnRdJyxcbiAgaG9zdDogeyBzdHlsZTogJ2NvbnRhaW46IGNvbnRlbnQ7J31cbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cbiAgQENvbnRlbnRDaGlsZCgndGVtcGxhdGVSZWYnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKSB0ZW1wbGF0ZUlEOiBzdHJpbmcgfCBudWxsID0gJyc7XG4gIEBJbnB1dCgpIGdlbmVyYXRlQ2xvbmVNZXRob2Q6ICgodGVtcGxhdGU6IEhUTUxFbGVtZW50LCBpdGVtczogYW55W10sIGluZGV4OiBudW1iZXIpID0+IE5vZGUpIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2Fycm93VXBTcGVlZDogc3RyaW5nIHwgbnVtYmVyID0gMTtcbiAgZ2V0IGFycm93VXBTcGVlZCgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLl9hcnJvd1VwU3BlZWQpO1xuICB9XG4gIEBJbnB1dCgpIHNldCBhcnJvd1VwU3BlZWQodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgdGhpcy5fYXJyb3dVcFNwZWVkID0gTnVtYmVyKHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fycm93RG93blNwZWVkOiBzdHJpbmcgfCBudW1iZXIgPSAxO1xuICBnZXQgYXJyb3dEb3duU3BlZWQoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy5fYXJyb3dEb3duU3BlZWQpO1xuICB9XG4gIEBJbnB1dCgpIHNldCBhcnJvd0Rvd25TcGVlZCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICB0aGlzLl9hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9wcmVJdGVtT3ZlcmZsb3c6IHN0cmluZyB8IG51bWJlciA9IDE7XG4gIGdldCBwcmVJdGVtT3ZlcmZsb3coKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy5fcHJlSXRlbU92ZXJmbG93KTtcbiAgfVxuICBASW5wdXQoKSBzZXQgcHJlSXRlbU92ZXJmbG93KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIHRoaXMuX3ByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9wb3N0SXRlbU92ZXJmbG93OiBzdHJpbmcgfCBudW1iZXIgPSAxO1xuICBnZXQgcG9zdEl0ZW1PdmVyZmxvdygpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLl9wb3N0SXRlbU92ZXJmbG93KTtcbiAgfVxuICBASW5wdXQoKSBzZXQgcG9zdEl0ZW1PdmVyZmxvdyh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICB0aGlzLl9wb3N0SXRlbU92ZXJmbG93ID0gTnVtYmVyKHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2l0ZW1Mb2FkTGltaXQ6IHN0cmluZyB8IG51bWJlciA9IEluZmluaXR5O1xuICBnZXQgaXRlbUxvYWRMaW1pdCgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLl9pdGVtTG9hZExpbWl0KTtcbiAgfVxuICBASW5wdXQoKSBzZXQgaXRlbUxvYWRMaW1pdCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICB0aGlzLl9pdGVtTG9hZExpbWl0ID0gTnVtYmVyKHZhbHVlKTtcbiAgfVxuXG4gIGl0ZW1zOiBhbnlbXSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIEN1c3RvbSBFbGVtZW50cyBJbnB1dHNcbiAgQElucHV0KCkgdGVtcGxhdGVpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHByZWl0ZW1vdmVyZmxvdzogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgcG9zdGl0ZW1vdmVyZmxvdzogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgYXJyb3d1cHNwZWVkOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBhcnJvd2Rvd25zcGVlZDogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgaXRlbWxvYWRsaW1pdDogbnVtYmVyID0gSW5maW5pdHk7XG4gIEBJbnB1dCgpIGZpbGxWaWV3cG9ydFNjcm9sbGluZzogYW55O1xuXG4gIEBPdXRwdXQoKSBpdGVtQWRkZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBpdGVtUmVtb3ZlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGl0ZW1VcGRhdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcmFuZ2VVcGRhdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgdmlld3BvcnRTY3JvbGxlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHZpZXdwb3J0UmVhZHk6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSB2aWV3cG9ydEluaXRpYWxpemVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgY29udGFpbmVySGVpZ2h0OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoZWlnaHRMb29rdXA6IGFueSA9IHt9O1xuICBwcml2YXRlIGl0ZW1WaXNpYmlsaXR5TG9va3VwOiBhbnkgPSB7fTtcbiAgcHVibGljIGxpc3RFbG06IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBsaXN0Q29udGVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHByZXZTcGFjZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBwb3N0U3BhY2VyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgZ3JpZERpcmVjdGl2ZTogR3JpZERpcmVjdGl2ZSB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgdmlydHVhbEZvckNoYW5nZXNTdWJzY3JpcHRpb24kOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBwYXVzZVZpZXdwb3J0UmVuZGVyVXBkYXRlczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyByYW5nZTogUmFuZ2UgPSB7IHN0YXJ0SW5kZXg6IDAsIGVuZEluZGV4OiAxLCBleHRlbmRlZFN0YXJ0SW5kZXg6IDAsIGV4dGVuZGVkRW5kSW5kZXg6IDEgfTtcbiAgcHVibGljIGxhc3RSYW5nZTogUmFuZ2UgPSB7IHN0YXJ0SW5kZXg6IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCwgZW5kSW5kZXg6IHRoaXMucmFuZ2UuZW5kSW5kZXgsIGV4dGVuZGVkU3RhcnRJbmRleDogdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXgsIGV4dGVuZGVkRW5kSW5kZXg6IHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCB9O1xuICBwdWJsaWMgbGFzdFNjcm9sbFRvcDogbnVtYmVyID0gMDtcbiAgcHVibGljIGN1cnJlbnRTY3JvbGxUb3A6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBjdXJyZW50U2Nyb2xsQ2hhbmdlOiBudW1iZXIgPSAwO1xuICBwdWJsaWMgdGVtcGxhdGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZXN0aW1hdGVkRnVsbENvbnRlbnRIZWlnaHQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgZXN0aW1hdGVkUHJlTGlzdEhlaWdodDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBlc3RpbWF0ZWRQb3N0TGlzdEhlaWdodDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSB0b3RhbEl0ZW1zQ291bnRlZDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSB0b3RhbEhlaWdodENvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGl0ZW1OYW1lOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBhdmdJdGVtSGVpZ2h0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgb3ZlcmZsb3dIZWlnaHRDb3VudDogbnVtYmVyID0gMDtcbiAgcHVibGljIHNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBsYXN0VmlzaWJsZUl0ZW1IZWlnaHQ6IG51bWJlciA9IEluZmluaXR5O1xuICBwcml2YXRlIGFkanVzdGVkU3RhcnRJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZm9yY2VkRW5kSW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBwbGFjZWhvbGRlck9iamVjdDogYW55ID0ge307XG5cbiAgcHJpdmF0ZSBwb3N0SXRlbU92ZXJmbG93Q291bnQ6IG51bWJlciA9IC0xO1xuICBwcml2YXRlIHByZUl0ZW1PdmVyZmxvd0NvdW50OiBudW1iZXIgPSAtMTtcbiAgcHJpdmF0ZSBsYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdzogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBwcmVPdmVyZmxvd0hlaWdodDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBtb3VzZUlzT3ZlclZpZXdwb3J0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgbGFzdEhlaWdodDogbnVtYmVyID0gMDtcblxuICBwcml2YXRlIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlTW91c2VPdmVyOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZU1vdXNlT3V0OiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZUtleURvd246ICgoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBjbG9uZUZyb21UZW1wbGF0ZVJlZjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHZpZXdwb3J0SGFzU2Nyb2xsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZUNvbnRleHQ6IFRhYmxlanNGb3JPZkNvbnRleHQ8YW55LCBhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgcHVibGljIHZpcnR1YWxOZXh1czogSVZpcnR1YWxOZXh1cyB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2Nsb25lTWV0aG9kOiAoKHRlbXBsYXRlOiBIVE1MRWxlbWVudCwgaXRlbXM6IGFueVtdLCBpbmRleDogbnVtYmVyKSA9PiBOb2RlKSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBkaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlOiBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2U6IFNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgb3BlcmF0aW5nU3lzdGVtOiBPcGVyYXRpbmdTeXN0ZW1TZXJ2aWNlLFxuICAgIHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmIHwgbnVsbCxcbiAgICBwcml2YXRlIHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5MlxuICApIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5yZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVNjcm9sbChlOiBFdmVudCkge1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5jdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5saXN0Q29udGVudCEuc2Nyb2xsVG9wO1xuICAgIHRoaXMuY3VycmVudFNjcm9sbENoYW5nZSA9IHRoaXMuY3VycmVudFNjcm9sbFRvcCAtIHRoaXMubGFzdFNjcm9sbFRvcDtcbiAgICB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSArPSB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2U7XG4gICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyAtPSB0aGlzLmN1cnJlbnRTY3JvbGxDaGFuZ2U7XG5cbiAgICBjb25zdCBuZXdSYW5nZSA9IHRoaXMuZ2V0UmFuZ2VDaGFuZ2UodGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0pO1xuICAgIHRoaXMudXBkYXRlU2Nyb2xsRnJvbVJhbmdlKG5ld1JhbmdlKTtcblxuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hWaWV3cG9ydFNjcm9sbGVkRXZlbnRzKHRoaXMudmlld3BvcnRTY3JvbGxlZCwgdGhpcy5sYXN0U2Nyb2xsVG9wLCB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyVmlld3BvcnRUb0VsZW1lbnQoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVmlld3BvcnQgPSB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hNdXRhdGlvbk9ic2VydmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IHRoczogYW55ID0gdGhpcztcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgICB0aHMudXBkYXRlTXV0YXRpb25zKG11dGF0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMubGlzdENvbnRlbnQhLCB7XG4gICAgICAvLyBjb25maWd1cmUgaXQgdG8gbGlzdGVuIHRvIGF0dHJpYnV0ZSBjaGFuZ2VzXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNdXRhdGlvbnMobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKTogdm9pZCB7XG4gICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICBjb25zdCBhZGRlZE5vZGVzID0gQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzKTtcbiAgICAgIGFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyTm9kZUF0dHJpYnV0ZXMobm9kZSk7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGROb2Rlcyhub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2hpbGROb2Rlcyhub2RlOiBOb2RlKSB7XG4gICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgIHRoaXMuZGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZS5yZWdpc3Rlck5vZGVBdHRyaWJ1dGVzKGNoaWxkTm9kZSk7XG4gICAgICBpZiAoY2hpbGROb2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZE5vZGVzKGNoaWxkTm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJDdXN0b21FbGVtZW50c0lucHV0cyh2aWV3cG9ydDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnRlbXBsYXRlSUQgPSB2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ3RlbXBsYXRlSUQnKTtcbiAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ3ByZUl0ZW1PdmVyZmxvdycpKTtcbiAgICB0aGlzLnBvc3RJdGVtT3ZlcmZsb3cgPSBOdW1iZXIodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdwb3N0SXRlbU92ZXJmbG93JykpO1xuICAgIHRoaXMuaXRlbUxvYWRMaW1pdCA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2l0ZW1Mb2FkTGltaXQnKSk7XG4gICAgdGhpcy5hcnJvd1VwU3BlZWQgPSBOdW1iZXIodmlld3BvcnQuZ2V0QXR0cmlidXRlKCdhcnJvd1VwU3BlZWQnKSk7XG4gICAgdGhpcy5hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih2aWV3cG9ydC5nZXRBdHRyaWJ1dGUoJ2Fycm93RG93blNwZWVkJykpO1xuICAgIHRoaXMuZmlsbFZpZXdwb3J0U2Nyb2xsaW5nID0gdmlld3BvcnQuZ2V0QXR0cmlidXRlKCdmaWxsVmlld3BvcnRTY3JvbGxpbmcnKTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEN1c3RvbUVsZW1lbnRzVmFyaWFibGVzKCkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlaWQpIHtcbiAgICAgIHRoaXMudGVtcGxhdGVJRCA9IHRoaXMudGVtcGxhdGVpZDtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJlaXRlbW92ZXJmbG93KSB7XG4gICAgICB0aGlzLnByZUl0ZW1PdmVyZmxvdyA9IE51bWJlcih0aGlzLnByZWl0ZW1vdmVyZmxvdyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RpdGVtb3ZlcmZsb3cpIHtcbiAgICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvdyA9IE51bWJlcih0aGlzLnBvc3RpdGVtb3ZlcmZsb3cpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hcnJvd2Rvd25zcGVlZCkge1xuICAgICAgdGhpcy5hcnJvd0Rvd25TcGVlZCA9IE51bWJlcih0aGlzLmFycm93ZG93bnNwZWVkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXJyb3d1cHNwZWVkKSB7XG4gICAgICB0aGlzLmFycm93VXBTcGVlZCA9IE51bWJlcih0aGlzLmFycm93dXBzcGVlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLml0ZW1sb2FkbGltaXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaXRlbUxvYWRMaW1pdCA9IE51bWJlcih0aGlzLml0ZW1sb2FkbGltaXQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVEJvZGllcygpIHtcbiAgICB0aGlzLmxpc3RFbG0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgYm9keTogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5saXN0RWxtIS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXTtcbiAgICBpZiAoYm9keSkge1xuICAgICAgYm9keSA9IGJvZHkuZ2V0QXR0cmlidXRlKCd0YWJsZWpzVmlld3BvcnQnKSAhPT0gbnVsbCA/IGJvZHkgOiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMubGlzdENvbnRlbnQgPSBib2R5ID8gYm9keSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XG4gICAgdGhpcy5saXN0Q29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmxlanNMaXN0Q29udGVudCcsICcnKTtcbiAgICB0aGlzLmxpc3RDb250ZW50LnNldEF0dHJpYnV0ZSgndGFibGVqc1ZpZXdwb3J0JywgJycpO1xuICAgIHRoaXMubGlzdENvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5saXN0Q29udGVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy5saXN0Q29udGVudC5zdHlsZS5oZWlnaHQgPSAnMzUwcHgnO1xuICAgIHRoaXMubGlzdENvbnRlbnQuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICAgIHRoaXMubGlzdEVsbSEuYXBwZW5kQ2hpbGQodGhpcy5saXN0Q29udGVudCk7XG5cbiAgICBpZiAodGhpcy5maWxsVmlld3BvcnRTY3JvbGxpbmcgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZpbGxWaWV3cG9ydFNjcm9sbGluZyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY292ZXJCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcbiAgICAgIGNvdmVyQm9keS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIGNvdmVyQm9keS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgY292ZXJCb2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xuICAgICAgY292ZXJCb2R5LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICBjb3ZlckJvZHkuc3R5bGUudmlzaWJpbGl0eSA9ICdmYWxzZSc7XG4gICAgICB0aGlzLmxpc3RFbG0hLmFwcGVuZENoaWxkKGNvdmVyQm9keSk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyVmlld3BvcnRPbkdyaWREaXJlY3RpdmUodGhpcy5saXN0Q29udGVudCk7XG5cbiAgICBjb25zdCBjb21wRmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFNjcm9sbFByZXZTcGFjZXJDb21wb25lbnQpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudDxTY3JvbGxQcmV2U3BhY2VyQ29tcG9uZW50Pihjb21wRmFjdG9yeSwgbnVsbCwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuaW5qZWN0b3IpO1xuICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmRldGFjaCgwKTtcbiAgICBjb25zdCByZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbXBvbmVudFJlZi5pbnN0YW5jZS50ZW1wbGF0ZSwgdW5kZWZpbmVkLCAwKTtcbiAgICB0aGlzLnByZXZTcGFjZXIgPSByZWYucm9vdE5vZGVzWzBdO1xuXG4gICAgdGhpcy5wb3N0U3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICB0aGlzLnBvc3RTcGFjZXIuc2V0QXR0cmlidXRlKCd0YWJsZWpzUG9zdFNwYWNlcicsICcnKTtcbiAgICB0aGlzLnBvc3RTcGFjZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5wb3N0U3BhY2VyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB0aGlzLmxpc3RDb250ZW50LmFwcGVuZENoaWxkKHRoaXMucG9zdFNwYWNlcik7XG4gIH1cblxuICBwcml2YXRlIGFkZFNjcm9sbEhhbmRsZXIoKTogdm9pZCB7XG4gICAgdGhpcy5saXN0Q29udGVudCEuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKGUpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlU2Nyb2xsKGUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlcmVuZGVyUm93QXQoaW5kZXg6IG51bWJlciwgdXBkYXRlU2Nyb2xsUG9zaXRpb246IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy52aWV3cG9ydEhhc1Njcm9sbGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluZCA9IGluZGV4IC0gdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXghO1xuICAgIGNvbnN0IGl0ZW1OYW1lOiBzdHJpbmcgPSAnaXRlbScgKyBpbmRleDtcblxuICAgIGlmIChpbmQgPiB0aGlzLml0ZW1zIS5sZW5ndGggLSAxIHx8IHRoaXMuaXRlbVZpc2liaWxpdHlMb29rdXBbdGhpcy5pdGVtTmFtZV0gIT09IHRydWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleE1hcDogYW55ID0ge307XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5sZW5ndGg7IGkrKykge1xuICAgICAgaW5kZXhNYXBbKHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdLmluZGV4XSA9IGk7XG4gICAgfTtcbiAgICBjb25zdCBkZXRhY2hlZFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5kZXRhY2goaW5kZXhNYXBbaW5kZXhdKTtcbiAgICBjb25zdCBjaGlsZDogSFRNTEVsZW1lbnQgPSAoZGV0YWNoZWRSZWYgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXTtcbiAgICBkZXRhY2hlZFJlZiEuZGVzdHJveSgpO1xuICAgIFxuICAgIHRoaXMudGVtcGxhdGVDb250ZXh0ID0gbmV3IFRhYmxlanNGb3JPZkNvbnRleHQ8YW55LCBhbnk+KHRoaXMuaXRlbXMhW2luZGV4XSwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RhYmxlanNGb3JPZiwgaW5kZXgsIHRoaXMuaXRlbXMhLmxlbmd0aCk7XG4gICAgY29uc3QgcmVmOiBFbWJlZGRlZFZpZXdSZWY8YW55PiA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGVtcGxhdGUsIHRoaXMudGVtcGxhdGVDb250ZXh0LCBpbmRleE1hcFtpbmRleF0pO1xuICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLm1vdmUocmVmLCBpbmRleE1hcFtpbmRleF0pO1xuICAgIGxldCBjbG9uZTogYW55ID0gcmVmLnJvb3ROb2Rlc1swXTtcbiAgICBjbG9uZS5pbmRleCA9IGluZGV4O1xuICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoUmVtb3ZlSXRlbUV2ZW50cyh0aGlzLml0ZW1SZW1vdmVkLCBjaGlsZCwgaW5kZXgsIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblxuICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gY2xvbmUub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IG9sZEhlaWdodDogbnVtYmVyID0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgIHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXSA9IGxvb2t1cEhlaWdodDtcblxuICAgIGNsb25lLmxhc3RIZWlnaHQgPSBsb29rdXBIZWlnaHQ7XG5cbiAgICB0aGlzLmFkZFJlc2l6ZVNlbnNvcihjbG9uZSwgaW5kZXgpO1xuXG4gICAgaWYgKG9sZEhlaWdodCkge1xuICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHRGcm9tUmVzaXplKG9sZEhlaWdodCwgbG9va3VwSGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHQobG9va3VwSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlU2Nyb2xsUG9zaXRpb24pIHtcbiAgICAgIHRoaXMucmVmcmVzaFZpZXdwb3J0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaFVwZGF0ZUl0ZW1FdmVudHModGhpcy5pdGVtVXBkYXRlZCwgY2xvbmUsIGluZGV4LCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaEFkZEl0ZW1FdmVudHModGhpcy5pdGVtQWRkZWQsIGNsb25lLCBpbmRleCwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2aWV3cG9ydFJlbmRlcmVkKCkge1xuICAgIHRoaXMudmlydHVhbE5leHVzID0gdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLmdldFZpcnR1YWxOZXh1c0Zyb21WaWV3cG9ydCh0aGlzKTtcblxuICAgIGlmICh0aGlzLnZpcnR1YWxOZXh1cyAmJiB0aGlzLnZpcnR1YWxOZXh1cy52aXJ0dWFsRm9yRGlyZWN0aXZlKSB7XG4gICAgICB0aGlzLml0ZW1zID0gdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZS5fdGFibGVqc0Zvck9mO1xuXG4gICAgICB0aGlzLnZpcnR1YWxGb3JDaGFuZ2VzU3Vic2NyaXB0aW9uJCA9IHRoaXMudmlydHVhbE5leHVzLnZpcnR1YWxGb3JEaXJlY3RpdmUuY2hhbmdlcy5zdWJzY3JpYmUoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGlzVGhlU2FtZUFycmF5ID0gdGhpcy5pdGVtcyA9PT0gaXRlbS50YWJsZWpzRm9yT2Y7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtLnRhYmxlanNGb3JPZjtcblxuICAgICAgICBjb25zdCBzY3JvbGxUb09wdGlvbnMgPSB7IGluZGV4OiAwLCBzY3JvbGxBZnRlckluZGV4ZWRJdGVtOiAwIH07XG4gICAgICAgIGlmIChpc1RoZVNhbWVBcnJheSkge1xuICAgICAgICAgIHNjcm9sbFRvT3B0aW9ucy5pbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCBhcyBudW1iZXI7XG4gICAgICAgICAgc2Nyb2xsVG9PcHRpb25zLnNjcm9sbEFmdGVySW5kZXhlZEl0ZW0gPSB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbTtcblxuICAgICAgICAgIC8vIGFycmF5IGhhcyBjaGFuZ2VkLi4ucmVyZW5kZXIgY3VycmVudCBlbGVtZW50c1xuICAgICAgICAgIGNvbnN0IGxpc3RDaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5saXN0Q29udGVudCEuY2hpbGROb2Rlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVJdGVtcyhpdGVtLnRhYmxlanNGb3JPZiwgc2Nyb2xsVG9PcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5jb252ZXJ0Q3VzdG9tRWxlbWVudHNWYXJpYWJsZXMoKTtcbiAgICB0aGlzLmNyZWF0ZVRCb2RpZXMoKTtcbiAgICB0aGlzLmFkZFNjcm9sbEhhbmRsZXIoKTtcbiAgICAvLyB0aGlzLmF0dGFjaE11dGF0aW9uT2JzZXJ2ZXIoKTtcblxuICAgIGlmICh0aGlzLml0ZW1zICYmICh0aGlzLmdlbmVyYXRlQ2xvbmVNZXRob2QgfHwgdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZS5fdGVtcGxhdGUpKSB7XG4gICAgICB0aGlzLmluaXRTY3JvbGwoe1xuICAgICAgICBpdGVtczogdGhpcy5pdGVtcyxcbiAgICAgICAgZ2VuZXJhdGVDbG9uZU1ldGhvZDogdGhpcy5fY2xvbmVNZXRob2QhXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaFZpZXdwb3J0UmVhZHlFdmVudHModGhpcy52aWV3cG9ydFJlYWR5LCB0aGlzLCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBwdWJsaWMgc2Nyb2xsVG9Cb3R0b20oKTogdm9pZCB7XG4gICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ID0gdGhpcy5pdGVtcyEubGVuZ3RoO1xuICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCh0aGlzLnJhbmdlLnN0YXJ0SW5kZXgsIDApO1xuICB9XG5cbiAgcHVibGljIHNjcm9sbFRvVG9wKCk6IHZvaWQge1xuICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCgwLCAwKTtcbiAgfVxuXG4gIHB1YmxpYyBwYWdlVXAoKTogdm9pZCB7XG4gICAgbGV0IGhlaWdodENvdW50OiBudW1iZXIgPSB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbTtcbiAgICBpZiAodGhpcy5yYW5nZS5zdGFydEluZGV4ID09PSAwKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvRXhhY3QoMCwgMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gdGhpcy5oZWlnaHRMb29rdXBbJ2l0ZW0nICsgaV0gPyB0aGlzLmhlaWdodExvb2t1cFsnaXRlbScgKyBpXSA6IHRoaXMuYXZnSXRlbUhlaWdodDtcbiAgICAgIGhlaWdodENvdW50ICs9IGxvb2t1cEhlaWdodDtcbiAgICAgIGlmIChoZWlnaHRDb3VudCA+PSB0aGlzLmNvbnRhaW5lckhlaWdodCEgfHwgaSA9PT0gMCkge1xuICAgICAgICBjb25zdCBvdmVyZmxvd0RpZmZlcmVuY2U6IG51bWJlciA9IGhlaWdodENvdW50ID49IHRoaXMuY29udGFpbmVySGVpZ2h0ISA/IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhIDogMDtcbiAgICAgICAgdGhpcy5zY3JvbGxUb0V4YWN0KGksIG92ZXJmbG93RGlmZmVyZW5jZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYWdlRG93bigpOiB2b2lkIHtcbiAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPSB0aGlzLnJhbmdlLmVuZEluZGV4ISAtIDE7XG4gICAgY29uc3Qgb3ZlcmZsb3dEaWZmZXJlbmNlOiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFsnaXRlbScgKyAodGhpcy5yYW5nZS5lbmRJbmRleCEgLSAxKS50b1N0cmluZygpXSAtIHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3c7XG4gICAgdGhpcy5zY3JvbGxUb0V4YWN0KHRoaXMucmFuZ2Uuc3RhcnRJbmRleCwgb3ZlcmZsb3dEaWZmZXJlbmNlKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQXJyb3dMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuaGFuZGxlTW91c2VPdmVyID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMubW91c2VJc092ZXJWaWV3cG9ydCA9IHRydWU7XG4gICAgfSk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuaGFuZGxlTW91c2VPdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5tb3VzZUlzT3ZlclZpZXdwb3J0ID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcblxuICAgICAgaWYgKHRoaXMubW91c2VJc092ZXJWaWV3cG9ydCkge1xuXG4gICAgICAgIGNvbnN0IGlzTWFjID0gdGhpcy5vcGVyYXRpbmdTeXN0ZW0uaXNNYWMoKTtcblxuICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICBpZiAoaXNNYWMgJiYgZS5tZXRhS2V5KSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghICs9IE51bWJlcih0aGlzLmFycm93RG93blNwZWVkKTtcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0V4YWN0KHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICBpZiAoaXNNYWMgJiYgZS5tZXRhS2V5KSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgLT0gTnVtYmVyKHRoaXMuYXJyb3dVcFNwZWVkKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4ISwgMCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvRXhhY3QodGhpcy5yYW5nZS5zdGFydEluZGV4ISwgMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1BhZ2VEb3duJzpcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMucGFnZURvd24oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1BhZ2VVcCc6XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnBhZ2VVcCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnRW5kJzpcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ0hvbWUnOlxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSA9ICh0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSEgYXMgYW55KVsnZ3JpZERpcmVjdGl2ZSddO1xuICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSEuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSB0aGlzO1xuXG4gICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5wcmVHcmlkSW5pdGlhbGl6ZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgdGhpcy5jZHIhLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMucmVmcmVzaENvbnRhaW5lckhlaWdodCgpO1xuXG4gICAgICB0aGlzLnJlZnJlc2hWaWV3cG9ydCgpO1xuICAgICAgLy8gcGxhY2Vob2xkZXIgb2JqZWN0IGlzIHVzZWQgb25seSB0byBpbml0aWFsaXplIGZpcnN0IGdyaWQgcmVuZGVyXG4gICAgICBpZiAodGhpcy5pdGVtcyFbMF0gPT09IHRoaXMucGxhY2Vob2xkZXJPYmplY3QpIHtcbiAgICAgICAgdGhpcy5pdGVtcyEuc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudmlld3BvcnRSZW5kZXJlZCgpO1xuICAgIHRoaXMuYWRkQXJyb3dMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyVmlld3BvcnRUb0VsZW1lbnQoKTtcbiAgICB0aGlzLl9jbG9uZU1ldGhvZCA9IHRoaXMuZ2VuZXJhdGVDbG9uZU1ldGhvZDtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5oYW5kbGVNb3VzZU92ZXIpO1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLmhhbmRsZU1vdXNlT3V0KTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duISk7XG4gICAgaWYgKHRoaXMudmlydHVhbEZvckNoYW5nZXNTdWJzY3JpcHRpb24kKSB7XG4gICAgICB0aGlzLnZpcnR1YWxGb3JDaGFuZ2VzU3Vic2NyaXB0aW9uJC51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0U2Nyb2xsU3BhY2VycygpOiB2b2lkIHtcblxuICAgIGNvbnN0IG51bUl0ZW1zQWZ0ZXJTaG93bkxpc3QgPSB0aGlzLml0ZW1zIS5sZW5ndGggLSB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXghO1xuICAgIGNvbnN0IG51bUl0ZW1zQmVmb3JlU2hvd25MaXN0ID0gdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXg7XG5cbiAgICBjb25zdCB0b3RhbFVuc2hvd25JdGVtcyA9IG51bUl0ZW1zQmVmb3JlU2hvd25MaXN0ISArIG51bUl0ZW1zQWZ0ZXJTaG93bkxpc3Q7XG5cbiAgICBjb25zdCBiZWZvcmVJdGVtSGVpZ2h0UGVyY2VudCA9IHRvdGFsVW5zaG93bkl0ZW1zICE9PSAwID8gbnVtSXRlbXNCZWZvcmVTaG93bkxpc3QhIC8gdG90YWxVbnNob3duSXRlbXMgOiAwO1xuICAgIGNvbnN0IGFmdGVySXRlbUhlaWdodFBlcmNlbnQgPSB0b3RhbFVuc2hvd25JdGVtcyAhPT0gMCA/IG51bUl0ZW1zQWZ0ZXJTaG93bkxpc3QgLyB0b3RhbFVuc2hvd25JdGVtcyA6IDA7XG4gICAgY29uc3QgcmVtYWluaW5nSGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodCAtIHRoaXMubGFzdEhlaWdodDtcblxuICAgIHRoaXMuZXN0aW1hdGVkUHJlTGlzdEhlaWdodCA9IE1hdGgucm91bmQoYmVmb3JlSXRlbUhlaWdodFBlcmNlbnQgKiByZW1haW5pbmdIZWlnaHQpO1xuICAgIHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQgPSBNYXRoLnJvdW5kKGFmdGVySXRlbUhlaWdodFBlcmNlbnQgKiByZW1haW5pbmdIZWlnaHQpO1xuXG4gICAgLy8gYWNjb3VudCBmb3Igcm91bmRpbmcgYm90aCB1cFxuICAgIHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQgPSB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0IC0gKGFmdGVySXRlbUhlaWdodFBlcmNlbnQgKiByZW1haW5pbmdIZWlnaHQpID09PSAwLjUgPyB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0IC0gMSA6IHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQ7XG5cbiAgICBpZiAodGhpcy5mb3JjZWRFbmRJbmRleCkge1xuICAgICAgdGhpcy5lc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0ID0gMDtcbiAgICAgIHRoaXMuZXN0aW1hdGVkUG9zdExpc3RIZWlnaHQgPSAwO1xuICAgIH1cblxuICAgIHRoaXMucHJldlNwYWNlciEuc3R5bGUuaGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgIHRoaXMucG9zdFNwYWNlciEuc3R5bGUuaGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRQb3N0TGlzdEhlaWdodC50b1N0cmluZygpICsgJ3B4JztcblxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIZWlnaHRCeUxpc3RIZWlnaHREaWZmZXJlbmNlKGxpSGVpZ2h0OiBudW1iZXIsIGxpc3RIZWlnaHQ6IG51bWJlcikge1xuICAgIHJldHVybiBsaUhlaWdodCAtIGxpc3RIZWlnaHQ7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVByZVNjcm9sbEl0ZW1zKGxhc3RJbmRleDogbnVtYmVyLCBpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGxhc3RJbmRleCA8IGluZGV4KSB7XG4gICAgICBmb3IgKGxldCBpID0gbGFzdEluZGV4OyBpIDwgaW5kZXg7IGkrKykge1xuICAgICAgICBjb25zdCBmaXJzdFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5nZXQoMSk7XG4gICAgICAgIGlmIChmaXJzdFJlZikge1xuICAgICAgICAgIGNvbnN0IGZpcnN0Q2hpbGQgPSAoZmlyc3RSZWYgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXTtcbiAgICAgICAgICBjb25zdCBpdGVtTmFtZSA9ICdpdGVtJyArIGk7XG4gICAgICAgICAgdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFtpdGVtTmFtZV0gPSBmYWxzZTtcbiAgXG4gICAgICAgICAgY29uc3QgZGV0YWNoZWRSZWY6IFZpZXdSZWYgfCBudWxsID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuZGV0YWNoKDEpO1xuICAgICAgICAgIGRldGFjaGVkUmVmIS5kZXN0cm95KCk7XG4gICAgICAgICAgdGhpcy5jZHIhLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICAgIHRoaXMucmVtb3ZlUmVzaXplU2Vuc29yKGZpcnN0Q2hpbGQsIGkpO1xuICAgICAgICAgIHRoaXMubGFzdEhlaWdodCAtPSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG4gICAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaFJlbW92ZUl0ZW1FdmVudHModGhpcy5pdGVtUmVtb3ZlZCwgZmlyc3RDaGlsZCwgaSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByaXZhdGUgcmVtb3ZlUG9zdFNjcm9sbEl0ZW1zKGxhc3RFbmRJbmRleDogbnVtYmVyLCBlbmRJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGxhc3RFbmRJbmRleCA+PSB0aGlzLml0ZW1zIS5sZW5ndGgpIHtcbiAgICAgIGxhc3RFbmRJbmRleCA9IHRoaXMuaXRlbXMhLmxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGxhc3RFbmRJbmRleDsgaSA+PSBlbmRJbmRleDsgaS0tKSB7XG4gICAgICBjb25zdCBsYXN0Q2hpbGQgPSB0aGlzLmdldFByZXZpb3VzU2libGluZyh0aGlzLmxpc3RDb250ZW50IS5sYXN0RWxlbWVudENoaWxkKTtcbiAgICAgIGlmIChsYXN0Q2hpbGQpIHtcbiAgICAgICAgY29uc3QgaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuICAgICAgICB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW2l0ZW1OYW1lXSA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGRldGFjaGVkUmVmOiBWaWV3UmVmIHwgbnVsbCA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmRldGFjaCh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5sZW5ndGggLSAxKTtcbiAgICAgICAgZGV0YWNoZWRSZWYhLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5jZHIhLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICB0aGlzLnJlbW92ZVJlc2l6ZVNlbnNvcihsYXN0Q2hpbGQsIGkpO1xuICAgICAgICB0aGlzLmxhc3RIZWlnaHQgLT0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoUmVtb3ZlSXRlbUV2ZW50cyh0aGlzLml0ZW1SZW1vdmVkLCAoZGV0YWNoZWRSZWYgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXSwgaSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVJdGVtcyhpdGVtczogYW55W10sIHNjcm9sbFRvT3B0aW9uczogYW55ID0ge2luZGV4OiAtMSwgc2Nyb2xsQWZ0ZXJJbmRleGVkSXRlbTogMCB9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGF1c2VWaWV3cG9ydFJlbmRlclVwZGF0ZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGRldGFjaGVkUmVmOiBWaWV3UmVmIHwgbnVsbCA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmRldGFjaChpKTtcbiAgICAgIGRldGFjaGVkUmVmIS5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB0aGlzLnJlc2V0VG9Jbml0aWFsVmFsdWVzKCk7XG4gICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgIGlmICh0aGlzLnZpcnR1YWxOZXh1cykge1xuICAgICAgdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZS5fdGFibGVqc0Zvck9mID0gaXRlbXM7XG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFRvT3B0aW9ucy5pbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdChzY3JvbGxUb09wdGlvbnMuaW5kZXgsIHNjcm9sbFRvT3B0aW9ucy5zY3JvbGxBZnRlckluZGV4ZWRJdGVtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVzZXRUb0luaXRpYWxWYWx1ZXMoKTogdm9pZCB7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmN1cnJlbnRTY3JvbGxUb3AgPSAwO1xuICAgIHRoaXMuY3VycmVudFNjcm9sbENoYW5nZSA9IDA7XG4gICAgdGhpcy5lc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodCA9IDA7XG4gICAgdGhpcy5lc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmVzdGltYXRlZFBvc3RMaXN0SGVpZ2h0ID0gMDtcbiAgICB0aGlzLnRvdGFsSXRlbXNDb3VudGVkID0gMDtcbiAgICB0aGlzLnRvdGFsSGVpZ2h0Q291bnQgPSAwO1xuICAgIHRoaXMuYXZnSXRlbUhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmhlaWdodExvb2t1cCA9IHt9O1xuICAgIHRoaXMuaXRlbVZpc2liaWxpdHlMb29rdXAgPSB7fTtcbiAgICB0aGlzLm92ZXJmbG93SGVpZ2h0Q291bnQgPSAwO1xuICAgIHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtID0gMDtcbiAgICB0aGlzLmxhc3RWaXNpYmxlSXRlbUhlaWdodCA9IEluZmluaXR5O1xuICAgIHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgPSAwO1xuICAgIHRoaXMubGFzdEhlaWdodCA9IDA7XG4gICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ID0gMDtcbiAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gMDtcbiAgICB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IDA7XG4gICAgdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ID0gMDtcbiAgICB0aGlzLmxhc3RSYW5nZS5zdGFydEluZGV4ID0gdGhpcy5yYW5nZS5zdGFydEluZGV4O1xuICAgIHRoaXMubGFzdFJhbmdlLmVuZEluZGV4ID0gdGhpcy5yYW5nZS5lbmRJbmRleDtcbiAgICB0aGlzLmxhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXggPSB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleDtcbiAgICB0aGlzLmxhc3RSYW5nZS5leHRlbmRlZEVuZEluZGV4ID0gdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4O1xuICAgIHRoaXMuZm9yY2VkRW5kSW5kZXggPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgcmVjYWxjdWxhdGVSb3dIZWlnaHQoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1OYW1lOiBzdHJpbmcgPSAnaXRlbScgKyBpbmRleDtcbiAgICBjb25zdCBpbmRleE1hcDogYW55ID0ge307XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5sZW5ndGg7IGkrKykge1xuICAgICAgaW5kZXhNYXBbKHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdLmluZGV4XSA9IGk7XG4gICAgfTtcbiAgICBjb25zdCByb3dSZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIuZ2V0KGluZGV4TWFwW2luZGV4XSkgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT47XG4gICAgY29uc3Qgcm93RWw6IEhUTUxFbGVtZW50IHwgYW55ID0gcm93UmVmLnJvb3ROb2Rlc1swXTtcblxuICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gcm93RWwub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IGhlaWdodERpZmZlcmVuY2U6IG51bWJlciA9IGxvb2t1cEhlaWdodCAtIHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcbiAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodEZyb21SZXNpemUodGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdLCBsb29rdXBIZWlnaHQpO1xuICAgIHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXSA9IGxvb2t1cEhlaWdodDtcblxuICAgIHJvd0VsLmxhc3RIZWlnaHQgPSBsb29rdXBIZWlnaHQ7XG4gICAgdGhpcy5sYXN0SGVpZ2h0ICs9IGhlaWdodERpZmZlcmVuY2U7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUVzdGltYXRlZEhlaWdodEZyb21SZXNpemUob2xkSGVpZ2h0OiBudW1iZXIsIG5ld0hlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50b3RhbEhlaWdodENvdW50ICs9IChuZXdIZWlnaHQgLSBvbGRIZWlnaHQpO1xuICAgIHRoaXMuYXZnSXRlbUhlaWdodCA9ICh0aGlzLnRvdGFsSGVpZ2h0Q291bnQgLyB0aGlzLnRvdGFsSXRlbXNDb3VudGVkKTtcbiAgICB0aGlzLmVzdGltYXRlZEZ1bGxDb250ZW50SGVpZ2h0ID0gdGhpcy5hdmdJdGVtSGVpZ2h0ICogdGhpcy5pdGVtcyEubGVuZ3RoO1xuICB9XG4gIHByaXZhdGUgdXBkYXRlRXN0aW1hdGVkSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgdGhpcy50b3RhbEhlaWdodENvdW50ICs9IGhlaWdodDtcbiAgICB0aGlzLnRvdGFsSXRlbXNDb3VudGVkKys7XG5cbiAgICB0aGlzLmF2Z0l0ZW1IZWlnaHQgPSAodGhpcy50b3RhbEhlaWdodENvdW50IC8gdGhpcy50b3RhbEl0ZW1zQ291bnRlZCk7XG4gICAgdGhpcy5lc3RpbWF0ZWRGdWxsQ29udGVudEhlaWdodCA9IHRoaXMuYXZnSXRlbUhlaWdodCAqIHRoaXMuaXRlbXMhLmxlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRQcmV2aW91c1NpYmxpbmcoZWw6IE5vZGUgfCBFbGVtZW50IHwgbnVsbCk6IGFueSB7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGxldCBwcmV2ID0gZWwucHJldmlvdXNTaWJsaW5nO1xuICAgIHdoaWxlIChwcmV2ICE9PSBudWxsICYmIHByZXYgIT09IHVuZGVmaW5lZCAmJiBwcmV2Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICBwcmV2ID0gcHJldi5wcmV2aW91c1NpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiBwcmV2O1xuICB9XG4gIHB1YmxpYyBnZXROZXh0U2libGluZyhlbDogRWxlbWVudCB8IG51bGwpOiBhbnkge1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgbmV4dCA9IGVsLm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChuZXh0ICE9PSBudWxsICYmIG5leHQgIT09IHVuZGVmaW5lZCAmJiBuZXh0Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICBuZXh0ID0gbmV4dC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBwcml2YXRlIGdldEVzdGltYXRlZENoaWxkSW5zZXJ0aW9ucyhyZW1haW5pbmdIZWlnaHQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGguY2VpbChyZW1haW5pbmdIZWlnaHQgLyB0aGlzLmF2Z0l0ZW1IZWlnaHQhKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TGFzdFJhbmdlVG9DdXJyZW50UmFuZ2UoKSB7XG4gICAgdGhpcy5sYXN0UmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleDtcbiAgICB0aGlzLmxhc3RSYW5nZS5lbmRJbmRleCA9IHRoaXMucmFuZ2UuZW5kSW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXg7XG4gICAgdGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCA9IHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRMYXN0SGVpZ2h0KCkge1xuICAgIGlmICghdGhpcy5sYXN0SGVpZ2h0KSB7XG4gICAgICB0aGlzLmxhc3RIZWlnaHQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbWFpbnRhaW5JbmRleEluQm91bmRzKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoaW5kZXggPiB0aGlzLml0ZW1zIS5sZW5ndGggLSAxKSB7XG4gICAgICBpbmRleCA9IHRoaXMuaXRlbXMhLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIGlmIChpbmRleCA8IDApIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgcHJpdmF0ZSBtYWludGFpbkVuZEluZGV4SW5Cb3VuZHMoaW5kZXg6IG51bWJlcikge1xuICAgIGlmIChpbmRleCA+IHRoaXMuaXRlbXMhLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSB0aGlzLml0ZW1zIS5sZW5ndGg7XG4gICAgfSBlbHNlIGlmIChpbmRleCA8IDApIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgcHVibGljIHNob3dSYW5nZShzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4OiBudW1iZXIsIG92ZXJmbG93OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVJdGVtcyh0aGlzLml0ZW1zISwge2luZGV4OiBzdGFydEluZGV4LCBzY3JvbGxBZnRlckluZGV4ZWRJdGVtOiBlbmRJbmRleCB9KTtcbiAgICBzdGFydEluZGV4ID0gdGhpcy5tYWludGFpbkluZGV4SW5Cb3VuZHMoc3RhcnRJbmRleCk7XG4gICAgZW5kSW5kZXggPSB0aGlzLm1haW50YWluRW5kSW5kZXhJbkJvdW5kcyhlbmRJbmRleCk7XG4gICAgaWYgKGVuZEluZGV4IDw9IHN0YXJ0SW5kZXgpIHtcbiAgICAgIGVuZEluZGV4ID0gc3RhcnRJbmRleCArIDE7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkQ29udGFpbmVySGVpZ2h0OiBudW1iZXIgPSB0aGlzLmNvbnRhaW5lckhlaWdodCE7XG4gICAgY29uc3Qgb2xkUHJlSXRlbU92ZXJmbG93OiBudW1iZXIgPSBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuICAgIGNvbnN0IG9sZFBvc3RJdGVtT3ZlcmZsb3c6IG51bWJlciA9IE51bWJlcih0aGlzLnBvc3RJdGVtT3ZlcmZsb3cpO1xuXG4gICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3cgPSAwO1xuICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvdyA9IDA7XG4gICAgdGhpcy5jb250YWluZXJIZWlnaHQgPSAxMDAwMDA7XG4gICAgdGhpcy5mb3JjZWRFbmRJbmRleCA9IGVuZEluZGV4O1xuXG4gICAgdGhpcy5zY3JvbGxUb0V4YWN0KHN0YXJ0SW5kZXgsIG92ZXJmbG93KTtcblxuICAgIGNvbnN0IHJhbmdlVG9LZWVwOiBSYW5nZSA9IHsgLi4udGhpcy5yYW5nZX07XG4gICAgY29uc3QgbGFzdFJhbmdlVG9LZWVwOiBSYW5nZSA9IHsgLi4udGhpcy5sYXN0UmFuZ2UgfTtcblxuICAgIHRoaXMucHJlSXRlbU92ZXJmbG93ID0gb2xkUHJlSXRlbU92ZXJmbG93O1xuICAgIHRoaXMucG9zdEl0ZW1PdmVyZmxvdyA9IG9sZFBvc3RJdGVtT3ZlcmZsb3c7XG4gICAgdGhpcy5jb250YWluZXJIZWlnaHQgPSBvbGRDb250YWluZXJIZWlnaHQ7XG4gICAgdGhpcy5mb3JjZWRFbmRJbmRleCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMucmFuZ2UgPSByYW5nZVRvS2VlcDtcbiAgICB0aGlzLmxhc3RSYW5nZSA9IGxhc3RSYW5nZVRvS2VlcDtcblxuICB9XG5cbiAgcHVibGljIGdldERpc3BsYXllZENvbnRlbnRzSGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubGFzdEhlaWdodDtcbiAgfVxuXG4gIHB1YmxpYyByZWZyZXNoQ29udGFpbmVySGVpZ2h0KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVySGVpZ2h0ID0gdGhpcy5saXN0Q29udGVudCEuY2xpZW50SGVpZ2h0O1xuICB9XG5cbiAgcHVibGljIGFsbEl0ZW1zRml0Vmlld3BvcnQocmVjYWxjdWxhdGVDb250YWluZXJIZWlnaHQ6IGJvb2xlYW4gPSBmYWxzZSwgcmVmcmVzaFZpZXdwb3J0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICBpZiAocmVjYWxjdWxhdGVDb250YWluZXJIZWlnaHQpIHtcbiAgICAgIHRoaXMuY2RyIS5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLnJlZnJlc2hDb250YWluZXJIZWlnaHQoKTtcbiAgICB9XG4gICAgaWYgKHJlZnJlc2hWaWV3cG9ydCkge1xuICAgICAgdGhpcy5yZWZyZXNoVmlld3BvcnQodHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJhbmdlLnN0YXJ0SW5kZXggPT09IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ICYmXG4gICAgICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID09PSB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXggJiYgXG4gICAgICAgICAgICB0aGlzLmxhc3RIZWlnaHQgPD0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuICB9XG5cbiAgcHVibGljIGdldEN1cnJlbnRTY3JvbGxQb3NpdGlvbigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogdGhpcy5yYW5nZS5zdGFydEluZGV4LFxuICAgICAgb3ZlcmZsb3c6IHRoaXMuc2Nyb2xsQ2hhbmdlQnlGaXJzdEluZGV4ZWRJdGVtLFxuICAgICAgbGFzdEl0ZW1PdmVyZmxvdzogdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA+IDAgPyAwIDogdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvd1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0SGVpZ2h0c0Zvck92ZXJmbG93Q2FsY3VsYXRpb25zKGl0ZW1JbmRleDogbnVtYmVyLCBzY3JvbGxUb0luZGV4OiBudW1iZXIsIGl0ZW1IZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMubGFzdEhlaWdodCArPSBpdGVtSGVpZ2h0O1xuXG4gICAgaWYgKGl0ZW1JbmRleCA8IHNjcm9sbFRvSW5kZXgpIHtcbiAgICAgIHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgKz0gaXRlbUhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAoaXRlbUluZGV4ID49IHNjcm9sbFRvSW5kZXgpIHtcbiAgICAgIHRoaXMub3ZlcmZsb3dIZWlnaHRDb3VudCArPSBpdGVtSGVpZ2h0O1xuICAgICAgaWYgKHRoaXMub3ZlcmZsb3dIZWlnaHRDb3VudCA+PSB0aGlzLmNvbnRhaW5lckhlaWdodCEpIHtcbiAgICAgICAgdGhpcy5wb3N0SXRlbU92ZXJmbG93Q291bnQrKztcblxuICAgICAgICBpZiAodGhpcy5wb3N0SXRlbU92ZXJmbG93Q291bnQgPT09IDApIHtcbiAgICAgICAgICB0aGlzLmxhc3RWaXNpYmxlSXRlbUhlaWdodCA9IHRoaXMuaGVpZ2h0TG9va3VwWydpdGVtJyArIGl0ZW1JbmRleF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFJlc2l6ZVNlbnNvcihlbDogYW55LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gIH1cbiAgcHJpdmF0ZSByZW1vdmVSZXNpemVTZW5zb3IoZWw6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICB9XG5cbiAgcHVibGljIG9uVHJhbnNpdGlvbkVuZDogKF9lOiBhbnkpID0+IHZvaWQgPSAoZSkgPT4ge1xuICB9XG4gIHB1YmxpYyBvblRyYW5zaXRpb25SdW46IChfZTogYW55KSA9PiB2b2lkID0gKGUpID0+IHtcbiAgfVxuICBwdWJsaWMgb25UcmFuc2l0aW9uU3RhcnQ6IChfZTogYW55KSA9PiB2b2lkID0gKGUpID0+IHtcbiAgfVxuICBwdWJsaWMgb25UcmFuc2l0aW9uQ2FuY2VsOiAoX2U6IGFueSkgPT4gdm9pZCA9IChlKSA9PiB7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2xvbmVGcm9tVGVtcGxhdGVSZWYoaW5kZXg6IG51bWJlcik6IEhUTUxFbGVtZW50IHtcbiAgICBsZXQgY2xvbmU6IEhUTUxFbGVtZW50O1xuXG4gICAgdGhpcy50ZW1wbGF0ZUNvbnRleHQgPSBuZXcgVGFibGVqc0Zvck9mQ29udGV4dDxhbnksIGFueT4odGhpcy5pdGVtcyFbaW5kZXhdLCB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGFibGVqc0Zvck9mLCBpbmRleCwgdGhpcy5pdGVtcyEubGVuZ3RoKTtcbiAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlQ29udGV4dCk7XG4gICAgdmlld1JlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgY2xvbmUgPSB2aWV3UmVmLnJvb3ROb2Rlc1swXTtcblxuICAgIHJldHVybiBjbG9uZTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkU2Nyb2xsSXRlbXMoaW5kZXg6IG51bWJlciwgb3ZlcmZsb3c6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHNjcm9sbGluZ1VwID0gaW5kZXggPCB0aGlzLmxhc3RSYW5nZS5zdGFydEluZGV4ITtcblxuICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ID0gdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXg7XG4gICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5vdmVyZmxvd0hlaWdodENvdW50ID0gLW92ZXJmbG93O1xuICAgIHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgPSAwO1xuICAgIGNvbnN0IGZpcnN0RWwgPSB0aGlzLmdldE5leHRTaWJsaW5nKHRoaXMubGlzdENvbnRlbnQhLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICB0aGlzLmxhc3RIZWlnaHQgPSAwO1xuICAgIGxldCBiYXRjaFNpemU6IG51bWJlciA9IHRoaXMuYXZnSXRlbUhlaWdodCAhPT0gdW5kZWZpbmVkICYmIGlzTmFOKHRoaXMuYXZnSXRlbUhlaWdodCkgPT09IGZhbHNlID8gdGhpcy5nZXRFc3RpbWF0ZWRDaGlsZEluc2VydGlvbnModGhpcy5jb250YWluZXJIZWlnaHQhIC0gdGhpcy5sYXN0SGVpZ2h0KSArIE51bWJlcih0aGlzLnByZUl0ZW1PdmVyZmxvdykgKyBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KSA6IDE7XG4gICAgbGV0IGl0ZW1zVG9CYXRjaDogYW55W10gPSBbXTtcbiAgICBsZXQgaXRlbUJlZm9yZTogTm9kZTtcbiAgICBsZXQgaW5kZXhCZWZvcmU6IG51bWJlcjtcbiAgICBjb25zdCBmaXJzdFJlZjogVmlld1JlZiB8IG51bGwgPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5nZXQoMSk7XG4gICAgY29uc3QgYXBwZW5kVG9FbmQ6IGJvb2xlYW4gPSBmaXJzdFJlZiA9PT0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXghOyBpIDwgdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXghICsgTnVtYmVyKHRoaXMuaXRlbUxvYWRMaW1pdCk7IGkrKykge1xuICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGkgPiB0aGlzLml0ZW1zIS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB0aGlzLml0ZW1OYW1lID0gJ2l0ZW0nICsgaTtcbiAgICAgIC8vIG9ubHkgaW5zZXJ0IGl0ZW0gaWYgaXQgaXMgbm90IGFscmVhZHkgdmlzaWJsZVxuICAgICAgY29uc3QgaXRlbUlzSW52aXNpYmxlOiBib29sZWFuID0gdGhpcy5pdGVtVmlzaWJpbGl0eUxvb2t1cFt0aGlzLml0ZW1OYW1lXSAhPT0gdHJ1ZTtcblxuICAgICAgaWYgKGl0ZW1Jc0ludmlzaWJsZSkge1xuICAgICAgICBpdGVtQmVmb3JlID0gIXNjcm9sbGluZ1VwID8gdGhpcy5wb3N0U3BhY2VyIDogZmlyc3RFbDtcblxuICAgICAgICBpbmRleEJlZm9yZSA9ICFzY3JvbGxpbmdVcCB8fCBhcHBlbmRUb0VuZCA/IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmxlbmd0aCA6IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmluZGV4T2YoZmlyc3RSZWYhKTtcblxuICAgICAgICB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlQ29udGV4dCA9IG5ldyBUYWJsZWpzRm9yT2ZDb250ZXh0PGFueSwgYW55Pih0aGlzLml0ZW1zIVtpXSwgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RhYmxlanNGb3JPZiwgaSwgdGhpcy5pdGVtcyEubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgcmVmOiBFbWJlZGRlZFZpZXdSZWY8YW55PiA9IHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGVtcGxhdGUsIHRoaXMudGVtcGxhdGVDb250ZXh0LCBpbmRleEJlZm9yZSk7XG4gICAgICAgIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLm1vdmUocmVmLCBpbmRleEJlZm9yZSk7XG5cbiAgICAgICAgY29uc3QgcHJldjogYW55ID0gcmVmLnJvb3ROb2Rlc1swXTtcbiAgICAgICAgcHJldi5pbmRleCA9IGk7XG4gICAgICAgIFxuICAgICAgICBpdGVtc1RvQmF0Y2gucHVzaCh7IGluZGV4OiBpLCBuYW1lOiB0aGlzLml0ZW1OYW1lLCBpdGVtOiBwcmV2LCBiZWZvcmU6IGl0ZW1CZWZvcmUgfSk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZS5kaXNwYXRjaEFkZEl0ZW1FdmVudHModGhpcy5pdGVtQWRkZWQsIHByZXYsIGksIHRoaXMsIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zVG9CYXRjaC5wdXNoKHsgaW5kZXg6IGksIG5hbWU6IHRoaXMuaXRlbU5hbWUsIGl0ZW06IG51bGwsIGJlZm9yZTogbnVsbCB9KTtcbiAgICAgICAgdGhpcy5zZXRIZWlnaHRzRm9yT3ZlcmZsb3dDYWxjdWxhdGlvbnMoaSwgaW5kZXgsIHRoaXMuaGVpZ2h0TG9va3VwW3RoaXMuaXRlbU5hbWVdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1zVG9CYXRjaC5sZW5ndGggPT09IGJhdGNoU2l6ZSB8fCBpID09PSB0aGlzLml0ZW1zIS5sZW5ndGggLSAxIHx8IHRoaXMucG9zdEl0ZW1PdmVyZmxvd0NvdW50ID49IE51bWJlcih0aGlzLnBvc3RJdGVtT3ZlcmZsb3cpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaXRlbXNUb0JhdGNoLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgYmF0Y2hPYmo6IGFueSA9IGl0ZW1zVG9CYXRjaFtqXTtcbiAgICAgICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBiYXRjaE9iai5uYW1lO1xuICAgICAgICAgIGNvbnN0IGluZDogbnVtYmVyID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgY29uc3Qgb2xkSGVpZ2h0OiBudW1iZXIgPSB0aGlzLmhlaWdodExvb2t1cFtuYW1lXTtcblxuICAgICAgICAgIGlmIChiYXRjaE9iai5pdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmNkciEuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgIGNvbnN0IGxvb2t1cEhlaWdodDogbnVtYmVyID0gYmF0Y2hPYmouaXRlbS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICB0aGlzLmhlaWdodExvb2t1cFtuYW1lXSA9IGxvb2t1cEhlaWdodDtcblxuICAgICAgICAgIGJhdGNoT2JqLml0ZW0ubGFzdEhlaWdodCA9IGxvb2t1cEhlaWdodDtcbiAgICAgICAgICB0aGlzLmFkZFJlc2l6ZVNlbnNvcihiYXRjaE9iai5pdGVtLCBiYXRjaE9iai5pbmRleCk7XG5cbiAgICAgICAgICBpZiAob2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodEZyb21SZXNpemUob2xkSGVpZ2h0LCBsb29rdXBIZWlnaHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodChsb29rdXBIZWlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldEhlaWdodHNGb3JPdmVyZmxvd0NhbGN1bGF0aW9ucyhpbmQsIGluZGV4LCBsb29rdXBIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGJhdGNoU2l6ZSA9IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISAtIHRoaXMubGFzdEhlaWdodCkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpICsgTnVtYmVyKHRoaXMucG9zdEl0ZW1PdmVyZmxvdyk7XG4gICAgICAgIGlmIChiYXRjaFNpemUgPD0gMCkge1xuICAgICAgICAgIGJhdGNoU2l6ZSA9IE51bWJlcih0aGlzLnBvc3RJdGVtT3ZlcmZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zVG9CYXRjaCA9IFtdO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodGhpcy5wb3N0SXRlbU92ZXJmbG93Q291bnQgPD0gMCkge1xuICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gaSArIDE7XG4gICAgICB9XG4gICAgICB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXggPSBpICsgMTtcbiAgICAgIC8vIGlmIGl0ZW0gaGVpZ2h0IGlzIGxvd2VyIHRoYW4gdGhlIGJvdHRvbSBvZiB0aGUgY29udGFpbmVyIGFyZWEsIHN0b3AgYWRkaW5nIGl0ZW1zXG4gICAgICBpZiAodGhpcy5mb3JjZWRFbmRJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0aGlzLnBvc3RJdGVtT3ZlcmZsb3dDb3VudCA+PSBOdW1iZXIodGhpcy5wb3N0SXRlbU92ZXJmbG93KSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaSA9PT0gdGhpcy5mb3JjZWRFbmRJbmRleCAtIDEpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgaXRlbU5hbWU6IHN0cmluZztcbiAgICBsZXQgZW5kSW5kZXhGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBoZWlnaHRDb3VudDogbnVtYmVyID0gLW92ZXJmbG93O1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXg7IGkgPCB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXghOyBpKyspIHtcbiAgICAgIGl0ZW1OYW1lID0gJ2l0ZW0nICsgaTtcbiAgICAgIGhlaWdodENvdW50ICs9IHRoaXMuaGVpZ2h0TG9va3VwW2l0ZW1OYW1lXTtcblxuICAgICAgaWYgKHRoaXMuZm9yY2VkRW5kSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaSA9PT0gdGhpcy5mb3JjZWRFbmRJbmRleCAtIDEpIHtcbiAgICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gaSArIDE7XG4gICAgICAgICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA9IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuXG4gICAgICAgICAgZW5kSW5kZXhGb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChoZWlnaHRDb3VudCA+PSB0aGlzLmNvbnRhaW5lckhlaWdodCEgJiYgIWVuZEluZGV4Rm91bmQpIHtcbiAgICAgICAgICB0aGlzLnJhbmdlLmVuZEluZGV4ID0gaSArIDE7XG4gICAgICAgICAgdGhpcy5sYXN0VmlzaWJsZUl0ZW1PdmVyZmxvdyA9IGhlaWdodENvdW50IC0gdGhpcy5jb250YWluZXJIZWlnaHQhO1xuXG4gICAgICAgICAgZW5kSW5kZXhGb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZE1pc3NpbmdQb3N0U2Nyb2xsSXRlbXNBbmRVcGRhdGVPdmVyZmxvdyhpbmRleDogbnVtYmVyLCBvdmVyZmxvdzogbnVtYmVyKTogbnVtYmVyIHtcblxuICAgIGxldCBmaXJzdEVsO1xuICAgIGxldCBpdGVtc1RvQmF0Y2g6IGFueVtdID0gW107XG4gICAgbGV0IGJhdGNoU2l6ZTogbnVtYmVyO1xuXG4gICAgaWYgKHRoaXMub3ZlcmZsb3dIZWlnaHRDb3VudCA8PSB0aGlzLmNvbnRhaW5lckhlaWdodCEpIHtcbiAgICAgIGJhdGNoU2l6ZSA9IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuICAgICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA9IC0xO1xuICAgICAgdGhpcy5wcmVPdmVyZmxvd0hlaWdodCA9IDA7XG5cbiAgICAgIGZpcnN0RWwgPSB0aGlzLmdldE5leHRTaWJsaW5nKHRoaXMubGlzdENvbnRlbnQhLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgbGV0IGhlaWdodENvdW50ID0gMDtcbiAgICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJhbmdlLmVuZEluZGV4ISAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHRoaXMuaXRlbU5hbWUgPSAnaXRlbScgKyBpO1xuXG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChpIDw9IHRoaXMucmFuZ2UuZXh0ZW5kZWRTdGFydEluZGV4ISAmJiB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdICE9PSB0cnVlKSB7XG5cbiAgICAgICAgICB0aGlzLml0ZW1WaXNpYmlsaXR5TG9va3VwW3RoaXMuaXRlbU5hbWVdID0gdHJ1ZTtcblxuICAgICAgICAgIHRoaXMudGVtcGxhdGVDb250ZXh0ID0gbmV3IFRhYmxlanNGb3JPZkNvbnRleHQ8YW55LCBhbnk+KHRoaXMuaXRlbXMhW2ldLCB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdGFibGVqc0Zvck9mLCBpLCB0aGlzLml0ZW1zIS5sZW5ndGgpO1xuICAgICAgICAgIGNvbnN0IHJlZjogRW1iZWRkZWRWaWV3UmVmPGFueT4gPSB0aGlzLnZpcnR1YWxOZXh1cyEudmlydHVhbEZvckRpcmVjdGl2ZS5fdmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3RlbXBsYXRlLCB0aGlzLnRlbXBsYXRlQ29udGV4dCwgMSk7XG4gICAgICAgICAgdGhpcy52aXJ0dWFsTmV4dXMhLnZpcnR1YWxGb3JEaXJlY3RpdmUuX3ZpZXdDb250YWluZXIubW92ZShyZWYsIDEpO1xuICAgICAgICAgIGNvbnN0IHByZXY6IGFueSA9IHJlZi5yb290Tm9kZXNbMF07XG4gICAgICAgICAgcHJldi5pbmRleCA9IGk7XG4gICAgICAgICAgdGhpcy5jZHIhLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICAgIGl0ZW1zVG9CYXRjaC5wdXNoKHsgaW5kZXg6IGksIG5hbWU6IHRoaXMuaXRlbU5hbWUsIGl0ZW06IHByZXYsIGJlZm9yZTogZmlyc3RFbCB9KTtcbiAgICAgICAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlLmRpc3BhdGNoQWRkSXRlbUV2ZW50cyh0aGlzLml0ZW1BZGRlZCwgcHJldiwgaSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIGZpcnN0RWwgPSBwcmV2O1xuXG4gICAgICAgICAgdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXggPSBpO1xuICAgICAgICAgIHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4ID0gaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtc1RvQmF0Y2gucHVzaCh7IGluZGV4OiBpLCBuYW1lOiB0aGlzLml0ZW1OYW1lLCBpdGVtOiBudWxsLCBiZWZvcmU6IG51bGwgfSk7XG5cbiAgICAgICAgICBoZWlnaHRDb3VudCArPSB0aGlzLmhlaWdodExvb2t1cFt0aGlzLml0ZW1OYW1lXTtcbiAgICAgICAgICBpZiAoaGVpZ2h0Q291bnQgPiB0aGlzLmNvbnRhaW5lckhlaWdodCEpIHtcbiAgICAgICAgICAgIHRoaXMucHJlSXRlbU92ZXJmbG93Q291bnQrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnByZUl0ZW1PdmVyZmxvd0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIG92ZXJmbG93ID0gaGVpZ2h0Q291bnQgLSB0aGlzLmNvbnRhaW5lckhlaWdodCE7XG4gICAgICAgICAgICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IGk7XG4gICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucHJlT3ZlcmZsb3dIZWlnaHQgKz0gdGhpcy5oZWlnaHRMb29rdXBbdGhpcy5pdGVtTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IGk7XG4gICAgICAgICAgICB0aGlzLmFkanVzdGVkU3RhcnRJbmRleCA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW1zVG9CYXRjaC5sZW5ndGggPT09IGJhdGNoU2l6ZSB8fCBpID09PSAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpdGVtc1RvQmF0Y2gubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJhdGNoT2JqOiBhbnkgPSBpdGVtc1RvQmF0Y2hbal07XG4gICAgICAgICAgICBpZiAoYmF0Y2hPYmouaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IGJhdGNoT2JqLm5hbWU7XG4gICAgICAgICAgICBjb25zdCBpbmQ6IG51bWJlciA9IGJhdGNoT2JqLmluZGV4O1xuICAgICAgICAgICAgY29uc3QgbG9va3VwSGVpZ2h0OiBudW1iZXIgPSBiYXRjaE9iai5pdGVtLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IG9sZEhlaWdodDogbnVtYmVyID0gdGhpcy5oZWlnaHRMb29rdXBbbmFtZV07XG4gICAgICAgICAgICB0aGlzLmhlaWdodExvb2t1cFtuYW1lXSA9IGxvb2t1cEhlaWdodDtcblxuICAgICAgICAgICAgYmF0Y2hPYmouaXRlbS5sYXN0SGVpZ2h0ID0gbG9va3VwSGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5hZGRSZXNpemVTZW5zb3IoYmF0Y2hPYmouaXRlbSwgYmF0Y2hPYmouaW5kZXgpO1xuICAgICAgICAgICAgaWYgKG9sZEhlaWdodCkge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVzdGltYXRlZEhlaWdodEZyb21SZXNpemUob2xkSGVpZ2h0LCBsb29rdXBIZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVFc3RpbWF0ZWRIZWlnaHQobG9va3VwSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGVpZ2h0Q291bnQgKz0gbG9va3VwSGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAoaGVpZ2h0Q291bnQgPiB0aGlzLmNvbnRhaW5lckhlaWdodCEpIHtcbiAgICAgICAgICAgICAgdGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCsrO1xuICAgICAgICAgICAgICBpZiAodGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gaGVpZ2h0Q291bnQgLSB0aGlzLmNvbnRhaW5lckhlaWdodCE7XG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZS5zdGFydEluZGV4ID0gYmF0Y2hPYmouaW5kZXg7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBiYXRjaE9iai5pbmRleDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZU92ZXJmbG93SGVpZ2h0ICs9IGxvb2t1cEhlaWdodDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCA9IGJhdGNoT2JqLmluZGV4O1xuICAgICAgICAgICAgICB0aGlzLmFkanVzdGVkU3RhcnRJbmRleCA9IGJhdGNoT2JqLmluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuICAgICAgICAgIGJhdGNoU2l6ZSA9IHRoaXMuZ2V0RXN0aW1hdGVkQ2hpbGRJbnNlcnRpb25zKHRoaXMuY29udGFpbmVySGVpZ2h0ISAtIHRoaXMubGFzdEhlaWdodCkgKyBOdW1iZXIodGhpcy5wcmVJdGVtT3ZlcmZsb3cpO1xuICAgICAgICAgIGlmIChiYXRjaFNpemUgPD0gMCkge1xuICAgICAgICAgICAgYmF0Y2hTaXplID0gTnVtYmVyKHRoaXMucHJlSXRlbU92ZXJmbG93KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaXRlbXNUb0JhdGNoID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVJdGVtT3ZlcmZsb3dDb3VudCA+PSB0aGlzLnByZUl0ZW1PdmVyZmxvdykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG92ZXJmbG93O1xuICB9XG5cbiAgcHVibGljIHNjcm9sbFRvRXhhY3QoaW5kZXg6IG51bWJlciwgb3ZlcmZsb3c6IG51bWJlciA9IDApOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXRlbXMgfHwgdGhpcy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2V0TGFzdEhlaWdodCgpO1xuICAgIGluZGV4ID0gdGhpcy5tYWludGFpbkluZGV4SW5Cb3VuZHMoaW5kZXgpO1xuICAgIG92ZXJmbG93ID0gaW5kZXggPT09IDAgJiYgb3ZlcmZsb3cgPCAwID8gMCA6IG92ZXJmbG93O1xuXG4gICAgdGhpcy5hZGp1c3RlZFN0YXJ0SW5kZXggPSBpbmRleCAtIE51bWJlcih0aGlzLnByZUl0ZW1PdmVyZmxvdykgPD0gMCA/IDAgOiBpbmRleCAtIE51bWJlcih0aGlzLnByZUl0ZW1PdmVyZmxvdyk7XG5cbiAgICB0aGlzLnByZUl0ZW1PdmVyZmxvd0NvdW50ID0gLTE7XG4gICAgdGhpcy5wb3N0SXRlbU92ZXJmbG93Q291bnQgPSAtMTtcbiAgICB0aGlzLmxhc3RWaXNpYmxlSXRlbU92ZXJmbG93ID0gMDtcblxuICAgIHRoaXMucmFuZ2UuZW5kSW5kZXggPSAwO1xuICAgIHRoaXMucmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCA9IDA7XG5cbiAgICB0aGlzLnJlbW92ZVByZVNjcm9sbEl0ZW1zKHRoaXMubGFzdFJhbmdlLmV4dGVuZGVkU3RhcnRJbmRleCEsIE1hdGgubWluKHRoaXMuYWRqdXN0ZWRTdGFydEluZGV4LCB0aGlzLmxhc3RSYW5nZS5leHRlbmRlZEVuZEluZGV4ISkpO1xuXG4gICAgdGhpcy5hZGRTY3JvbGxJdGVtcyhpbmRleCwgb3ZlcmZsb3cpO1xuXG4gICAgdGhpcy5yZW1vdmVQb3N0U2Nyb2xsSXRlbXModGhpcy5sYXN0UmFuZ2UuZXh0ZW5kZWRFbmRJbmRleCEgLSAxLCBNYXRoLm1heCh0aGlzLmxhc3RSYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghLCB0aGlzLnJhbmdlLmV4dGVuZGVkRW5kSW5kZXgpKTtcblxuICAgIGlmICghdGhpcy5mb3JjZWRFbmRJbmRleCkge1xuICAgICAgb3ZlcmZsb3cgPSB0aGlzLmFkZE1pc3NpbmdQb3N0U2Nyb2xsSXRlbXNBbmRVcGRhdGVPdmVyZmxvdyhpbmRleCwgb3ZlcmZsb3cpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TGFzdFJhbmdlVG9DdXJyZW50UmFuZ2UoKTtcblxuICAgIHRoaXMuc2V0U2Nyb2xsU3BhY2VycygpO1xuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5wcmVPdmVyZmxvd0hlaWdodCArIG92ZXJmbG93ICsgdGhpcy5lc3RpbWF0ZWRQcmVMaXN0SGVpZ2h0O1xuICAgIHRoaXMubGlzdENvbnRlbnQhLnNjcm9sbFRvcCA9IHRoaXMubGFzdFNjcm9sbFRvcDtcbiAgICB0aGlzLmN1cnJlbnRTY3JvbGxUb3AgPSB0aGlzLmxhc3RTY3JvbGxUb3A7XG5cbiAgICB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSA9IG92ZXJmbG93O1xuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hSYW5nZVVwZGF0ZUV2ZW50cyh0aGlzLnJhbmdlVXBkYXRlZCwgdGhpcy5yYW5nZSwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgdGhpcy52aWV3cG9ydEhhc1Njcm9sbGVkID0gdHJ1ZTtcblxuICB9XG5cbiAgcHJpdmF0ZSBnZXRSYW5nZUNoYW5nZShzY3JvbGxDaGFuZ2U6IG51bWJlcikge1xuICAgIGxldCBoZWlnaHRDb3VudCA9IDA7XG4gICAgbGV0IHJhbmdlU3RhcnRDb3VudCA9IDA7XG4gICAgbGV0IG92ZXJmbG93ID0gMDtcbiAgICBjb25zdCBuZXdSYW5nZTogUmFuZ2UgPSB7IHN0YXJ0SW5kZXg6IG51bGwsIGVuZEluZGV4OiBudWxsLCBleHRlbmRlZFN0YXJ0SW5kZXg6IG51bGwsIGV4dGVuZGVkRW5kSW5kZXg6IG51bGwgfTtcbiAgICBsZXQgaXRlbU5hbWU7XG5cbiAgICBpZiAoc2Nyb2xsQ2hhbmdlID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleDsgaSEgPD0gdGhpcy5yYW5nZS5lbmRJbmRleCEgKyBOdW1iZXIodGhpcy5pdGVtTG9hZExpbWl0KTsgaSErKykge1xuICAgICAgICBvdmVyZmxvdyA9IHNjcm9sbENoYW5nZSAtIGhlaWdodENvdW50O1xuICAgICAgICBpdGVtTmFtZSA9ICdpdGVtJyArIGk7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV0pIHtcbiAgICAgICAgICBoZWlnaHRDb3VudCArPSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVpZ2h0Q291bnQgKz0gdGhpcy5hdmdJdGVtSGVpZ2h0ITtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoZWlnaHRDb3VudCA+PSBzY3JvbGxDaGFuZ2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmdlU3RhcnRDb3VudCsrO1xuICAgICAgfVxuXG4gICAgICBuZXdSYW5nZS5zdGFydEluZGV4ID0gdGhpcy5yYW5nZS5zdGFydEluZGV4ISArIHJhbmdlU3RhcnRDb3VudDtcbiAgICAgIG5ld1JhbmdlLmVuZEluZGV4ID0gcmFuZ2VTdGFydENvdW50IDwgdGhpcy5yYW5nZS5lbmRJbmRleCEgLSB0aGlzLnJhbmdlLnN0YXJ0SW5kZXghID8gdGhpcy5yYW5nZS5lbmRJbmRleCA6IG5ld1JhbmdlLnN0YXJ0SW5kZXggKyAxO1xuICAgIH1cblxuICAgIGlmIChzY3JvbGxDaGFuZ2UgPCAwKSB7XG4gICAgICByYW5nZVN0YXJ0Q291bnQgPSAtMTtcbiAgICAgIG92ZXJmbG93ID0gc2Nyb2xsQ2hhbmdlO1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpdGVtTmFtZSA9ICdpdGVtJyArIGk7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV0pIHtcbiAgICAgICAgICBvdmVyZmxvdyArPSB0aGlzLmhlaWdodExvb2t1cFtpdGVtTmFtZV07XG4gICAgICAgICAgaGVpZ2h0Q291bnQgKz0gdGhpcy5oZWlnaHRMb29rdXBbaXRlbU5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG92ZXJmbG93ICs9IHRoaXMuYXZnSXRlbUhlaWdodCE7XG4gICAgICAgICAgaGVpZ2h0Q291bnQgKz0gdGhpcy5hdmdJdGVtSGVpZ2h0ITtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdmVyZmxvdyA+PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByYW5nZVN0YXJ0Q291bnQtLTtcbiAgICAgIH1cblxuICAgICAgbmV3UmFuZ2Uuc3RhcnRJbmRleCA9IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgKyByYW5nZVN0YXJ0Q291bnQgPj0gMCA/IHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgKyByYW5nZVN0YXJ0Q291bnQgOiAwO1xuICAgICAgbmV3UmFuZ2UuZW5kSW5kZXggPSByYW5nZVN0YXJ0Q291bnQgPCB0aGlzLnJhbmdlLmVuZEluZGV4ISAtIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCEgPyB0aGlzLnJhbmdlLmVuZEluZGV4IDogbmV3UmFuZ2Uuc3RhcnRJbmRleCArIDE7XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGxDaGFuZ2VCeUZpcnN0SW5kZXhlZEl0ZW0gPSBvdmVyZmxvdztcblxuICAgIHJldHVybiBuZXdSYW5nZTtcbiAgfVxuXG4gIHB1YmxpYyByZWZyZXNoVmlld3BvcnQocmVjYWxjdWxhdGVSb3dzOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAocmVjYWxjdWxhdGVSb3dzKSB7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5yYW5nZS5leHRlbmRlZFN0YXJ0SW5kZXghOyBpIDwgdGhpcy5yYW5nZS5leHRlbmRlZEVuZEluZGV4ITsgaSsrKSB7XG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGVSb3dIZWlnaHQoaSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2Nyb2xsVG9FeGFjdCh0aGlzLnJhbmdlLnN0YXJ0SW5kZXghLCB0aGlzLnNjcm9sbENoYW5nZUJ5Rmlyc3RJbmRleGVkSXRlbSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlU2Nyb2xsRnJvbVJhbmdlKG5ld1JhbmdlOiBSYW5nZSk6IHZvaWQge1xuICAgIGlmIChuZXdSYW5nZS5zdGFydEluZGV4ICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5yYW5nZS5zdGFydEluZGV4ICE9PSBuZXdSYW5nZS5zdGFydEluZGV4IHx8IHRoaXMubGFzdFZpc2libGVJdGVtT3ZlcmZsb3cgPCAwKSB7XG4gICAgICAgIHRoaXMucmFuZ2Uuc3RhcnRJbmRleCA9IG5ld1JhbmdlLnN0YXJ0SW5kZXg7XG4gICAgICAgIHRoaXMucmFuZ2UuZW5kSW5kZXggPSBuZXdSYW5nZS5lbmRJbmRleDtcblxuICAgICAgICB0aGlzLnJlZnJlc2hWaWV3cG9ydCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdGhpcy5jdXJyZW50U2Nyb2xsVG9wO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0aGlzLmN1cnJlbnRTY3JvbGxUb3A7XG4gIH1cblxuICBwcml2YXRlIGluaXRTY3JvbGwob3B0aW9uczogSVNjcm9sbE9wdGlvbnMpIHtcbiAgICB0aGlzLml0ZW1zID0gb3B0aW9ucy5pdGVtcztcbiAgICB0aGlzLl9jbG9uZU1ldGhvZCA9IG9wdGlvbnMuZ2VuZXJhdGVDbG9uZU1ldGhvZDtcbiAgICBjb25zdCBpdGVtc0FyZUVtcHR5OiBib29sZWFuID0gdGhpcy5pdGVtcy5sZW5ndGggPT09IDA7XG4gICAgbGV0IGluZGV4ID0gb3B0aW9ucy5pbml0aWFsSW5kZXggPyBvcHRpb25zLmluaXRpYWxJbmRleCA6IDA7XG5cbiAgICBpZiAodGhpcy52aXJ0dWFsTmV4dXMgJiYgdGhpcy52aXJ0dWFsTmV4dXMudmlydHVhbEZvckRpcmVjdGl2ZS5fdGVtcGxhdGUpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNsb25lRnJvbVRlbXBsYXRlUmVmID0gdHJ1ZTtcbiAgICAgICAgdGhpcy52ZXJpZnlWaWV3cG9ydElzUmVhZHkoKTtcbiAgICAgICAgdGhpcy5pbml0Rmlyc3RTY3JvbGwoaW5kZXgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRlbXBsYXRlSUQhKTtcbiAgICAgIHRoaXMudmVyaWZ5Vmlld3BvcnRJc1JlYWR5KCk7XG4gICAgICB0aGlzLmluaXRGaXJzdFNjcm9sbChpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2ZXJpZnlWaWV3cG9ydElzUmVhZHkoKSB7XG4gICAgaWYgKHRoaXMudGVtcGxhdGVJRCA9PT0gJycgJiYgIXRoaXMudGVtcGxhdGVJc1NldCgpKSB7XG4gICAgICB0aHJvdyBFcnJvcignU2Nyb2xsIHZpZXdwb3J0IHRlbXBsYXRlIElEIGlzIG5vdCBzZXQuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pdGVtc0FyZVNldCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Njcm9sbCB2aWV3cG9ydCByZXF1aXJlcyBhbiBhcnJheSBvZiBpdGVtcy4gIFBsZWFzZSBzdXBwbHkgYW4gaXRlbXMgYXJyYXkuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5jbG9uZU1ldGhvZElzU2V0KCkgJiYgIXRoaXMudGVtcGxhdGVJc1NldCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Njcm9sbCB2aWV3cG9ydCByZXF1aXJlcyBhIGNsb25pbmcgbWV0aG9kIG9yIGEgdGVtcGxhdGUuICBQbGVhc2Ugc3VwcGx5IGEgbWV0aG9kIGFzIGZvbGxvd3M6XFxuXFxuICh0ZW1wbGF0ZTogSFRNTEVsZW1lbnQsIGl0ZW1zOiBhbnlbXSwgaW5kZXg6IG51bWJlcikgPT4gTm9kZVxcblxcbiBvciBzdXBwbHkgYSB0YWJsZWpzVmlydHVhbEZvcicpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdEZpcnN0U2Nyb2xsKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtc0FyZUVtcHR5OiBib29sZWFuID0gdGhpcy5pdGVtcyEubGVuZ3RoID09PSAwO1xuICAgIHRoaXMucmVmcmVzaENvbnRhaW5lckhlaWdodCgpO1xuICAgIGlmIChpdGVtc0FyZUVtcHR5KSB7XG4gICAgICB0aGlzLml0ZW1zIS5wdXNoKHRoaXMucGxhY2Vob2xkZXJPYmplY3QpO1xuICAgICAgdGhpcy5zY3JvbGxUb0V4YWN0KGluZGV4LCAwKTtcbiAgICAgIGNvbnN0IG5vZGU6IEhUTUxFbGVtZW50ID0gKHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl92aWV3Q29udGFpbmVyLmdldCgxKSBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdO1xuICAgICAgdGhpcy5yZW5kZXJlciEuc2V0U3R5bGUobm9kZSwgJ2hlaWdodCcsICcwcHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIhLnNldFN0eWxlKG5vZGUsICdtaW5IZWlnaHQnLCAnMHB4Jyk7XG4gICAgICB0aGlzLnJlbmRlcmVyIS5zZXRTdHlsZShub2RlLCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9FeGFjdChpbmRleCwgMCk7XG4gICAgfVxuICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UuZGlzcGF0Y2hWaWV3cG9ydEluaXRpYWxpemVkRXZlbnRzKHRoaXMudmlld3BvcnRJbml0aWFsaXplZCwgdGhpcywgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpdGVtc0FyZVNldCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLml0ZW1zO1xuICB9XG4gIHByaXZhdGUgY2xvbmVNZXRob2RJc1NldCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9jbG9uZU1ldGhvZDtcbiAgfVxuICBwcml2YXRlIHRlbXBsYXRlSXNTZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl90ZW1wbGF0ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmlydHVhbE5leHVzIS52aXJ0dWFsRm9yRGlyZWN0aXZlLl90ZW1wbGF0ZSAhPT0gbnVsbDtcbiAgfVxuXG59XG4iXX0=