import { ComponentFactoryResolver, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Injector, Input, Output, ViewContainerRef, RendererFactory2 } from '@angular/core';
import { DragAndDropGhostComponent } from './../../components/drag-and-drop-ghost/drag-and-drop-ghost.component';
import { DOCUMENT } from '@angular/common';
import { TablejsGridProxy } from './../../shared/classes/tablejs-grid-proxy';
import { GridService } from './../../services/grid/grid.service';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { ScrollDispatcherService } from './../../services/scroll-dispatcher/scroll-dispatcher.service';
import { OperatingSystemService } from './../../services/operating-system/operating-system.service';
import { ResizeSensor } from 'css-element-queries';
import { Subject } from 'rxjs';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
export class GridDirective extends TablejsGridProxy {
    constructor(viewContainerRef, elementRef, resolver, gridService, directiveRegistrationService, document, overlay, scrollDispatcherService, operatingSystem, rendererFactory) {
        super();
        this.viewContainerRef = viewContainerRef;
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
            this.scrollViewportDirective = new ScrollViewportDirective(viewportRef, this.gridService, this.document, this.directiveRegistrationService, this.scrollDispatcherService, this.operatingSystem, this.resolver, null, this.rendererFactory);
            this.scrollViewportDirective.registerCustomElementsInputs(viewport);
            this.scrollViewportDirective.ngOnInit();
            this.scrollViewportDirective.ngAfterViewInit();
        }
        // Close observer if directives are registering
        this.elementRef.nativeElement.directive = this;
        if (!this.document['hasPointerDownListener']) {
            this.document.addEventListener('pointerdown', (e) => {
                let el = e.target;
                if (el) {
                    while (el !== null && el.getAttribute('tablejsGrid') === null) {
                        el = el.parentElement;
                    }
                    if (el) {
                        el['directive'].onPointerDown(e);
                    }
                }
            });
            this.document['hasPointerDownListener'] = true;
        }
        window.requestAnimationFrame((timestamp) => {
            this.onEnterFrame(this, timestamp);
        });
    }
    onEnterFrame(ths, timestamp) {
        if (this.columnsWithDataClasses.length > 0) {
            this.observer.disconnect();
        }
        if (this.columnsWithDataClasses.length === 0 && this.mutationColumnsWithDataClasses.length === 0) {
            window.requestAnimationFrame((tmstamp) => {
                ths.onEnterFrame(ths, tmstamp);
            });
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
        this.initialWidthSettingsSubscription$ = this.gridService.containsInitialWidthSettings.subscribe(hasWidths => {
            this.initialWidthsAreSet = hasWidths;
        });
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
            window.requestAnimationFrame((tmstamp) => {
                ths.onEnterFrame(ths, tmstamp);
            });
        }
        else {
            const keys = Object.keys(this.initialWidths);
            if (this.initialWidthsAreSet === true && keys.length < maxColumnsPerRow) {
                window.requestAnimationFrame((tmstamp) => {
                    ths.awaitWidths(ths, tmstamp);
                });
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
            window.requestAnimationFrame((tmstamp) => {
                this.awaitWidths(this, tmstamp);
            });
        }
        else if (this.initialWidthsAreSet === undefined) {
            window.requestAnimationFrame((tmstamp) => {
                this.awaitWidths(this, tmstamp);
            });
        }
        else {
            if (!this.linkClass) {
                this.initGrid();
            }
            else {
                window.requestAnimationFrame((tmstamp) => {
                    this.awaitSingleFrame(this, tmstamp);
                });
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
        if (this.headTag.contains(this.headStyle)) {
            this.headTag.removeChild(this.headStyle);
        }
        if (this.headTag.contains(this.widthStyle)) {
            this.headTag.removeChild(this.widthStyle);
            this.widthStyleFragment = null;
        }
        if (this.headTag.contains(this.reorderHighlightStyle)) {
            this.headTag.removeChild(this.reorderHighlightStyle);
            this.reorderHighlightStyleFragment = null;
        }
        for (let i = 0, len = this.subGroupFragments.length; i < len; i++) {
            if (this.headTag.contains(this.subGroupStyles[i])) {
                this.headTag.removeChild(this.subGroupStyles[i]);
                this.subGroupFragments[i] = null;
            }
        }
        for (let i = 0, len = this.gridOrderFragments.length; i < len; i++) {
            if (this.headTag.contains(this.gridOrderStyles[i])) {
                this.headTag.removeChild(this.gridOrderStyles[i]);
                this.gridOrderFragments[i] = null;
            }
        }
    }
    ngOnDestroy() {
        this.document['hasPointerDownListener'] = false;
        this.observer.disconnect();
        if (this.linkClass === undefined) {
            this.removeStylesFromHead();
        }
        if (this.initialWidthSettingsSubscription$) {
            this.initialWidthSettingsSubscription$.unsubscribe();
        }
        if (this.hiddenColumnChangesSubscription$) {
            this.hiddenColumnChangesSubscription$.unsubscribe();
        }
    }
}
GridDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tablejsGrid],[tablejsgrid]',
                host: { class: 'tablejs-table-container tablejs-table-width' }
            },] }
];
GridDirective.ctorParameters = () => [
    { type: ViewContainerRef },
    { type: ElementRef },
    { type: ComponentFactoryResolver },
    { type: GridService },
    { type: DirectiveRegistrationService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: Overlay },
    { type: ScrollDispatcherService },
    { type: OperatingSystemService },
    { type: RendererFactory2 }
];
GridDirective.propDecorators = {
    linkClass: [{ type: Input }],
    resizeColumnWidthByPercent: [{ type: Input }],
    columnResizeStart: [{ type: Output }],
    columnResize: [{ type: Output }],
    columnResizeEnd: [{ type: Output }],
    columnReorder: [{ type: Output }],
    columnReorderStart: [{ type: Output }],
    dragOver: [{ type: Output }],
    columnReorderEnd: [{ type: Output }],
    preGridInitialize: [{ type: Output }],
    gridInitialize: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvZGlyZWN0aXZlcy9ncmlkL2dyaWQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUQsd0JBQXdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQWEsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3TyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxzRUFBc0UsQ0FBQztBQUNqSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDN0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHdFQUF3RSxDQUFDO0FBRXRILE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FB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QUMsaUNBQWlDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdEQ7UUFDRCxJQUFJLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRTtZQUN6QyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckQ7SUFDSCxDQUFDOzs7WUFoNUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNkJBQTZCO2dCQUN2QyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsNkNBQTZDLEVBQUU7YUFDL0Q7OztZQXhCa0wsZ0JBQWdCO1lBQXRHLFVBQVU7WUFBL0Msd0JBQXdCO1lBSXZFLFdBQVc7WUFDWCw0QkFBNEI7NENBcUloQyxNQUFNLFNBQUMsUUFBUTtZQTNIWCxPQUFPO1lBSlAsdUJBQXVCO1lBQ3ZCLHNCQUFzQjtZQVpzSyxnQkFBZ0I7Ozt3QkF1SGxOLEtBQUs7eUNBQ0wsS0FBSztnQ0FFTCxNQUFNOzJCQUNOLE1BQU07OEJBQ04sTUFBTTs0QkFDTixNQUFNO2lDQUNOLE1BQU07dUJBQ04sTUFBTTsrQkFDTixNQUFNO2dDQUNOLE1BQU07NkJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudFJlZiwgQ29tcG9uZW50RmFjdG9yeSwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBJbmplY3QsIEluamVjdGlvblRva2VuLCBJbmplY3RvciwgSW5wdXQsIE91dHB1dCwgVmlld0NvbnRhaW5lclJlZiwgUmVuZGVyZXJGYWN0b3J5MiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCB9IGZyb20gJy4vLi4vLi4vY29tcG9uZW50cy9kcmFnLWFuZC1kcm9wLWdob3N0L2RyYWctYW5kLWRyb3AtZ2hvc3QuY29tcG9uZW50JztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFRhYmxlanNHcmlkUHJveHkgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL3RhYmxlanMtZ3JpZC1wcm94eSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi9kaXJlY3RpdmUtcmVnaXN0cmF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSUNvbHVtbkRhdGEgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9pbnRlcmZhY2VzL2ktY29sdW1uLWRhdGEnO1xuaW1wb3J0IHsgQ29sdW1uUmVvcmRlckV2ZW50IH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy9ldmVudHMvY29sdW1uLXJlb3JkZXItZXZlbnQnO1xuaW1wb3J0IHsgQ29sdW1uUmVzaXplRXZlbnQgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL2V2ZW50cy9jb2x1bW4tcmVzaXplLWV2ZW50JztcbmltcG9ydCB7IEdyaWRFdmVudCB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2NsYXNzZXMvZXZlbnRzL2dyaWQtZXZlbnQnO1xuaW1wb3J0IHsgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgfSBmcm9tICcuLy4uLy4uL2RpcmVjdGl2ZXMvc2Nyb2xsLXZpZXdwb3J0L3Njcm9sbC12aWV3cG9ydC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgU2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL3Njcm9sbC1kaXNwYXRjaGVyL3Njcm9sbC1kaXNwYXRjaGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgT3BlcmF0aW5nU3lzdGVtU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvb3BlcmF0aW5nLXN5c3RlbS9vcGVyYXRpbmctc3lzdGVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzaXplU2Vuc29yIH0gZnJvbSAnY3NzLWVsZW1lbnQtcXVlcmllcyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYsIFBvc2l0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IElDb2x1bW5IaWVyYXJjaHkgfSBmcm9tICcuLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9pLWNvbHVtbi1oaWVyYXJjaHknO1xuaW1wb3J0IHsgSUNvbHVtbkhpZGVDaGFuZ2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9ldmVudHMvaS1jb2x1bW4taGlkZS1jaGFuZ2UnO1xuaW1wb3J0IHsgSGlkZUNvbHVtbklmRGlyZWN0aXZlIH0gZnJvbSAnLi4vaGlkZS1jb2x1bW4taWYvaGlkZS1jb2x1bW4taWYuZGlyZWN0aXZlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3RhYmxlanNHcmlkXSxbdGFibGVqc2dyaWRdJyxcbiAgaG9zdDogeyBjbGFzczogJ3RhYmxlanMtdGFibGUtY29udGFpbmVyIHRhYmxlanMtdGFibGUtd2lkdGgnIH1cbn0pXG5leHBvcnQgY2xhc3MgR3JpZERpcmVjdGl2ZSBleHRlbmRzIFRhYmxlanNHcmlkUHJveHkgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIGRyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHJlb3JkZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgc3RhcnRYOiBudW1iZXIgPSAwO1xuICBzdGFydFk6IG51bWJlciA9IDA7XG4gIHN0eWxlc0J5Q2xhc3M6IGFueVtdID0gW107XG4gIGlkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgdmlld3BvcnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHZpZXdwb3J0SUQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjdXJyZW50Q2xhc3Nlc1RvUmVzaXplOiBzdHJpbmdbXSA9IFtdO1xuICBzdGFydGluZ1dpZHRoczogbnVtYmVyW10gPSBbXTtcbiAgbWluV2lkdGhzOiBudW1iZXJbXSA9IFtdO1xuICB0b3RhbENvbXB1dGVkTWluV2lkdGg6IG51bWJlciA9IDA7XG4gIHRvdGFsQ29tcHV0ZWRXaWR0aDogbnVtYmVyID0gMDtcbiAgZGVmYXVsdFRhYmxlTWluV2lkdGg6IG51bWJlciA9IDI1O1xuICBncmlkVGVtcGxhdGVDbGFzc2VzOiBzdHJpbmdbXSA9IFtdO1xuICBncmlkT3JkZXI6IG51bWJlcltdID0gW107XG4gIGNsYXNzV2lkdGhzOiBhbnlbXSA9IFtdO1xuICBncmlkVGVtcGxhdGVUeXBlczogYW55W10gPSBbXTtcbiAgZHJhZ2dpbmdDb2x1bW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIGNvbFJhbmdlR3JvdXBzOiBudW1iZXJbXVtdW10gPSBbXTtcbiAgbGFzdERyYWdnZWRPdmVyRWxlbWVudDogYW55ID0gbnVsbDtcbiAgbGFzdERyYWdnZWRHcm91cEluZGV4OiBudW1iZXIgPSAtMTtcbiAgbGFzdERyYWdnZWRPdmVyUmVjdDogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuICBsYXN0RHJhZ2dlZEdyb3VwQm91bmRpbmdSZWN0czogQ2xpZW50UmVjdFtdIHwgbnVsbCA9IG51bGw7XG4gIGxhc3RNb3ZlRGlyZWN0aW9uOiBudW1iZXIgPSAtMTtcbiAgcmVzaXphYmxlQ29sdW1uczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICByZXNpemFibGVHcmlwczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICByZW9yZGVyR3JpcHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgcmVvcmRlcmFibGVDb2x1bW5zOiBIVE1MRWxlbWVudFtdID0gW107XG4gIGNvbHVtbnNXaXRoRGF0YUNsYXNzZXM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgcm93czogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBpbmZpbml0ZVNjcm9sbFZpZXdwb3J0czogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBtdXRhdGlvblJlc2l6YWJsZUNvbHVtbnM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgbXV0YXRpb25SZXNpemFibGVHcmlwczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBtdXRhdGlvblJlb3JkZXJHcmlwczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBtdXRhdGlvblJlb3JkZXJhYmxlQ29sdW1uczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBtdXRhdGlvbkNvbHVtbnNXaXRoRGF0YUNsYXNzZXM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgbXV0YXRpb25Sb3dzOiBIVE1MRWxlbWVudFtdID0gW107XG4gIG11dGF0aW9uSW5maW5pdGVTY3JvbGxWaWV3cG9ydHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgaGVhZFRhZzogSFRNTEhlYWRFbGVtZW50ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICBzdHlsZUNvbnRlbnQ6IHN0cmluZyA9ICcnO1xuICBoZWFkU3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgc3R5bGVMaXN0OiBIVE1MU3R5bGVFbGVtZW50W10gPSBbXTtcbiAgaW5pdGlhbFdpZHRoczogYW55W10gPSBbXTtcbiAgaW5pdGlhbFdpZHRoc0FyZVNldDogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgbGFzdENvbHVtbnM6IGFueVtdID0gW107XG4gIGNvbnRlbnRSZXNpemVTZW5zb3I6IFJlc2l6ZVNlbnNvciB8IG51bGwgPSBudWxsO1xuICBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IG51bGwgPSBudWxsO1xuICBpc0N1c3RvbUVsZW1lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwYXJlbnRHcm91cHM6IEVsZW1lbnRbXVtdID0gW107XG5cbiAgY29sRGF0YTogSUNvbHVtbkRhdGEgfCBudWxsID0gbnVsbDtcbiAgY29sRGF0YUdyb3VwczogSUNvbHVtbkRhdGFbXVtdID0gW107XG4gIGVsZW1lbnRzV2l0aEhpZ2hsaWdodDogYW55W10gPSBbXTtcblxuICBkcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50OiBEcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50IHwgbnVsbCA9IG51bGw7XG4gIGRyYWdPZmZzZXRYOiBudW1iZXIgPSAwO1xuICBkcmFnT2Zmc2V0WTogbnVtYmVyID0gMDtcbiAgcmVvcmRlckhhbmRsZUNvbE9mZnNldDogbnVtYmVyID0gMDtcbiAgc2Nyb2xsYmFyV2lkdGg6IG51bWJlciA9IDA7XG5cbiAgaW5pdGlhbFdpZHRoU2V0dGluZ3NTdWJzY3JpcHRpb24kOiBTdWJzY3JpcHRpb247XG5cbiAgLy8gY2xhc3MgdXNlZCBmb3Igc2V0dGluZyBvcmRlclxuICByZW9yZGVyYWJsZUNsYXNzOiBzdHJpbmcgPSAncmVvcmRlcmFibGUtdGFibGUtcm93JztcblxuICAvLyBmcmFnbWVudHNcbiAgd2lkdGhTdHlsZTogSFRNTFN0eWxlRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICB3aWR0aFN0eWxlRnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQgfCBudWxsID0gbnVsbDtcbiAgcmVvcmRlckhpZ2hsaWdodFN0eWxlOiBIVE1MU3R5bGVFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHJlb3JkZXJIaWdobGlnaHRTdHlsZUZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50IHwgbnVsbCA9IG51bGw7XG4gIHN1Ykdyb3VwU3R5bGVzOiBIVE1MU3R5bGVFbGVtZW50W10gPSBbXTtcbiAgc3ViR3JvdXBGcmFnbWVudHM6IChEb2N1bWVudEZyYWdtZW50IHwgbnVsbClbXSA9IFtdO1xuICBncmlkT3JkZXJTdHlsZXM6IEhUTUxTdHlsZUVsZW1lbnRbXSA9IFtdO1xuICBncmlkT3JkZXJGcmFnbWVudHM6IChEb2N1bWVudEZyYWdtZW50IHwgbnVsbClbXSA9IFtdO1xuICBzdWJHcm91cFN0eWxlT2JqczogYW55ID0ge307XG4gIHNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudCB8IG51bGwgPSBudWxsO1xuICBzY3JvbGxiYXJBZGp1c3RtZW50U3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcmVzaXplTWFrZVVwUGVyY2VudDogbnVtYmVyID0gMDtcbiAgcmVzaXplTWFrZVVwUGVyQ29sUGVyY2VudDogbnVtYmVyID0gMDtcblxuICBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgfCBudWxsID0gbnVsbDtcbiAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZjtcbiAgaGlkZGVuQ29sdW1uSW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgcHVibGljIGhpZGRlbkNvbHVtbkNoYW5nZXM6IFN1YmplY3Q8SUNvbHVtbkhpZGVDaGFuZ2UgfCBudWxsPiA9IG5ldyBTdWJqZWN0PElDb2x1bW5IaWRlQ2hhbmdlIHwgbnVsbD4oKTtcbiAgcHJpdmF0ZSBoaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJDogU3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgSElEREVOX0NPTFVNTl9DTEFTUzogc3RyaW5nID0gJ2NvbHVtbi1pcy1oaWRkZW4nO1xuXG4gIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yO1xuICBwcml2YXRlIERSQUdfQU5EX0RST1BfR0hPU1RfT1ZFUkxBWV9EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ0RSQUdfQU5EX0RST1BfR0hPU1RfT1ZFUkxBWV9EQVRBJyk7XG5cbiAgQElucHV0KCkgbGlua0NsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGNvbHVtblJlc2l6ZVN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVzaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVzaXplRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNvbHVtblJlb3JkZXJTdGFydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGRyYWdPdmVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVvcmRlckVuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHByZUdyaWRJbml0aWFsaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55Pih0cnVlKTtcbiAgQE91dHB1dCgpIGdyaWRJbml0aWFsaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55Pih0cnVlKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSxcbiAgICBwcml2YXRlIGRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2U6IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIHNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlOiBTY3JvbGxEaXNwYXRjaGVyU2VydmljZSxcbiAgICBwcml2YXRlIG9wZXJhdGluZ1N5c3RlbTogT3BlcmF0aW5nU3lzdGVtU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5Mikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5yZWdpc3RlckRpcmVjdGl2ZVRvRWxlbWVudCgpO1xuICAgIHRoaXMuYXR0YWNoTXV0YXRpb25PYnNlcnZlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckRpcmVjdGl2ZVRvRWxlbWVudCgpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ncmlkRGlyZWN0aXZlID0gdGhpcztcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmdyaWREaXJlY3RpdmUgPSB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hNdXRhdGlvbk9ic2VydmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IHRoczogYW55ID0gdGhpcztcbiAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgICB0aHMudXBkYXRlTXV0YXRpb25zKG11dGF0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAvLyBjb25maWd1cmUgaXQgdG8gbGlzdGVuIHRvIGF0dHJpYnV0ZSBjaGFuZ2VzXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIGNoYXJhY3RlckRhdGE6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU11dGF0aW9ucyhtdXRhdGlvbjogTXV0YXRpb25SZWNvcmQpOiB2b2lkIHtcbiAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgIGNvbnN0IGFkZGVkTm9kZXMgPSBBcnJheS5mcm9tKG11dGF0aW9uLmFkZGVkTm9kZXMpO1xuICAgICAgYWRkZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZS5yZWdpc3Rlck5vZGVBdHRyaWJ1dGVzKG5vZGUpO1xuICAgICAgICB0aGlzLmdldENoaWxkTm9kZXMobm9kZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldENoaWxkTm9kZXMobm9kZTogYW55KSB7XG4gICAgbm9kZS5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkTm9kZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UucmVnaXN0ZXJOb2RlQXR0cmlidXRlcyhjaGlsZE5vZGUpO1xuICAgICAgaWYgKGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZE5vZGVzKGNoaWxkTm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIFxuXG4gICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcqW3RhYmxlanNTY3JvbGxWaWV3cG9ydF0nKTtcbiAgICBpZiAodmlld3BvcnQgIT09IG51bGwgJiYgKHZpZXdwb3J0LnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlID09PSBudWxsIHx8IHZpZXdwb3J0LnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAvLyBhdHRhY2ggZGlyZWN0aXZlXG4gICAgICBjb25zdCB2aWV3cG9ydFJlZjogRWxlbWVudFJlZiA9IG5ldyBFbGVtZW50UmVmKHZpZXdwb3J0KTtcbiAgICAgIFxuICAgICAgdGhpcy5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9IG5ldyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZShcbiAgICAgICAgdmlld3BvcnRSZWYsXG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UsXG4gICAgICAgIHRoaXMuZG9jdW1lbnQsXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZSxcbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyU2VydmljZSxcbiAgICAgICAgdGhpcy5vcGVyYXRpbmdTeXN0ZW0sXG4gICAgICAgIHRoaXMucmVzb2x2ZXIsXG4gICAgICAgIG51bGwsXG4gICAgICAgIHRoaXMucmVuZGVyZXJGYWN0b3J5XG4gICAgICApO1xuXG4gICAgICB0aGlzLnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudHNJbnB1dHModmlld3BvcnQpO1xuXG4gICAgICB0aGlzLnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlLm5nT25Jbml0KCk7XG4gICAgICB0aGlzLnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuXG4gICAgfVxuICAgIFxuXG4gICAgLy8gQ2xvc2Ugb2JzZXJ2ZXIgaWYgZGlyZWN0aXZlcyBhcmUgcmVnaXN0ZXJpbmdcblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpcmVjdGl2ZSA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50WydoYXNQb2ludGVyRG93bkxpc3RlbmVyJ10pIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgbGV0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZSgndGFibGVqc0dyaWQnKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGVsWydkaXJlY3RpdmUnXS5vblBvaW50ZXJEb3duKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRvY3VtZW50WydoYXNQb2ludGVyRG93bkxpc3RlbmVyJ10gPSB0cnVlO1xuICAgIH1cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lc3RhbXApID0+IHtcbiAgICAgIHRoaXMub25FbnRlckZyYW1lKHRoaXMsIHRpbWVzdGFtcCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uRW50ZXJGcmFtZSh0aHM6IGFueSwgdGltZXN0YW1wOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIhLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLm11dGF0aW9uQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRtc3RhbXApID0+IHtcbiAgICAgICAgdGhzLm9uRW50ZXJGcmFtZSh0aHMsIHRtc3RhbXApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3Nlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5tdXRhdGlvbkNvbHVtbnNXaXRoRGF0YUNsYXNzZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aGlzLmlzQ3VzdG9tRWxlbWVudCA9IHRydWU7XG5cbiAgICAgIHRoaXMucmVzaXphYmxlQ29sdW1ucyA9IHRoaXMubXV0YXRpb25SZXNpemFibGVDb2x1bW5zLmNvbmNhdCgpO1xuICAgICAgdGhpcy5yZXNpemFibGVHcmlwcyA9IHRoaXMubXV0YXRpb25SZXNpemFibGVHcmlwcy5jb25jYXQoKTtcbiAgICAgIHRoaXMucmVvcmRlckdyaXBzID0gdGhpcy5tdXRhdGlvblJlb3JkZXJHcmlwcy5jb25jYXQoKTtcbiAgICAgIHRoaXMucmVvcmRlcmFibGVDb2x1bW5zID0gdGhpcy5tdXRhdGlvblJlb3JkZXJhYmxlQ29sdW1ucy5jb25jYXQoKTtcbiAgICAgIHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3NlcyA9IHRoaXMubXV0YXRpb25Db2x1bW5zV2l0aERhdGFDbGFzc2VzLmNvbmNhdCgpO1xuICAgICAgdGhpcy5yb3dzID0gdGhpcy5tdXRhdGlvblJvd3MuY29uY2F0KCk7XG4gICAgICB0aGlzLmluZmluaXRlU2Nyb2xsVmlld3BvcnRzID0gdGhpcy5tdXRhdGlvbkluZmluaXRlU2Nyb2xsVmlld3BvcnRzLmNvbmNhdCgpO1xuXG4gICAgICB0aGlzLm11dGF0aW9uUmVzaXphYmxlQ29sdW1ucyA9IFtdO1xuICAgICAgdGhpcy5tdXRhdGlvblJlc2l6YWJsZUdyaXBzID0gW107XG4gICAgICB0aGlzLm11dGF0aW9uUmVvcmRlckdyaXBzID0gW107XG4gICAgICB0aGlzLm11dGF0aW9uUmVvcmRlcmFibGVDb2x1bW5zID0gW107XG4gICAgICB0aGlzLm11dGF0aW9uQ29sdW1uc1dpdGhEYXRhQ2xhc3NlcyA9IFtdO1xuICAgICAgdGhpcy5tdXRhdGlvblJvd3MgPSBbXTtcbiAgICAgIHRoaXMubXV0YXRpb25JbmZpbml0ZVNjcm9sbFZpZXdwb3J0cyA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGFsbEVsZW1lbnRzV2l0aERhdGFSZXNpemFibGU6IGFueSA9IHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3NlcztcbiAgICBjb25zdCBlbCA9IGFsbEVsZW1lbnRzV2l0aERhdGFSZXNpemFibGVbMF07XG4gICAgY29uc3QgcmVzaXplQ2xhc3Nlczogc3RyaW5nW10gPSB0aGlzLmdldFJlc2l6YWJsZUNsYXNzZXMoZWwpO1xuICAgIGNvbnN0IHJlc2l6ZUNscyA9IHJlc2l6ZUNsYXNzZXNbMF07XG4gICAgY29uc3QgZmlyc3RFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHJlc2l6ZUNscylbMF07XG5cbiAgICB0aGlzLmluaXRpYWxXaWR0aFNldHRpbmdzU3Vic2NyaXB0aW9uJCA9IHRoaXMuZ3JpZFNlcnZpY2UuY29udGFpbnNJbml0aWFsV2lkdGhTZXR0aW5ncy5zdWJzY3JpYmUoaGFzV2lkdGhzID0+IHtcbiAgICAgIHRoaXMuaW5pdGlhbFdpZHRoc0FyZVNldCA9IGhhc1dpZHRocztcbiAgICB9KTtcbiAgICBpZiAoIXRoaXMuaGlkZGVuQ29sdW1uQ2hhbmdlc1N1YnNjcmlwdGlvbiQpIHtcblxuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJCA9IHRoaXMuaGlkZGVuQ29sdW1uQ2hhbmdlcy5zdWJzY3JpYmUoXG4gICAgICAgIChjaGFuZ2U6IElDb2x1bW5IaWRlQ2hhbmdlIHwgbnVsbCkgPT4ge1xuXG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEhlYWRlcjogRWxlbWVudCB8IGFueSA9IHRoaXMuZ2V0UmVsYXRlZEhlYWRlcihjaGFuZ2UuaGllcmFyY2h5Q29sdW1uLmVsZW1lbnQpO1xuICAgICAgICAgICAgcmVsYXRlZEhlYWRlci5oaWRlQ29sdW1uID0gY2hhbmdlLmhpZGRlbjtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAoY2hhbmdlLndhc1RyaWdnZXJlZEJ5VGhpc0NvbHVtbikge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUhpZGRlbkNvbHVtbkluZGljZXMoKTtcbiAgICAgICAgICAgICAgY29uc3QgaGlkZUNvbHVtbklmOiBIaWRlQ29sdW1uSWZEaXJlY3RpdmUgPSAoY2hhbmdlLmhpZXJhcmNoeUNvbHVtbi5lbGVtZW50IGFzIGFueSkuaGlkZUNvbHVtbklmO1xuICAgICAgICAgICAgICBoaWRlQ29sdW1uSWYudXBkYXRlSGVhZGVyc1RoYXRDYW5IaWRlKCk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNoYW5nZS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgaWYgKGNoYW5nZS53YXNUcmlnZ2VyZWRCeVRoaXNDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUgPSB0aGlzLmdldFJlc2l6YWJsZUNsYXNzZXMocmVsYXRlZEhlYWRlcik7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZnV2lkdGhQZXJDb2x1bW46IG51bWJlciA9IHRoaXMuZ2V0QXZlcmFnZUNvbHVtbldpZHRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNaW5pbXVtV2lkdGhzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG90YWxUYWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLnZpZXdwb3J0IS5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBsZXQgbmV3V2lkdGg6IG51bWJlciA9IGF2Z1dpZHRoUGVyQ29sdW1uICogdGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgY2xhc3NJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NXaWR0aHNbY2xhc3NJbmRleF0gPSAoYXZnV2lkdGhQZXJDb2x1bW4gLyB0b3RhbFRhYmxlV2lkdGggKiAxMDApLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2ZXJhZ2UgYWxsIHBlcmNlbnRhZ2VzXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzV2lkdGhzW2NsYXNzSW5kZXhdID0gTWF0aC5tYXgoYXZnV2lkdGhQZXJDb2x1bW4sIHRoaXMubWluV2lkdGhzW2NsYXNzSW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmZpdFdpZHRoc1RvT25lSHVuZHJlZFBlcmNlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXaWR0aHMobmV3V2lkdGgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0R3JpZE9yZGVyKCk7IFxuICAgICAgICAgIH0gICBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnRHcm91cHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFBhcmVudEdyb3VwcyhhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlKTtcbiAgICB9XG4gICAgY29uc3QgbWF4Q29sdW1uc1BlclJvdzogbnVtYmVyID0gdGhpcy5wYXJlbnRHcm91cHNbdGhpcy5wYXJlbnRHcm91cHMubGVuZ3RoIC0gMV0ubGVuZ3RoO1xuXG4gICAgaWYgKGZpcnN0RWwgPT09IHVuZGVmaW5lZCB8fCBmaXJzdEVsID09PSBudWxsKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgIHRocy5vbkVudGVyRnJhbWUodGhzLCB0bXN0YW1wKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBrZXlzOiBhbnlbXSA9IE9iamVjdC5rZXlzKHRoaXMuaW5pdGlhbFdpZHRocyk7XG4gICAgICBpZiAodGhpcy5pbml0aWFsV2lkdGhzQXJlU2V0ID09PSB0cnVlICYmIGtleXMubGVuZ3RoIDwgbWF4Q29sdW1uc1BlclJvdykge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgICAgdGhzLmF3YWl0V2lkdGhzKHRocywgdG1zdGFtcCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jaGVja0ZvckdyaWRJbml0UmVhZHkoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2FuSGlkZUNvbHVtbihjb2x1bW46IEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKGNvbHVtbiBhcyBhbnkpLmhpZGVDb2x1bW5JZi5jYW5IaWRlO1xuICB9XG5cbiAgcHVibGljIGdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpOiBJQ29sdW1uSGllcmFyY2h5W10ge1xuICAgIGNvbnN0IGhpZXJhcmNoeTogYW55ID0gdGhpcy5nZXRDb2x1bW5IaWVyYXJjaHkoKTtcbiAgICByZXR1cm4gaGllcmFyY2h5LmNvbHVtbkdyb3Vwcy5yZWR1Y2UoKHByZXY6IGFueSwgY3VycjogYW55KSA9PiB7XG4gICAgICBsZXQgYXJyOiBhbnlbXSA9IFtjdXJyXTtcbiAgICAgIGlmIChjdXJyLnN1YkNvbHVtbnMpIHtcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdCh0aGlzLmdldFN1YkNvbHVtbnMoY3VycikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByZXYuY29uY2F0KGFycik7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdWJDb2x1bW5zKGl0ZW06IGFueSk6IGFueVtdIHtcbiAgICBpZiAoaXRlbS5zdWJDb2x1bW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBsZXQgYXJyOiBhbnlbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5zdWJDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzdWJJdGVtOiBhbnkgPSBpdGVtLnN1YkNvbHVtbnNbaV07XG4gICAgICBhcnIgPSBhcnIuY29uY2F0KHN1Ykl0ZW0pO1xuICAgICAgaWYgKHN1Ykl0ZW0uc3ViQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFyciA9IGFyci5jb25jYXQodGhpcy5nZXRTdWJDb2x1bW5zKHN1Ykl0ZW0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDb2x1bW5IaWVyYXJjaHkoKTogYW55IHtcbiAgICBjb25zdCBoaWVyYXJjaHk6IGFueSA9IHtcbiAgICAgIGNvbHVtbkdyb3VwczogW11cbiAgICB9O1xuICAgIGNvbnN0IGhpZ2hlc3RMZXZlbEdyb3VwOiBJQ29sdW1uRGF0YVtdID0gdGhpcy5jb2xEYXRhR3JvdXBzWzBdO1xuICAgIGNvbnN0IGhpZXJhcmNoeUdyb3VwOiBJQ29sdW1uSGllcmFyY2h5W10gPSBoaWdoZXN0TGV2ZWxHcm91cC5tYXAoKGl0ZW06IElDb2x1bW5EYXRhKSA9PiB7XG4gICAgICBsZXQgbGV2ZWxDb3VudDogbnVtYmVyID0gMDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxldmVsOiBsZXZlbENvdW50LFxuICAgICAgICBlbGVtZW50OiBpdGVtLmNoaWxkLFxuICAgICAgICBwYXJlbnQ6IGl0ZW0ucGFyZW50LFxuICAgICAgICBwYXJlbnRDb2x1bW46IG51bGwsXG4gICAgICAgIHN1YkNvbHVtbnM6IHRoaXMuZ2V0SGllcmFyY2h5U3ViQ29sdW1ucyhpdGVtLCBsZXZlbENvdW50KVxuICAgICAgfTtcbiAgICB9KTtcbiAgICBoaWVyYXJjaHkuY29sdW1uR3JvdXBzID0gaGllcmFyY2h5R3JvdXA7XG4gICAgcmV0dXJuIGhpZXJhcmNoeTtcbiAgfVxuXG4gIGdldEhpZXJhcmNoeVN1YkNvbHVtbnMoaXRlbTogSUNvbHVtbkRhdGEsIGxldmVsQ291bnQ6IG51bWJlcik6IElDb2x1bW5IaWVyYXJjaHlbXSB7XG4gICAgbGV2ZWxDb3VudCsrO1xuICAgIGlmICghaXRlbS5zdWJHcm91cHMgfHwgaXRlbS5zdWJHcm91cHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IHN1YkNvbHVtbnM6IElDb2x1bW5IaWVyYXJjaHlbXSA9IGl0ZW0uc3ViR3JvdXBzLm1hcCgoc3ViSXRlbTogSUNvbHVtbkRhdGEpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxldmVsOiBsZXZlbENvdW50LFxuICAgICAgICBlbGVtZW50OiBzdWJJdGVtLmNoaWxkLFxuICAgICAgICBwYXJlbnQ6IHN1Ykl0ZW0ucGFyZW50LFxuICAgICAgICBwYXJlbnRDb2x1bW46IGl0ZW0uY2hpbGQsXG4gICAgICAgIHN1YkNvbHVtbnM6IHRoaXMuZ2V0SGllcmFyY2h5U3ViQ29sdW1ucyhzdWJJdGVtLCBsZXZlbENvdW50KVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN1YkNvbHVtbnM7XG5cbiAgfVxuXG4gIHB1YmxpYyBjaGVja0ZvckdyaWRJbml0UmVhZHkoKTogdm9pZCB7XG4gICAgY29uc3QgYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTogYW55ID0gdGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzO1xuICAgIGNvbnN0IGVsID0gYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZVswXTtcbiAgICBjb25zdCByZXNpemVDbGFzc2VzOiBzdHJpbmdbXSA9IHRoaXMuZ2V0UmVzaXphYmxlQ2xhc3NlcyhlbCk7XG4gICAgY29uc3QgcmVzaXplQ2xzOiBhbnkgPSByZXNpemVDbGFzc2VzWzBdO1xuICAgIGNvbnN0IGtleXM6IGFueVtdID0gT2JqZWN0LmtleXModGhpcy5pbml0aWFsV2lkdGhzKTtcbiAgICBjb25zdCBtYXhDb2x1bW5zUGVyUm93OiBudW1iZXIgPSB0aGlzLnBhcmVudEdyb3Vwc1t0aGlzLnBhcmVudEdyb3Vwcy5sZW5ndGggLSAxXS5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5pbml0aWFsV2lkdGhzQXJlU2V0ID09PSB0cnVlICYmIChrZXlzLmxlbmd0aCA8IG1heENvbHVtbnNQZXJSb3cgfHwgIXRoaXMuaW5pdGlhbFdpZHRoc1tyZXNpemVDbHNdKSkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodG1zdGFtcCkgPT4ge1xuICAgICAgICB0aGlzLmF3YWl0V2lkdGhzKHRoaXMsIHRtc3RhbXApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWxXaWR0aHNBcmVTZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodG1zdGFtcCkgPT4ge1xuICAgICAgICB0aGlzLmF3YWl0V2lkdGhzKHRoaXMsIHRtc3RhbXApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5pbml0R3JpZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodG1zdGFtcCkgPT4ge1xuICAgICAgICAgIHRoaXMuYXdhaXRTaW5nbGVGcmFtZSh0aGlzLCB0bXN0YW1wKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhd2FpdFdpZHRocyh0aHM6IGFueSwgdGltZXN0YW1wOiBhbnkpIHtcbiAgICB0aGlzLmNoZWNrRm9yR3JpZEluaXRSZWFkeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhd2FpdFNpbmdsZUZyYW1lKHRoczogYW55LCB0aW1lc3RhbXA6IGFueSkge1xuICAgIHRoaXMuaW5pdEdyaWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgb25Qb2ludGVyRG93bihldmVudDogYW55KSB7XG4gICAgXG4gICAgdGhpcy5hZGRQb2ludGVyTGlzdGVuZXJzKCk7XG5cbiAgICBpZiAoIXRoaXMuZ2V0UmVzaXplR3JpcFVuZGVyUG9pbnQoZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIG9ubHkgZHJhZyBvbiBsZWZ0IG1vdXNlIGJ1dHRvblxuICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHsgcmV0dXJuOyB9XG4gICAgXG4gICAgLy8gZGlzYWJsZXMgdW53YW50ZWQgZHJhZyBhbmQgZHJvcCBmdW5jdGlvbmFsaXR5IGZvciBzZWxlY3RlZCB0ZXh0IGluIGJyb3dzZXJzXG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuXG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IHJlc2l6ZUhhbmRsZXM6IEhUTUxFbGVtZW50W107XG5cbiAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVvcmRlcmluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlb3JkZXJIYW5kbGVzVW5kZXJQb2ludDogRWxlbWVudFtdID0gdGhpcy5nZXRSZW9yZGVySGFuZGxlc1VuZGVyUG9pbnQoZXZlbnQpO1xuICAgIGNvbnN0IGNvbHNVbmRlclBvaW50OiBFbGVtZW50W10gPSB0aGlzLmdldFJlb3JkZXJDb2xzVW5kZXJQb2ludChldmVudCk7XG5cbiAgICBpZiAocmVvcmRlckhhbmRsZXNVbmRlclBvaW50Lmxlbmd0aCA+IDAgJiYgY29sc1VuZGVyUG9pbnQubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVvcmRlcmluZyA9IHRydWU7XG4gICAgICB0aGlzLmRyYWdnaW5nQ29sdW1uID0gY29sc1VuZGVyUG9pbnRbMF0gYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgIHRoaXMuY29sdW1uUmVvcmRlclN0YXJ0LmVtaXQoe1xuICAgICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgICBjb2x1bW5EcmFnZ2VkOiB0aGlzLmRyYWdnaW5nQ29sdW1uLFxuICAgICAgICBjb2x1bW5Ib3ZlcmVkOiB0aGlzLmRyYWdnaW5nQ29sdW1uXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGN1c3RvbVJlb3JkZXJTdGFydEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KENvbHVtblJlb3JkZXJFdmVudC5PTl9SRU9SREVSX1NUQVJULCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgICAgY29sdW1uRHJhZ2dlZDogdGhpcy5kcmFnZ2luZ0NvbHVtbixcbiAgICAgICAgICBjb2x1bW5Ib3ZlcmVkOiB0aGlzLmRyYWdnaW5nQ29sdW1uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbVJlb3JkZXJTdGFydEV2ZW50KTtcbiAgICAgIGNvbnN0IGVsUmVjdDogYW55ID0gdGhpcy5kcmFnZ2luZ0NvbHVtbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMuZHJhZ09mZnNldFggPSAoZXZlbnQucGFnZVggLSBlbFJlY3QubGVmdCkgLSB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgIHRoaXMuZHJhZ09mZnNldFkgPSAoZXZlbnQucGFnZVkgLSBlbFJlY3QudG9wKSAtIHdpbmRvdy5zY3JvbGxZO1xuXG4gICAgICB0aGlzLnJlbW92ZURyYWdBbmREcm9wQ29tcG9uZW50KCk7XG4gICAgICB0aGlzLmNyZWF0ZURyYWdBbmREcm9wQ29tcG9uZW50KCk7XG5cbiAgICAgIGNvbnN0IGRyYWdORHJvcFggPSBldmVudC5wYWdlWCAtIHRoaXMuZHJhZ09mZnNldFg7XG4gICAgICBjb25zdCBkcmFnTkRyb3BZID0gZXZlbnQucGFnZVkgLSB0aGlzLmRyYWdPZmZzZXRZO1xuICAgICAgdGhpcy5zZXREcmFnQW5kRHJvcFBvc2l0aW9uKGRyYWdORHJvcFgsIGRyYWdORHJvcFkpO1xuXG4gICAgICB0aGlzLmF0dGFjaFJlb3JkZXJHaG9zdCh0aGlzLmRyYWdnaW5nQ29sdW1uKTtcbiAgICAgIHRoaXMuc2V0UmVvcmRlckhpZ2hsaWdodEhlaWdodCh0aGlzLmRyYWdnaW5nQ29sdW1uKTtcblxuICAgICAgdGhpcy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50ID0gdGhpcy5kcmFnZ2luZ0NvbHVtbjtcblxuICAgICAgdGhpcy5wYXJlbnRHcm91cHMuZm9yRWFjaCgoYXJyLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoYXJyLmluZGV4T2YodGhpcy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50KSAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLmxhc3REcmFnZ2VkR3JvdXBJbmRleCA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVvcmRlckhhbmRsZUNvbE9mZnNldCA9IChyZW9yZGVySGFuZGxlc1VuZGVyUG9pbnRbMF0gYXMgSFRNTEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSB0aGlzLmRyYWdnaW5nQ29sdW1uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkR3JvdXBCb3VuZGluZ1JlY3RzID0gdGhpcy5wYXJlbnRHcm91cHNbdGhpcy5sYXN0RHJhZ2dlZEdyb3VwSW5kZXhdLm1hcChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgcmVjdDogYW55ID0ge1xuICAgICAgICAgIGxlZnQ6IChpdGVtIGFzIEhUTUxFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgdGhpcy5nZXRDb250YWluZXJTY3JvbGxDb3VudChpdGVtIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgICAgICByaWdodDogYm91bmRpbmdSZWN0LnJpZ2h0ICsgd2luZG93LnNjcm9sbFgsXG4gICAgICAgICAgdG9wOiBib3VuZGluZ1JlY3QudG9wLFxuICAgICAgICAgIGJvdHRvbTogYm91bmRpbmdSZWN0LmJvdHRvbSxcbiAgICAgICAgICB3aWR0aDogYm91bmRpbmdSZWN0LndpZHRoLFxuICAgICAgICAgIGhlaWdodDogYm91bmRpbmdSZWN0LmhlaWdodFxuICAgICAgICB9O1xuICAgICAgICByZWN0LnggPSByZWN0LmxlZnQ7XG4gICAgICAgIHJlY3QueSA9IHJlY3QudG9wO1xuICAgICAgICByZWN0LnRvSlNPTiA9IHt9O1xuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc2l6ZUhhbmRsZXMgPSB0aGlzLnJlc2l6YWJsZUdyaXBzO1xuXG4gICAgaWYgKHJlc2l6ZUhhbmRsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWYgbm8gaGFuZGxlIGV4aXN0cywgYWxsb3cgd2hvbGUgcm93IHRvIGJlIHJlc2l6YWJsZVxuICAgIGlmIChyZXNpemVIYW5kbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHJlc2l6YWJsZUVsZW1lbnRzOiBFbGVtZW50W10gPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgY29uc3QgZWxzOiBFbGVtZW50W10gPSByZXNpemFibGVFbGVtZW50cy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgIGxldCBoYW5kbGVJdGVtOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICAgIHJlc2l6ZUhhbmRsZXMuZm9yRWFjaChyZXNpemVIYW5kbGUgPT4ge1xuICAgICAgICAgIGlmIChpdGVtID09PSByZXNpemVIYW5kbGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUl0ZW0gPSByZXNpemVIYW5kbGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUl0ZW0gIT09IG51bGw7XG4gICAgICB9KTtcbiAgICAgIGlmIChlbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICBjb25zdCBlbGVtZW50czogRWxlbWVudFtdID0gdGhpcy5nZXRSZXNpemFibGVFbGVtZW50cyhldmVudCk7XG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudG90YWxDb21wdXRlZE1pbldpZHRoID0gMDtcbiAgICB0aGlzLnRvdGFsQ29tcHV0ZWRXaWR0aCA9IDA7XG4gICAgdGhpcy5taW5XaWR0aHMgPSBbXTtcbiAgICB0aGlzLnN0YXJ0aW5nV2lkdGhzID0gW107XG4gICAgdGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplID0gdGhpcy5nZXRSZXNpemFibGVDbGFzc2VzKGVsZW1lbnRzWzBdKTtcblxuICAgIC8vIGRpc2FsbG93IHJlc2l6aW5nIHRoZSByaWdodG1vc3QgY29sdW1uIHdpdGggcGVyY2VudCBzaXppbmdcbiAgICBpZiAodGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCkge1xuICAgICAgY29uc3QgbGFzdENvbHVtbkNsYXNzOiBzdHJpbmcgPSB0aGlzLmdldExhc3RWaXNpYmxlQ29sdW1uQ2xhc3MoKTtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUuaW5kZXhPZihsYXN0Q29sdW1uQ2xhc3MpICE9PSAtMSkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSAgICBcblxuICAgIHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3Qgd2R0aDogbnVtYmVyID0gdGhpcy5nZXRDbGFzc1dpZHRoSW5QaXhlbHMoY2xhc3NOYW1lKTtcbiAgICAgIGlmICghdGhpcy5jb2x1bW5Jc0hpZGRlbldpdGhDbGFzcyhjbGFzc05hbWUpKSB7XG4gICAgICAgIHRoaXMudG90YWxDb21wdXRlZFdpZHRoICs9IHdkdGg7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXJ0aW5nV2lkdGhzLnB1c2god2R0aCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldE1pbmltdW1XaWR0aHMoKTtcblxuICAgIHRoaXMuc3RhcnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICB0aGlzLnN0YXJ0WSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICB0aGlzLmNvbHVtblJlc2l6ZVN0YXJ0LmVtaXQoe1xuICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgIGNvbHVtbldpZHRoOiB0aGlzLnRvdGFsQ29tcHV0ZWRXaWR0aCxcbiAgICAgIGNvbHVtbk1pbldpZHRoOiB0aGlzLnRvdGFsQ29tcHV0ZWRNaW5XaWR0aCxcbiAgICAgIGNsYXNzZXNCZWluZ1Jlc2l6ZWQ6IHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZVxuICAgIH0pO1xuICAgIGNvbnN0IGN1c3RvbVJlc2l6ZVN0YXJ0RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoQ29sdW1uUmVzaXplRXZlbnQuT05fUkVTSVpFX1NUQVJULCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgICAgY29sdW1uV2lkdGg6IHRoaXMudG90YWxDb21wdXRlZFdpZHRoLFxuICAgICAgICBjb2x1bW5NaW5XaWR0aDogdGhpcy50b3RhbENvbXB1dGVkTWluV2lkdGgsXG4gICAgICAgIGNsYXNzZXNCZWluZ1Jlc2l6ZWQ6IHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21SZXNpemVTdGFydEV2ZW50KTtcbiAgICAvLyBzdG9wIGludGVyZmVyZW5jZSB3aXRoIHJlb3JkZXJpbmcgY29sdW1uc1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBwcml2YXRlIGdldENsYXNzV2lkdGhJblBpeGVscyhjbGFzc05hbWU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgY29uc3QgY2xhc3NJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICBsZXQgd2R0aDogc3RyaW5nID0gdGhpcy5jbGFzc1dpZHRoc1tjbGFzc0luZGV4XTtcbiAgICBpZiAodGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCkge1xuICAgICAgd2R0aCA9IHdkdGgucmVwbGFjZSgnJScsICcnKTsgLy8gcmVtb3ZlIHB4XG4gICAgICBsZXQgdG90YWxUYWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLnZpZXdwb3J0IS5jbGllbnRXaWR0aDtcbiAgICAgIHdkdGggPSAoTnVtYmVyKHdkdGgpIC8gMTAwICogdG90YWxUYWJsZVdpZHRoKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gTnVtYmVyKHdkdGgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRNaW5pbXVtV2lkdGhzKCk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBjb25zdCBmaXJzdEVsOiBFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBjbGFzc05hbWUpO1xuICAgICAgY29uc3QgbWluV2lkdGg6IHN0cmluZyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGZpcnN0RWwpLmdldFByb3BlcnR5VmFsdWUoJ21pbi13aWR0aCcpO1xuICAgICAgbGV0IHdkdGg6IG51bWJlciA9IE51bWJlcihtaW5XaWR0aC5zdWJzdHJpbmcoMCwgbWluV2lkdGgubGVuZ3RoIC0gMikpOyAvLyByZW1vdmUgcHhcbiAgICAgIHdkdGggPSBOdW1iZXIod2R0aCkgPCB0aGlzLmRlZmF1bHRUYWJsZU1pbldpZHRoID8gdGhpcy5kZWZhdWx0VGFibGVNaW5XaWR0aCA6IHdkdGg7IC8vIGFjY291bnQgZm9yIG1pbmltdW0gVEQgc2l6ZSBpbiB0YWJsZXNcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMSAmJiAhdGhpcy5jb2x1bW5Jc0hpZGRlbldpdGhDbGFzcyhjbGFzc05hbWUpKSB7XG4gICAgICAgIHRoaXMudG90YWxDb21wdXRlZE1pbldpZHRoICs9IHdkdGg7XG4gICAgICB9XG4gICAgICB0aGlzLm1pbldpZHRocy5wdXNoKHdkdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hSZW9yZGVyR2hvc3QoY29sdW1uOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuZHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudD8udXBkYXRlVmlldygoY29sdW1uIGFzIGFueSkucmVvcmRlckdob3N0LCAoY29sdW1uIGFzIGFueSkucmVvcmRlckdob3N0Q29udGV4dClcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29udGFpbmVyU2Nyb2xsQ291bnQoZWw6IEhUTUxFbGVtZW50IHwgbnVsbCk6IG51bWJlciB7XG5cbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgbGV0IHNjcm9sbFhDb3VudDogbnVtYmVyID0gZWwuc2Nyb2xsTGVmdDtcbiAgICB3aGlsZSAoZWwgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGVsID0gZWwhLnBhcmVudEVsZW1lbnQ7XG4gICAgICBzY3JvbGxYQ291bnQgKz0gZWwhLnNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgLy8gaW5jbHVkZSBzY3JvbGxpbmcgb24gdGFibGVqcy1ncmlkIGNvbXBvbmVudFxuICAgIHNjcm9sbFhDb3VudCArPSBlbCEucGFyZW50RWxlbWVudCEuc2Nyb2xsTGVmdDtcblxuICAgIHJldHVybiBzY3JvbGxYQ291bnQ7XG4gIH1cblxuICBwcml2YXRlIG9uUG9pbnRlck1vdmUoZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHRoczogR3JpZERpcmVjdGl2ZSA9IGRvY3VtZW50WydjdXJyZW50R3JpZERpcmVjdGl2ZSddO1xuXG4gICAgaWYgKHRocy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVvcmRlcmluZykge1xuXG4gICAgICB0aHMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIGNvbnN0IGRyYWdORHJvcFggPSBldmVudC5wYWdlWCAtIHRocy5kcmFnT2Zmc2V0WDtcbiAgICAgIGNvbnN0IGRyYWdORHJvcFkgPSBldmVudC5wYWdlWSAtIHRocy5kcmFnT2Zmc2V0WTtcbiAgICAgIHRocy5zZXREcmFnQW5kRHJvcFBvc2l0aW9uKGRyYWdORHJvcFgsIGRyYWdORHJvcFkpO1xuXG4gICAgICBjb25zdCB0cnVlTW91c2VYOiBudW1iZXIgPSBldmVudC5wYWdlWCAtIHRocy5yZW9yZGVySGFuZGxlQ29sT2Zmc2V0ICsgdGhzLmdldENvbnRhaW5lclNjcm9sbENvdW50KHRocy5kcmFnZ2luZ0NvbHVtbik7XG5cbiAgICAgIGlmICghdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhzLmNvbHVtblJlb3JkZXIuZW1pdCh7XG4gICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgIGNvbHVtbkRyYWdnZWQ6IHRocy5kcmFnZ2luZ0NvbHVtbixcbiAgICAgICAgY29sdW1uSG92ZXJlZDogdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnRcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY3VzdG9tUmVvcmRlckV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KENvbHVtblJlb3JkZXJFdmVudC5PTl9SRU9SREVSLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgICAgY29sdW1uRHJhZ2dlZDogdGhzLmRyYWdnaW5nQ29sdW1uLFxuICAgICAgICAgIGNvbHVtbkhvdmVyZWQ6IHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tUmVvcmRlckV2ZW50KTtcblxuICAgICAgbGV0IG1vdmVEaXJlY3Rpb246IG51bWJlciA9IDA7XG4gICAgICBsZXQgY3VycmVudFJlY3Q6IENsaWVudFJlY3Q7XG4gICAgICBsZXQgY3VycmVudENvbEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgICAgIGZvciAoY29uc3QgcmVjdCBvZiB0aHMubGFzdERyYWdnZWRHcm91cEJvdW5kaW5nUmVjdHMhKSB7XG5cbiAgICAgICAgaWYgKHRydWVNb3VzZVggPiByZWN0LmxlZnQgJiYgdHJ1ZU1vdXNlWCA8IHJlY3QubGVmdCArIHJlY3Qud2lkdGgpIHtcbiAgICAgICAgICBjb25zdCBlbFg6IG51bWJlciA9IHJlY3QubGVmdDtcbiAgICAgICAgICBjb25zdCBlbFc6IG51bWJlciA9IHJlY3Qud2lkdGg7XG5cbiAgICAgICAgICBpZiAoKHRydWVNb3VzZVggLSBlbFgpID49IGVsVyAvIDIpIHtcbiAgICAgICAgICAgIG1vdmVEaXJlY3Rpb24gPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb3ZlRGlyZWN0aW9uID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFJlY3QgPSByZWN0O1xuICAgICAgICAgIGN1cnJlbnRDb2xJbmRleCA9IHRocy5sYXN0RHJhZ2dlZEdyb3VwQm91bmRpbmdSZWN0cyEuaW5kZXhPZihyZWN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudENvbEluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRocy5sYXN0RHJhZ2dlZE92ZXJSZWN0ID09PSBjdXJyZW50UmVjdCEgJiYgdGhzLmxhc3RNb3ZlRGlyZWN0aW9uID09PSBtb3ZlRGlyZWN0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRocy5sYXN0TW92ZURpcmVjdGlvbiA9IG1vdmVEaXJlY3Rpb247XG4gICAgICB0aHMubGFzdERyYWdnZWRPdmVyUmVjdCA9IGN1cnJlbnRSZWN0ITtcblxuICAgICAgdGhzLnJlbW92ZUVsZW1lbnRIaWdobGlnaHQodGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQpO1xuICAgICAgdGhzLnJlbW92ZUhpZ2hsaWdodHModGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQsIG1vdmVEaXJlY3Rpb24pO1xuXG4gICAgICBjb25zdCBkcmFnZ2FibGVJbkNvbHVtbjogRWxlbWVudCA9IHRocy5wYXJlbnRHcm91cHNbdGhzLmxhc3REcmFnZ2VkR3JvdXBJbmRleF1bY3VycmVudENvbEluZGV4XTtcblxuICAgICAgdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQgPSBkcmFnZ2FibGVJbkNvbHVtbjtcblxuICAgICAgbGV0IGNvbFJhbmdlRHJhZ2dlZFBhcmVudEluZDogbnVtYmVyID0gLTE7XG4gICAgICBsZXQgY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQ6IG51bWJlciA9IC0xO1xuICAgICAgbGV0IGNvbFJhbmdlRHJvcHBlZFBhcmVudEluZDogbnVtYmVyID0gLTE7XG4gICAgICBsZXQgY29sUmFuZ2VEcm9wcGVkQ2hpbGRJbmQ6IG51bWJlciA9IC0xO1xuICAgICAgbGV0IGRyYWdnZWRJbmQ6IG51bWJlciA9IC0xO1xuICAgICAgbGV0IGRyb3BwZWRJbmQ6IG51bWJlciA9IC0xO1xuICAgICAgbGV0IGRyYWdnZWRHcm91cDogSUNvbHVtbkRhdGFbXSB8IEVsZW1lbnRbXSB8IG51bGwgPSBudWxsO1xuXG4gICAgICBjb25zdCBwR3JvdXA6IGFueSA9IHRocy5jb2xEYXRhR3JvdXBzLmZvckVhY2goKGdyb3VwOiBJQ29sdW1uRGF0YVtdLCBncm91cEluZDogbnVtYmVyKSA9PlxuICAgICAgICBncm91cC5mb3JFYWNoKChjb2x1bW5EYXRhOiBJQ29sdW1uRGF0YSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbTogRWxlbWVudCB8IG51bGwgPSBjb2x1bW5EYXRhLmNoaWxkO1xuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHRocy5nZXRSZWxhdGVkSGVhZGVyKHRocy5kcmFnZ2luZ0NvbHVtbiBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kID0gZ3JvdXBJbmQ7XG4gICAgICAgICAgICAgIGNvbFJhbmdlRHJhZ2dlZENoaWxkSW5kID0gdGhzLmdldFJhbmdlUG9zaXRpb24oY29sdW1uRGF0YSk7IC8vIGluZGV4O1xuICAgICAgICAgICAgICBkcmFnZ2VkSW5kID0gaW5kZXg7XG4gICAgICAgICAgICAgIGRyYWdnZWRHcm91cCA9IGdyb3VwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHRocy5nZXRSZWxhdGVkSGVhZGVyKHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgICBjb2xSYW5nZURyb3BwZWRQYXJlbnRJbmQgPSBncm91cEluZDtcbiAgICAgICAgICAgICAgY29sUmFuZ2VEcm9wcGVkQ2hpbGRJbmQgPSB0aHMuZ2V0UmFuZ2VQb3NpdGlvbihjb2x1bW5EYXRhKTsgLy8gaW5kZXg7XG4gICAgICAgICAgICAgIGRyb3BwZWRJbmQgPSBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIGlmICh0aHMuZHJhZ2dpbmdDb2x1bW4gPT09IHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBwYXJlbnRSYW5nZXM6IG51bWJlcltdW10gfCBudWxsID0gbnVsbDtcbiAgICAgIGNvbnN0IHRlbXBSYW5nZXM6IG51bWJlcltdW11bXSA9IHRocy5jb2xSYW5nZUdyb3Vwcy5jb25jYXQoKTtcbiAgICAgIGxldCBwYXJlbnRSYW5nZUluZGV4OiBudW1iZXIgPSAtMTtcbiAgICAgIHRlbXBSYW5nZXMuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG4gICAgICB0ZW1wUmFuZ2VzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICghcGFyZW50UmFuZ2VzICYmIGl0ZW0ubGVuZ3RoIDwgZHJhZ2dlZEdyb3VwIS5sZW5ndGgpIHtcbiAgICAgICAgICBwYXJlbnRSYW5nZXMgPSBpdGVtO1xuICAgICAgICAgIHBhcmVudFJhbmdlSW5kZXggPSB0aHMuY29sUmFuZ2VHcm91cHMuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBmcm9tT3JkZXI6IG51bWJlciA9IChjb2xSYW5nZURyYWdnZWRDaGlsZEluZCArIDEpO1xuICAgICAgY29uc3QgdG9PcmRlcjogbnVtYmVyID0gKGNvbFJhbmdlRHJvcHBlZENoaWxkSW5kICsgMSk7XG5cbiAgICAgIC8vIGlmIGhhcyB0byBzdGF5IHdpdGhpbiByYW5nZXMsIGdldCByYW5nZXMgYW5kIHN3YXBcbiAgICAgIGlmIChwYXJlbnRSYW5nZXMgIT09IG51bGwpIHtcbiAgICAgICAgdGhzLmNvbFJhbmdlR3JvdXBzW3BhcmVudFJhbmdlSW5kZXhdLmZvckVhY2goXG4gICAgICAgICAgcmFuZ2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG93UmFuZ2U6IG51bWJlciA9IHJhbmdlWzBdO1xuICAgICAgICAgICAgY29uc3QgaGlnaFJhbmdlOiBudW1iZXIgPSByYW5nZVsxXTtcbiAgICAgICAgICAgIGlmIChmcm9tT3JkZXIgPj0gbG93UmFuZ2UgJiYgZnJvbU9yZGVyIDwgaGlnaFJhbmdlICYmIHRvT3JkZXIgPj0gbG93UmFuZ2UgJiYgdG9PcmRlciA8IGhpZ2hSYW5nZSkge1xuICAgICAgICAgICAgICBpZiAoY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kID09PSBjb2xSYW5nZURyb3BwZWRQYXJlbnRJbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZURpcmVjdGlvbiA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LXJpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1sZWZ0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocy5lbGVtZW50c1dpdGhIaWdobGlnaHQucHVzaCh7IGVsOiB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCwgbW92ZURpcmVjdGlvbiB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb2xSYW5nZURyYWdnZWRQYXJlbnRJbmQgPT09IGNvbFJhbmdlRHJvcHBlZFBhcmVudEluZCkge1xuICAgICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uID09PSAxKSB7XG4gICAgICAgICAgICB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQtcmlnaHQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LWxlZnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhzLmVsZW1lbnRzV2l0aEhpZ2hsaWdodC5wdXNoKHsgZWw6IHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50LCBtb3ZlRGlyZWN0aW9uIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghdGhzLmRyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBtb3VzZU9mZnNldDogbnVtYmVyID0gTWF0aC5yb3VuZChldmVudC5jbGllbnRYKSAtIE1hdGgucm91bmQodGhzLnN0YXJ0WCk7XG4gICAgY29uc3Qgd2lkdGhzTmVlZFVwZGF0aW5nOiBib29sZWFuID0gTWF0aC5yb3VuZChldmVudC5jbGllbnRYKSAhPT0gdGhzLnN0YXJ0WDtcbiAgICB0aHMuc3RhcnRYID0gTWF0aC5yb3VuZChldmVudC5jbGllbnRYKTsgLy8gcmVzZXQgc3RhcnRpbmcgWFxuICAgIGxldCBuZXdXaWR0aDogbnVtYmVyID0gdGhzLnRvdGFsQ29tcHV0ZWRXaWR0aCArIG1vdXNlT2Zmc2V0O1xuICAgIGNvbnN0IGFsbG93YWJsZVdpZHRoQ2hhbmdlOiBudW1iZXIgPSBuZXdXaWR0aCAtIHRocy50b3RhbENvbXB1dGVkTWluV2lkdGg7XG5cbiAgICBpZiAoYWxsb3dhYmxlV2lkdGhDaGFuZ2UgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh3aWR0aHNOZWVkVXBkYXRpbmcpIHtcbiAgICAgIHRocy51cGRhdGVXaWR0aHMobmV3V2lkdGgpO1xuICAgIH1cbiAgICB0aHMuY29sdW1uUmVzaXplLmVtaXQoe1xuICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgIGNvbHVtbldpZHRoOiB0aHMudG90YWxDb21wdXRlZFdpZHRoLFxuICAgICAgY29sdW1uTWluV2lkdGg6IHRocy50b3RhbENvbXB1dGVkTWluV2lkdGhcbiAgICB9KTtcbiAgICBjb25zdCBjdXN0b21SZXNpemVFdmVudCA9IG5ldyBDdXN0b21FdmVudChDb2x1bW5SZXNpemVFdmVudC5PTl9SRVNJWkUsIHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgICBjb2x1bW5XaWR0aDogdGhzLnRvdGFsQ29tcHV0ZWRXaWR0aCxcbiAgICAgICAgY29sdW1uTWluV2lkdGg6IHRocy50b3RhbENvbXB1dGVkTWluV2lkdGhcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aHMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21SZXNpemVFdmVudCk7XG4gIH1cblxuICBwcml2YXRlIGdldExhc3RWaXNpYmxlQ29sdW1uQ2xhc3MoKTogc3RyaW5nIHtcbiAgICBsZXQgaGlnaGVzdE9yZGVySW5kZXg6IG51bWJlciA9IDA7XG4gICAgbGV0IGxhc3RWaXNpYmxlQ29sdW1uQ2xhc3M6IHN0cmluZyA9ICcnO1xuXG4gICAgdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZUluZGV4OiBudW1iZXIgPSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuICAgICAgY29uc3QgZ3JpZE9yZGVySW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZE9yZGVyLmluZGV4T2YoY2xhc3NOYW1lSW5kZXggKyAxKTtcbiAgICAgIGlmICh0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMuaW5kZXhPZihncmlkT3JkZXJJbmRleCArIDEpID09PSAtMSkge1xuICAgICAgICBpZiAoZ3JpZE9yZGVySW5kZXggPiBoaWdoZXN0T3JkZXJJbmRleCkge1xuICAgICAgICAgIGhpZ2hlc3RPcmRlckluZGV4ID0gZ3JpZE9yZGVySW5kZXg7XG4gICAgICAgICAgbGFzdFZpc2libGVDb2x1bW5DbGFzcyA9IGNsYXNzTmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBsYXN0VmlzaWJsZUNvbHVtbkNsYXNzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSYW5nZVBvc2l0aW9uKGNvbHVtbkRhdGE6IElDb2x1bW5EYXRhKTogbnVtYmVyIHtcbiAgICBsZXQgc3ViR3JvdXBzOiBJQ29sdW1uRGF0YVtdID0gY29sdW1uRGF0YS5zdWJHcm91cHM7XG4gICAgbGV0IGNoaWxkOiBJQ29sdW1uRGF0YSA9IGNvbHVtbkRhdGE7XG4gICAgd2hpbGUgKHN1Ykdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICBjaGlsZCA9IHN1Ykdyb3Vwc1swXTtcbiAgICAgIHN1Ykdyb3VwcyA9IGNoaWxkLnN1Ykdyb3VwcztcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkLm50aENoaWxkIC0gMTtcbiAgfVxuXG4gIHByaXZhdGUgY29sdW1uSXNIaWRkZW5XaXRoQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBjbGFzc05hbWVJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICBjb25zdCBncmlkT3JkZXJJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkT3JkZXIuaW5kZXhPZihjbGFzc05hbWVJbmRleCArIDEpO1xuICAgIHJldHVybiB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMuaW5kZXhPZihncmlkT3JkZXJJbmRleCArIDEpICE9PSAtMTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG90YWxHcm91cGVkQ29sdW1uc1Zpc2libGUoc29ydGFibGVXaWR0aHM6IElTb3J0YWJsZVdpZHRoSXRlbVtdKTogbnVtYmVyIHtcbiAgICBjb25zdCBsZW46IG51bWJlciA9IHNvcnRhYmxlV2lkdGhzLmxlbmd0aDtcbiAgICBsZXQgdG90YWxHcm91cGVkQ29sdW1uc1Zpc2libGU6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgaXRlbTogYW55ID0gc29ydGFibGVXaWR0aHNbaV07XG4gICAgICBpZiAoIXRoaXMuY29sdW1uSXNIaWRkZW5XaXRoQ2xhc3MoaXRlbS5jbGFzc05hbWUpKSB7XG4gICAgICAgIHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Rmlyc3RHcmlkT3JkZXJJbmRleEFmdGVyQ29sdW1uR3JvdXAoc29ydGFibGVXaWR0aEdyb3VwOiBJU29ydGFibGVXaWR0aEl0ZW1bXSk6IG51bWJlciB7XG4gICAgbGV0IG1heEluZGV4OiBudW1iZXIgPSAtMTtcbiAgICBzb3J0YWJsZVdpZHRoR3JvdXAuZm9yRWFjaChjbGFzc0l0ZW0gPT4ge1xuICAgICAgY29uc3QgY29sdW1uSW5keCA9IHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5pbmRleE9mKGNsYXNzSXRlbS5jbGFzc05hbWUpO1xuICAgICAgY29uc3QgZ3JpZE9yZGVySW5kZXggPSB0aGlzLmdyaWRPcmRlci5pbmRleE9mKGNvbHVtbkluZHggKyAxKTtcbiAgICAgIGlmIChtYXhJbmRleCA8IGdyaWRPcmRlckluZGV4KSB7XG4gICAgICAgIG1heEluZGV4ID0gZ3JpZE9yZGVySW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1heEluZGV4ICsgMTtcbiAgfVxuXG4gIC8vIHJldHVybnMgYSBudW1iZXIgaW4gcGVyY2VudCBtb3ZlZCB0d28gZGVjaW1hbCBwbGFjZXMgb3ZlciAoMTAuMjQ1IGlzIGVxdWFsIHRvIDEwLjI0NSUpXG4gIHByaXZhdGUgZ2V0UG9zdENvbHVtbldpZHRoVG90YWwoc3RhcnRpbmdJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0aW5nSW5kZXg7IGkgPCB0aGlzLmdyaWRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2xzSW5kZXggPSB0aGlzLmdyaWRPcmRlcltpXSAtIDE7XG4gICAgICBsZXQgcGVyYzogbnVtYmVyID0gTnVtYmVyKHRoaXMuY2xhc3NXaWR0aHNbY2xzSW5kZXhdLnRvU3RyaW5nKCkucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaSArIDEpID09PSAtMSkge1xuICAgICAgICBjb3VudCArPSBwZXJjO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICAvLyByZXR1cm5zIGEgbnVtYmVyIGluIHBlcmNlbnQgbW92ZWQgdHdvIGRlY2ltYWwgcGxhY2VzIG92ZXIgKDEwLjI0NSBpcyBlcXVhbCB0byAxMC4yNDUlKVxuICBwcml2YXRlIGdldFBvc3RDb2x1bW5NaW5pbXVtV2lkdGhUb3RhbChzdGFydGluZ0luZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcbiAgICBmb3IgKGxldCBpID0gc3RhcnRpbmdJbmRleDsgaSA8IHRoaXMuZ3JpZE9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjbHNJbmRleCA9IHRoaXMuZ3JpZE9yZGVyW2ldIC0gMTtcbiAgICAgIGxldCBwZXJjOiBudW1iZXIgPSBOdW1iZXIodGhpcy5taW5XaWR0aHNbY2xzSW5kZXhdLnRvU3RyaW5nKCkucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaSArIDEpID09PSAtMSkge1xuICAgICAgICBjb3VudCArPSBwZXJjO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICAvLyByZXR1cm5zIGEgbnVtYmVyIGluIHBlcmNlbnQgbW92ZWQgdHdvIGRlY2ltYWwgcGxhY2VzIG92ZXIgKDEwLjI0NSBpcyBlcXVhbCB0byAxMC4yNDUlKVxuICBwcml2YXRlIGdldFByZXZpb3VzQ29sdW1uV2lkdGhUb3RhbChzb3J0YWJsZVdpZHRoR3JvdXA6IElTb3J0YWJsZVdpZHRoSXRlbVtdKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IG1pbkluZGV4ID0gSW5maW5pdHk7XG4gICAgc29ydGFibGVXaWR0aEdyb3VwLmZvckVhY2goY2xhc3NJdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvbHVtbkluZHggPSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMuaW5kZXhPZihjbGFzc0l0ZW0uY2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IGdyaWRPcmRlckluZGV4ID0gdGhpcy5ncmlkT3JkZXIuaW5kZXhPZihjb2x1bW5JbmR4ICsgMSk7XG4gICAgICBpZiAobWluSW5kZXggPiBncmlkT3JkZXJJbmRleCkge1xuICAgICAgICBtaW5JbmRleCA9IGdyaWRPcmRlckluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWluSW5kZXg7IGkrKykge1xuICAgICAgY29uc3QgY2xhc3NJbmR4OiBudW1iZXIgPSB0aGlzLmdyaWRPcmRlcltpXSAtIDE7XG4gICAgICBjb25zdCB3ZHRoOiBudW1iZXIgPSBOdW1iZXIodGhpcy5jbGFzc1dpZHRoc1tjbGFzc0luZHhdLnRvU3RyaW5nKCkucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICBjb3VudCArPSB3ZHRoO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVdpZHRoc0luUGVyY2VudChuZXdXaWR0aDogbnVtYmVyLCBzb3J0YWJsZVdpZHRoczogSVNvcnRhYmxlV2lkdGhJdGVtW10sIHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlOiBudW1iZXIsIHNvcnRhYmxlV2lkdGhHcm91cDogSVNvcnRhYmxlV2lkdGhJdGVtW10pOiB2b2lkIHtcblxuICAgIGxldCB0b3RhbFRhYmxlV2lkdGg6IG51bWJlciA9IHRoaXMudmlld3BvcnQhLmNsaWVudFdpZHRoO1xuICAgIGxldCBuZXdXaWR0aEluUGVyY2VudDogbnVtYmVyID0gbmV3V2lkdGggLyB0b3RhbFRhYmxlV2lkdGggKiAxMDA7XG4gICAgXG4gICAgY29uc3QgY2xhc3NNaW5XaWR0aHM6IG51bWJlcltdID0gc29ydGFibGVXaWR0aHMubWFwKChpdGVtOiBJU29ydGFibGVXaWR0aEl0ZW0pID0+IGl0ZW0ubWluV2lkdGgpO1xuICAgIGNvbnN0IGdyb3VwTWluV2lkdGhDYWxjOiBudW1iZXIgPSBjbGFzc01pbldpZHRocy5yZWR1Y2UoKHByZXY6IG51bWJlciwgY3VycjogbnVtYmVyKSA9PiBwcmV2ICsgY3Vycik7XG4gICAgXG4gICAgY29uc3QgZmlyc3RHcmlkT3JkZXJJbmRleEFmdGVyQ29sdW1uR3JvdXA6IG51bWJlciA9IHRoaXMuZ2V0Rmlyc3RHcmlkT3JkZXJJbmRleEFmdGVyQ29sdW1uR3JvdXAoc29ydGFibGVXaWR0aEdyb3VwKTtcbiAgICBjb25zdCBjb2xzUGFzdE1pbldpZHRoQ2FsYzogbnVtYmVyID0gdGhpcy5nZXRQb3N0Q29sdW1uTWluaW11bVdpZHRoVG90YWwoZmlyc3RHcmlkT3JkZXJJbmRleEFmdGVyQ29sdW1uR3JvdXApO1xuICAgIGNvbnN0IGNvbHNQYXN0TWluV2lkdGhJblBlcmNlbnQ6IG51bWJlciA9IGNvbHNQYXN0TWluV2lkdGhDYWxjIC8gdG90YWxUYWJsZVdpZHRoICogMTAwO1xuICAgIGNvbnN0IGNvbHNQYXN0V2lkdGhQZXJjOiBudW1iZXIgPSB0aGlzLmdldFBvc3RDb2x1bW5XaWR0aFRvdGFsKGZpcnN0R3JpZE9yZGVySW5kZXhBZnRlckNvbHVtbkdyb3VwKTtcblxuICAgIGxldCBwcmV2Q29sUGVyY2VudFRvdGFsOiBudW1iZXIgPSAwO1xuICAgIHByZXZDb2xQZXJjZW50VG90YWwgPSB0aGlzLmdldFByZXZpb3VzQ29sdW1uV2lkdGhUb3RhbChzb3J0YWJsZVdpZHRoR3JvdXApO1xuICAgIGNvbnN0IHBlcmNlbnRNb3ZlZDogbnVtYmVyID0gKHByZXZDb2xQZXJjZW50VG90YWwgKyBuZXdXaWR0aEluUGVyY2VudCArIGNvbHNQYXN0V2lkdGhQZXJjKSAtIDEwMDtcblxuICAgIGlmIChwcmV2Q29sUGVyY2VudFRvdGFsICsgbmV3V2lkdGhJblBlcmNlbnQgKyBjb2xzUGFzdE1pbldpZHRoSW5QZXJjZW50ID4gMTAwKSB7XG4gICAgICBjb25zdCBhY3R1YWxQZXJDYW5Nb3ZlOiBudW1iZXIgPSAxMDAgLSAocHJldkNvbFBlcmNlbnRUb3RhbCArIGNvbHNQYXN0TWluV2lkdGhJblBlcmNlbnQpO1xuICAgICAgbmV3V2lkdGhJblBlcmNlbnQgPSBhY3R1YWxQZXJDYW5Nb3ZlO1xuICAgIH1cbiAgICBpZiAobmV3V2lkdGggPCBncm91cE1pbldpZHRoQ2FsYykge1xuICAgICAgbmV3V2lkdGhJblBlcmNlbnQgPSBncm91cE1pbldpZHRoQ2FsYyAvIHRvdGFsVGFibGVXaWR0aCAqIDEwMDtcbiAgICB9XG5cbiAgICBzb3J0YWJsZVdpZHRocy5zb3J0KChpdGVtMTogYW55LCBpdGVtMjogYW55KSA9PiB7XG4gICAgICBjb25zdCB3ZHRoMTogbnVtYmVyID0gaXRlbTEud2lkdGg7XG4gICAgICBjb25zdCB3ZHRoMjogbnVtYmVyID0gaXRlbTIud2lkdGg7XG4gICAgICBpZiAod2R0aDEgPT09IHdkdGgyKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdkdGgxIDwgd2R0aDIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgXG4gICAgY29uc3QgbWFwcGVkR3JvdXBXaWR0aHNJblBpeGVsczogbnVtYmVyW10gPSBzb3J0YWJsZVdpZHRocy5tYXAoaXRlbSA9PiBpdGVtLndpZHRoKTtcbiAgICBjb25zdCB0b3RhbFByZXZHcm91cFdpZHRoczogbnVtYmVyID0gbWFwcGVkR3JvdXBXaWR0aHNJblBpeGVscy5yZWR1Y2UoKHByZXY6IG51bWJlciwgY3VycjogbnVtYmVyKSA9PiBwcmV2ICsgY3Vycik7XG4gICAgY29uc3QgZGlzcGVyc2VkUGVyY3M6IG51bWJlcltdID0gc29ydGFibGVXaWR0aHMubWFwKGl0ZW0gPT4gaXRlbS53aWR0aCAvIHRvdGFsUHJldkdyb3VwV2lkdGhzKTtcbiAgICBjb25zdCB0b3RhbFBlcmNNb3ZlZDogbnVtYmVyID0gbmV3V2lkdGhJblBlcmNlbnQgLSAodG90YWxQcmV2R3JvdXBXaWR0aHMgLyB0b3RhbFRhYmxlV2lkdGggKiAxMDApO1xuXG5cbiAgICBsZXQgYWRkaXRpb25hbFBlcmNlbnRGcm9tQ29sdW1uc1RvU21hbGw6IG51bWJlciA9IDA7XG4gICAgY29uc3Qgc29ydGFibGVXaWR0aHNMZW46IG51bWJlciA9IHNvcnRhYmxlV2lkdGhzLmxlbmd0aDtcbiAgICBzb3J0YWJsZVdpZHRocy5mb3JFYWNoKChpdGVtOiBJU29ydGFibGVXaWR0aEl0ZW0sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5pbmRleE9mKGl0ZW0uY2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IG1pbldpZHRoSW5QZXJjZW50OiBudW1iZXIgPSB0aGlzLm1pbldpZHRoc1tjbGFzc0luZGV4XSAvIHRvdGFsVGFibGVXaWR0aCAqIDEwMDtcbiAgICBcbiAgICAgIGxldCBjYWxjdWxhdGVkUGVyY2VudDogbnVtYmVyID0gZGlzcGVyc2VkUGVyY3NbaW5kZXhdICogbmV3V2lkdGhJblBlcmNlbnQ7XG4gICAgICBpZiAoY2FsY3VsYXRlZFBlcmNlbnQgPCBtaW5XaWR0aEluUGVyY2VudCkge1xuICAgICAgICBhZGRpdGlvbmFsUGVyY2VudEZyb21Db2x1bW5zVG9TbWFsbCArPSBtaW5XaWR0aEluUGVyY2VudCAtIGNhbGN1bGF0ZWRQZXJjZW50O1xuICAgICAgICBjYWxjdWxhdGVkUGVyY2VudCA9IG1pbldpZHRoSW5QZXJjZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaXRlbXNSZW1haW5pbmc6IG51bWJlciA9IHNvcnRhYmxlV2lkdGhzTGVuIC0gaW5kZXggLSAxO1xuICAgICAgICBpZiAoaXRlbXNSZW1haW5pbmcgIT09IDApIHtcbiAgICAgICAgICBjb25zdCBleHRyYUFtdFRvUmVtb3ZlOiBudW1iZXIgPSBhZGRpdGlvbmFsUGVyY2VudEZyb21Db2x1bW5zVG9TbWFsbCAvIGl0ZW1zUmVtYWluaW5nO1xuICAgICAgICAgIGNhbGN1bGF0ZWRQZXJjZW50IC09IGV4dHJhQW10VG9SZW1vdmU7XG4gICAgICAgICAgYWRkaXRpb25hbFBlcmNlbnRGcm9tQ29sdW1uc1RvU21hbGwgLT0gZXh0cmFBbXRUb1JlbW92ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgY29sV2lkdGhJblBlcmNlbnQ6IHN0cmluZyA9IGNhbGN1bGF0ZWRQZXJjZW50LnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICB0aGlzLmNsYXNzV2lkdGhzW2NsYXNzSW5kZXhdID0gY29sV2lkdGhJblBlcmNlbnQ7XG4gICAgfSk7XG5cbiAgICBsZXQgcmVtYWluaW5nUGVyY1RvRGlzcGVyc2U6IG51bWJlciA9IHRvdGFsUGVyY01vdmVkICsgYWRkaXRpb25hbFBlcmNlbnRGcm9tQ29sdW1uc1RvU21hbGw7XG4gICAgY29uc3QgbWF4UGVyY3NDYW5Nb3ZlUGVyQ29sOiBhbnlbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBmaXJzdEdyaWRPcmRlckluZGV4QWZ0ZXJDb2x1bW5Hcm91cDsgaSA8IHRoaXMuZ3JpZE9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjbHNJbmRleCA9IHRoaXMuZ3JpZE9yZGVyW2ldIC0gMTtcbiAgICAgIGxldCBwZXJjOiBudW1iZXIgPSBOdW1iZXIodGhpcy5jbGFzc1dpZHRoc1tjbHNJbmRleF0udG9TdHJpbmcoKS5yZXBsYWNlKCclJywgJycpKTtcbiAgICAgIGxldCBtaW5XaWR0aFBlcmM6IG51bWJlciA9ICAodGhpcy5taW5XaWR0aHNbY2xzSW5kZXhdIC8gdG90YWxUYWJsZVdpZHRoICogMTAwKTtcbiAgICAgIGlmICh0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMuaW5kZXhPZihpICsgMSkgPT09IC0xKSB7XG4gICAgICAgIG1heFBlcmNzQ2FuTW92ZVBlckNvbC5wdXNoKHsgXG4gICAgICAgICAgbW92ZUFtdDogcGVyY2VudE1vdmVkID4gMCA/IHBlcmMgLSBtaW5XaWR0aFBlcmMgOiBwZXJjLFxuICAgICAgICAgIGNsYXNzSW5kZXg6IGNsc0luZGV4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRvdGFsUGVyY3NDYW5Nb3ZlOiBudW1iZXIgPSBtYXhQZXJjc0Nhbk1vdmVQZXJDb2wucmVkdWNlKChwcmV2OiBudW1iZXIsIGN1cnI6IGFueSkgPT4gcHJldiArIGN1cnIubW92ZUFtdCwgMC4wMDAwMDAxKTtcbiAgICBtYXhQZXJjc0Nhbk1vdmVQZXJDb2wuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCBwZXJjT2ZUb3RhbE1vdmVtZW50QWxsb3dlZDogbnVtYmVyID0gaXRlbS5tb3ZlQW10IC8gdG90YWxQZXJjc0Nhbk1vdmU7XG4gICAgICBjb25zdCBwZXJjT2ZSZW1haW5pbmdEaXNwZXJzZW1lbnQ6IG51bWJlciA9IHBlcmNPZlRvdGFsTW92ZW1lbnRBbGxvd2VkICogcmVtYWluaW5nUGVyY1RvRGlzcGVyc2U7XG4gICAgICBjb25zdCBwZXJjOiBudW1iZXIgPSBOdW1iZXIodGhpcy5jbGFzc1dpZHRoc1tpdGVtLmNsYXNzSW5kZXhdLnRvU3RyaW5nKCkucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICBjb25zdCBkaXNwZXJzZWRXaWR0aDogbnVtYmVyID0gcGVyYyAtIHBlcmNPZlJlbWFpbmluZ0Rpc3BlcnNlbWVudDtcbiAgICAgIHRoaXMuY2xhc3NXaWR0aHNbaXRlbS5jbGFzc0luZGV4XSA9IGRpc3BlcnNlZFdpZHRoICsgJyUnO1xuICAgIH0pO1xuXG4gICAgbmV3V2lkdGggPSBuZXdXaWR0aEluUGVyY2VudCAvIDEwMCAqIHRvdGFsVGFibGVXaWR0aDtcbiAgICBsZXQgYW1vdW50TW92ZWQ6IG51bWJlciA9IG5ld1dpZHRoIC0gdG90YWxQcmV2R3JvdXBXaWR0aHM7XG4gICAgYW1vdW50TW92ZWQgPSBNYXRoLnJvdW5kKGFtb3VudE1vdmVkICogMTAwKSAvIDEwMDsgLy8gcm91bmQgdG8gMiBkZWNpbWFsIHBvaW50c1xuICAgIHRoaXMudG90YWxDb21wdXRlZFdpZHRoICs9IGFtb3VudE1vdmVkO1xuXG4gICAgY29uc3QgZ3JpZFRlbXBsYXRlQ29sdW1uczogc3RyaW5nID0gdGhpcy5jb25zdHJ1Y3RHcmlkVGVtcGxhdGVDb2x1bW5zKCk7XG4gICAgdGhpcy5ncmlkVGVtcGxhdGVUeXBlcy5mb3JFYWNoKHN0eWxlT2JqID0+IHsgICAgICBcbiAgICAgIHN0eWxlT2JqLnN0eWxlLmlubmVySFRNTCA9IHRoaXMuaWQgKyAnIC4nICsgdGhpcy5yZW9yZGVyYWJsZUNsYXNzICsgJyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczonICsgZ3JpZFRlbXBsYXRlQ29sdW1ucyArICc7IH0nO1xuICAgICAgdGhpcy5zZXRTdHlsZUNvbnRlbnQoKTtcbiAgICB9KTtcbiAgIFxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVXaWR0aHNJblBpeGVscyhuZXdXaWR0aDogbnVtYmVyLCBzb3J0YWJsZVdpZHRoczogSVNvcnRhYmxlV2lkdGhJdGVtW10sIHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlOiBudW1iZXIpOiB2b2lkIHtcblxuICAgIGxldCByZW1haW5pbmdXaWR0aDogbnVtYmVyID0gdGhpcy50b3RhbENvbXB1dGVkV2lkdGggLSBuZXdXaWR0aDtcbiAgICBcbiAgICBzb3J0YWJsZVdpZHRocy5mb3JFYWNoKChpdGVtOiBJU29ydGFibGVXaWR0aEl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IG1heFBlcmNPZlJlbWFpbmluZzogbnVtYmVyID0gMSAvIHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlO1xuICAgICAgbGV0IGFtb3VudE1vdmVkOiBudW1iZXIgPSAwO1xuICAgICAgY29uc3QgcmVzaXplSUQ6IHN0cmluZyA9IHRoaXMuaWQgKyAnIC4nICsgaXRlbS5jbGFzc05hbWU7XG5cbiAgICAgIGlmIChpdGVtLndpZHRoIC0gaXRlbS5taW5XaWR0aCA8IG1heFBlcmNPZlJlbWFpbmluZyAqIHJlbWFpbmluZ1dpZHRoKSB7XG4gICAgICAgIGFtb3VudE1vdmVkID0gaXRlbS53aWR0aCAtIGl0ZW0ubWluV2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbW91bnRNb3ZlZCA9IG1heFBlcmNPZlJlbWFpbmluZyAqIHJlbWFpbmluZ1dpZHRoO1xuICAgICAgfVxuICAgICAgXG4gICAgICBhbW91bnRNb3ZlZCA9IE1hdGgucm91bmQoYW1vdW50TW92ZWQgKiAxMDApIC8gMTAwOyAvLyByb3VuZCB0byAyIGRlY2ltYWwgcG9pbnRzXG5cbiAgICAgIGNvbnN0IGNsYXNzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5pbmRleE9mKGl0ZW0uY2xhc3NOYW1lKTtcbiAgICAgIHRoaXMuY2xhc3NXaWR0aHNbY2xhc3NJbmRleF0gPSAoaXRlbS53aWR0aCAtIGFtb3VudE1vdmVkKTtcbiAgICAgIFxuICAgICAgY29uc3QgbWFya3VwSXRlbTogYW55ID0gdGhpcy5zdHlsZXNCeUNsYXNzLmZpbHRlcihzdHlsZSA9PiBzdHlsZS5pZCA9PT0gcmVzaXplSUQpWzBdO1xuICAgICAgbGV0IG1hcmt1cCA9IHJlc2l6ZUlEICsgJyB7IHdpZHRoOiAnICsgKGl0ZW0ud2lkdGggLSBhbW91bnRNb3ZlZCkgKyAncHggfSc7XG4gICAgICBtYXJrdXBJdGVtLm1hcmt1cCA9IG1hcmt1cDtcbiAgICAgIG1hcmt1cEl0ZW0ud2lkdGggPSAoaXRlbS53aWR0aCAtIGFtb3VudE1vdmVkKS50b1N0cmluZygpO1xuXG4gICAgICB0aGlzLnRvdGFsQ29tcHV0ZWRXaWR0aCAtPSBhbW91bnRNb3ZlZDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyaWRUZW1wbGF0ZUNvbHVtbnM6IHN0cmluZyA9IHRoaXMuY29uc3RydWN0R3JpZFRlbXBsYXRlQ29sdW1ucygpO1xuXG4gICAgdGhpcy5ncmlkVGVtcGxhdGVUeXBlcy5mb3JFYWNoKHN0eWxlT2JqID0+IHtcbiAgICAgIHN0eWxlT2JqLnN0eWxlLmlubmVySFRNTCA9IHRoaXMuaWQgKyAnIC4nICsgdGhpcy5yZW9yZGVyYWJsZUNsYXNzICsgJyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczonICsgZ3JpZFRlbXBsYXRlQ29sdW1ucyArICc7IH0nO1xuICAgICAgdGhpcy5zZXRTdHlsZUNvbnRlbnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZml0V2lkdGhzVG9PbmVIdW5kcmVkUGVyY2VudCgpOiB2b2lkIHtcbiAgICBjb25zdCBudW1lcmljYWxXaWR0aHM6IG51bWJlcltdID0gdGhpcy5jbGFzc1dpZHRocy5tYXAoKHdkdGg6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4gTnVtYmVyKHdkdGgucmVwbGFjZSgnJScsICcnKSkpO1xuICAgIGNvbnN0IHdpZHRoVG90YWw6IG51bWJlciA9IG51bWVyaWNhbFdpZHRocy5yZWR1Y2UoKHByZXY6IG51bWJlciwgd2R0aDogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gcHJldiArIHdkdGg7XG4gICAgfSwgMCk7XG5cbiAgICBjb25zdCBzY2FsZWRXaWR0aHM6IHsgd2lkdGg6IG51bWJlciwgaW5kZXg6IG51bWJlciB9W10gPSBudW1lcmljYWxXaWR0aHMubWFwKCh3ZHRoOiBudW1iZXIsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB3ZHRoIC8gd2lkdGhUb3RhbCAqIDEwMCxcbiAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzY2FsZWRXaWR0aHMuZm9yRWFjaCgoaXRlbTogeyB3aWR0aDogbnVtYmVyLCBpbmRleDogbnVtYmVyIH0sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHRoaXMuY2xhc3NXaWR0aHNbaXRlbS5pbmRleF0gPSBzY2FsZWRXaWR0aHNbaXRlbS5pbmRleF0ud2lkdGgudG9TdHJpbmcoKSArICclJztcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVXaWR0aHMobmV3V2lkdGg6IG51bWJlcikge1xuICAgIGNvbnN0IGN1cnJlbnRXaWR0aHM6IG51bWJlcltdID0gdGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplLm1hcCgocmVzaXplQ2xhc3M6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xhc3NXaWR0aEluUGl4ZWxzKHJlc2l6ZUNsYXNzKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNvcnRhYmxlV2lkdGhzOiBJU29ydGFibGVXaWR0aEl0ZW1bXSA9IGN1cnJlbnRXaWR0aHMubWFwKCh3LCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWluV2lkdGg6IHRoaXMubWluV2lkdGhzW2luZGV4XSxcbiAgICAgICAgd2lkdGg6IHcsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplW2luZGV4XVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdmlzaWJsZVNvcnRhYmxlV2lkdGhzOiBJU29ydGFibGVXaWR0aEl0ZW1bXSA9IHNvcnRhYmxlV2lkdGhzLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIHJldHVybiAhdGhpcy5jb2x1bW5Jc0hpZGRlbldpdGhDbGFzcyhpdGVtLmNsYXNzTmFtZSk7XG4gICAgfSlcblxuICAgIGNvbnN0IHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlOiBudW1iZXIgPSB0aGlzLmdldFRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlKHZpc2libGVTb3J0YWJsZVdpZHRocyk7XG5cbiAgICBpZiAodGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCkge1xuICAgICAgdGhpcy51cGRhdGVXaWR0aHNJblBlcmNlbnQobmV3V2lkdGgsIHZpc2libGVTb3J0YWJsZVdpZHRocywgdG90YWxHcm91cGVkQ29sdW1uc1Zpc2libGUsIHNvcnRhYmxlV2lkdGhzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVXaWR0aHNJblBpeGVscyhuZXdXaWR0aCwgdmlzaWJsZVNvcnRhYmxlV2lkdGhzLCB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZW5lcmF0ZVdpZHRoU3R5bGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVXaWR0aFN0eWxlKCkge1xuICAgIGxldCBpbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLnN0eWxlc0J5Q2xhc3MuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlubmVySFRNTCArPSBpdGVtLm1hcmt1cDtcbiAgICB9KTtcbiAgICB0aGlzLndpZHRoU3R5bGUhLmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICB0aGlzLnNldFN0eWxlQ29udGVudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemFibGVDbGFzc2VzKGVsOiBFbGVtZW50IHwgYW55KTogc3RyaW5nW10ge1xuICAgIHJldHVybiBlbCA/IGVsWydkYXRhQ2xhc3NlcyddIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0UmVzaXphYmxlU3R5bGVzKCkge1xuXG4gICAgY29uc3QgYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTogYW55ID0gdGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzO1xuICAgIGxldCBlbDogRWxlbWVudDtcbiAgICBjb25zdCBjbGFzc2VzVXNlZDogc3RyaW5nW10gPSBbXTtcblxuICAgIGxldCBmcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudDtcbiAgICBsZXQgc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQ7XG4gICAgbGV0IHN0eWxlVGV4dCA9ICcnO1xuXG4gICAgaWYgKHRoaXMubGlua0NsYXNzID09PSB1bmRlZmluZWQgfHwgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcmFnbWVudCA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10ud2lkdGhTdHlsZUZyYWdtZW50O1xuICAgICAgc3R5bGUgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLndpZHRoU3R5bGU7XG4gICAgfVxuICAgIGxldCBtYXJrdXA6IHN0cmluZztcblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsID0gYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZVtpXTtcbiAgICAgICAgY29uc3QgcmVzaXplQ2xhc3Nlczogc3RyaW5nW10gPSB0aGlzLmdldFJlc2l6YWJsZUNsYXNzZXMoZWwpO1xuXG4gICAgICAgIHJlc2l6ZUNsYXNzZXMuZm9yRWFjaCgocmVzaXplQ2xzOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoY2xhc3Nlc1VzZWQuaW5kZXhPZihyZXNpemVDbHMpID09PSAtMSkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHJlc2l6ZUNscylbMF07XG4gICAgICAgICAgICBjb25zdCBzdGFydGluZ1dpZHRoID0gISF0aGlzLmluaXRpYWxXaWR0aHNbcmVzaXplQ2xzXSA/IHRoaXMuaW5pdGlhbFdpZHRoc1tyZXNpemVDbHNdIDogZmlyc3RFbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlIHBlcmNlbnRhZ2UgaWYgd2UgaGF2ZSB3aWR0aFBlcmNlbnQgZW5hYmxlZFxuICAgICAgICAgICAgY29uc3Qgc3RhcnRpbmdXaWR0aFBlcmNlbnQgPSB0aGlzLmluaXRpYWxXaWR0aHNbcmVzaXplQ2xzXTtcbiAgICAgICAgICAgIGNvbnN0IHJlc2l6ZUlEOiBzdHJpbmcgPSB0aGlzLmlkICsgJyAuJyArIHJlc2l6ZUNscztcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50IHx8IHN0YXJ0aW5nV2lkdGgudG9TdHJpbmcoKS5pbmNsdWRlcygnJScpKSB7XG4gICAgICAgICAgICAgIG1hcmt1cCA9IHJlc2l6ZUlEICsgJyB7IHdpZHRoOiAnICsgMTAwICsgJyV9JztcbiAgICAgICAgICAgICAgdGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtYXJrdXAgPSByZXNpemVJRCArICcgeyB3aWR0aDogJyArIHN0YXJ0aW5nV2lkdGggKyAncHggfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHlsZVRleHQgKz0gbWFya3VwO1xuICAgICAgICAgICAgdGhpcy5zdHlsZXNCeUNsYXNzLnB1c2goeyBzdHlsZSwgaWQ6IHJlc2l6ZUlELCByZXNpemVDbGFzczogcmVzaXplQ2xzLCBtYXJrdXAsIHdpZHRoOiBzdGFydGluZ1dpZHRoIH0pO1xuICAgICAgICAgICAgY2xhc3Nlc1VzZWQucHVzaChyZXNpemVDbHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGVzQnlDbGFzcyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3R5bGVzQnlDbGFzcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5saW5rQ2xhc3MgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLmlubmVySFRNTCA9IHN0eWxlVGV4dDtcbiAgICB9XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIHRoaXMud2lkdGhTdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMud2lkdGhTdHlsZUZyYWdtZW50ID0gZnJhZ21lbnQ7XG5cbiAgICB0aGlzLmFkZFN0eWxlKHN0eWxlLCBmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXSA9IHt9O1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWREaXJlY3RpdmUgPSB0aGlzO1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN0eWxlc0J5Q2xhc3MgPSB0aGlzLnN0eWxlc0J5Q2xhc3M7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLndpZHRoU3R5bGVGcmFnbWVudCA9IGZyYWdtZW50O1xuICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS53aWR0aFN0eWxlID0gc3R5bGU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRTdHlsZShzdHlsZTogSFRNTFN0eWxlRWxlbWVudCwgYWRkVG9Db250ZW50OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0eWxlTGlzdC5pbmRleE9mKHN0eWxlKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuc3R5bGVMaXN0LnB1c2goc3R5bGUpO1xuICAgIH1cblxuICAgIGlmIChhZGRUb0NvbnRlbnQpIHtcbiAgICAgIHRoaXMuc2V0U3R5bGVDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRTdHlsZUNvbnRlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5zdHlsZUNvbnRlbnQgPSAnJztcbiAgICB0aGlzLnN0eWxlTGlzdC5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICAgIHRoaXMuc3R5bGVDb250ZW50ICs9IHN0eWxlLmlubmVySFRNTDtcbiAgICB9KTtcbiAgICB0aGlzLmhlYWRTdHlsZSEuaW5uZXJIVE1MID0gdGhpcy5zdHlsZUNvbnRlbnQ7XG4gIH1cblxuICBwdWJsaWMgbW92ZVN0eWxlQ29udGVudFRvUHJvbWluZW50KCk6IHZvaWQge1xuICAgIHRoaXMuaGVhZFRhZy5hcHBlbmRDaGlsZCh0aGlzLmhlYWRTdHlsZSEpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRSZW9yZGVyU3R5bGVzKCkge1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8ICh0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdICYmIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10ucmVvcmRlckhpZ2hsaWdodFN0eWxlID09PSB1bmRlZmluZWQpKSB7XG4gICAgICBjb25zdCBmcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gdGhpcy5pZCArICcgLmhpZ2hsaWdodC1sZWZ0IGRpdjphZnRlciwgJyArIHRoaXMuaWQgKyAnIC5oaWdobGlnaHQtcmlnaHQgZGl2OmFmdGVyIHsgaGVpZ2h0OiAyMDBweCAhaW1wb3J0YW50IH0nO1xuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGUgPSBzdHlsZTtcbiAgICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQgPSBmcmFnbWVudDtcblxuICAgICAgdGhpcy5hZGRTdHlsZShzdHlsZSwgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5yZW9yZGVySGlnaGxpZ2h0U3R5bGUgPSB0aGlzLnJlb3JkZXJIaWdobGlnaHRTdHlsZTtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5yZW9yZGVySGlnaGxpZ2h0U3R5bGVGcmFnbWVudCA9IHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5yZW9yZGVySGlnaGxpZ2h0U3R5bGU7XG4gICAgICB0aGlzLnJlb3JkZXJIaWdobGlnaHRTdHlsZUZyYWdtZW50ID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5yZW9yZGVySGlnaGxpZ2h0U3R5bGVGcmFnbWVudDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldENvbFNwYW4oZWxlbWVudDogRWxlbWVudCk6IG51bWJlciB7XG4gICAgY29uc3QgY29sU3Bhbjogc3RyaW5nIHwgbnVsbCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgcmV0dXJuIGNvbFNwYW4gPT09IG51bGwgPyAxIDogTnVtYmVyKGNvbFNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUNvbHVtblNwYW5zQXJlVGhlU2FtZShjb2xTcGFuczogbnVtYmVyW10pIHtcblxuICAgIGlmIChjb2xTcGFucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdObyBjb2x1bW5zIGFwcGVhciB0byBleGlzdC4nKTtcbiAgICB9XG4gICAgY29uc3QgY29sTGVuZ3RoOiBudW1iZXIgPSBjb2xTcGFuc1swXTtcbiAgICBjb25zdCBpbnZhbGlkQ29sTGVuZ3RoczogbnVtYmVyW10gPSBjb2xTcGFucy5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSBjb2xMZW5ndGgpO1xuICAgIGlmIChpbnZhbGlkQ29sTGVuZ3Rocy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignR3JpZCBjb2x1bW4gbGVuZ3RocyBkbyBub3QgbWF0Y2guICBQbGVhc2UgY2hlY2sgeW91ciBjb2xzcGFucy4nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uUG9pbnRlclVwKGV2ZW50OiBhbnkpIHtcblxuICAgIGNvbnN0IHRoczogR3JpZERpcmVjdGl2ZSA9IGRvY3VtZW50WydjdXJyZW50R3JpZERpcmVjdGl2ZSddO1xuICAgIHRocy5yZW1vdmVQb2ludGVyTGlzdGVuZXJzKCk7XG4gICAgaWYgKHRocy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVvcmRlcmluZykge1xuXG4gICAgICB0aHMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJpbmcgPSBmYWxzZTtcbiAgICAgIHRocy5yZW1vdmVEcmFnQW5kRHJvcENvbXBvbmVudCgpO1xuICAgICAgaWYgKCF0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aHMucmVtb3ZlRWxlbWVudEhpZ2hsaWdodCh0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCk7XG4gICAgICB0aHMucmVtb3ZlSGlnaGxpZ2h0cygpO1xuXG4gICAgICBpZiAodGhzLnJlb3JkZXJHcmlwcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgdGhzLnJlb3JkZXJDb2x1bW5zKGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhzLmNvbHVtblJlb3JkZXJFbmQuZW1pdCh7XG4gICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgIGNvbHVtbkRyYWdnZWQ6IHRocy5kcmFnZ2luZ0NvbHVtbixcbiAgICAgICAgY29sdW1uSG92ZXJlZDogdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnRcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY3VzdG9tUmVvcmRlckVuZEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KENvbHVtblJlb3JkZXJFdmVudC5PTl9SRU9SREVSX0VORCwge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIGNvbHVtbkRyYWdnZWQ6IHRocy5kcmFnZ2luZ0NvbHVtbixcbiAgICAgICAgICBjb2x1bW5Ib3ZlcmVkOiB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRocy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbVJlb3JkZXJFbmRFdmVudCk7XG4gICAgICB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCA9IG51bGw7XG4gICAgICB0aHMubGFzdE1vdmVEaXJlY3Rpb24gPSAtMTtcbiAgICAgIHRocy5kcmFnZ2luZ0NvbHVtbiEuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICAgIHRocy5kcmFnZ2luZ0NvbHVtbiA9IG51bGw7XG4gICAgfVxuICAgIGlmICghdGhzLmRyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocy5jb2x1bW5SZXNpemVFbmQuZW1pdCh7XG4gICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgY29sdW1uV2lkdGg6IHRocy50b3RhbENvbXB1dGVkV2lkdGgsXG4gICAgICBjb2x1bW5NaW5XaWR0aDogdGhzLnRvdGFsQ29tcHV0ZWRNaW5XaWR0aCxcbiAgICAgIGNsYXNzZXNCZWluZ1Jlc2l6ZWQ6IHRocy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplXG4gICAgfSk7XG4gICAgY29uc3QgY3VzdG9tUmVzaXplRW5kRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoQ29sdW1uUmVzaXplRXZlbnQuT05fUkVTSVpFX0VORCwge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgIGNvbHVtbldpZHRoOiB0aHMudG90YWxDb21wdXRlZFdpZHRoLFxuICAgICAgICBjb2x1bW5NaW5XaWR0aDogdGhzLnRvdGFsQ29tcHV0ZWRNaW5XaWR0aCxcbiAgICAgICAgY2xhc3Nlc0JlaW5nUmVzaXplZDogdGhzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemVcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aHMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21SZXNpemVFbmRFdmVudCk7XG4gICAgdGhzLmVuZERyYWcoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRQb2ludGVyTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuZG9jdW1lbnRbJ2N1cnJlbnRHcmlkRGlyZWN0aXZlJ10gPSB0aGlzO1xuICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLm9uUG9pbnRlck1vdmUpO1xuICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5vblBvaW50ZXJVcCk7XG4gIH1cbiAgcHJpdmF0ZSByZW1vdmVQb2ludGVyTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuZG9jdW1lbnRbJ2N1cnJlbnRHcmlkRGlyZWN0aXZlJ10gPSBudWxsO1xuICAgIHRoaXMuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLm9uUG9pbnRlck1vdmUpO1xuICAgIHRoaXMuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5vblBvaW50ZXJVcCk7XG4gIH1cblxuICBwcml2YXRlIGVuZERyYWcoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kcmFnZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgdGhpcy50b3RhbENvbXB1dGVkTWluV2lkdGggPSAwO1xuICAgIHRoaXMudG90YWxDb21wdXRlZFdpZHRoID0gMDtcbiAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUgPSBbXTtcbiAgICB0aGlzLm1pbldpZHRocyA9IFtdO1xuICAgIHRoaXMuc3RhcnRpbmdXaWR0aHMgPSBbXTtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGluaXRHcmlkKCkge1xuICAgIFxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5oZWFkU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgdGhpcy5oZWFkU3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICB0aGlzLmhlYWRUYWcuYXBwZW5kQ2hpbGQodGhpcy5oZWFkU3R5bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWRTdHlsZSA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uaGVhZFN0eWxlO1xuICAgIH1cblxuICAgIHRoaXMuZ2VuZXJhdGVDb250YWluZXJJRCgpO1xuICAgIHRoaXMuZ2VuZXJhdGVWaWV3cG9ydElEKCk7XG4gICAgdGhpcy5hdHRhY2hDb250ZW50UmVzaXplU2Vuc29yKCk7XG4gICAgdGhpcy5zZXRSZXNpemFibGVTdHlsZXMoKTtcbiAgICB0aGlzLnNldFJlb3JkZXJTdHlsZXMoKTtcbiAgICB0aGlzLmdlbmVyYXRlQ29sdW1uR3JvdXBzKCk7XG5cbiAgICB0aGlzLnNldEdyaWRUZW1wbGF0ZUNsYXNzZXMoKTtcbiAgICBcblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3R5bGVzQnlDbGFzcykge1xuICAgICAgdGhpcy5zdHlsZXNCeUNsYXNzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdHlsZXNCeUNsYXNzO1xuICAgICAgdGhpcy5jbGFzc1dpZHRocyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uY2xhc3NXaWR0aHM7XG4gICAgfVxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uY2xhc3NXaWR0aHMpIHtcbiAgICAgIHRoaXMuY2xhc3NXaWR0aHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNsYXNzV2lkdGhzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzV2lkdGhzID0gdGhpcy5jYWxjdWxhdGVXaWR0aHNGcm9tU3R5bGVzKCk7XG4gICAgICBpZiAodGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5jbGFzc1dpZHRocyA9IHRoaXMuY2xhc3NXaWR0aHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRHcmlkT3JkZXIoKTtcbiAgICB0aGlzLmVtaXRHcmlkSW5pdGlhbGl6YXRpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0R3JpZFRlbXBsYXRlQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBsZXQgaW5kOiBudW1iZXIgPSAtMTtcbiAgICBsZXQgaGlnaGVzdExlbjogbnVtYmVyID0gMDtcbiAgICBcbiAgICBsZXQgZ3JvdXA6IGFueTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnBhcmVudEdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGdyb3VwID0gdGhpcy5wYXJlbnRHcm91cHNbaW5kZXhdO1xuICAgICAgaWYgKGdyb3VwLmxlbmd0aCA+IGhpZ2hlc3RMZW4pIHtcbiAgICAgICAgaGlnaGVzdExlbiA9IGdyb3VwLmxlbmd0aDtcbiAgICAgICAgaW5kID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIFxuXG4gICAgaWYgKHRoaXMucGFyZW50R3JvdXBzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhpcy5wYXJlbnRHcm91cHNbaW5kXS5mb3JFYWNoKChpdGVtMiwgaW5kZXgpID0+IHtcbiAgICAgICAgdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLnB1c2godGhpcy5nZXRSZXNpemFibGVDbGFzc2VzKGl0ZW0yKVswXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMubGlua0NsYXNzKSB7XG4gICAgICBpZiAoIXRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZFRlbXBsYXRlQ2xhc3Nlcykge1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRUZW1wbGF0ZUNsYXNzZXMgPSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgdGhpcy52ZXJpZnlMaW5rZWRUZW1wbGF0ZUNsYXNzZXNNYXRjaCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2ZXJpZnlMaW5rZWRUZW1wbGF0ZUNsYXNzZXNNYXRjaCgpOiB2b2lkIHtcbiAgICBsZXQgY29sdW1uc0FyZVRoZVNhbWU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLmdyaWRUZW1wbGF0ZUNsYXNzZXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpdGVtICE9PSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXNbaW5kZXhdKSB7XG4gICAgICAgIGNvbHVtbnNBcmVUaGVTYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjb2x1bW5zQXJlVGhlU2FtZSkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvbHVtbiBjbGFzc2VzIG11c3QgbWF0Y2ggZm9yIGxpbmtlZCB0YWJsZXM6XFxuXFxuICR7dGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlQ2xhc3Nlc31cXG4gICBkb2VzIG5vdCBtYXRjaFxcbiAke3RoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlc31cXG5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGN1bGF0ZVdpZHRoc0Zyb21TdHlsZXMoKTogYW55W10ge1xuICAgIGlmICghdGhpcy5zdHlsZXNCeUNsYXNzWzBdLndpZHRoLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSAmJiB0aGlzLmNsYXNzV2lkdGhzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZXNCeUNsYXNzLm1hcCgoc3R5bGVPYmosIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiAoTWF0aC5yb3VuZCgoMSAvIHRoaXMuc3R5bGVzQnlDbGFzcy5sZW5ndGgpICogMTAwMDApIC8gMTAwKS50b1N0cmluZygpICsgJyUnO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc0J5Q2xhc3MubWFwKChzdHlsZU9iaiwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHN0eWxlT2JqLndpZHRoLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSkge1xuICAgICAgICAgIHJldHVybiBzdHlsZU9iai53aWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gTnVtYmVyKHN0eWxlT2JqLndpZHRoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0R3JpZEluaXRpYWxpemF0aW9uKCkge1xuICAgIGNvbnN0IGVtaXR0ZXJPYmogPSB7XG4gICAgICBncmlkQ29tcG9uZW50OiB0aGlzLFxuICAgICAgZ3JpZEVsZW1lbnQ6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgfTtcbiAgICB0aGlzLnByZUdyaWRJbml0aWFsaXplLmVtaXQoZW1pdHRlck9iaik7XG4gICAgdGhpcy5ncmlkSW5pdGlhbGl6ZS5lbWl0KGVtaXR0ZXJPYmopO1xuXG4gICAgY29uc3QgY3VzdG9tR3JpZEluaXRpYWxpemVkRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoR3JpZEV2ZW50Lk9OX0lOSVRJQUxJWkVELCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgZ3JpZENvbXBvbmVudDogZW1pdHRlck9iai5ncmlkQ29tcG9uZW50LFxuICAgICAgICBncmlkRWxlbWVudDogZW1pdHRlck9iai5ncmlkQ29tcG9uZW50LFxuICAgICAgICB0eXBlOiBHcmlkRXZlbnQuT05fSU5JVElBTElaRURcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tR3JpZEluaXRpYWxpemVkRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEcmFnQW5kRHJvcENvbXBvbmVudCgpIHtcbiAgICBjb25zdCBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+ID0gdGhpcy5vcGVuTW9kYWwoRHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCwgdGhpcy5EUkFHX0FORF9EUk9QX0dIT1NUX09WRVJMQVlfREFUQSwge30pO1xuICAgIHRoaXMuZHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIG9wZW5Nb2RhbChcbiAgICBjb21wb25lbnRUeXBlOiBDb21wb25lbnRUeXBlPHVua25vd24+LFxuICAgIHRva2VuOiBJbmplY3Rpb25Ub2tlbjxhbnk+LFxuICAgIGRhdGE6IGFueSwgcG9zaXRpb25TdHJhdGVneTogUG9zaXRpb25TdHJhdGVneSB8IG51bGwgPSBudWxsLFxuICAgIG92ZXJsYXlDb25maWc6IE92ZXJsYXlDb25maWcgfCBudWxsID0gbnVsbFxuICApOiBDb21wb25lbnRSZWY8dW5rbm93bj4ge1xuXG4gICAgaWYgKCFwb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmdsb2JhbCgpXG4gICAgICAuY2VudGVySG9yaXpvbnRhbGx5KClcbiAgICAgIC5jZW50ZXJWZXJ0aWNhbGx5KCk7XG4gICAgfVxuICAgXG4gICAgaWYgKCFvdmVybGF5Q29uZmlnKSB7XG4gICAgICBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgICAgYmFja2Ryb3BDbGFzczogJ21vZGFsLWJnJyxcbiAgICAgICAgcGFuZWxDbGFzczogJ21vZGFsLWNvbnRhaW5lcicsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLm92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpLFxuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlSZWYgPSB0aGlzLm92ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuXG4gICAgdGhpcy5pbmplY3RvciA9IHRoaXMuY3JlYXRlSW5qZWN0b3IoZGF0YSwgdG9rZW4pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsOiBDb21wb25lbnRQb3J0YWw8dW5rbm93bj4gPSBuZXcgQ29tcG9uZW50UG9ydGFsKGNvbXBvbmVudFR5cGUsIG51bGwsIHRoaXMuaW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPHVua25vd24+ID0gdGhpcy5vdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSW5qZWN0b3IoZGF0YVRvUGFzcywgdG9rZW46IGFueSk6IEluamVjdG9yIHtcbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdGhpcy5pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IHRva2VuLCB1c2VWYWx1ZTogZGF0YVRvUGFzcyB9XG4gICAgICBdXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgc2V0RHJhZ0FuZERyb3BQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMuZHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCEubGVmdCA9IHg7XG4gICAgdGhpcy5kcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50IS50b3AgPSB5O1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVEcmFnQW5kRHJvcENvbXBvbmVudCgpIHtcbiAgICBpZiAodGhpcy5vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLm92ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRQYXJlbnRHcm91cHMoYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTogYW55W10pOiB2b2lkIHtcbiAgICBjb25zdCBjb2xTcGFuczogbnVtYmVyW10gPSBbXTtcbiAgICBsZXQgY3VyclNwYW5Db3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgbGFzdFBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCBjaGlsZHJlbiE6IEVsZW1lbnRbXTtcbiAgICBsZXQgY29sdW1uU3RhcnQ6IG51bWJlciA9IDE7XG4gICAgbGV0IGNvbFJhbmdlczogbnVtYmVyW11bXSA9IFtdO1xuXG4gICAgdGhpcy5jb2xSYW5nZUdyb3Vwcy5wdXNoKGNvbFJhbmdlcyk7XG5cbiAgICBsZXQgaXRlbTogYW55O1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaXRlbTogRWxlbWVudCA9IGFsbEVsZW1lbnRzV2l0aERhdGFSZXNpemFibGVbaW5kZXhdO1xuICAgICAgY29uc3Qgc3BhbjogbnVtYmVyID0gdGhpcy5nZXRDb2xTcGFuKGl0ZW0pO1xuICAgICAgXG4gICAgICBpZiAoaXRlbS5wYXJlbnRFbGVtZW50ICE9PSBsYXN0UGFyZW50KSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICAgIGNvbFNwYW5zLnB1c2goY3VyclNwYW5Db3VudCk7XG4gICAgICAgICAgY29sdW1uU3RhcnQgPSAxO1xuICAgICAgICAgIGNvbFJhbmdlcyA9IFtdO1xuICAgICAgICAgIHRoaXMuY29sUmFuZ2VHcm91cHMucHVzaChjb2xSYW5nZXMpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJTcGFuQ291bnQgPSAwO1xuICAgICAgICBsYXN0UGFyZW50ID0gaXRlbS5wYXJlbnRFbGVtZW50O1xuICAgICAgICBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudEdyb3Vwcy5wdXNoKGNoaWxkcmVuKTtcbiAgICAgIH1cbiAgICAgIGNvbFJhbmdlcy5wdXNoKFtjb2x1bW5TdGFydCwgKHNwYW4gKyBjb2x1bW5TdGFydCldKTtcbiAgICAgIGN1cnJTcGFuQ291bnQgKz0gc3BhbjtcbiAgICAgIGNvbHVtblN0YXJ0ICs9IHNwYW47XG4gICAgICBjaGlsZHJlbi5wdXNoKGl0ZW0pO1xuICAgIH1cblxuICAgIGNvbFNwYW5zLnB1c2goY3VyclNwYW5Db3VudCk7XG5cbiAgICB0aGlzLnZhbGlkYXRlQ29sdW1uU3BhbnNBcmVUaGVTYW1lKGNvbFNwYW5zKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDb2x1bW5Hcm91cHMoKSB7XG4gICAgY29uc3QgYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTogYW55ID0gdGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzO1xuICAgIGNvbnN0IGFycjogRWxlbWVudFtdID0gYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTtcbiAgICBsZXQgY29sT3JkZXI6IG51bWJlciA9IDE7XG4gICAgbGV0IGxhc3RQYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbGFzdEdyb3VwOiBJQ29sdW1uRGF0YVtdIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGxhc3RPcmRlcjogbnVtYmVyID0gMDtcbiAgICBsZXQgbGFzdEluZGV4OiBudW1iZXIgPSAwO1xuICAgIGxldCBzcGFuQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGNvbERhdGFHcm91cDogYW55W10gPSBbXTtcblxuICAgIHRoaXMuY29sRGF0YUdyb3Vwcy5wdXNoKGNvbERhdGFHcm91cCk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYXJyLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaXRlbTogRWxlbWVudCB8IG51bGwgPSBhcnJbaW5kZXhdO1xuXG4gICAgICBpZiAoaXRlbS5wYXJlbnRFbGVtZW50ICE9PSBsYXN0UGFyZW50KSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICAgIGNvbE9yZGVyID0gMTtcbiAgICAgICAgICBsYXN0R3JvdXAgPSBjb2xEYXRhR3JvdXA7XG4gICAgICAgICAgbGFzdE9yZGVyID0gaW5kZXg7XG4gICAgICAgICAgbGFzdEluZGV4ID0gMDtcbiAgICAgICAgICBjb2xEYXRhR3JvdXAgPSBbXTtcbiAgICAgICAgICB0aGlzLmNvbERhdGFHcm91cHMucHVzaChjb2xEYXRhR3JvdXApO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RQYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb2xPcmRlciA9IGluZGV4ICsgMSAtIGxhc3RPcmRlcjtcblxuICAgICAgaWYgKGxhc3RHcm91cCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAobGFzdEdyb3VwW2xhc3RJbmRleF0uc3BhbiA8IChjb2xPcmRlciAtIHNwYW5Db3VudCkpIHtcbiAgICAgICAgICBzcGFuQ291bnQgKz0gbGFzdEdyb3VwW2xhc3RJbmRleF0uc3BhbjtcbiAgICAgICAgICBsYXN0SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuY29sRGF0YSA9IHtcbiAgICAgICAgb3JkZXI6IGNvbE9yZGVyLFxuICAgICAgICBsYXN0RGF0YVNwYW46IChjb2xPcmRlciAtIHNwYW5Db3VudCksXG4gICAgICAgIG50aENoaWxkOiBjb2xPcmRlcixcbiAgICAgICAgc3BhbjogdGhpcy5nZXRDb2xTcGFuKGl0ZW0pLFxuICAgICAgICBzdWJHcm91cHM6IFtdLFxuICAgICAgICBwYXJlbnQ6IGl0ZW0ucGFyZW50RWxlbWVudCBhcyBFbGVtZW50LFxuICAgICAgICBjaGlsZDogaXRlbSxcbiAgICAgICAgbGlua2VkQ2hpbGRyZW46IFtdLFxuICAgICAgICBzdWJDb2x1bW5MZW5ndGg6IDBcbiAgICAgIH07XG4gICAgICBjb2xEYXRhR3JvdXAucHVzaCh0aGlzLmNvbERhdGEpO1xuICAgIH1cbiAgICBcbiAgICBsZXQgZ3JvdXBzV2VyZVNldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAmJiB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHMpIHtcbiAgICAgIHRoaXMudmVyaWZ5TGlua2VkR3JvdXBTdHJ1Y3R1cmVzTWF0Y2godGhpcy5jb2xEYXRhR3JvdXBzLCB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHMpO1xuICAgICAgZ3JvdXBzV2VyZVNldCA9IHRydWU7XG4gICAgICB0aGlzLmNvbERhdGFHcm91cHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHM7XG4gICAgICB0aGlzLmNvbERhdGFHcm91cHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHM7XG4gICAgfVxuXG4gICAgXG5cbiAgICBpZiAodGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uY29sRGF0YUdyb3VwcyA9IHRoaXMuY29sRGF0YUdyb3VwcztcbiAgICB9XG5cbiAgICBpZiAoIWdyb3Vwc1dlcmVTZXQpIHtcbiAgICAgIGxldCBjb2x1bW5Hcm91cDogYW55O1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBsZW4gPSB0aGlzLmNvbERhdGFHcm91cHMubGVuZ3RoOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgICBjb2x1bW5Hcm91cCA9IHRoaXMuY29sRGF0YUdyb3Vwc1tpbmRleF07XG4gICAgICAgIGlmIChpbmRleCA8IHRoaXMuY29sRGF0YUdyb3Vwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgdGhpcy5nZW5lcmF0ZVN1Ykdyb3VwKGNvbHVtbkdyb3VwLCB0aGlzLmNvbERhdGFHcm91cHNbaW5kZXggKyAxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09PSBsZW4gLSAxKSB7XG4gICAgICAgICAgdGhpcy5vcmRlclN1Ykdyb3Vwcyhjb2x1bW5Hcm91cCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgXG4gICAgICB0aGlzLnNldExpbmtlZEhlYWRlckNvbnRhaW5lckNsYXNzZXMoKTtcbiAgICAgIHRoaXMuc2V0TGlua2VkQ2hpbGRyZW4oKTtcblxuICAgICAgaWYgKHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLnN1Ykdyb3VwU3R5bGVPYmpzKSB7XG4gICAgICAgIHRoaXMuZ3JpZFRlbXBsYXRlVHlwZXMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3MhXS5ncmlkVGVtcGxhdGVUeXBlcztcbiAgICAgICAgdGhpcy5zdHlsZUxpc3QgPSAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uc3R5bGVMaXN0O1xuICAgICAgICB0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uc3ViR3JvdXBTdHlsZU9ianM7XG4gICAgICAgIHRoaXMuc3ViR3JvdXBTdHlsZXMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3MhXS5zdWJHcm91cFN0eWxlcztcbiAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50cyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLnN1Ykdyb3VwRnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmdyaWRPcmRlciA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLmdyaWRPcmRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZlcmlmeUxpbmtlZEdyb3VwU3RydWN0dXJlc01hdGNoKGNvbERhdGFHcm91cHMxOiBJQ29sdW1uRGF0YVtdW10sIGNvbERhdGFHcm91cHMyOiBJQ29sdW1uRGF0YVtdW10pOiB2b2lkIHtcbiAgICBsZXQgY29sdW1uR3JvdXBzQXJlVGhlU2FtZTogYm9vbGVhbiA9IHRydWU7XG4gICAgaWYgKGNvbERhdGFHcm91cHMxLmxlbmd0aCAhPT0gY29sRGF0YUdyb3VwczIubGVuZ3RoKSB7XG4gICAgICBjb2x1bW5Hcm91cHNBcmVUaGVTYW1lID0gZmFsc2U7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sRGF0YUdyb3VwczEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDE6IElDb2x1bW5EYXRhW10gPSBjb2xEYXRhR3JvdXBzMVtpXTtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDI6IElDb2x1bW5EYXRhW10gPSBjb2xEYXRhR3JvdXBzMltpXTtcbiAgICAgIGlmIChjb2xEYXRhR3JvdXAxLmxlbmd0aCAhPT0gY29sRGF0YUdyb3VwMi5sZW5ndGgpIHtcbiAgICAgICAgY29sdW1uR3JvdXBzQXJlVGhlU2FtZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNvbHVtbkdyb3Vwc0FyZVRoZVNhbWUpIHtcbiAgICAgIHRocm93IEVycm9yKGBUaGUgaGVhZGVyIHN0cnVjdHVyZSBmb3IgbGlua2VkIHRhYmxlcyBkb2VzIG5vdCBtYXRjaC5cXG5QbGVhc2UgY2hlY2sgeW91ciBjb2x1bW4gc3BhbnMuYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIaWRkZW5DbGFzc0ZvckFsbExpbmtlZFBhcmVudEhlYWRlcnMoKTogSFRNTEVsZW1lbnRbXSB7XG5cbiAgICBjb25zdCBmbGF0dGVuZWRIaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHlbXSA9IHRoaXMuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG4gICAgY29uc3QgZmxhdHRlbmVkSGVpcmFyY2h5TGVuTWluMTogbnVtYmVyID0gZmxhdHRlbmVkSGllcmFyY2h5Lmxlbmd0aCAtIDE7XG5cbiAgICAvLyBzdGFydCBhdCB0aGUgZW5kIHRvIGdldCB0aGUgZGVlcGVzdCBjaGlsZCBwb3NzaWJsZVxuICAgIGZvciAobGV0IGkgPSBmbGF0dGVuZWRIZWlyYXJjaHlMZW5NaW4xOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkSGllcmFyY2h5W2ldO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnRzUmVzaG93bjogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHN0YXJ0SW5kZXg6IG51bWJlciA9IHRoaXMuY29sRGF0YUdyb3Vwcy5sZW5ndGggLSAyO1xuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29sRGF0YUdyb3VwOiBJQ29sdW1uRGF0YVtdID0gdGhpcy5jb2xEYXRhR3JvdXBzW2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xEYXRhR3JvdXAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sdW1uRGF0YTogSUNvbHVtbkRhdGEgPSBjb2xEYXRhR3JvdXBbal07XG4gICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQ6IGFueSA9IGNvbHVtbkRhdGEuY2hpbGQgYXMgYW55O1xuICAgICAgICBjb25zdCBwYXJlbnRXYXNIaWRkZW46IGJvb2xlYW4gPSBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW47XG4gICAgICAgIGxldCBoaWRkZW5DaGlsZENvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgY29uc3Qgc3ViR3JvdXA6IElDb2x1bW5EYXRhID0gY29sdW1uRGF0YS5zdWJHcm91cHNba107XG4gICAgICAgICAgaWYgKChzdWJHcm91cC5jaGlsZCBhcyBhbnkpLmhpZGVDb2x1bW4pIHtcbiAgICAgICAgICAgIGhpZGRlbkNoaWxkQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGlmICghcGFyZW50V2FzSGlkZGVuICYmIGhpZGRlbkNoaWxkQ291bnQgPT09IGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFyZW50RWxlbWVudC5oaWRlQ29sdW1uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0SGlkZGVuQ2xhc3NGb3JDb2x1bW5Hcm91cChjb2x1bW5EYXRhLmNoaWxkLCBjb2xEYXRhR3JvdXBbal0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFyZW50V2FzSGlkZGVuICYmIGhpZGRlbkNoaWxkQ291bnQgPCBjb2x1bW5EYXRhLnN1Ykdyb3Vwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuaGlkZUNvbHVtbiA9IGZhbHNlO1xuICAgICAgICAgICAgZWxlbWVudHNSZXNob3duLnB1c2gocGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50c1Jlc2hvd247XG4gIH1cblxuICBwcml2YXRlIHNldEhpZGRlbkNsYXNzRm9yQWxsTGlua2VkSGVhZGVycyhlbGVtZW50OiBIVE1MRWxlbWVudCB8IGFueSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xEYXRhR3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xEYXRhR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbERhdGFHcm91cC5sZW5ndGg7IGorKykge1xuICAgICAgICB0aGlzLnNldEhpZGRlbkNsYXNzRm9yQ29sdW1uR3JvdXAoZWxlbWVudCwgY29sRGF0YUdyb3VwW2pdKTtcbiAgICAgICAgXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIaWRkZW5DbGFzc0ZvckNvbHVtbkdyb3VwKGVsZW1lbnQ6IEVsZW1lbnQgfCBhbnksIGNvbHVtbkdyb3VwOiBJQ29sdW1uRGF0YSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbHVtbkRhdGE6IElDb2x1bW5EYXRhID0gY29sdW1uR3JvdXA7XG4gICAgaWYgKGNvbHVtbkRhdGEuY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgY29uc3QgaGlkZUNvbHVtbjogYm9vbGVhbiA9IGVsZW1lbnQuaGlkZUNvbHVtbjtcbiAgICAgIGlmIChoaWRlQ29sdW1uKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgfVxuICAgICAgY29sdW1uRGF0YS5saW5rZWRDaGlsZHJlbi5mb3JFYWNoKChoZWFkZXI6IEVsZW1lbnQgfCBhbnkpID0+IHtcbiAgICAgICAgaGVhZGVyLmhpZGVDb2x1bW4gPSBoaWRlQ29sdW1uO1xuICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgICBpZiAoaGlkZUNvbHVtbikge1xuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKHRoaXMuSElEREVOX0NPTFVNTl9DTEFTUyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aCA7IGkrKykge1xuICAgICAgICBjb25zdCBzdWJHcm91cDogSUNvbHVtbkRhdGEgPSBjb2x1bW5EYXRhLnN1Ykdyb3Vwc1tpXTtcbiAgICAgICAgKHN1Ykdyb3VwLmNoaWxkIGFzIGFueSkuaGlkZUNvbHVtbiA9IGhpZGVDb2x1bW47XG4gICAgICAgIHRoaXMuc2V0SGlkZGVuQ2xhc3NGb3JDb2x1bW5Hcm91cChzdWJHcm91cC5jaGlsZCwgc3ViR3JvdXApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRSZWxhdGVkSGVhZGVycyhlbGVtZW50OiBFbGVtZW50KTogKEVsZW1lbnQgfCBhbnkpW10ge1xuICAgIGlmICgoZWxlbWVudCBhcyBhbnkpLnJlbGF0ZWRFbGVtZW50cykge1xuICAgICAgcmV0dXJuIChlbGVtZW50IGFzIGFueSkucmVsYXRlZEVsZW1lbnRzO1xuICAgIH1cbiAgICBsZXQgcmVsYXRlZEVsZW1lbnRzOiAoSFRNTEVsZW1lbnQgfCBhbnkpW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sRGF0YUdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29sRGF0YUdyb3VwOiBJQ29sdW1uRGF0YVtdID0gdGhpcy5jb2xEYXRhR3JvdXBzW2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xEYXRhR3JvdXAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sdW1uRGF0YTogSUNvbHVtbkRhdGEgPSBjb2xEYXRhR3JvdXBbal07XG4gICAgICAgIGlmIChlbGVtZW50ID09PSBjb2x1bW5EYXRhLmNoaWxkIHx8IHRoaXMuZ2V0UmVsYXRlZEhlYWRlcihlbGVtZW50KSA9PT0gY29sdW1uRGF0YS5jaGlsZCkge1xuICAgICAgICAgIHJlbGF0ZWRFbGVtZW50cy5wdXNoKGNvbHVtbkRhdGEuY2hpbGQpO1xuICAgICAgICAgIGNvbHVtbkRhdGEubGlua2VkQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICByZWxhdGVkRWxlbWVudHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRFbGVtZW50cztcbiAgfVxuXG4gIHB1YmxpYyBnZXRSZWxhdGVkSGVhZGVyKGVsZW1lbnQ6IEVsZW1lbnQpOkVsZW1lbnQgfCBhbnkge1xuICAgIGlmICgoZWxlbWVudCBhcyBhbnkpLnJlbGF0ZWRFbGVtZW50KSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQgYXMgYW55KS5yZWxhdGVkRWxlbWVudDtcbiAgICB9XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50OiBIVE1MRWxlbWVudCB8IGFueSA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbERhdGFHcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDogSUNvbHVtbkRhdGFbXSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tpXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sRGF0YUdyb3VwLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbkRhdGE6IElDb2x1bW5EYXRhID0gY29sRGF0YUdyb3VwW2pdO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZENoaWxkcmVuOiBFbGVtZW50W10gPSBjb2x1bW5EYXRhLmxpbmtlZENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCA9PT0gZWxlbWVudCk7XG4gICAgICAgIGlmIChmaWx0ZXJlZENoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZWxhdGVkRWxlbWVudCA9IGNvbHVtbkRhdGEuY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgKGVsZW1lbnQgYXMgYW55KS5yZWxhdGVkRWxlbWVudCA9IHJlbGF0ZWRFbGVtZW50ID8gcmVsYXRlZEVsZW1lbnQgOiBlbGVtZW50O1xuICAgIHJldHVybiAoZWxlbWVudCBhcyBhbnkpLnJlbGF0ZWRFbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRMaW5rZWRDaGlsZHJlbigpOiB2b2lkIHtcbiAgICBsZXQgZGF0YUluZGV4OiBudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xEYXRhR3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xEYXRhR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbERhdGFHcm91cC5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBjb2x1bW5EYXRhOiBJQ29sdW1uRGF0YSA9IGNvbERhdGFHcm91cFtqXTtcbiAgICAgICAgY29uc3QgY29sdW1uOiBIVE1MRWxlbWVudCA9IHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3Nlc1tkYXRhSW5kZXggKyBqXTtcbiAgICAgICAgY29sdW1uRGF0YS5saW5rZWRDaGlsZHJlbi5wdXNoKGNvbHVtbik7XG4gICAgICB9XG4gICAgICBkYXRhSW5kZXggKz0gY29sRGF0YUdyb3VwLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBzZXRMaW5rZWRIZWFkZXJDb250YWluZXJDbGFzc2VzKCk6IHZvaWQge1xuICAgIGxldCBkYXRhSW5kZXg6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbERhdGFHcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDogSUNvbHVtbkRhdGFbXSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tpXTtcbiAgICAgIGNvbnN0IGNvbHVtbjogSFRNTEVsZW1lbnQgPSB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXNbZGF0YUluZGV4XTtcbiAgICAgIGRhdGFJbmRleCArPSBjb2xEYXRhR3JvdXAubGVuZ3RoO1xuICAgICAgY29uc3QgY29udGFpbmVyQ2xhc3MgPSAnY29sdW1uLWNvbnRhaW5lci0nICsgaTtcbiAgICAgIHRoaXMuYWRkQ2xhc3NUb0xpbmtlZEhlYWRlcihjb2x1bW4ucGFyZW50RWxlbWVudCEsIGNvbnRhaW5lckNsYXNzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZENsYXNzVG9MaW5rZWRIZWFkZXIoZWxlbWVudDogRWxlbWVudCwgY2xzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVTdWJHcm91cChjdXJyZW50R3JvdXA6IGFueSwgc3ViR3JvdXA6IGFueSk6IHZvaWQge1xuXG4gICAgbGV0IGluZGV4Q291bnQ6IG51bWJlciA9IDA7XG4gICAgY3VycmVudEdyb3VwLmZvckVhY2goXG4gICAgICAoZ3JvdXA6IElDb2x1bW5EYXRhLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzTGVuOiBudW1iZXIgPSAoZ3JvdXAuY2hpbGQgYXMgYW55KS5kYXRhQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGxldCBzdWJDbGFzc0NvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBsZXQgbnVtT2ZTdWJDb2x1bW5zOiBudW1iZXIgPSAwO1xuICAgICAgICB3aGlsZSAoc3ViQ2xhc3NDb3VudCA8IGNsYXNzTGVuKSB7XG4gICAgICAgICAgc3ViQ2xhc3NDb3VudCArPSAoc3ViR3JvdXBbaW5kZXhDb3VudF0uY2hpbGQgYXMgYW55KS5kYXRhQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgICAgZ3JvdXAuc3ViR3JvdXBzLnB1c2goc3ViR3JvdXBbaW5kZXhDb3VudF0pO1xuICAgICAgICAgIGluZGV4Q291bnQrKztcbiAgICAgICAgICBudW1PZlN1YkNvbHVtbnMrKztcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50R3JvdXBbaW5kZXhdLnN1YkNvbHVtbkxlbmd0aCA9IG51bU9mU3ViQ29sdW1ucztcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBvcmRlclN1Ykdyb3Vwcyhjb2x1bW5Hcm91cDogSUNvbHVtbkRhdGFbXSwgY29sdW1uUGxhY2VtZW50OiBudW1iZXIgPSAxLCBwbGFjZW1lbnRTdGFydDogbnVtYmVyID0gMCwgb3JkZXI6IG51bWJlciA9IDEpIHtcbiAgICBsZXQgc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQ7XG4gICAgbGV0IGNvbnRhaW5lcklEOiBzdHJpbmc7XG4gICAgbGV0IGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50O1xuICAgIGxldCBzZWxlY3Rvcjogc3RyaW5nO1xuXG4gICAgaWYgKHRoaXMubGlua0NsYXNzKSB7XG4gICAgICBpZiAodGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdWJHcm91cFN0eWxlT2Jqcykge1xuICAgICAgICB0aGlzLmhlYWRTdHlsZSA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uaGVhZFN0eWxlO1xuICAgICAgICB0aGlzLmdyaWRUZW1wbGF0ZVR5cGVzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlVHlwZXM7XG4gICAgICAgIHRoaXMuc3R5bGVMaXN0ID0gIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3R5bGVMaXN0O1xuICAgICAgICB0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdWJHcm91cFN0eWxlT2JqcztcbiAgICAgICAgdGhpcy5zdWJHcm91cFN0eWxlcyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3ViR3JvdXBTdHlsZXM7XG4gICAgICAgIHRoaXMuc3ViR3JvdXBGcmFnbWVudHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN1Ykdyb3VwRnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmdyaWRPcmRlciA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZE9yZGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5oZWFkU3R5bGUgPSB0aGlzLmhlYWRTdHlsZTtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlVHlwZXMgPSB0aGlzLmdyaWRUZW1wbGF0ZVR5cGVzO1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN0eWxlTGlzdCA9IHRoaXMuc3R5bGVMaXN0O1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN1Ykdyb3VwU3R5bGVPYmpzID0gdGhpcy5zdWJHcm91cFN0eWxlT2JqcztcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdWJHcm91cFN0eWxlcyA9IHRoaXMuc3ViR3JvdXBTdHlsZXM7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3ViR3JvdXBGcmFnbWVudHMgPSB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRPcmRlciA9IHRoaXMuZ3JpZE9yZGVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsYWNlbWVudFN0YXJ0ID0gY29sdW1uUGxhY2VtZW50IC0gMTtcbiAgICBjb2x1bW5Hcm91cC5zb3J0KChjb2x1bW5EYXRhMTogSUNvbHVtbkRhdGEsIGNvbHVtbkRhdGEyOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbHVtbkRhdGExLm9yZGVyIC0gY29sdW1uRGF0YTIub3JkZXI7XG4gICAgfSk7XG5cbiAgICBjb2x1bW5Hcm91cC5mb3JFYWNoKChjb2x1bW5EYXRhOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgY29sdW1uRGF0YS5vcmRlciA9IGNvbHVtblBsYWNlbWVudDtcblxuICAgICAgY29uc3QgdGFnTmFtZTogc3RyaW5nID0gY29sdW1uRGF0YS5jaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGNvbnRhaW5lcklEID0gJ2NvbHVtbi1jb250YWluZXItJyArIEFycmF5LmZyb20oY29sdW1uRGF0YSEucGFyZW50IS5wYXJlbnRFbGVtZW50IS5jaGlsZHJlbikuaW5kZXhPZihjb2x1bW5EYXRhLnBhcmVudCk7XG4gICAgICBjb25zdCBwYXJlbnRJbmRleCA9IEFycmF5LmZyb20oY29sdW1uRGF0YSEucGFyZW50IS5wYXJlbnRFbGVtZW50IS5jaGlsZHJlbikuaW5kZXhPZihjb2x1bW5EYXRhLnBhcmVudCk7XG4gICAgICBcbiAgICAgIHRoaXMuYWRkQ2xhc3NUb0xpbmtlZEhlYWRlcihjb2x1bW5EYXRhLnBhcmVudCwgY29udGFpbmVySUQpO1xuICAgICAgXG4gICAgICBzZWxlY3RvciA9IHRoaXMuaWQgKyAnIC4nICsgY29udGFpbmVySUQgKyAnICcgKyB0YWdOYW1lICsgJzpudGgtY2hpbGQoJyArIChjb2x1bW5EYXRhLm50aENoaWxkKS50b1N0cmluZygpICsgJyknO1xuICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGlmICh0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSkge1xuICAgICAgICBzdHlsZSA9IHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgdGhpcy5zdWJHcm91cFN0eWxlcy5wdXNoKHN0eWxlKTtcbiAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50cy5wdXNoKGZyYWdtZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb2x1bW5TdHlsZShzdHlsZSwgZnJhZ21lbnQsIHNlbGVjdG9yLCBjb2x1bW5QbGFjZW1lbnQsIGNvbHVtblBsYWNlbWVudCArIGNvbHVtbkRhdGEuc3BhbiwgY29sdW1uRGF0YS5vcmRlcik7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLnBhcmVudEdyb3Vwc1twYXJlbnRJbmRleF0pIHtcbiAgICAgICAgaWYgKCh0aGlzLnBhcmVudEdyb3Vwc1twYXJlbnRJbmRleF0ubGVuZ3RoKSA9PT0gKGNvbHVtbkRhdGEub3JkZXIpKSB7XG4gICAgICAgICAgdGhpcy5sYXN0Q29sdW1uc1twYXJlbnRJbmRleF0gPSBjb2x1bW5EYXRhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2x1bW5EYXRhLnN1Ykdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMub3JkZXJTdWJHcm91cHMoY29sdW1uRGF0YS5zdWJHcm91cHMsIGNvbHVtblBsYWNlbWVudCwgcGxhY2VtZW50U3RhcnQsIG9yZGVyKyspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZWN0b3IgPSB0aGlzLmlkICsgJyAnICsgdGFnTmFtZSArICc6bnRoLWNoaWxkKCcgKyAoY29sdW1uRGF0YS5udGhDaGlsZCkudG9TdHJpbmcoKSArICcpJztcbiAgICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGlmICh0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSkge1xuICAgICAgICAgIHN0eWxlID0gdGhpcy5zdWJHcm91cFN0eWxlT2Jqc1tzZWxlY3Rvcl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgIHRoaXMuc3ViR3JvdXBTdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50cy5wdXNoKGZyYWdtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q29sdW1uU3R5bGUoc3R5bGUsIGZyYWdtZW50LCBzZWxlY3RvciwgY29sdW1uUGxhY2VtZW50LCBjb2x1bW5QbGFjZW1lbnQgKyBjb2x1bW5EYXRhLnNwYW4sIGNvbHVtbkRhdGEub3JkZXIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkT3JkZXJbY29sdW1uUGxhY2VtZW50IC0gMV0gPSBjb2x1bW5EYXRhLm50aENoaWxkO1xuXG4gICAgICAgIGNvbnN0IGhhc1Npc3RlclRhZzogYm9vbGVhbiA9IHRhZ05hbWUgPT09ICd0aCcgfHwgdGFnTmFtZSA9PT0gJ3RkJztcbiAgICAgICAgbGV0IHNpc3RlclRhZzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGlmIChoYXNTaXN0ZXJUYWcpIHtcbiAgICAgICAgICBzaXN0ZXJUYWcgPSB0YWdOYW1lID09PSAndGgnID8gJ3RkJyA6ICd0aCc7XG5cbiAgICAgICAgICBzZWxlY3RvciA9IHRoaXMuaWQgKyAnICcgKyBzaXN0ZXJUYWcgKyAnOm50aC1jaGlsZCgnICsgKGNvbHVtbkRhdGEubnRoQ2hpbGQpLnRvU3RyaW5nKCkgKyAnKSc7XG4gICAgICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgICAgaWYgKHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdKSB7XG4gICAgICAgICAgICBzdHlsZSA9IHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgIHRoaXMuc3ViR3JvdXBTdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzLnB1c2goZnJhZ21lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldENvbHVtblN0eWxlKHN0eWxlLCBmcmFnbWVudCwgc2VsZWN0b3IsIGNvbHVtblBsYWNlbWVudCwgY29sdW1uUGxhY2VtZW50ICsgY29sdW1uRGF0YS5zcGFuLCBjb2x1bW5EYXRhLm9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29sdW1uUGxhY2VtZW50ICs9IGNvbHVtbkRhdGEuc3BhbjtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q29sdW1uU3R5bGUoc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQsIGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50LCBzZWxlY3Rvcjogc3RyaW5nLCBncmlkU3RhcnQ6IG51bWJlciwgZ3JpZEVuZDogbnVtYmVyLCBvcmRlcjogbnVtYmVyKTogdm9pZCB7XG4gICAgc3R5bGUuaW5uZXJIVE1MID0gc2VsZWN0b3IgKyAnIHsgZ3JpZC1jb2x1bW4tc3RhcnQ6ICcgKyAoZ3JpZFN0YXJ0KS50b1N0cmluZygpICsgJzsgZ3JpZC1jb2x1bW4tZW5kOiAnICsgKGdyaWRFbmQpLnRvU3RyaW5nKCkgKyAnOyBvcmRlcjogJyArIChvcmRlcikudG9TdHJpbmcoKSArICc7IH0nO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB0aGlzLmFkZFN0eWxlKHN0eWxlKTtcbiAgICB0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSA9IHN0eWxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRHcmlkT3JkZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZ3JpZFRlbXBsYXRlQ29sdW1uczogc3RyaW5nID0gdGhpcy5jb25zdHJ1Y3RHcmlkVGVtcGxhdGVDb2x1bW5zKCk7XG5cbiAgICBpZiAodGhpcy5jb2xEYXRhR3JvdXBzWzBdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcWlyZXNOZXdTdHlsZU9iamVjdHM6IGJvb2xlYW4gPSB0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZE9yZGVyU3R5bGVzID09PSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmNvbERhdGFHcm91cHMuZm9yRWFjaCgoY29sdW1uR3JvdXA6IElDb2x1bW5EYXRhW10sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQ7XG4gICAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG5cbiAgICAgIGNvbnN0IHNlbGVjdG9yOiBzdHJpbmcgPSB0aGlzLmlkICsgJyAuJyArIHRoaXMucmVvcmRlcmFibGVDbGFzcztcbiAgICAgIGxldCBzdHlsZUFscmVhZHlFeGlzdGVkOiBib29sZWFuID0gZmFsc2U7ICAgICAgXG5cbiAgICAgIGlmICh0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSkge1xuICAgICAgICBzdHlsZSA9IHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdO1xuICAgICAgICBzdHlsZUFscmVhZHlFeGlzdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAocmVxaXJlc05ld1N0eWxlT2JqZWN0cykge1xuICAgICAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJhZ21lbnQgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3MhXS5ncmlkT3JkZXJGcmFnbWVudHNbaW5kZXhdO1xuICAgICAgICBzdHlsZSA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLmdyaWRPcmRlclN0eWxlc1tpbmRleF07XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgIH1cbiAgICAgIHN0eWxlLmlubmVySFRNTCA9IHNlbGVjdG9yICsgJyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogJyArIGdyaWRUZW1wbGF0ZUNvbHVtbnMgKyAnOyB9JztcblxuICAgICAgXG4gICAgICBpZiAoIXRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdICYmIHJlcWlyZXNOZXdTdHlsZU9iamVjdHMpIHtcbiAgICAgICAgdGhpcy5ncmlkT3JkZXJTdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgIHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzLnB1c2goZnJhZ21lbnQhKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJHcm91cFN0eWxlT2Jqc1tzZWxlY3Rvcl0gPSBzdHlsZTtcbiAgICAgIFxuICAgICAgdGhpcy5hZGRTdHlsZShzdHlsZSk7XG4gICAgICBpZiAoIXN0eWxlQWxyZWFkeUV4aXN0ZWQpIHtcbiAgICAgICAgdGhpcy5tb3ZlU3R5bGVDb250ZW50VG9Qcm9taW5lbnQoKTtcbiAgICAgICAgdGhpcy5ncmlkVGVtcGxhdGVUeXBlcy5wdXNoKHsgc3R5bGUgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICB0aGlzLm9yZGVyU3ViR3JvdXBzKGNvbHVtbkdyb3VwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAmJiB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRPcmRlclN0eWxlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRPcmRlckZyYWdtZW50cyA9IHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzO1xuICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkT3JkZXJTdHlsZXMgPSB0aGlzLmdyaWRPcmRlclN0eWxlcztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldE9mZnNldChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYLFxuICAgICAgdG9wOiByZWN0LnRvcCArIHdpbmRvdy5zY3JvbGxZXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUoZWw6IEhUTUxFbGVtZW50IHwgbnVsbCk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XG4gICAgd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZSgndGFibGVqc0dyaWQnKSA9PT0gbnVsbCkge1xuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBwcml2YXRlIGVsZW1lbnRSZWZVbmRlclBvaW50KGV2ZW50OiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgcmV0dXJuIGVsZW1lbnRzLmZpbHRlcihpdGVtID0+IGl0ZW0gPT09IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5sZW5ndGggPiAwO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemVHcmlwVW5kZXJQb2ludChldmVudDogYW55KTogRWxlbWVudFtdIHtcbiAgICBjb25zdCByZXNpemFibGVFbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgY29uc3QgZWxlbWVudHM6IEVsZW1lbnRbXSA9IHJlc2l6YWJsZUVsZW1lbnRzLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmdldEF0dHJpYnV0ZSgncmVzaXphYmxlR3JpcCcpICE9PSBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBlbGVtZW50cztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVvcmRlckNvbHNVbmRlclBvaW50KGV2ZW50OiBhbnkpOiBFbGVtZW50W10ge1xuICAgIGNvbnN0IHJlb3JkZXJDb2xFbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgY29uc3QgZWxlbWVudHM6IEVsZW1lbnRbXSA9IHJlb3JkZXJDb2xFbGVtZW50cy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5nZXRBdHRyaWJ1dGUoJ3Jlb3JkZXJDb2wnKSAhPT0gbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gZWxlbWVudHM7XG4gIH1cblxuICBwcml2YXRlIGdldFJlb3JkZXJIYW5kbGVzVW5kZXJQb2ludChldmVudDogYW55KTogRWxlbWVudFtdIHtcbiAgICBjb25zdCByZW9yZGVyR3JpcEVsZW1lbnRzOiBFbGVtZW50W10gPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICBjb25zdCBlbGVtZW50czogRWxlbWVudFtdID0gcmVvcmRlckdyaXBFbGVtZW50cy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5nZXRBdHRyaWJ1dGUoJ3Jlb3JkZXJHcmlwJykgIT09IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsZW1lbnRzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemFibGVFbGVtZW50cyhldmVudDogYW55KTogRWxlbWVudFtdIHtcbiAgICBjb25zdCByZXNpemFibGVFbGVtZW50cyA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgIGxldCBlbGVtZW50czogRWxlbWVudFtdID0gcmVzaXphYmxlRWxlbWVudHMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uZ2V0QXR0cmlidXRlKCd0YWJsZWpzRGF0YUNvbENsYXNzZXMnKSAhPT0gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IG5vRWxlbWVudHNGb3VuZDogYm9vbGVhbiA9IGVsZW1lbnRzLmxlbmd0aCA9PT0gMDtcbiAgICBjb25zdCBpdGVyYXRpb25MZW46IG51bWJlciA9IG5vRWxlbWVudHNGb3VuZCA/IDEgOiBlbGVtZW50cy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaXRlcmF0aW9uTGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSByZXNpemFibGVFbGVtZW50c1swXTtcbiAgICAgIGxldCBwYXJlbnRFbGVtZW50OiBFbGVtZW50IHwgbnVsbCA9IGl0ZW0ucGFyZW50RWxlbWVudDtcbiAgICAgIHdoaWxlKHBhcmVudEVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZm91bmRHcmlwUGFyZW50OiBib29sZWFuID0gIW5vRWxlbWVudHNGb3VuZCAmJiBwYXJlbnRFbGVtZW50ID09PSBlbGVtZW50c1tpXTtcbiAgICAgICAgY29uc3QgZm91bmRQYXJlbnRXaXRoQ29sQ2xhc3NlczogYm9vbGVhbiA9IG5vRWxlbWVudHNGb3VuZCAmJiBwYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGFibGVqc0RhdGFDb2xDbGFzc2VzJykgIT09IG51bGw7XG4gICAgICAgIGlmIChmb3VuZEdyaXBQYXJlbnQgfHwgZm91bmRQYXJlbnRXaXRoQ29sQ2xhc3Nlcykge1xuICAgICAgICAgIGVsZW1lbnRzID0gW3BhcmVudEVsZW1lbnRdO1xuICAgICAgICAgIHBhcmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50IS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50cztcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVIaWdobGlnaHRzKGVsVG9FeGNsdWRlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsLCBtb3ZlRGlyZWN0aW9uOiBudW1iZXIgPSAtMik6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudHNXaXRoSGlnaGxpZ2h0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbS5lbCAhPT0gZWxUb0V4Y2x1ZGUgfHwgaXRlbS5tb3ZlRGlyZWN0aW9uICE9PSBtb3ZlRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudEhpZ2hsaWdodChpdGVtLmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVFbGVtZW50SGlnaGxpZ2h0KGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodC1sZWZ0Jyk7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0LXJpZ2h0Jyk7XG4gIH1cblxuICBwcml2YXRlIHJlb3JkZXJDb2x1bW5zKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCBkcmFnZ2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMubGFzdERyYWdnZWRPdmVyRWxlbWVudDtcbiAgICBjb25zdCBlbFJlY3Q6IGFueSA9IGRyYWdnYWJsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZWxYOiBudW1iZXIgPSBlbFJlY3QubGVmdDtcbiAgICBjb25zdCBlbFc6IG51bWJlciA9IGVsUmVjdC53aWR0aDtcblxuICAgIHRoaXMucmVtb3ZlRWxlbWVudEhpZ2hsaWdodChkcmFnZ2FibGVFbGVtZW50KTtcbiAgICBpZiAodGhpcy5kcmFnZ2luZ0NvbHVtbiA9PT0gZHJhZ2dhYmxlRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbW92ZURpcmVjdGlvbjogbnVtYmVyID0gMDtcbiAgICBpZiAoKGV2ZW50LmNsaWVudFggLSBlbFgpID49IGVsVyAvIDIpIHtcbiAgICAgIG1vdmVEaXJlY3Rpb24gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3ZlRGlyZWN0aW9uID0gMDtcbiAgICB9XG5cbiAgICBsZXQgY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kOiBudW1iZXIgPSAtMTtcbiAgICBsZXQgY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb2xSYW5nZURyb3BwZWRQYXJlbnRJbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb2xSYW5nZURyb3BwZWRDaGlsZEluZDogbnVtYmVyID0gLTE7XG4gICAgbGV0IGRyYWdnZWRJbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBkcm9wcGVkSW5kOiBudW1iZXIgPSAtMTtcbiAgICBsZXQgZHJhZ2dlZEdyb3VwOiBFbGVtZW50W10gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0IHBHcm91cDogYW55ID0gdGhpcy5wYXJlbnRHcm91cHMuZm9yRWFjaCgoZ3JvdXAsIGdyb3VwSW5kKSA9PlxuICAgICAgZ3JvdXAuZm9yRWFjaChcbiAgICAgICAgKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuZHJhZ2dpbmdDb2x1bW4pIHtcbiAgICAgICAgICAgIGNvbFJhbmdlRHJhZ2dlZFBhcmVudEluZCA9IGdyb3VwSW5kO1xuICAgICAgICAgICAgY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQgPSBpbmRleDtcbiAgICAgICAgICAgIGRyYWdnZWRJbmQgPSBpbmRleDtcbiAgICAgICAgICAgIGRyYWdnZWRHcm91cCA9IGdyb3VwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbSA9PT0gZHJhZ2dhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgY29sUmFuZ2VEcm9wcGVkUGFyZW50SW5kID0gZ3JvdXBJbmQ7XG4gICAgICAgICAgICBjb2xSYW5nZURyb3BwZWRDaGlsZEluZCA9IGluZGV4O1xuICAgICAgICAgICAgZHJvcHBlZEluZCA9IGluZGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgICk7XG5cbiAgICBsZXQgcGFyZW50UmFuZ2VzOiBudW1iZXJbXVtdIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgdGVtcFJhbmdlczogbnVtYmVyW11bXVtdID0gdGhpcy5jb2xSYW5nZUdyb3Vwcy5jb25jYXQoKTtcbiAgICBsZXQgcGFyZW50UmFuZ2VJbmRleDogbnVtYmVyID0gLTE7XG4gICAgdGVtcFJhbmdlcy5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcbiAgICB0ZW1wUmFuZ2VzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIXBhcmVudFJhbmdlcyAmJiBpdGVtLmxlbmd0aCA8IGRyYWdnZWRHcm91cCEubGVuZ3RoKSB7XG4gICAgICAgIHBhcmVudFJhbmdlcyA9IGl0ZW07XG4gICAgICAgIHBhcmVudFJhbmdlSW5kZXggPSB0aGlzLmNvbFJhbmdlR3JvdXBzLmluZGV4T2YoaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZnJvbU9yZGVyOiBudW1iZXIgPSAoY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQgKyAxKTtcbiAgICBjb25zdCB0b09yZGVyOiBudW1iZXIgPSAoY29sUmFuZ2VEcm9wcGVkQ2hpbGRJbmQgKyAxKTtcblxuICAgIC8vIGlmIGhhcyB0byBzdGF5IHdpdGhpbiByYW5nZXMsIGdldCByYW5nZXMgYW5kIHN3YXBcbiAgICBpZiAocGFyZW50UmFuZ2VJbmRleCA9PT0gdGhpcy5jb2xSYW5nZUdyb3Vwcy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmNvbFJhbmdlR3JvdXBzW3BhcmVudFJhbmdlSW5kZXhdLmZvckVhY2goXG4gICAgICAgIHJhbmdlID0+IHtcbiAgICAgICAgICBjb25zdCBsb3dSYW5nZTogbnVtYmVyID0gcmFuZ2VbMF07XG4gICAgICAgICAgY29uc3QgaGlnaFJhbmdlOiBudW1iZXIgPSByYW5nZVsxXTtcbiAgICAgICAgICBpZiAoZnJvbU9yZGVyID49IGxvd1JhbmdlICYmIGZyb21PcmRlciA8IGhpZ2hSYW5nZSAmJiB0b09yZGVyID49IGxvd1JhbmdlICYmIHRvT3JkZXIgPCBoaWdoUmFuZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGExOiBJQ29sdW1uRGF0YSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tjb2xSYW5nZURyYWdnZWRQYXJlbnRJbmRdLmZpbHRlcihpdGVtID0+IGl0ZW0ubnRoQ2hpbGQgPT09IGZyb21PcmRlcilbMF07XG4gICAgICAgICAgICBjb25zdCBkYXRhMjogSUNvbHVtbkRhdGEgPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5maWx0ZXIoaXRlbSA9PiBpdGVtLm50aENoaWxkID09PSB0b09yZGVyKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5zbGljZShyYW5nZVswXSAtIDEsIHJhbmdlWzFdIC0gMSk7XG4gICAgICAgICAgICByYW5nZUdyb3VwLnNvcnQoKGl0ZW0xOiBJQ29sdW1uRGF0YSwgaXRlbTI6IElDb2x1bW5EYXRhKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtMS5vcmRlciAtIGl0ZW0yLm9yZGVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByYW5nZUdyb3VwLnNwbGljZShyYW5nZUdyb3VwLmluZGV4T2YoZGF0YTEpLCAxKTtcbiAgICAgICAgICAgIHJhbmdlR3JvdXAuc3BsaWNlKHJhbmdlR3JvdXAuaW5kZXhPZihkYXRhMikgKyBtb3ZlRGlyZWN0aW9uLCAwLCBkYXRhMSk7XG4gICAgICAgICAgICByYW5nZUdyb3VwLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGl0ZW0ub3JkZXIgPSBpbmRleCArIDE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRhdGExOiBJQ29sdW1uRGF0YSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tjb2xSYW5nZURyYWdnZWRQYXJlbnRJbmRdLmZpbHRlcihpdGVtID0+IGl0ZW0ubnRoQ2hpbGQgPT09IGZyb21PcmRlcilbMF07XG4gICAgICBjb25zdCBkYXRhMjogSUNvbHVtbkRhdGEgPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5maWx0ZXIoaXRlbSA9PiBpdGVtLm50aENoaWxkID09PSB0b09yZGVyKVswXTtcbiAgICAgIGNvbnN0IHJhbmdlR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5jb25jYXQoKTtcbiAgICAgIHJhbmdlR3JvdXAuc29ydCgoaXRlbTE6IElDb2x1bW5EYXRhLCBpdGVtMjogSUNvbHVtbkRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0xLm9yZGVyIC0gaXRlbTIub3JkZXI7XG4gICAgICB9KTtcbiAgICAgIHJhbmdlR3JvdXAuc3BsaWNlKHJhbmdlR3JvdXAuaW5kZXhPZihkYXRhMSksIDEpO1xuICAgICAgcmFuZ2VHcm91cC5zcGxpY2UocmFuZ2VHcm91cC5pbmRleE9mKGRhdGEyKSArIG1vdmVEaXJlY3Rpb24sIDAsIGRhdGExKTtcbiAgICAgIHJhbmdlR3JvdXAuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaXRlbS5vcmRlciA9IGluZGV4ICsgMTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnNldEdyaWRPcmRlcigpO1xuXG4gICAgLy8gbmVlZCB0byBzZXQgYSBjbGFzcyB0byByZXNpemUgLSBkZWZhdWx0IHRvIGZpcnN0IHNvIGNvbHVtbiB3aWR0aHMgYXJlIHVwZGF0ZWRcbiAgICBjb25zdCBmaXJzdEl0ZW1XaWR0aDogbnVtYmVyID0gdGhpcy5nZXRGaXJzdFZpc2libGVJdGVtV2lkdGgoKTtcbiAgICB0aGlzLnNldE1pbmltdW1XaWR0aHMoKTtcblxuICAgIC8vIHVwZGF0ZSB3aWR0aHMgYnkgZmlyc3QgaXRlbVxuICAgIHRoaXMudG90YWxDb21wdXRlZFdpZHRoID0gZmlyc3RJdGVtV2lkdGg7XG4gICAgdGhpcy51cGRhdGVXaWR0aHMoZmlyc3RJdGVtV2lkdGgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRBdmVyYWdlQ29sdW1uV2lkdGgoKTogbnVtYmVyIHtcbiAgICBsZXQgdG90YWxUYWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLnZpZXdwb3J0IS5jbGllbnRXaWR0aDtcbiAgICByZXR1cm4gdG90YWxUYWJsZVdpZHRoIC8gdGhpcy5jbGFzc1dpZHRocy5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGdldEZpcnN0VmlzaWJsZUl0ZW1XaWR0aCgpOiBudW1iZXIge1xuICAgIGxldCBmaXJzdFZpc2libGVJdGVtSW5kZXg6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyaWRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2xhc3NJbmRleCA9IHRoaXMuZ3JpZE9yZGVyW2ldIC0gMTtcbiAgICAgIGlmICghdGhpcy5jb2x1bW5Jc0hpZGRlbldpdGhDbGFzcyh0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXNbY2xhc3NJbmRleF0pKSB7XG4gICAgICAgIGZpcnN0VmlzaWJsZUl0ZW1JbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUgPSBbdGhpcy5zdHlsZXNCeUNsYXNzW3RoaXMuZ3JpZE9yZGVyW2ZpcnN0VmlzaWJsZUl0ZW1JbmRleF0gLSAxXS5yZXNpemVDbGFzc107XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZS5tYXAoKHJlc2l6ZUNsYXNzOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENsYXNzV2lkdGhJblBpeGVscyhyZXNpemVDbGFzcyk7XG4gICAgfSlbMF07XG4gIH1cblxuICBwcml2YXRlIHNldExpbmtlZENvbHVtbkluZGljZXNGcm9tTWFzdGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkRGlyZWN0aXZlLmhpZGRlbkNvbHVtbkluZGljZXM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNYXN0ZXJDb2x1bW5JbmRpY2VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkRGlyZWN0aXZlLmhpZGRlbkNvbHVtbkluZGljZXMgPSB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVIaWRkZW5Db2x1bW5JbmRpY2VzKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0TGlua2VkQ29sdW1uSW5kaWNlc0Zyb21NYXN0ZXIoKTtcbiAgICB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMgPSB0aGlzLmdldEhpZGRlbkNvbHVtbkluZGljZXMoKTtcbiAgICB0aGlzLnVwZGF0ZU1hc3RlckNvbHVtbkluZGljZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0R3JpZFRlbXBsYXRlQ29sdW1ucygpOiBzdHJpbmcge1xuICAgIHRoaXMudXBkYXRlSGlkZGVuQ29sdW1uSW5kaWNlcygpO1xuXG4gICAgdGhpcy5yZXNpemVNYWtlVXBQZXJjZW50ID0gMDtcbiAgICB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQgPSAwO1xuICAgIGxldCByZW1haW5pbmdDb2xzOiBudW1iZXIgPSB0aGlzLmdyaWRPcmRlci5sZW5ndGggLSB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMubGVuZ3RoO1xuICAgIHRoaXMuaGlkZGVuQ29sdW1uSW5kaWNlcy5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgICAgY29uc3QgY2xhc3NXaWR0aEluZGV4OiBudW1iZXIgPSB0aGlzLmdyaWRPcmRlcltpbmRleCAtIDFdO1xuICAgICAgY29uc3QgYW10OiBzdHJpbmcgPSB0aGlzLmNsYXNzV2lkdGhzW2NsYXNzV2lkdGhJbmRleCAtIDFdLnRvU3RyaW5nKCk7XG4gICAgICBpZiAoYW10LmluY2x1ZGVzKCclJykpIHtcbiAgICAgICAgdGhpcy5yZXNpemVNYWtlVXBQZXJjZW50ICs9IE51bWJlcihhbXQucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICB9XG4gICAgICBcbiAgICB9KTtcbiAgICBpZiAodGhpcy5yZXNpemVNYWtlVXBQZXJjZW50ICE9PSAwKSB7XG4gICAgICB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQgPXRoaXMucmVzaXplTWFrZVVwUGVyY2VudCAvIHJlbWFpbmluZ0NvbHM7XG4gICAgfVxuXG4gICAgbGV0IHN0cjogc3RyaW5nID0gJyc7XG4gICAgdGhpcy5ncmlkT3JkZXIuZm9yRWFjaCgob3JkZXIsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgd2R0aDogbnVtYmVyID0gTnVtYmVyKHRoaXMuY2xhc3NXaWR0aHNbb3JkZXIgLSAxXS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJykpO1xuICAgICAgd2R0aCA9IHdkdGggPCAwID8gMCA6IHdkdGg7XG4gICAgICBpZiAodGhpcy5jbGFzc1dpZHRoc1tvcmRlciAtIDFdLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSkge1xuICAgICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaW5kZXggKyAxKSAhPT0gLTEpIHtcbiAgICAgICAgICBzdHIgKz0gJyAwJSc7XG4gICAgICAgICAgdGhpcy5jbGFzc1dpZHRoc1tvcmRlciAtIDFdID0gJzAlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgKz0gJyAnICsgKHdkdGggKyB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQpLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICAgICAgdGhpcy5jbGFzc1dpZHRoc1tvcmRlciAtIDFdID0gKHdkdGggKyB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQpLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICAgIH0gICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaW5kZXggKyAxKSAhPT0gLTEpIHtcbiAgICAgICAgICBzdHIgKz0gJyAwcHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciArPSAnICcgKyB3ZHRoLnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xuXG4gIH1cblxuICBwcml2YXRlIGdldEhpZGRlbkNvbHVtbkluZGljZXMoKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IGhpZGRlbkNvbHVtbkluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgdGhpcy5jb2xEYXRhR3JvdXBzLmZvckVhY2goKGNvbHVtbkdyb3VwOiBJQ29sdW1uRGF0YVtdLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHRoaXMub3JkZXJTdWJDb2xzKGhpZGRlbkNvbHVtbkluZGljZXMsIGNvbHVtbkdyb3VwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBoaWRkZW5Db2x1bW5JbmRpY2VzO1xuICB9XG5cbiAgcHJpdmF0ZSBvcmRlclN1YkNvbHMoYXJyOiBudW1iZXJbXSwgY29sdW1uR3JvdXA6IElDb2x1bW5EYXRhW10sIGNvbHVtblBsYWNlbWVudDogbnVtYmVyID0gMSwgcGxhY2VtZW50U3RhcnQ6IG51bWJlciA9IDAsIHBhcmVudElzSGlkZGVuOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBwbGFjZW1lbnRTdGFydCA9IGNvbHVtblBsYWNlbWVudCAtIDE7XG5cbiAgICBjb2x1bW5Hcm91cC5zb3J0KChjb2x1bW5EYXRhMTogSUNvbHVtbkRhdGEsIGNvbHVtbkRhdGEyOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbHVtbkRhdGExLm9yZGVyIC0gY29sdW1uRGF0YTIub3JkZXI7XG4gICAgfSk7XG5cbiAgICBjb2x1bW5Hcm91cC5mb3JFYWNoKGNvbHVtbkRhdGEgPT4ge1xuXG4gICAgICBjb25zdCBzdGFydEluZGV4OiBudW1iZXIgPSBjb2x1bW5QbGFjZW1lbnQ7XG4gICAgICBjb25zdCBjb2x1bW5FbGVtZW50OiBFbGVtZW50IHwgYW55ID0gdGhpcy5nZXRSZWxhdGVkSGVhZGVyKGNvbHVtbkRhdGEuY2hpbGQpO1xuICAgICAgY29uc3QgaGFzU3ViR3JvdXBzOiBib29sZWFuID0gY29sdW1uRGF0YS5zdWJHcm91cHMubGVuZ3RoID4gMDtcblxuICAgICAgaWYgKChjb2x1bW5FbGVtZW50LmhpZGVDb2x1bW4gfHwgcGFyZW50SXNIaWRkZW4pICYmICFoYXNTdWJHcm91cHMgJiYgYXJyLmluZGV4T2Yoc3RhcnRJbmRleCkgPT09IC0xKSB7XG4gICAgICAgIGFyci5wdXNoKHN0YXJ0SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzU3ViR3JvdXBzKSB7XG4gICAgICAgIHRoaXMub3JkZXJTdWJDb2xzKGFyciwgY29sdW1uRGF0YS5zdWJHcm91cHMsIGNvbHVtblBsYWNlbWVudCwgcGxhY2VtZW50U3RhcnQsIGNvbHVtbkVsZW1lbnQuaGlkZUNvbHVtbik7XG4gICAgICB9XG4gICAgICBjb2x1bW5QbGFjZW1lbnQgKz0gY29sdW1uRGF0YS5zcGFuO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRSZW9yZGVySGlnaGxpZ2h0SGVpZ2h0KGRyYWdnYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZHJhZ2dhYmxlVG9wOiBudW1iZXIgPSB0aGlzLmdldE9mZnNldChkcmFnZ2FibGVFbGVtZW50KS50b3A7XG4gICAgY29uc3QgY29udGFpbmVyVG9wOiBudW1iZXIgPSB0aGlzLmdldE9mZnNldCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkudG9wO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodFN0cjogc3RyaW5nID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodDogbnVtYmVyID0gTnVtYmVyKGNvbnRhaW5lckhlaWdodFN0ci5zdWJzdHIoMCwgY29udGFpbmVySGVpZ2h0U3RyLmxlbmd0aCAtIDIpKTtcbiAgICBjb25zdCBoaWdobGlnaHRIZWlnaHQ6IG51bWJlciA9IGNvbnRhaW5lckhlaWdodCAtIChkcmFnZ2FibGVUb3AgLSBjb250YWluZXJUb3ApIC0gMTtcblxuICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlIS5pbm5lckhUTUwgPSB0aGlzLmlkICsgJyAuaGlnaGxpZ2h0LWxlZnQgZGl2OmFmdGVyLCAnICsgdGhpcy5pZCArICcgLmhpZ2hsaWdodC1yaWdodCBkaXY6YWZ0ZXIgeyBoZWlnaHQ6ICcgKyBoaWdobGlnaHRIZWlnaHQgKyAncHggIWltcG9ydGFudCB9JztcbiAgICB0aGlzLnNldFN0eWxlQ29udGVudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXRyaWV2ZU9yQ3JlYXRlRWxlbWVudElEKGVsOiBIVE1MRWxlbWVudCwgaGFzTGlua0NsYXNzOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGxldCBpZDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCA9IGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKSB7XG4gICAgICBpZCA9ICd0YWJsZWpzLWJvZHktaWQnO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgY29uc3Qgc29tZUlEOiBzdHJpbmcgPSBoYXNMaW5rQ2xhc3MgPyAnJyA6IHRoaXMuZ2VuZXJhdGVHcmlkSUQoZWwpO1xuICAgIHJldHVybiAnIycgKyBpZCArIHNvbWVJRDtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVHcmlkSUQoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICBsZXQgZ3JpZElEOiBzdHJpbmcgfCBudWxsID0gZWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgaWYgKGdyaWRJRCA9PT0gbnVsbCkge1xuICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcbiAgICAgICAgd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWlkLScgKyBpLnRvU3RyaW5nKCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGdyaWRJRCA9ICdncmlkLWlkLScgKyBpLnRvU3RyaW5nKCk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoZ3JpZElEKTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdpZCcsIGdyaWRJRCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnIC4nICsgZ3JpZElEOyAvLyAnICMnICsgZ3JpZElEO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNvbnRhaW5lcklEKCkge1xuICAgIFRhYmxlanNHcmlkUHJveHkuR1JJRF9DT1VOVCsrO1xuICAgIGNvbnN0IGhhc0xpbmtDbGFzczogYm9vbGVhbiA9IHRoaXMubGlua0NsYXNzICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKCFoYXNMaW5rQ2xhc3MpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJldHJpZXZlT3JDcmVhdGVFbGVtZW50SUQodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlkID0gJy4nICsgdGhpcy5saW5rQ2xhc3M7XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudEdyaWRJRDogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50KTtcblxuICAgIGlmIChwYXJlbnRHcmlkSUQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJldHJpZXZlT3JDcmVhdGVFbGVtZW50SUQocGFyZW50R3JpZElELCBoYXNMaW5rQ2xhc3MpICsgJyAnICsgdGhpcy5pZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlVmlld3BvcnRJRCgpIHtcbiAgICBjb25zdCB2aWV3cG9ydHM6IEhUTUxFbGVtZW50W10gPSB0aGlzLmluZmluaXRlU2Nyb2xsVmlld3BvcnRzO1xuICAgIGlmICh2aWV3cG9ydHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy52aWV3cG9ydCA9IHZpZXdwb3J0c1swXTtcbiAgICAgIHRoaXMudmlld3BvcnRJRCA9IHRoaXMudmlld3BvcnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njcm9sbC12aWV3cG9ydC1pZC0nICsgaS50b1N0cmluZygpKSAhPT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXdwb3J0SUQgPSAnc2Nyb2xsLXZpZXdwb3J0LWlkLScgKyBpLnRvU3RyaW5nKCk7XG4gICAgICB0aGlzLnZpZXdwb3J0LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLnZpZXdwb3J0SUQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoQ29udGVudFJlc2l6ZVNlbnNvcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCkge1xuICAgICAgaWYgKHRoaXMudmlld3BvcnQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnZpZXdwb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdBIHZpZXdwb3J0IGhhcyBub3QgYmUgZGVjbGFyZWQuICBUcnkgYWRkaW5nIHRoZSB0YWJsZWpzVmlld3BvcnQgZGlyZWN0aXZlIHRvIHlvdXIgdGJvZHkgdGFnLicpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZW50UmVzaXplU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcih0aGlzLnZpZXdwb3J0LmZpcnN0RWxlbWVudENoaWxkISwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFNjcm9sbGJhckFkanVzdG1lbnRTdHlsZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHRoaXMuc2Nyb2xsYmFyQWRqdXN0bWVudFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHRoaXMuc2V0U2Nyb2xsYmFyQWRqdXN0bWVudFN0eWxlKCk7XG4gICAgICB0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRTdHlsZSk7XG5cbiAgICAgIHRoaXMuYWRkU3R5bGUodGhpcy5zY3JvbGxiYXJBZGp1c3RtZW50U3R5bGUsIGZhbHNlKTtcblxuICAgIH1cbiAgfVxuICBcbiAgcHJpdmF0ZSBzZXRTY3JvbGxiYXJBZGp1c3RtZW50U3R5bGUoKTogdm9pZCB7XG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMudmlld3BvcnQhLm9mZnNldFdpZHRoIC0gdGhpcy52aWV3cG9ydCEuY2xpZW50V2lkdGg7XG4gICAgdGhpcy5zY3JvbGxiYXJBZGp1c3RtZW50U3R5bGUhLmlubmVySFRNTCA9ICcjJyArIHRoaXMudmlld3BvcnRJRCArICcgLnJlb3JkZXJhYmxlLXRhYmxlLXJvdyB7IG1hcmdpbi1yaWdodDogLScgKyB0aGlzLnNjcm9sbGJhcldpZHRoICsgJ3B4OyB9JztcbiAgICB0aGlzLnNldFN0eWxlQ29udGVudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclNlbGVjdGlvbigpIHtcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgY29uc3Qgc2VsZWN0aW9uOiBTZWxlY3Rpb24gfCBudWxsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmRvY3VtZW50WydzZWxlY3Rpb24nXSkge1xuICAgICAgdGhpcy5kb2N1bWVudFsnc2VsZWN0aW9uJ10uZW1wdHkoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFJlc2l6YWJsZUdyaXAoZWw6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmIChmcm9tTXV0YXRpb24gJiYgIXRoaXMuaXNDdXN0b21FbGVtZW50KSB7XG4gICAgICB0aGlzLm11dGF0aW9uUmVzaXphYmxlR3JpcHMucHVzaChlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzaXphYmxlR3JpcHMucHVzaChlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRSZXNpemFibGVDb2x1bW4oZWw6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmIChmcm9tTXV0YXRpb24gJiYgIXRoaXMuaXNDdXN0b21FbGVtZW50KSB7XG4gICAgICB0aGlzLm11dGF0aW9uUmVzaXphYmxlQ29sdW1ucy5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNpemFibGVDb2x1bW5zLnB1c2goZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkUmVvcmRlckdyaXAoZWw6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmIChmcm9tTXV0YXRpb24gJiYgIXRoaXMuaXNDdXN0b21FbGVtZW50KSB7XG4gICAgICB0aGlzLm11dGF0aW9uUmVvcmRlckdyaXBzLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlb3JkZXJHcmlwcy5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFJlb3JkZXJhYmxlQ29sdW1uKGVsOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoZnJvbU11dGF0aW9uICYmICF0aGlzLmlzQ3VzdG9tRWxlbWVudCkge1xuICAgICAgdGhpcy5tdXRhdGlvblJlb3JkZXJhYmxlQ29sdW1ucy5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW9yZGVyYWJsZUNvbHVtbnMucHVzaChlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRDb2x1bW5zV2l0aERhdGFDbGFzc2VzKGVsOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoZnJvbU11dGF0aW9uICYmICF0aGlzLmlzQ3VzdG9tRWxlbWVudCkge1xuICAgICAgdGhpcy5tdXRhdGlvbkNvbHVtbnNXaXRoRGF0YUNsYXNzZXMucHVzaChlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3Nlcy5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFJvdyhlbDogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKGZyb21NdXRhdGlvbiAmJiAhdGhpcy5pc0N1c3RvbUVsZW1lbnQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25Sb3dzLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvd3MucHVzaChlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRJbmZpbml0ZVNjcm9sbFZpZXdwb3J0KGVsOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoZnJvbU11dGF0aW9uICYmICF0aGlzLmlzQ3VzdG9tRWxlbWVudCkge1xuICAgICAgdGhpcy5tdXRhdGlvbkluZmluaXRlU2Nyb2xsVmlld3BvcnRzLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluZmluaXRlU2Nyb2xsVmlld3BvcnRzLnB1c2goZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlU3R5bGVzRnJvbUhlYWQoKSB7XG4gICAgaWYgKHRoaXMuaGVhZFRhZy5jb250YWlucyh0aGlzLmhlYWRTdHlsZSkpIHtcbiAgICAgIHRoaXMuaGVhZFRhZy5yZW1vdmVDaGlsZCh0aGlzLmhlYWRTdHlsZSEpO1xuICAgIH1cbiAgICBpZiAodGhpcy5oZWFkVGFnLmNvbnRhaW5zKHRoaXMud2lkdGhTdHlsZSkpIHtcbiAgICAgIHRoaXMuaGVhZFRhZy5yZW1vdmVDaGlsZCh0aGlzLndpZHRoU3R5bGUhKTtcbiAgICAgIHRoaXMud2lkdGhTdHlsZUZyYWdtZW50ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGVhZFRhZy5jb250YWlucyh0aGlzLnJlb3JkZXJIaWdobGlnaHRTdHlsZSkpIHtcbiAgICAgIHRoaXMuaGVhZFRhZy5yZW1vdmVDaGlsZCh0aGlzLnJlb3JkZXJIaWdobGlnaHRTdHlsZSEpO1xuICAgICAgdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGVGcmFnbWVudCA9IG51bGw7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5oZWFkVGFnLmNvbnRhaW5zKHRoaXMuc3ViR3JvdXBTdHlsZXNbaV0pKSB7XG4gICAgICAgIHRoaXMuaGVhZFRhZy5yZW1vdmVDaGlsZCh0aGlzLnN1Ykdyb3VwU3R5bGVzW2ldKTtcbiAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50c1tpXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmdyaWRPcmRlckZyYWdtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuaGVhZFRhZy5jb250YWlucyh0aGlzLmdyaWRPcmRlclN0eWxlc1tpXSkpIHtcbiAgICAgICAgdGhpcy5oZWFkVGFnLnJlbW92ZUNoaWxkKHRoaXMuZ3JpZE9yZGVyU3R5bGVzW2ldKTtcbiAgICAgICAgdGhpcy5ncmlkT3JkZXJGcmFnbWVudHNbaV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRvY3VtZW50WydoYXNQb2ludGVyRG93bkxpc3RlbmVyJ10gPSBmYWxzZTtcbiAgICB0aGlzLm9ic2VydmVyIS5kaXNjb25uZWN0KCk7XG4gICAgaWYgKHRoaXMubGlua0NsYXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVtb3ZlU3R5bGVzRnJvbUhlYWQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaW5pdGlhbFdpZHRoU2V0dGluZ3NTdWJzY3JpcHRpb24kKSB7XG4gICAgICB0aGlzLmluaXRpYWxXaWR0aFNldHRpbmdzU3Vic2NyaXB0aW9uJC51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJCkge1xuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJC51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNvcnRhYmxlV2lkdGhJdGVtIHtcbiAgbWluV2lkdGg6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG59XG4iXX0=