import { Directive, ElementRef, EventEmitter, Inject, InjectionToken, Injector, Input, Output } from '@angular/core';
import { DragAndDropGhostComponent } from './../../components/drag-and-drop-ghost/drag-and-drop-ghost.component';
import { DOCUMENT } from '@angular/common';
import { TablejsGridProxy } from './../../shared/classes/tablejs-grid-proxy';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { ResizeSensor } from 'css-element-queries';
import { Subject } from 'rxjs';
import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
import * as i2 from "./../../services/directive-registration/directive-registration.service";
import * as i3 from "@angular/cdk/overlay";
import * as i4 from "./../../services/scroll-dispatcher/scroll-dispatcher.service";
import * as i5 from "./../../services/operating-system/operating-system.service";
export class GridDirective extends TablejsGridProxy {
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
        if (this.columnsWithDataClasses.length > 0) {
            this.observer?.disconnect();
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
        this.dragAndDropGhostComponent?.updateView(column.reorderGhost, column.reorderGhostContext);
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
GridDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridDirective, deps: [{ token: i0.ElementRef }, { token: i0.ComponentFactoryResolver }, { token: i1.GridService }, { token: i2.DirectiveRegistrationService }, { token: DOCUMENT }, { token: i3.Overlay }, { token: i4.ScrollDispatcherService }, { token: i5.OperatingSystemService }, { token: i0.RendererFactory2 }], target: i0.ɵɵFactoryTarget.Directive });
GridDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: GridDirective, selector: "[tablejsGrid],[tablejsgrid]", inputs: { linkClass: "linkClass", resizeColumnWidthByPercent: "resizeColumnWidthByPercent" }, outputs: { columnResizeStart: "columnResizeStart", columnResize: "columnResize", columnResizeEnd: "columnResizeEnd", columnReorder: "columnReorder", columnReorderStart: "columnReorderStart", dragOver: "dragOver", columnReorderEnd: "columnReorderEnd", preGridInitialize: "preGridInitialize", gridInitialize: "gridInitialize" }, host: { classAttribute: "tablejs-table-container tablejs-table-width" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: GridDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsGrid],[tablejsgrid]',
                    host: { class: 'tablejs-table-container tablejs-table-width' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ComponentFactoryResolver }, { type: i1.GridService }, { type: i2.DirectiveRegistrationService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i3.Overlay }, { type: i4.ScrollDispatcherService }, { type: i5.OperatingSystemService }, { type: i0.RendererFactory2 }]; }, propDecorators: { linkClass: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy90YWJsZWpzL3NyYy9saWIvZGlyZWN0aXZlcy9ncmlkL2dyaWQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBMkUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQWEsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBc0MsTUFBTSxlQUFlLENBQUM7QUFDN08sT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDakgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBSTdFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUd2RyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUFXLGFBQWEsRUFBZ0MsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RixPQUFPLEVBQUUsZUFBZSxFQUFpQixNQUFNLHFCQUFxQixDQUFDOzs7Ozs7O0FBU3JFLE1BQU0sT0FBTyxhQUFjLFNBQVEsZ0JBQWdCO0lBOEdqRCxZQUNVLFVBQXNCLEVBQ3RCLFFBQWtDLEVBQ2xDLFdBQXdCLEVBQ3hCLDRCQUEwRCxFQUN4QyxRQUFhLEVBQy9CLE9BQWdCLEVBQ2hCLHVCQUFnRCxFQUNo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RyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFdEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUVoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7OzBHQTUvRVUsYUFBYSwySkFtSGQsUUFBUTs4RkFuSFAsYUFBYTsyRkFBYixhQUFhO2tCQUp6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw2QkFBNkI7b0JBQ3ZDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSw2Q0FBNkMsRUFBRTtpQkFDL0Q7OzBCQW9ISSxNQUFNOzJCQUFDLFFBQVE7NEtBbEJULFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csMEJBQTBCO3NCQUFsQyxLQUFLO2dCQUVJLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFDRyxZQUFZO3NCQUFyQixNQUFNO2dCQUNHLGVBQWU7c0JBQXhCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxrQkFBa0I7c0JBQTNCLE1BQU07Z0JBQ0csUUFBUTtzQkFBakIsTUFBTTtnQkFDRyxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBQ0csaUJBQWlCO3NCQUExQixNQUFNO2dCQUNHLGNBQWM7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnRSZWYsIENvbXBvbmVudEZhY3RvcnksIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIElucHV0LCBPdXRwdXQsIFZpZXdDb250YWluZXJSZWYsIFJlbmRlcmVyRmFjdG9yeTIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERyYWdBbmREcm9wR2hvc3RDb21wb25lbnQgfSBmcm9tICcuLy4uLy4uL2NvbXBvbmVudHMvZHJhZy1hbmQtZHJvcC1naG9zdC9kcmFnLWFuZC1kcm9wLWdob3N0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUYWJsZWpzR3JpZFByb3h5IH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy90YWJsZWpzLWdyaWQtcHJveHknO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2dyaWQvZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24vZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElDb2x1bW5EYXRhIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9pLWNvbHVtbi1kYXRhJztcbmltcG9ydCB7IENvbHVtblJlb3JkZXJFdmVudCB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2NsYXNzZXMvZXZlbnRzL2NvbHVtbi1yZW9yZGVyLWV2ZW50JztcbmltcG9ydCB7IENvbHVtblJlc2l6ZUV2ZW50IH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvY2xhc3Nlcy9ldmVudHMvY29sdW1uLXJlc2l6ZS1ldmVudCc7XG5pbXBvcnQgeyBHcmlkRXZlbnQgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL2V2ZW50cy9ncmlkLWV2ZW50JztcbmltcG9ydCB7IFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlIH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zZXJ2aWNlcy9zY3JvbGwtZGlzcGF0Y2hlci9zY3JvbGwtZGlzcGF0Y2hlci5zZXJ2aWNlJztcbmltcG9ydCB7IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL29wZXJhdGluZy1zeXN0ZW0vb3BlcmF0aW5nLXN5c3RlbS5zZXJ2aWNlJztcbmltcG9ydCB7IFJlc2l6ZVNlbnNvciB9IGZyb20gJ2Nzcy1lbGVtZW50LXF1ZXJpZXMnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmLCBQb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBJQ29sdW1uSGllcmFyY2h5IH0gZnJvbSAnLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvaS1jb2x1bW4taGllcmFyY2h5JztcbmltcG9ydCB7IElDb2x1bW5IaWRlQ2hhbmdlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvZXZlbnRzL2ktY29sdW1uLWhpZGUtY2hhbmdlJztcbmltcG9ydCB7IEhpZGVDb2x1bW5JZkRpcmVjdGl2ZSB9IGZyb20gJy4uL2hpZGUtY29sdW1uLWlmL2hpZGUtY29sdW1uLWlmLmRpcmVjdGl2ZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t0YWJsZWpzR3JpZF0sW3RhYmxlanNncmlkXScsXG4gIGhvc3Q6IHsgY2xhc3M6ICd0YWJsZWpzLXRhYmxlLWNvbnRhaW5lciB0YWJsZWpzLXRhYmxlLXdpZHRoJyB9XG59KVxuZXhwb3J0IGNsYXNzIEdyaWREaXJlY3RpdmUgZXh0ZW5kcyBUYWJsZWpzR3JpZFByb3h5IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBkcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICByZW9yZGVyaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHN0YXJ0WDogbnVtYmVyID0gMDtcbiAgc3RhcnRZOiBudW1iZXIgPSAwO1xuICBzdHlsZXNCeUNsYXNzOiBhbnlbXSA9IFtdO1xuICBpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHZpZXdwb3J0OiBIVE1MRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuICB2aWV3cG9ydElEOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgY3VycmVudENsYXNzZXNUb1Jlc2l6ZTogc3RyaW5nW10gPSBbXTtcbiAgc3RhcnRpbmdXaWR0aHM6IG51bWJlcltdID0gW107XG4gIG1pbldpZHRoczogbnVtYmVyW10gPSBbXTtcbiAgdG90YWxDb21wdXRlZE1pbldpZHRoOiBudW1iZXIgPSAwO1xuICB0b3RhbENvbXB1dGVkV2lkdGg6IG51bWJlciA9IDA7XG4gIGRlZmF1bHRUYWJsZU1pbldpZHRoOiBudW1iZXIgPSAyNTtcbiAgZ3JpZFRlbXBsYXRlQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcbiAgZ3JpZE9yZGVyOiBudW1iZXJbXSA9IFtdO1xuICBjbGFzc1dpZHRoczogYW55W10gPSBbXTtcbiAgZ3JpZFRlbXBsYXRlVHlwZXM6IGFueVtdID0gW107XG4gIGRyYWdnaW5nQ29sdW1uOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBjb2xSYW5nZUdyb3VwczogbnVtYmVyW11bXVtdID0gW107XG4gIGxhc3REcmFnZ2VkT3ZlckVsZW1lbnQ6IGFueSA9IG51bGw7XG4gIGxhc3REcmFnZ2VkR3JvdXBJbmRleDogbnVtYmVyID0gLTE7XG4gIGxhc3REcmFnZ2VkT3ZlclJlY3Q6IENsaWVudFJlY3QgfCBudWxsID0gbnVsbDtcbiAgbGFzdERyYWdnZWRHcm91cEJvdW5kaW5nUmVjdHM6IENsaWVudFJlY3RbXSB8IG51bGwgPSBudWxsO1xuICBsYXN0TW92ZURpcmVjdGlvbjogbnVtYmVyID0gLTE7XG4gIHJlc2l6YWJsZUNvbHVtbnM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgcmVzaXphYmxlR3JpcHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgcmVvcmRlckdyaXBzOiBIVE1MRWxlbWVudFtdID0gW107XG4gIHJlb3JkZXJhYmxlQ29sdW1uczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBjb2x1bW5zV2l0aERhdGFDbGFzc2VzOiBIVE1MRWxlbWVudFtdID0gW107XG4gIHJvd3M6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgaW5maW5pdGVTY3JvbGxWaWV3cG9ydHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgbXV0YXRpb25SZXNpemFibGVDb2x1bW5zOiBIVE1MRWxlbWVudFtdID0gW107XG4gIG11dGF0aW9uUmVzaXphYmxlR3JpcHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgbXV0YXRpb25SZW9yZGVyR3JpcHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgbXV0YXRpb25SZW9yZGVyYWJsZUNvbHVtbnM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgbXV0YXRpb25Db2x1bW5zV2l0aERhdGFDbGFzc2VzOiBIVE1MRWxlbWVudFtdID0gW107XG4gIG11dGF0aW9uUm93czogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBtdXRhdGlvbkluZmluaXRlU2Nyb2xsVmlld3BvcnRzOiBIVE1MRWxlbWVudFtdID0gW107XG4gIGhlYWRUYWc6IEhUTUxIZWFkRWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgc3R5bGVDb250ZW50OiBzdHJpbmcgPSAnJztcbiAgaGVhZFN0eWxlOiBIVE1MU3R5bGVFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHN0eWxlTGlzdDogSFRNTFN0eWxlRWxlbWVudFtdID0gW107XG4gIGluaXRpYWxXaWR0aHM6IGFueVtdID0gW107XG4gIGluaXRpYWxXaWR0aHNBcmVTZXQ6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxhc3RDb2x1bW5zOiBhbnlbXSA9IFtdO1xuICBjb250ZW50UmVzaXplU2Vuc29yOiBSZXNpemVTZW5zb3IgfCBudWxsID0gbnVsbDtcbiAgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcbiAgaXNDdXN0b21FbGVtZW50OiBib29sZWFuID0gZmFsc2U7XG4gIHBvaW50ZXJMaXN0ZW5lckZ1bmM6IGFueTtcblxuICBwYXJlbnRHcm91cHM6IEVsZW1lbnRbXVtdID0gW107XG5cbiAgY29sRGF0YTogSUNvbHVtbkRhdGEgfCBudWxsID0gbnVsbDtcbiAgY29sRGF0YUdyb3VwczogSUNvbHVtbkRhdGFbXVtdID0gW107XG4gIGVsZW1lbnRzV2l0aEhpZ2hsaWdodDogYW55W10gPSBbXTtcblxuICBkcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50OiBEcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50IHwgbnVsbCA9IG51bGw7XG4gIGRyYWdPZmZzZXRYOiBudW1iZXIgPSAwO1xuICBkcmFnT2Zmc2V0WTogbnVtYmVyID0gMDtcbiAgcmVvcmRlckhhbmRsZUNvbE9mZnNldDogbnVtYmVyID0gMDtcbiAgc2Nyb2xsYmFyV2lkdGg6IG51bWJlciA9IDA7XG5cbiAgaW5pdGlhbFdpZHRoU2V0dGluZ3NTdWJzY3JpcHRpb24kOiBTdWJzY3JpcHRpb247XG5cbiAgLy8gY2xhc3MgdXNlZCBmb3Igc2V0dGluZyBvcmRlclxuICByZW9yZGVyYWJsZUNsYXNzOiBzdHJpbmcgPSAncmVvcmRlcmFibGUtdGFibGUtcm93JztcblxuICAvLyBmcmFnbWVudHNcbiAgd2lkdGhTdHlsZTogSFRNTFN0eWxlRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICB3aWR0aFN0eWxlRnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQgfCBudWxsID0gbnVsbDtcbiAgcmVvcmRlckhpZ2hsaWdodFN0eWxlOiBIVE1MU3R5bGVFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHJlb3JkZXJIaWdobGlnaHRTdHlsZUZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50IHwgbnVsbCA9IG51bGw7XG4gIHN1Ykdyb3VwU3R5bGVzOiAoSFRNTFN0eWxlRWxlbWVudCB8IG51bGwpW10gPSBbXTtcbiAgc3ViR3JvdXBGcmFnbWVudHM6IChEb2N1bWVudEZyYWdtZW50IHwgbnVsbClbXSA9IFtdO1xuICBncmlkT3JkZXJTdHlsZXM6IChIVE1MU3R5bGVFbGVtZW50IHwgbnVsbClbXSA9IFtdO1xuICBncmlkT3JkZXJGcmFnbWVudHM6IChEb2N1bWVudEZyYWdtZW50IHwgbnVsbClbXSA9IFtdO1xuICBzdWJHcm91cFN0eWxlT2JqczogYW55ID0ge307XG4gIHNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudCB8IG51bGwgPSBudWxsO1xuICBzY3JvbGxiYXJBZGp1c3RtZW50U3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcmVzaXplTWFrZVVwUGVyY2VudDogbnVtYmVyID0gMDtcbiAgcmVzaXplTWFrZVVwUGVyQ29sUGVyY2VudDogbnVtYmVyID0gMDtcblxuICBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgfCBudWxsID0gbnVsbDtcbiAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZjtcbiAgaGlkZGVuQ29sdW1uSW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgcHVibGljIGhpZGRlbkNvbHVtbkNoYW5nZXM6IFN1YmplY3Q8SUNvbHVtbkhpZGVDaGFuZ2UgfCBudWxsPiA9IG5ldyBTdWJqZWN0PElDb2x1bW5IaWRlQ2hhbmdlIHwgbnVsbD4oKTtcbiAgcHJpdmF0ZSBoaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJDogU3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgSElEREVOX0NPTFVNTl9DTEFTUzogc3RyaW5nID0gJ2NvbHVtbi1pcy1oaWRkZW4nO1xuXG4gIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yO1xuICBwcml2YXRlIERSQUdfQU5EX0RST1BfR0hPU1RfT1ZFUkxBWV9EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ0RSQUdfQU5EX0RST1BfR0hPU1RfT1ZFUkxBWV9EQVRBJyk7XG5cbiAgcHJpdmF0ZSBhbmltYXRpb25GcmFtZUlEczogbnVtYmVyW10gPSBbXTtcblxuICBASW5wdXQoKSBsaW5rQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgcmVzaXplQ29sdW1uV2lkdGhCeVBlcmNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgY29sdW1uUmVzaXplU3RhcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5SZXNpemU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5SZXNpemVFbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5SZW9yZGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sdW1uUmVvcmRlclN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZHJhZ092ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5SZW9yZGVyRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHJlR3JpZEluaXRpYWxpemU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KHRydWUpO1xuICBAT3V0cHV0KCkgZ3JpZEluaXRpYWxpemU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KHRydWUpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBncmlkU2VydmljZTogR3JpZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlOiBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBzY3JvbGxEaXNwYXRjaGVyU2VydmljZTogU2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvcGVyYXRpbmdTeXN0ZW06IE9wZXJhdGluZ1N5c3RlbVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucmVnaXN0ZXJEaXJlY3RpdmVUb0VsZW1lbnQoKTtcbiAgICB0aGlzLmF0dGFjaE11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJEaXJlY3RpdmVUb0VsZW1lbnQoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ3JpZERpcmVjdGl2ZSA9IHRoaXM7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5ncmlkRGlyZWN0aXZlID0gdGhpcztcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoTXV0YXRpb25PYnNlcnZlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMub2JzZXJ2ZXIpIHtcbiAgICAgIGNvbnN0IHRoczogYW55ID0gdGhpcztcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbjogTXV0YXRpb25SZWNvcmQpID0+IHtcbiAgICAgICAgICB0aHMudXBkYXRlTXV0YXRpb25zKG11dGF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIC8vIGNvbmZpZ3VyZSBpdCB0byBsaXN0ZW4gdG8gYXR0cmlidXRlIGNoYW5nZXNcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICBjaGFyYWN0ZXJEYXRhOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNdXRhdGlvbnMobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKTogdm9pZCB7XG4gICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICBjb25zdCBhZGRlZE5vZGVzID0gQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzKTtcbiAgICAgIGFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcblxuICAgICAgICB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UucmVnaXN0ZXJOb2RlQXR0cmlidXRlcyhub2RlKTtcbiAgICAgICAgdGhpcy5nZXRDaGlsZE5vZGVzKG5vZGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaGlsZE5vZGVzKG5vZGU6IGFueSkge1xuICAgIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZE5vZGU6IGFueSkgPT4ge1xuICAgICAgdGhpcy5kaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlLnJlZ2lzdGVyTm9kZUF0dHJpYnV0ZXMoY2hpbGROb2RlKTtcbiAgICAgIGlmIChjaGlsZE5vZGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGROb2RlcyhjaGlsZE5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBcblxuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignKlt0YWJsZWpzU2Nyb2xsVmlld3BvcnRdJyk7XG4gICAgaWYgKHZpZXdwb3J0ICE9PSBudWxsICYmICh2aWV3cG9ydC5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9PT0gbnVsbCB8fCB2aWV3cG9ydC5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgLy8gYXR0YWNoIGRpcmVjdGl2ZVxuICAgICAgY29uc3Qgdmlld3BvcnRSZWY6IEVsZW1lbnRSZWYgPSBuZXcgRWxlbWVudFJlZih2aWV3cG9ydCk7XG4gICAgICBcbiAgICAgIHRoaXMuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPSBuZXcgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUoXG4gICAgICAgIHZpZXdwb3J0UmVmLFxuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLFxuICAgICAgICB0aGlzLmRvY3VtZW50LFxuICAgICAgICB0aGlzLmRpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlclNlcnZpY2UsXG4gICAgICAgIHRoaXMub3BlcmF0aW5nU3lzdGVtLFxuICAgICAgICBudWxsLFxuICAgICAgICB0aGlzLnJlbmRlcmVyRmFjdG9yeVxuICAgICAgKTtcblxuICAgICAgdGhpcy5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZS5yZWdpc3RlckN1c3RvbUVsZW1lbnRzSW5wdXRzKHZpZXdwb3J0KTtcblxuICAgICAgdGhpcy5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZS5uZ09uSW5pdCgpO1xuICAgICAgdGhpcy5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZS5uZ0FmdGVyVmlld0luaXQoKTtcblxuICAgIH1cbiAgICBcblxuICAgIC8vIENsb3NlIG9ic2VydmVyIGlmIGRpcmVjdGl2ZXMgYXJlIHJlZ2lzdGVyaW5nXG5cbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5kaXJlY3RpdmUgPSB0aGlzO1xuICAgIGlmICghdGhpcy5kb2N1bWVudFsnaGFzUG9pbnRlckRvd25MaXN0ZW5lciddKSB7XG4gICAgICB0aGlzLnBvaW50ZXJMaXN0ZW5lckZ1bmMgPSAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgbGV0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZSgndGFibGVqc0dyaWQnKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGVsWydkaXJlY3RpdmUnXS5vblBvaW50ZXJEb3duKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMucG9pbnRlckxpc3RlbmVyRnVuYyk7XG4gICAgICB0aGlzLmRvY3VtZW50WydoYXNQb2ludGVyRG93bkxpc3RlbmVyJ10gPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBhbmltYXRpb25GcmFtZUlEOiBudW1iZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lc3RhbXApID0+IHtcbiAgICAgIHRoaXMub25FbnRlckZyYW1lKHRoaXMsIHRpbWVzdGFtcCk7XG4gICAgfSk7XG4gICAgdGhpcy5hbmltYXRpb25GcmFtZUlEcy5wdXNoKGFuaW1hdGlvbkZyYW1lSUQpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkVudGVyRnJhbWUodGhzOiBhbnksIHRpbWVzdGFtcDogYW55KSB7XG5cbiAgICBpZiAodGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLm11dGF0aW9uQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGFuaW1hdGlvbkZyYW1lSUQ6IG51bWJlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRtc3RhbXApID0+IHtcbiAgICAgICAgdGhzLm9uRW50ZXJGcmFtZSh0aHMsIHRtc3RhbXApO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lSURzLnB1c2goYW5pbWF0aW9uRnJhbWVJRCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXMubGVuZ3RoID09PSAwICYmIHRoaXMubXV0YXRpb25Db2x1bW5zV2l0aERhdGFDbGFzc2VzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhpcy5pc0N1c3RvbUVsZW1lbnQgPSB0cnVlO1xuXG4gICAgICB0aGlzLnJlc2l6YWJsZUNvbHVtbnMgPSB0aGlzLm11dGF0aW9uUmVzaXphYmxlQ29sdW1ucy5jb25jYXQoKTtcbiAgICAgIHRoaXMucmVzaXphYmxlR3JpcHMgPSB0aGlzLm11dGF0aW9uUmVzaXphYmxlR3JpcHMuY29uY2F0KCk7XG4gICAgICB0aGlzLnJlb3JkZXJHcmlwcyA9IHRoaXMubXV0YXRpb25SZW9yZGVyR3JpcHMuY29uY2F0KCk7XG4gICAgICB0aGlzLnJlb3JkZXJhYmxlQ29sdW1ucyA9IHRoaXMubXV0YXRpb25SZW9yZGVyYWJsZUNvbHVtbnMuY29uY2F0KCk7XG4gICAgICB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXMgPSB0aGlzLm11dGF0aW9uQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlcy5jb25jYXQoKTtcbiAgICAgIHRoaXMucm93cyA9IHRoaXMubXV0YXRpb25Sb3dzLmNvbmNhdCgpO1xuICAgICAgdGhpcy5pbmZpbml0ZVNjcm9sbFZpZXdwb3J0cyA9IHRoaXMubXV0YXRpb25JbmZpbml0ZVNjcm9sbFZpZXdwb3J0cy5jb25jYXQoKTtcblxuICAgICAgdGhpcy5tdXRhdGlvblJlc2l6YWJsZUNvbHVtbnMgPSBbXTtcbiAgICAgIHRoaXMubXV0YXRpb25SZXNpemFibGVHcmlwcyA9IFtdO1xuICAgICAgdGhpcy5tdXRhdGlvblJlb3JkZXJHcmlwcyA9IFtdO1xuICAgICAgdGhpcy5tdXRhdGlvblJlb3JkZXJhYmxlQ29sdW1ucyA9IFtdO1xuICAgICAgdGhpcy5tdXRhdGlvbkNvbHVtbnNXaXRoRGF0YUNsYXNzZXMgPSBbXTtcbiAgICAgIHRoaXMubXV0YXRpb25Sb3dzID0gW107XG4gICAgICB0aGlzLm11dGF0aW9uSW5maW5pdGVTY3JvbGxWaWV3cG9ydHMgPSBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlOiBhbnkgPSB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXM7XG4gICAgY29uc3QgZWwgPSBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlWzBdO1xuICAgIGNvbnN0IHJlc2l6ZUNsYXNzZXM6IHN0cmluZ1tdID0gdGhpcy5nZXRSZXNpemFibGVDbGFzc2VzKGVsKTtcbiAgICBjb25zdCByZXNpemVDbHMgPSByZXNpemVDbGFzc2VzWzBdO1xuICAgIGNvbnN0IGZpcnN0RWw6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShyZXNpemVDbHMpWzBdO1xuXG4gICAgXG4gICAgaWYgKCF0aGlzLmluaXRpYWxXaWR0aFNldHRpbmdzU3Vic2NyaXB0aW9uJCkge1xuICAgICAgdGhpcy5pbml0aWFsV2lkdGhTZXR0aW5nc1N1YnNjcmlwdGlvbiQgPSB0aGlzLmdyaWRTZXJ2aWNlLmNvbnRhaW5zSW5pdGlhbFdpZHRoU2V0dGluZ3Muc3Vic2NyaWJlKGhhc1dpZHRocyA9PiB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoc0FyZVNldCA9IGhhc1dpZHRocztcbiAgICAgIH0pO1xuICAgIH1cbiAgIFxuICAgIGlmICghdGhpcy5oaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJCkge1xuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5DaGFuZ2VzU3Vic2NyaXB0aW9uJCA9IHRoaXMuaGlkZGVuQ29sdW1uQ2hhbmdlcy5zdWJzY3JpYmUoXG4gICAgICAgIChjaGFuZ2U6IElDb2x1bW5IaWRlQ2hhbmdlIHwgbnVsbCkgPT4ge1xuXG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZEhlYWRlcjogRWxlbWVudCB8IGFueSA9IHRoaXMuZ2V0UmVsYXRlZEhlYWRlcihjaGFuZ2UuaGllcmFyY2h5Q29sdW1uLmVsZW1lbnQpO1xuICAgICAgICAgICAgcmVsYXRlZEhlYWRlci5oaWRlQ29sdW1uID0gY2hhbmdlLmhpZGRlbjtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAoY2hhbmdlLndhc1RyaWdnZXJlZEJ5VGhpc0NvbHVtbikge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUhpZGRlbkNvbHVtbkluZGljZXMoKTtcbiAgICAgICAgICAgICAgY29uc3QgaGlkZUNvbHVtbklmOiBIaWRlQ29sdW1uSWZEaXJlY3RpdmUgPSAoY2hhbmdlLmhpZXJhcmNoeUNvbHVtbi5lbGVtZW50IGFzIGFueSkuaGlkZUNvbHVtbklmO1xuICAgICAgICAgICAgICBoaWRlQ29sdW1uSWYudXBkYXRlSGVhZGVyc1RoYXRDYW5IaWRlKCk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNoYW5nZS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgaWYgKGNoYW5nZS53YXNUcmlnZ2VyZWRCeVRoaXNDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUgPSB0aGlzLmdldFJlc2l6YWJsZUNsYXNzZXMocmVsYXRlZEhlYWRlcik7XG4gICAgICAgICAgICAgICAgY29uc3QgYXZnV2lkdGhQZXJDb2x1bW46IG51bWJlciA9IHRoaXMuZ2V0QXZlcmFnZUNvbHVtbldpZHRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNaW5pbXVtV2lkdGhzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdG90YWxUYWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLnZpZXdwb3J0IS5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBsZXQgbmV3V2lkdGg6IG51bWJlciA9IGF2Z1dpZHRoUGVyQ29sdW1uICogdGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgY2xhc3NJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NXaWR0aHNbY2xhc3NJbmRleF0gPSAoYXZnV2lkdGhQZXJDb2x1bW4gLyB0b3RhbFRhYmxlV2lkdGggKiAxMDApLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2ZXJhZ2UgYWxsIHBlcmNlbnRhZ2VzXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzV2lkdGhzW2NsYXNzSW5kZXhdID0gTWF0aC5tYXgoYXZnV2lkdGhQZXJDb2x1bW4sIHRoaXMubWluV2lkdGhzW2NsYXNzSW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmZpdFdpZHRoc1RvT25lSHVuZHJlZFBlcmNlbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXaWR0aHMobmV3V2lkdGgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2V0R3JpZE9yZGVyKCk7IFxuICAgICAgICAgIH0gICBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnRHcm91cHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFBhcmVudEdyb3VwcyhhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlKTtcbiAgICB9XG4gICAgY29uc3QgbWF4Q29sdW1uc1BlclJvdzogbnVtYmVyID0gdGhpcy5wYXJlbnRHcm91cHNbdGhpcy5wYXJlbnRHcm91cHMubGVuZ3RoIC0gMV0ubGVuZ3RoO1xuXG4gICAgaWYgKGZpcnN0RWwgPT09IHVuZGVmaW5lZCB8fCBmaXJzdEVsID09PSBudWxsKSB7XG4gICAgICBjb25zdCBhbmltYXRpb25GcmFtZUlEOiBudW1iZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgIHRocy5vbkVudGVyRnJhbWUodGhzLCB0bXN0YW1wKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hbmltYXRpb25GcmFtZUlEcy5wdXNoKGFuaW1hdGlvbkZyYW1lSUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBrZXlzOiBhbnlbXSA9IE9iamVjdC5rZXlzKHRoaXMuaW5pdGlhbFdpZHRocyk7XG4gICAgICBpZiAodGhpcy5pbml0aWFsV2lkdGhzQXJlU2V0ID09PSB0cnVlICYmIGtleXMubGVuZ3RoIDwgbWF4Q29sdW1uc1BlclJvdykge1xuICAgICAgICBjb25zdCBhbmltYXRpb25GcmFtZUlEOiBudW1iZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgICAgdGhzLmF3YWl0V2lkdGhzKHRocywgdG1zdGFtcCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lSURzLnB1c2goYW5pbWF0aW9uRnJhbWVJRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNoZWNrRm9yR3JpZEluaXRSZWFkeSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjYW5IaWRlQ29sdW1uKGNvbHVtbjogRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoY29sdW1uIGFzIGFueSkuaGlkZUNvbHVtbklmLmNhbkhpZGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk6IElDb2x1bW5IaWVyYXJjaHlbXSB7XG4gICAgY29uc3QgaGllcmFyY2h5OiBhbnkgPSB0aGlzLmdldENvbHVtbkhpZXJhcmNoeSgpO1xuICAgIHJldHVybiBoaWVyYXJjaHkuY29sdW1uR3JvdXBzLnJlZHVjZSgocHJldjogYW55LCBjdXJyOiBhbnkpID0+IHtcbiAgICAgIGxldCBhcnI6IGFueVtdID0gW2N1cnJdO1xuICAgICAgaWYgKGN1cnIuc3ViQ29sdW1ucykge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KHRoaXMuZ2V0U3ViQ29sdW1ucyhjdXJyKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJldi5jb25jYXQoYXJyKTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICBwcml2YXRlIGdldFN1YkNvbHVtbnMoaXRlbTogYW55KTogYW55W10ge1xuICAgIGlmIChpdGVtLnN1YkNvbHVtbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGxldCBhcnI6IGFueVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLnN1YkNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHN1Ykl0ZW06IGFueSA9IGl0ZW0uc3ViQ29sdW1uc1tpXTtcbiAgICAgIGFyciA9IGFyci5jb25jYXQoc3ViSXRlbSk7XG4gICAgICBpZiAoc3ViSXRlbS5zdWJDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdCh0aGlzLmdldFN1YkNvbHVtbnMoc3ViSXRlbSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgcHVibGljIGdldENvbHVtbkhpZXJhcmNoeSgpOiBhbnkge1xuICAgIGNvbnN0IGhpZXJhcmNoeTogYW55ID0ge1xuICAgICAgY29sdW1uR3JvdXBzOiBbXVxuICAgIH07XG4gICAgY29uc3QgaGlnaGVzdExldmVsR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbMF07XG4gICAgY29uc3QgaGllcmFyY2h5R3JvdXA6IElDb2x1bW5IaWVyYXJjaHlbXSA9IGhpZ2hlc3RMZXZlbEdyb3VwLm1hcCgoaXRlbTogSUNvbHVtbkRhdGEpID0+IHtcbiAgICAgIGxldCBsZXZlbENvdW50OiBudW1iZXIgPSAwO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGV2ZWw6IGxldmVsQ291bnQsXG4gICAgICAgIGVsZW1lbnQ6IGl0ZW0uY2hpbGQsXG4gICAgICAgIHBhcmVudDogaXRlbS5wYXJlbnQsXG4gICAgICAgIHBhcmVudENvbHVtbjogbnVsbCxcbiAgICAgICAgc3ViQ29sdW1uczogdGhpcy5nZXRIaWVyYXJjaHlTdWJDb2x1bW5zKGl0ZW0sIGxldmVsQ291bnQpXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGhpZXJhcmNoeS5jb2x1bW5Hcm91cHMgPSBoaWVyYXJjaHlHcm91cDtcbiAgICByZXR1cm4gaGllcmFyY2h5O1xuICB9XG5cbiAgZ2V0SGllcmFyY2h5U3ViQ29sdW1ucyhpdGVtOiBJQ29sdW1uRGF0YSwgbGV2ZWxDb3VudDogbnVtYmVyKTogSUNvbHVtbkhpZXJhcmNoeVtdIHtcbiAgICBsZXZlbENvdW50Kys7XG4gICAgaWYgKCFpdGVtLnN1Ykdyb3VwcyB8fCBpdGVtLnN1Ykdyb3Vwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3Qgc3ViQ29sdW1uczogSUNvbHVtbkhpZXJhcmNoeVtdID0gaXRlbS5zdWJHcm91cHMubWFwKChzdWJJdGVtOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGV2ZWw6IGxldmVsQ291bnQsXG4gICAgICAgIGVsZW1lbnQ6IHN1Ykl0ZW0uY2hpbGQsXG4gICAgICAgIHBhcmVudDogc3ViSXRlbS5wYXJlbnQsXG4gICAgICAgIHBhcmVudENvbHVtbjogaXRlbS5jaGlsZCxcbiAgICAgICAgc3ViQ29sdW1uczogdGhpcy5nZXRIaWVyYXJjaHlTdWJDb2x1bW5zKHN1Ykl0ZW0sIGxldmVsQ291bnQpXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3ViQ29sdW1ucztcblxuICB9XG5cbiAgcHVibGljIGNoZWNrRm9yR3JpZEluaXRSZWFkeSgpOiB2b2lkIHtcbiAgICBjb25zdCBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlOiBhbnkgPSB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXM7XG4gICAgY29uc3QgZWwgPSBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlWzBdO1xuICAgIGNvbnN0IHJlc2l6ZUNsYXNzZXM6IHN0cmluZ1tdID0gdGhpcy5nZXRSZXNpemFibGVDbGFzc2VzKGVsKTtcbiAgICBjb25zdCByZXNpemVDbHM6IGFueSA9IHJlc2l6ZUNsYXNzZXNbMF07XG4gICAgY29uc3Qga2V5czogYW55W10gPSBPYmplY3Qua2V5cyh0aGlzLmluaXRpYWxXaWR0aHMpO1xuICAgIGNvbnN0IG1heENvbHVtbnNQZXJSb3c6IG51bWJlciA9IHRoaXMucGFyZW50R3JvdXBzW3RoaXMucGFyZW50R3JvdXBzLmxlbmd0aCAtIDFdLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLmluaXRpYWxXaWR0aHNBcmVTZXQgPT09IHRydWUgJiYgKGtleXMubGVuZ3RoIDwgbWF4Q29sdW1uc1BlclJvdyB8fCAhdGhpcy5pbml0aWFsV2lkdGhzW3Jlc2l6ZUNsc10pKSB7XG4gICAgICBjb25zdCBhbmltYXRpb25GcmFtZUlEOiBudW1iZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgIHRoaXMuYXdhaXRXaWR0aHModGhpcywgdG1zdGFtcCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWVJRHMucHVzaChhbmltYXRpb25GcmFtZUlEKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFdpZHRoc0FyZVNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBhbmltYXRpb25GcmFtZUlEOiBudW1iZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgIHRoaXMuYXdhaXRXaWR0aHModGhpcywgdG1zdGFtcCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWVJRHMucHVzaChhbmltYXRpb25GcmFtZUlEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLmxpbmtDbGFzcykge1xuICAgICAgICB0aGlzLmluaXRHcmlkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBhbmltYXRpb25GcmFtZUlEOiBudW1iZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0bXN0YW1wKSA9PiB7XG4gICAgICAgICAgdGhpcy5hd2FpdFNpbmdsZUZyYW1lKHRoaXMsIHRtc3RhbXApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZUlEcy5wdXNoKGFuaW1hdGlvbkZyYW1lSUQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXdhaXRXaWR0aHModGhzOiBhbnksIHRpbWVzdGFtcDogYW55KSB7XG4gICAgdGhpcy5jaGVja0ZvckdyaWRJbml0UmVhZHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXdhaXRTaW5nbGVGcmFtZSh0aHM6IGFueSwgdGltZXN0YW1wOiBhbnkpIHtcbiAgICB0aGlzLmluaXRHcmlkKCk7XG4gIH1cblxuICBwcml2YXRlIG9uUG9pbnRlckRvd24oZXZlbnQ6IGFueSkge1xuICAgIFxuICAgIHRoaXMuYWRkUG9pbnRlckxpc3RlbmVycygpO1xuXG4gICAgaWYgKCF0aGlzLmdldFJlc2l6ZUdyaXBVbmRlclBvaW50KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBvbmx5IGRyYWcgb24gbGVmdCBtb3VzZSBidXR0b25cbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwKSB7IHJldHVybjsgfVxuICAgIFxuICAgIC8vIGRpc2FibGVzIHVud2FudGVkIGRyYWcgYW5kIGRyb3AgZnVuY3Rpb25hbGl0eSBmb3Igc2VsZWN0ZWQgdGV4dCBpbiBicm93c2Vyc1xuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcblxuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGxldCByZXNpemVIYW5kbGVzOiBIVE1MRWxlbWVudFtdO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZW9yZGVySGFuZGxlc1VuZGVyUG9pbnQ6IEVsZW1lbnRbXSA9IHRoaXMuZ2V0UmVvcmRlckhhbmRsZXNVbmRlclBvaW50KGV2ZW50KTtcbiAgICBjb25zdCBjb2xzVW5kZXJQb2ludDogRWxlbWVudFtdID0gdGhpcy5nZXRSZW9yZGVyQ29sc1VuZGVyUG9pbnQoZXZlbnQpO1xuXG4gICAgaWYgKHJlb3JkZXJIYW5kbGVzVW5kZXJQb2ludC5sZW5ndGggPiAwICYmIGNvbHNVbmRlclBvaW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kcmFnZ2luZ0NvbHVtbiA9IGNvbHNVbmRlclBvaW50WzBdIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICB0aGlzLmNvbHVtblJlb3JkZXJTdGFydC5lbWl0KHtcbiAgICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgICAgY29sdW1uRHJhZ2dlZDogdGhpcy5kcmFnZ2luZ0NvbHVtbixcbiAgICAgICAgY29sdW1uSG92ZXJlZDogdGhpcy5kcmFnZ2luZ0NvbHVtblxuICAgICAgfSk7XG4gICAgICBjb25zdCBjdXN0b21SZW9yZGVyU3RhcnRFdmVudCA9IG5ldyBDdXN0b21FdmVudChDb2x1bW5SZW9yZGVyRXZlbnQuT05fUkVPUkRFUl9TVEFSVCwge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIGNvbHVtbkRyYWdnZWQ6IHRoaXMuZHJhZ2dpbmdDb2x1bW4sXG4gICAgICAgICAgY29sdW1uSG92ZXJlZDogdGhpcy5kcmFnZ2luZ0NvbHVtblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21SZW9yZGVyU3RhcnRFdmVudCk7XG4gICAgICBjb25zdCBlbFJlY3Q6IGFueSA9IHRoaXMuZHJhZ2dpbmdDb2x1bW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLmRyYWdPZmZzZXRYID0gKGV2ZW50LnBhZ2VYIC0gZWxSZWN0LmxlZnQpIC0gd2luZG93LnNjcm9sbFg7XG4gICAgICB0aGlzLmRyYWdPZmZzZXRZID0gKGV2ZW50LnBhZ2VZIC0gZWxSZWN0LnRvcCkgLSB3aW5kb3cuc2Nyb2xsWTtcblxuICAgICAgdGhpcy5yZW1vdmVEcmFnQW5kRHJvcENvbXBvbmVudCgpO1xuICAgICAgdGhpcy5jcmVhdGVEcmFnQW5kRHJvcENvbXBvbmVudCgpO1xuXG4gICAgICBjb25zdCBkcmFnTkRyb3BYID0gZXZlbnQucGFnZVggLSB0aGlzLmRyYWdPZmZzZXRYO1xuICAgICAgY29uc3QgZHJhZ05Ecm9wWSA9IGV2ZW50LnBhZ2VZIC0gdGhpcy5kcmFnT2Zmc2V0WTtcbiAgICAgIHRoaXMuc2V0RHJhZ0FuZERyb3BQb3NpdGlvbihkcmFnTkRyb3BYLCBkcmFnTkRyb3BZKTtcblxuICAgICAgdGhpcy5hdHRhY2hSZW9yZGVyR2hvc3QodGhpcy5kcmFnZ2luZ0NvbHVtbik7XG4gICAgICB0aGlzLnNldFJlb3JkZXJIaWdobGlnaHRIZWlnaHQodGhpcy5kcmFnZ2luZ0NvbHVtbik7XG5cbiAgICAgIHRoaXMubGFzdERyYWdnZWRPdmVyRWxlbWVudCA9IHRoaXMuZHJhZ2dpbmdDb2x1bW47XG5cbiAgICAgIHRoaXMucGFyZW50R3JvdXBzLmZvckVhY2goKGFyciwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGFyci5pbmRleE9mKHRoaXMubGFzdERyYWdnZWRPdmVyRWxlbWVudCkgIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5sYXN0RHJhZ2dlZEdyb3VwSW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlb3JkZXJIYW5kbGVDb2xPZmZzZXQgPSAocmVvcmRlckhhbmRsZXNVbmRlclBvaW50WzBdIGFzIEhUTUxFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gdGhpcy5kcmFnZ2luZ0NvbHVtbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZEdyb3VwQm91bmRpbmdSZWN0cyA9IHRoaXMucGFyZW50R3JvdXBzW3RoaXMubGFzdERyYWdnZWRHcm91cEluZGV4XS5tYXAoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHJlY3Q6IGFueSA9IHtcbiAgICAgICAgICBsZWZ0OiAoaXRlbSBhcyBIVE1MRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIHRoaXMuZ2V0Q29udGFpbmVyU2Nyb2xsQ291bnQoaXRlbSBhcyBIVE1MRWxlbWVudCksXG4gICAgICAgICAgcmlnaHQ6IGJvdW5kaW5nUmVjdC5yaWdodCArIHdpbmRvdy5zY3JvbGxYLFxuICAgICAgICAgIHRvcDogYm91bmRpbmdSZWN0LnRvcCxcbiAgICAgICAgICBib3R0b206IGJvdW5kaW5nUmVjdC5ib3R0b20sXG4gICAgICAgICAgd2lkdGg6IGJvdW5kaW5nUmVjdC53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGJvdW5kaW5nUmVjdC5oZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgcmVjdC54ID0gcmVjdC5sZWZ0O1xuICAgICAgICByZWN0LnkgPSByZWN0LnRvcDtcbiAgICAgICAgcmVjdC50b0pTT04gPSB7fTtcbiAgICAgICAgcmV0dXJuIHJlY3Q7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNpemVIYW5kbGVzID0gdGhpcy5yZXNpemFibGVHcmlwcztcblxuICAgIGlmIChyZXNpemVIYW5kbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGlmIG5vIGhhbmRsZSBleGlzdHMsIGFsbG93IHdob2xlIHJvdyB0byBiZSByZXNpemFibGVcbiAgICBpZiAocmVzaXplSGFuZGxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByZXNpemFibGVFbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgIGNvbnN0IGVsczogRWxlbWVudFtdID0gcmVzaXphYmxlRWxlbWVudHMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICBsZXQgaGFuZGxlSXRlbTogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgICAgICByZXNpemVIYW5kbGVzLmZvckVhY2gocmVzaXplSGFuZGxlID0+IHtcbiAgICAgICAgICBpZiAoaXRlbSA9PT0gcmVzaXplSGFuZGxlKSB7XG4gICAgICAgICAgICBoYW5kbGVJdGVtID0gcmVzaXplSGFuZGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoYW5kbGVJdGVtICE9PSBudWxsO1xuICAgICAgfSk7XG4gICAgICBpZiAoZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgY29uc3QgZWxlbWVudHM6IEVsZW1lbnRbXSA9IHRoaXMuZ2V0UmVzaXphYmxlRWxlbWVudHMoZXZlbnQpO1xuICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsQ29tcHV0ZWRNaW5XaWR0aCA9IDA7XG4gICAgdGhpcy50b3RhbENvbXB1dGVkV2lkdGggPSAwO1xuICAgIHRoaXMubWluV2lkdGhzID0gW107XG4gICAgdGhpcy5zdGFydGluZ1dpZHRocyA9IFtdO1xuICAgIHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZSA9IHRoaXMuZ2V0UmVzaXphYmxlQ2xhc3NlcyhlbGVtZW50c1swXSk7XG5cbiAgICAvLyBkaXNhbGxvdyByZXNpemluZyB0aGUgcmlnaHRtb3N0IGNvbHVtbiB3aXRoIHBlcmNlbnQgc2l6aW5nXG4gICAgaWYgKHRoaXMucmVzaXplQ29sdW1uV2lkdGhCeVBlcmNlbnQpIHtcbiAgICAgIGNvbnN0IGxhc3RDb2x1bW5DbGFzczogc3RyaW5nID0gdGhpcy5nZXRMYXN0VmlzaWJsZUNvbHVtbkNsYXNzKCk7XG4gICAgICBpZiAodGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplLmluZGV4T2YobGFzdENvbHVtbkNsYXNzKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gICAgXG5cbiAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHdkdGg6IG51bWJlciA9IHRoaXMuZ2V0Q2xhc3NXaWR0aEluUGl4ZWxzKGNsYXNzTmFtZSk7XG4gICAgICBpZiAoIXRoaXMuY29sdW1uSXNIaWRkZW5XaXRoQ2xhc3MoY2xhc3NOYW1lKSkge1xuICAgICAgICB0aGlzLnRvdGFsQ29tcHV0ZWRXaWR0aCArPSB3ZHRoO1xuICAgICAgfVxuICAgICAgdGhpcy5zdGFydGluZ1dpZHRocy5wdXNoKHdkdGgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRNaW5pbXVtV2lkdGhzKCk7XG5cbiAgICB0aGlzLnN0YXJ0WCA9IGV2ZW50LmNsaWVudFg7XG4gICAgdGhpcy5zdGFydFkgPSBldmVudC5jbGllbnRZO1xuXG4gICAgdGhpcy5jb2x1bW5SZXNpemVTdGFydC5lbWl0KHtcbiAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICBjb2x1bW5XaWR0aDogdGhpcy50b3RhbENvbXB1dGVkV2lkdGgsXG4gICAgICBjb2x1bW5NaW5XaWR0aDogdGhpcy50b3RhbENvbXB1dGVkTWluV2lkdGgsXG4gICAgICBjbGFzc2VzQmVpbmdSZXNpemVkOiB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemVcbiAgICB9KTtcbiAgICBjb25zdCBjdXN0b21SZXNpemVTdGFydEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KENvbHVtblJlc2l6ZUV2ZW50Lk9OX1JFU0laRV9TVEFSVCwge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgIGNvbHVtbldpZHRoOiB0aGlzLnRvdGFsQ29tcHV0ZWRXaWR0aCxcbiAgICAgICAgY29sdW1uTWluV2lkdGg6IHRoaXMudG90YWxDb21wdXRlZE1pbldpZHRoLFxuICAgICAgICBjbGFzc2VzQmVpbmdSZXNpemVkOiB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemVcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tUmVzaXplU3RhcnRFdmVudCk7XG4gICAgLy8gc3RvcCBpbnRlcmZlcmVuY2Ugd2l0aCByZW9yZGVyaW5nIGNvbHVtbnNcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDbGFzc1dpZHRoSW5QaXhlbHMoY2xhc3NOYW1lOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGNvbnN0IGNsYXNzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG4gICAgbGV0IHdkdGg6IHN0cmluZyA9IHRoaXMuY2xhc3NXaWR0aHNbY2xhc3NJbmRleF07XG4gICAgaWYgKHRoaXMucmVzaXplQ29sdW1uV2lkdGhCeVBlcmNlbnQpIHtcbiAgICAgIHdkdGggPSB3ZHRoLnJlcGxhY2UoJyUnLCAnJyk7IC8vIHJlbW92ZSBweFxuICAgICAgbGV0IHRvdGFsVGFibGVXaWR0aDogbnVtYmVyID0gdGhpcy52aWV3cG9ydCEuY2xpZW50V2lkdGg7XG4gICAgICB3ZHRoID0gKE51bWJlcih3ZHRoKSAvIDEwMCAqIHRvdGFsVGFibGVXaWR0aCkudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIE51bWJlcih3ZHRoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TWluaW11bVdpZHRocygpOiB2b2lkIHtcbiAgICB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgY29uc3QgZmlyc3RFbDogRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgY2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IG1pbldpZHRoOiBzdHJpbmcgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmaXJzdEVsKS5nZXRQcm9wZXJ0eVZhbHVlKCdtaW4td2lkdGgnKTtcbiAgICAgIGxldCB3ZHRoOiBudW1iZXIgPSBOdW1iZXIobWluV2lkdGguc3Vic3RyaW5nKDAsIG1pbldpZHRoLmxlbmd0aCAtIDIpKTsgLy8gcmVtb3ZlIHB4XG4gICAgICB3ZHRoID0gTnVtYmVyKHdkdGgpIDwgdGhpcy5kZWZhdWx0VGFibGVNaW5XaWR0aCA/IHRoaXMuZGVmYXVsdFRhYmxlTWluV2lkdGggOiB3ZHRoOyAvLyBhY2NvdW50IGZvciBtaW5pbXVtIFREIHNpemUgaW4gdGFibGVzXG4gICAgICBpZiAodGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplLmluZGV4T2YoY2xhc3NOYW1lKSAhPT0gLTEgJiYgIXRoaXMuY29sdW1uSXNIaWRkZW5XaXRoQ2xhc3MoY2xhc3NOYW1lKSkge1xuICAgICAgICB0aGlzLnRvdGFsQ29tcHV0ZWRNaW5XaWR0aCArPSB3ZHRoO1xuICAgICAgfVxuICAgICAgdGhpcy5taW5XaWR0aHMucHVzaCh3ZHRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoUmVvcmRlckdob3N0KGNvbHVtbjogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmRyYWdBbmREcm9wR2hvc3RDb21wb25lbnQ/LnVwZGF0ZVZpZXcoKGNvbHVtbiBhcyBhbnkpLnJlb3JkZXJHaG9zdCwgKGNvbHVtbiBhcyBhbnkpLnJlb3JkZXJHaG9zdENvbnRleHQpXG4gIH1cblxuICBwcml2YXRlIGdldENvbnRhaW5lclNjcm9sbENvdW50KGVsOiBIVE1MRWxlbWVudCB8IG51bGwpOiBudW1iZXIge1xuXG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGxldCBzY3JvbGxYQ291bnQ6IG51bWJlciA9IGVsLnNjcm9sbExlZnQ7XG4gICAgd2hpbGUgKGVsICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBlbCA9IGVsIS5wYXJlbnRFbGVtZW50O1xuICAgICAgc2Nyb2xsWENvdW50ICs9IGVsIS5zY3JvbGxMZWZ0O1xuICAgIH1cblxuICAgIC8vIGluY2x1ZGUgc2Nyb2xsaW5nIG9uIHRhYmxlanMtZ3JpZCBjb21wb25lbnRcbiAgICBzY3JvbGxYQ291bnQgKz0gZWwhLnBhcmVudEVsZW1lbnQhLnNjcm9sbExlZnQ7XG5cbiAgICByZXR1cm4gc2Nyb2xsWENvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBvblBvaW50ZXJNb3ZlKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCB0aHM6IEdyaWREaXJlY3RpdmUgPSBkb2N1bWVudFsnY3VycmVudEdyaWREaXJlY3RpdmUnXTtcblxuICAgIGlmICh0aHMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlb3JkZXJpbmcpIHtcblxuICAgICAgdGhzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICBjb25zdCBkcmFnTkRyb3BYID0gZXZlbnQucGFnZVggLSB0aHMuZHJhZ09mZnNldFg7XG4gICAgICBjb25zdCBkcmFnTkRyb3BZID0gZXZlbnQucGFnZVkgLSB0aHMuZHJhZ09mZnNldFk7XG4gICAgICB0aHMuc2V0RHJhZ0FuZERyb3BQb3NpdGlvbihkcmFnTkRyb3BYLCBkcmFnTkRyb3BZKTtcblxuICAgICAgY29uc3QgdHJ1ZU1vdXNlWDogbnVtYmVyID0gZXZlbnQucGFnZVggLSB0aHMucmVvcmRlckhhbmRsZUNvbE9mZnNldCArIHRocy5nZXRDb250YWluZXJTY3JvbGxDb3VudCh0aHMuZHJhZ2dpbmdDb2x1bW4pO1xuXG4gICAgICBpZiAoIXRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRocy5jb2x1bW5SZW9yZGVyLmVtaXQoe1xuICAgICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgICBjb2x1bW5EcmFnZ2VkOiB0aHMuZHJhZ2dpbmdDb2x1bW4sXG4gICAgICAgIGNvbHVtbkhvdmVyZWQ6IHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGN1c3RvbVJlb3JkZXJFdmVudCA9IG5ldyBDdXN0b21FdmVudChDb2x1bW5SZW9yZGVyRXZlbnQuT05fUkVPUkRFUiwge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBwb2ludGVyRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIGNvbHVtbkRyYWdnZWQ6IHRocy5kcmFnZ2luZ0NvbHVtbixcbiAgICAgICAgICBjb2x1bW5Ib3ZlcmVkOiB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRocy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbVJlb3JkZXJFdmVudCk7XG5cbiAgICAgIGxldCBtb3ZlRGlyZWN0aW9uOiBudW1iZXIgPSAwO1xuICAgICAgbGV0IGN1cnJlbnRSZWN0OiBDbGllbnRSZWN0O1xuICAgICAgbGV0IGN1cnJlbnRDb2xJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgICBmb3IgKGNvbnN0IHJlY3Qgb2YgdGhzLmxhc3REcmFnZ2VkR3JvdXBCb3VuZGluZ1JlY3RzISkge1xuXG4gICAgICAgIGlmICh0cnVlTW91c2VYID4gcmVjdC5sZWZ0ICYmIHRydWVNb3VzZVggPCByZWN0LmxlZnQgKyByZWN0LndpZHRoKSB7XG4gICAgICAgICAgY29uc3QgZWxYOiBudW1iZXIgPSByZWN0LmxlZnQ7XG4gICAgICAgICAgY29uc3QgZWxXOiBudW1iZXIgPSByZWN0LndpZHRoO1xuXG4gICAgICAgICAgaWYgKCh0cnVlTW91c2VYIC0gZWxYKSA+PSBlbFcgLyAyKSB7XG4gICAgICAgICAgICBtb3ZlRGlyZWN0aW9uID0gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW92ZURpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRSZWN0ID0gcmVjdDtcbiAgICAgICAgICBjdXJyZW50Q29sSW5kZXggPSB0aHMubGFzdERyYWdnZWRHcm91cEJvdW5kaW5nUmVjdHMhLmluZGV4T2YocmVjdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRDb2xJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aHMubGFzdERyYWdnZWRPdmVyUmVjdCA9PT0gY3VycmVudFJlY3QhICYmIHRocy5sYXN0TW92ZURpcmVjdGlvbiA9PT0gbW92ZURpcmVjdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aHMubGFzdE1vdmVEaXJlY3Rpb24gPSBtb3ZlRGlyZWN0aW9uO1xuICAgICAgdGhzLmxhc3REcmFnZ2VkT3ZlclJlY3QgPSBjdXJyZW50UmVjdCE7XG5cbiAgICAgIHRocy5yZW1vdmVFbGVtZW50SGlnaGxpZ2h0KHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50KTtcbiAgICAgIHRocy5yZW1vdmVIaWdobGlnaHRzKHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50LCBtb3ZlRGlyZWN0aW9uKTtcblxuICAgICAgY29uc3QgZHJhZ2dhYmxlSW5Db2x1bW46IEVsZW1lbnQgPSB0aHMucGFyZW50R3JvdXBzW3Rocy5sYXN0RHJhZ2dlZEdyb3VwSW5kZXhdW2N1cnJlbnRDb2xJbmRleF07XG5cbiAgICAgIHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50ID0gZHJhZ2dhYmxlSW5Db2x1bW47XG5cbiAgICAgIGxldCBjb2xSYW5nZURyYWdnZWRQYXJlbnRJbmQ6IG51bWJlciA9IC0xO1xuICAgICAgbGV0IGNvbFJhbmdlRHJhZ2dlZENoaWxkSW5kOiBudW1iZXIgPSAtMTtcbiAgICAgIGxldCBjb2xSYW5nZURyb3BwZWRQYXJlbnRJbmQ6IG51bWJlciA9IC0xO1xuICAgICAgbGV0IGNvbFJhbmdlRHJvcHBlZENoaWxkSW5kOiBudW1iZXIgPSAtMTtcbiAgICAgIGxldCBkcmFnZ2VkSW5kOiBudW1iZXIgPSAtMTtcbiAgICAgIGxldCBkcm9wcGVkSW5kOiBudW1iZXIgPSAtMTtcbiAgICAgIGxldCBkcmFnZ2VkR3JvdXA6IElDb2x1bW5EYXRhW10gfCBFbGVtZW50W10gfCBudWxsID0gbnVsbDtcblxuICAgICAgY29uc3QgcEdyb3VwOiBhbnkgPSB0aHMuY29sRGF0YUdyb3Vwcy5mb3JFYWNoKChncm91cDogSUNvbHVtbkRhdGFbXSwgZ3JvdXBJbmQ6IG51bWJlcikgPT5cbiAgICAgICAgZ3JvdXAuZm9yRWFjaCgoY29sdW1uRGF0YTogSUNvbHVtbkRhdGEsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW06IEVsZW1lbnQgfCBudWxsID0gY29sdW1uRGF0YS5jaGlsZDtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSB0aHMuZ2V0UmVsYXRlZEhlYWRlcih0aHMuZHJhZ2dpbmdDb2x1bW4gYXMgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgIGNvbFJhbmdlRHJhZ2dlZFBhcmVudEluZCA9IGdyb3VwSW5kO1xuICAgICAgICAgICAgICBjb2xSYW5nZURyYWdnZWRDaGlsZEluZCA9IHRocy5nZXRSYW5nZVBvc2l0aW9uKGNvbHVtbkRhdGEpOyAvLyBpbmRleDtcbiAgICAgICAgICAgICAgZHJhZ2dlZEluZCA9IGluZGV4O1xuICAgICAgICAgICAgICBkcmFnZ2VkR3JvdXAgPSBncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtID09PSB0aHMuZ2V0UmVsYXRlZEhlYWRlcih0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgY29sUmFuZ2VEcm9wcGVkUGFyZW50SW5kID0gZ3JvdXBJbmQ7XG4gICAgICAgICAgICAgIGNvbFJhbmdlRHJvcHBlZENoaWxkSW5kID0gdGhzLmdldFJhbmdlUG9zaXRpb24oY29sdW1uRGF0YSk7IC8vIGluZGV4O1xuICAgICAgICAgICAgICBkcm9wcGVkSW5kID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBpZiAodGhzLmRyYWdnaW5nQ29sdW1uID09PSB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgcGFyZW50UmFuZ2VzOiBudW1iZXJbXVtdIHwgbnVsbCA9IG51bGw7XG4gICAgICBjb25zdCB0ZW1wUmFuZ2VzOiBudW1iZXJbXVtdW10gPSB0aHMuY29sUmFuZ2VHcm91cHMuY29uY2F0KCk7XG4gICAgICBsZXQgcGFyZW50UmFuZ2VJbmRleDogbnVtYmVyID0gLTE7XG4gICAgICB0ZW1wUmFuZ2VzLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuICAgICAgdGVtcFJhbmdlcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoIXBhcmVudFJhbmdlcyAmJiBpdGVtLmxlbmd0aCA8IGRyYWdnZWRHcm91cCEubGVuZ3RoKSB7XG4gICAgICAgICAgcGFyZW50UmFuZ2VzID0gaXRlbTtcbiAgICAgICAgICBwYXJlbnRSYW5nZUluZGV4ID0gdGhzLmNvbFJhbmdlR3JvdXBzLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgZnJvbU9yZGVyOiBudW1iZXIgPSAoY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQgKyAxKTtcbiAgICAgIGNvbnN0IHRvT3JkZXI6IG51bWJlciA9IChjb2xSYW5nZURyb3BwZWRDaGlsZEluZCArIDEpO1xuXG4gICAgICAvLyBpZiBoYXMgdG8gc3RheSB3aXRoaW4gcmFuZ2VzLCBnZXQgcmFuZ2VzIGFuZCBzd2FwXG4gICAgICBpZiAocGFyZW50UmFuZ2VzICE9PSBudWxsKSB7XG4gICAgICAgIHRocy5jb2xSYW5nZUdyb3Vwc1twYXJlbnRSYW5nZUluZGV4XS5mb3JFYWNoKFxuICAgICAgICAgIHJhbmdlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvd1JhbmdlOiBudW1iZXIgPSByYW5nZVswXTtcbiAgICAgICAgICAgIGNvbnN0IGhpZ2hSYW5nZTogbnVtYmVyID0gcmFuZ2VbMV07XG4gICAgICAgICAgICBpZiAoZnJvbU9yZGVyID49IGxvd1JhbmdlICYmIGZyb21PcmRlciA8IGhpZ2hSYW5nZSAmJiB0b09yZGVyID49IGxvd1JhbmdlICYmIHRvT3JkZXIgPCBoaWdoUmFuZ2UpIHtcbiAgICAgICAgICAgICAgaWYgKGNvbFJhbmdlRHJhZ2dlZFBhcmVudEluZCA9PT0gY29sUmFuZ2VEcm9wcGVkUGFyZW50SW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgIHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1yaWdodCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQtbGVmdCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHMuZWxlbWVudHNXaXRoSGlnaGxpZ2h0LnB1c2goeyBlbDogdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQsIG1vdmVEaXJlY3Rpb24gfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kID09PSBjb2xSYW5nZURyb3BwZWRQYXJlbnRJbmQpIHtcbiAgICAgICAgICBpZiAobW92ZURpcmVjdGlvbiA9PT0gMSkge1xuICAgICAgICAgICAgdGhzLmxhc3REcmFnZ2VkT3ZlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LXJpZ2h0Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1sZWZ0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocy5lbGVtZW50c1dpdGhIaWdobGlnaHQucHVzaCh7IGVsOiB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudCwgbW92ZURpcmVjdGlvbiB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIXRocy5kcmFnZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbW91c2VPZmZzZXQ6IG51bWJlciA9IE1hdGgucm91bmQoZXZlbnQuY2xpZW50WCkgLSBNYXRoLnJvdW5kKHRocy5zdGFydFgpO1xuICAgIGNvbnN0IHdpZHRoc05lZWRVcGRhdGluZzogYm9vbGVhbiA9IE1hdGgucm91bmQoZXZlbnQuY2xpZW50WCkgIT09IHRocy5zdGFydFg7XG4gICAgdGhzLnN0YXJ0WCA9IE1hdGgucm91bmQoZXZlbnQuY2xpZW50WCk7IC8vIHJlc2V0IHN0YXJ0aW5nIFhcbiAgICBsZXQgbmV3V2lkdGg6IG51bWJlciA9IHRocy50b3RhbENvbXB1dGVkV2lkdGggKyBtb3VzZU9mZnNldDtcbiAgICBjb25zdCBhbGxvd2FibGVXaWR0aENoYW5nZTogbnVtYmVyID0gbmV3V2lkdGggLSB0aHMudG90YWxDb21wdXRlZE1pbldpZHRoO1xuXG4gICAgaWYgKGFsbG93YWJsZVdpZHRoQ2hhbmdlIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAod2lkdGhzTmVlZFVwZGF0aW5nKSB7XG4gICAgICB0aHMudXBkYXRlV2lkdGhzKG5ld1dpZHRoKTtcbiAgICB9XG4gICAgdGhzLmNvbHVtblJlc2l6ZS5lbWl0KHtcbiAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICBjb2x1bW5XaWR0aDogdGhzLnRvdGFsQ29tcHV0ZWRXaWR0aCxcbiAgICAgIGNvbHVtbk1pbldpZHRoOiB0aHMudG90YWxDb21wdXRlZE1pbldpZHRoXG4gICAgfSk7XG4gICAgY29uc3QgY3VzdG9tUmVzaXplRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoQ29sdW1uUmVzaXplRXZlbnQuT05fUkVTSVpFLCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgICAgY29sdW1uV2lkdGg6IHRocy50b3RhbENvbXB1dGVkV2lkdGgsXG4gICAgICAgIGNvbHVtbk1pbldpZHRoOiB0aHMudG90YWxDb21wdXRlZE1pbldpZHRoXG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tUmVzaXplRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRMYXN0VmlzaWJsZUNvbHVtbkNsYXNzKCk6IHN0cmluZyB7XG4gICAgbGV0IGhpZ2hlc3RPcmRlckluZGV4OiBudW1iZXIgPSAwO1xuICAgIGxldCBsYXN0VmlzaWJsZUNvbHVtbkNsYXNzOiBzdHJpbmcgPSAnJztcblxuICAgIHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWVJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IGdyaWRPcmRlckluZGV4OiBudW1iZXIgPSB0aGlzLmdyaWRPcmRlci5pbmRleE9mKGNsYXNzTmFtZUluZGV4ICsgMSk7XG4gICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoZ3JpZE9yZGVySW5kZXggKyAxKSA9PT0gLTEpIHtcbiAgICAgICAgaWYgKGdyaWRPcmRlckluZGV4ID4gaGlnaGVzdE9yZGVySW5kZXgpIHtcbiAgICAgICAgICBoaWdoZXN0T3JkZXJJbmRleCA9IGdyaWRPcmRlckluZGV4O1xuICAgICAgICAgIGxhc3RWaXNpYmxlQ29sdW1uQ2xhc3MgPSBjbGFzc05hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbGFzdFZpc2libGVDb2x1bW5DbGFzcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmFuZ2VQb3NpdGlvbihjb2x1bW5EYXRhOiBJQ29sdW1uRGF0YSk6IG51bWJlciB7XG4gICAgbGV0IHN1Ykdyb3VwczogSUNvbHVtbkRhdGFbXSA9IGNvbHVtbkRhdGEuc3ViR3JvdXBzO1xuICAgIGxldCBjaGlsZDogSUNvbHVtbkRhdGEgPSBjb2x1bW5EYXRhO1xuICAgIHdoaWxlIChzdWJHcm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgY2hpbGQgPSBzdWJHcm91cHNbMF07XG4gICAgICBzdWJHcm91cHMgPSBjaGlsZC5zdWJHcm91cHM7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZC5udGhDaGlsZCAtIDE7XG4gIH1cblxuICBwcml2YXRlIGNvbHVtbklzSGlkZGVuV2l0aENsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY2xhc3NOYW1lSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG4gICAgY29uc3QgZ3JpZE9yZGVySW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZE9yZGVyLmluZGV4T2YoY2xhc3NOYW1lSW5kZXggKyAxKTtcbiAgICByZXR1cm4gdGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoZ3JpZE9yZGVySW5kZXggKyAxKSAhPT0gLTE7XG4gIH1cblxuICBwcml2YXRlIGdldFRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlKHNvcnRhYmxlV2lkdGhzOiBJU29ydGFibGVXaWR0aEl0ZW1bXSk6IG51bWJlciB7XG4gICAgY29uc3QgbGVuOiBudW1iZXIgPSBzb3J0YWJsZVdpZHRocy5sZW5ndGg7XG4gICAgbGV0IHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlOiBudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW06IGFueSA9IHNvcnRhYmxlV2lkdGhzW2ldO1xuICAgICAgaWYgKCF0aGlzLmNvbHVtbklzSGlkZGVuV2l0aENsYXNzKGl0ZW0uY2xhc3NOYW1lKSkge1xuICAgICAgICB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZSsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG90YWxHcm91cGVkQ29sdW1uc1Zpc2libGU7XG4gIH1cblxuICBwcml2YXRlIGdldEZpcnN0R3JpZE9yZGVySW5kZXhBZnRlckNvbHVtbkdyb3VwKHNvcnRhYmxlV2lkdGhHcm91cDogSVNvcnRhYmxlV2lkdGhJdGVtW10pOiBudW1iZXIge1xuICAgIGxldCBtYXhJbmRleDogbnVtYmVyID0gLTE7XG4gICAgc29ydGFibGVXaWR0aEdyb3VwLmZvckVhY2goY2xhc3NJdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvbHVtbkluZHggPSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMuaW5kZXhPZihjbGFzc0l0ZW0uY2xhc3NOYW1lKTtcbiAgICAgIGNvbnN0IGdyaWRPcmRlckluZGV4ID0gdGhpcy5ncmlkT3JkZXIuaW5kZXhPZihjb2x1bW5JbmR4ICsgMSk7XG4gICAgICBpZiAobWF4SW5kZXggPCBncmlkT3JkZXJJbmRleCkge1xuICAgICAgICBtYXhJbmRleCA9IGdyaWRPcmRlckluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtYXhJbmRleCArIDE7XG4gIH1cblxuICAvLyByZXR1cm5zIGEgbnVtYmVyIGluIHBlcmNlbnQgbW92ZWQgdHdvIGRlY2ltYWwgcGxhY2VzIG92ZXIgKDEwLjI0NSBpcyBlcXVhbCB0byAxMC4yNDUlKVxuICBwcml2YXRlIGdldFBvc3RDb2x1bW5XaWR0aFRvdGFsKHN0YXJ0aW5nSW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGkgPSBzdGFydGluZ0luZGV4OyBpIDwgdGhpcy5ncmlkT3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNsc0luZGV4ID0gdGhpcy5ncmlkT3JkZXJbaV0gLSAxO1xuICAgICAgbGV0IHBlcmM6IG51bWJlciA9IE51bWJlcih0aGlzLmNsYXNzV2lkdGhzW2Nsc0luZGV4XS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJykpO1xuICAgICAgaWYgKHRoaXMuaGlkZGVuQ29sdW1uSW5kaWNlcy5pbmRleE9mKGkgKyAxKSA9PT0gLTEpIHtcbiAgICAgICAgY291bnQgKz0gcGVyYztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLy8gcmV0dXJucyBhIG51bWJlciBpbiBwZXJjZW50IG1vdmVkIHR3byBkZWNpbWFsIHBsYWNlcyBvdmVyICgxMC4yNDUgaXMgZXF1YWwgdG8gMTAuMjQ1JSlcbiAgcHJpdmF0ZSBnZXRQb3N0Q29sdW1uTWluaW11bVdpZHRoVG90YWwoc3RhcnRpbmdJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0aW5nSW5kZXg7IGkgPCB0aGlzLmdyaWRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2xzSW5kZXggPSB0aGlzLmdyaWRPcmRlcltpXSAtIDE7XG4gICAgICBsZXQgcGVyYzogbnVtYmVyID0gTnVtYmVyKHRoaXMubWluV2lkdGhzW2Nsc0luZGV4XS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJykpO1xuICAgICAgaWYgKHRoaXMuaGlkZGVuQ29sdW1uSW5kaWNlcy5pbmRleE9mKGkgKyAxKSA9PT0gLTEpIHtcbiAgICAgICAgY291bnQgKz0gcGVyYztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLy8gcmV0dXJucyBhIG51bWJlciBpbiBwZXJjZW50IG1vdmVkIHR3byBkZWNpbWFsIHBsYWNlcyBvdmVyICgxMC4yNDUgaXMgZXF1YWwgdG8gMTAuMjQ1JSlcbiAgcHJpdmF0ZSBnZXRQcmV2aW91c0NvbHVtbldpZHRoVG90YWwoc29ydGFibGVXaWR0aEdyb3VwOiBJU29ydGFibGVXaWR0aEl0ZW1bXSk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCBtaW5JbmRleCA9IEluZmluaXR5O1xuICAgIHNvcnRhYmxlV2lkdGhHcm91cC5mb3JFYWNoKGNsYXNzSXRlbSA9PiB7XG4gICAgICBjb25zdCBjb2x1bW5JbmR4ID0gdGhpcy5ncmlkVGVtcGxhdGVDbGFzc2VzLmluZGV4T2YoY2xhc3NJdGVtLmNsYXNzTmFtZSk7XG4gICAgICBjb25zdCBncmlkT3JkZXJJbmRleCA9IHRoaXMuZ3JpZE9yZGVyLmluZGV4T2YoY29sdW1uSW5keCArIDEpO1xuICAgICAgaWYgKG1pbkluZGV4ID4gZ3JpZE9yZGVySW5kZXgpIHtcbiAgICAgICAgbWluSW5kZXggPSBncmlkT3JkZXJJbmRleDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbkluZGV4OyBpKyspIHtcbiAgICAgIGNvbnN0IGNsYXNzSW5keDogbnVtYmVyID0gdGhpcy5ncmlkT3JkZXJbaV0gLSAxO1xuICAgICAgY29uc3Qgd2R0aDogbnVtYmVyID0gTnVtYmVyKHRoaXMuY2xhc3NXaWR0aHNbY2xhc3NJbmR4XS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJykpO1xuICAgICAgY291bnQgKz0gd2R0aDtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVXaWR0aHNJblBlcmNlbnQobmV3V2lkdGg6IG51bWJlciwgc29ydGFibGVXaWR0aHM6IElTb3J0YWJsZVdpZHRoSXRlbVtdLCB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZTogbnVtYmVyLCBzb3J0YWJsZVdpZHRoR3JvdXA6IElTb3J0YWJsZVdpZHRoSXRlbVtdKTogdm9pZCB7XG5cbiAgICBsZXQgdG90YWxUYWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLnZpZXdwb3J0IS5jbGllbnRXaWR0aDtcbiAgICBsZXQgbmV3V2lkdGhJblBlcmNlbnQ6IG51bWJlciA9IG5ld1dpZHRoIC8gdG90YWxUYWJsZVdpZHRoICogMTAwO1xuICAgIFxuICAgIGNvbnN0IGNsYXNzTWluV2lkdGhzOiBudW1iZXJbXSA9IHNvcnRhYmxlV2lkdGhzLm1hcCgoaXRlbTogSVNvcnRhYmxlV2lkdGhJdGVtKSA9PiBpdGVtLm1pbldpZHRoKTtcbiAgICBjb25zdCBncm91cE1pbldpZHRoQ2FsYzogbnVtYmVyID0gY2xhc3NNaW5XaWR0aHMucmVkdWNlKChwcmV2OiBudW1iZXIsIGN1cnI6IG51bWJlcikgPT4gcHJldiArIGN1cnIpO1xuICAgIFxuICAgIGNvbnN0IGZpcnN0R3JpZE9yZGVySW5kZXhBZnRlckNvbHVtbkdyb3VwOiBudW1iZXIgPSB0aGlzLmdldEZpcnN0R3JpZE9yZGVySW5kZXhBZnRlckNvbHVtbkdyb3VwKHNvcnRhYmxlV2lkdGhHcm91cCk7XG4gICAgY29uc3QgY29sc1Bhc3RNaW5XaWR0aENhbGM6IG51bWJlciA9IHRoaXMuZ2V0UG9zdENvbHVtbk1pbmltdW1XaWR0aFRvdGFsKGZpcnN0R3JpZE9yZGVySW5kZXhBZnRlckNvbHVtbkdyb3VwKTtcbiAgICBjb25zdCBjb2xzUGFzdE1pbldpZHRoSW5QZXJjZW50OiBudW1iZXIgPSBjb2xzUGFzdE1pbldpZHRoQ2FsYyAvIHRvdGFsVGFibGVXaWR0aCAqIDEwMDtcbiAgICBjb25zdCBjb2xzUGFzdFdpZHRoUGVyYzogbnVtYmVyID0gdGhpcy5nZXRQb3N0Q29sdW1uV2lkdGhUb3RhbChmaXJzdEdyaWRPcmRlckluZGV4QWZ0ZXJDb2x1bW5Hcm91cCk7XG5cbiAgICBsZXQgcHJldkNvbFBlcmNlbnRUb3RhbDogbnVtYmVyID0gMDtcbiAgICBwcmV2Q29sUGVyY2VudFRvdGFsID0gdGhpcy5nZXRQcmV2aW91c0NvbHVtbldpZHRoVG90YWwoc29ydGFibGVXaWR0aEdyb3VwKTtcbiAgICBjb25zdCBwZXJjZW50TW92ZWQ6IG51bWJlciA9IChwcmV2Q29sUGVyY2VudFRvdGFsICsgbmV3V2lkdGhJblBlcmNlbnQgKyBjb2xzUGFzdFdpZHRoUGVyYykgLSAxMDA7XG5cbiAgICBpZiAocHJldkNvbFBlcmNlbnRUb3RhbCArIG5ld1dpZHRoSW5QZXJjZW50ICsgY29sc1Bhc3RNaW5XaWR0aEluUGVyY2VudCA+IDEwMCkge1xuICAgICAgY29uc3QgYWN0dWFsUGVyQ2FuTW92ZTogbnVtYmVyID0gMTAwIC0gKHByZXZDb2xQZXJjZW50VG90YWwgKyBjb2xzUGFzdE1pbldpZHRoSW5QZXJjZW50KTtcbiAgICAgIG5ld1dpZHRoSW5QZXJjZW50ID0gYWN0dWFsUGVyQ2FuTW92ZTtcbiAgICB9XG4gICAgaWYgKG5ld1dpZHRoIDwgZ3JvdXBNaW5XaWR0aENhbGMpIHtcbiAgICAgIG5ld1dpZHRoSW5QZXJjZW50ID0gZ3JvdXBNaW5XaWR0aENhbGMgLyB0b3RhbFRhYmxlV2lkdGggKiAxMDA7XG4gICAgfVxuXG4gICAgc29ydGFibGVXaWR0aHMuc29ydCgoaXRlbTE6IGFueSwgaXRlbTI6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgd2R0aDE6IG51bWJlciA9IGl0ZW0xLndpZHRoO1xuICAgICAgY29uc3Qgd2R0aDI6IG51bWJlciA9IGl0ZW0yLndpZHRoO1xuICAgICAgaWYgKHdkdGgxID09PSB3ZHRoMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB3ZHRoMSA8IHdkdGgyID8gLTEgOiAxO1xuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IG1hcHBlZEdyb3VwV2lkdGhzSW5QaXhlbHM6IG51bWJlcltdID0gc29ydGFibGVXaWR0aHMubWFwKGl0ZW0gPT4gaXRlbS53aWR0aCk7XG4gICAgY29uc3QgdG90YWxQcmV2R3JvdXBXaWR0aHM6IG51bWJlciA9IG1hcHBlZEdyb3VwV2lkdGhzSW5QaXhlbHMucmVkdWNlKChwcmV2OiBudW1iZXIsIGN1cnI6IG51bWJlcikgPT4gcHJldiArIGN1cnIpO1xuICAgIGNvbnN0IGRpc3BlcnNlZFBlcmNzOiBudW1iZXJbXSA9IHNvcnRhYmxlV2lkdGhzLm1hcChpdGVtID0+IGl0ZW0ud2lkdGggLyB0b3RhbFByZXZHcm91cFdpZHRocyk7XG4gICAgY29uc3QgdG90YWxQZXJjTW92ZWQ6IG51bWJlciA9IG5ld1dpZHRoSW5QZXJjZW50IC0gKHRvdGFsUHJldkdyb3VwV2lkdGhzIC8gdG90YWxUYWJsZVdpZHRoICogMTAwKTtcblxuXG4gICAgbGV0IGFkZGl0aW9uYWxQZXJjZW50RnJvbUNvbHVtbnNUb1NtYWxsOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHNvcnRhYmxlV2lkdGhzTGVuOiBudW1iZXIgPSBzb3J0YWJsZVdpZHRocy5sZW5ndGg7XG4gICAgc29ydGFibGVXaWR0aHMuZm9yRWFjaCgoaXRlbTogSVNvcnRhYmxlV2lkdGhJdGVtLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBjb25zdCBjbGFzc0luZGV4OiBudW1iZXIgPSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMuaW5kZXhPZihpdGVtLmNsYXNzTmFtZSk7XG4gICAgICBjb25zdCBtaW5XaWR0aEluUGVyY2VudDogbnVtYmVyID0gdGhpcy5taW5XaWR0aHNbY2xhc3NJbmRleF0gLyB0b3RhbFRhYmxlV2lkdGggKiAxMDA7XG4gICAgXG4gICAgICBsZXQgY2FsY3VsYXRlZFBlcmNlbnQ6IG51bWJlciA9IGRpc3BlcnNlZFBlcmNzW2luZGV4XSAqIG5ld1dpZHRoSW5QZXJjZW50O1xuICAgICAgaWYgKGNhbGN1bGF0ZWRQZXJjZW50IDwgbWluV2lkdGhJblBlcmNlbnQpIHtcbiAgICAgICAgYWRkaXRpb25hbFBlcmNlbnRGcm9tQ29sdW1uc1RvU21hbGwgKz0gbWluV2lkdGhJblBlcmNlbnQgLSBjYWxjdWxhdGVkUGVyY2VudDtcbiAgICAgICAgY2FsY3VsYXRlZFBlcmNlbnQgPSBtaW5XaWR0aEluUGVyY2VudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zUmVtYWluaW5nOiBudW1iZXIgPSBzb3J0YWJsZVdpZHRoc0xlbiAtIGluZGV4IC0gMTtcbiAgICAgICAgaWYgKGl0ZW1zUmVtYWluaW5nICE9PSAwKSB7XG4gICAgICAgICAgY29uc3QgZXh0cmFBbXRUb1JlbW92ZTogbnVtYmVyID0gYWRkaXRpb25hbFBlcmNlbnRGcm9tQ29sdW1uc1RvU21hbGwgLyBpdGVtc1JlbWFpbmluZztcbiAgICAgICAgICBjYWxjdWxhdGVkUGVyY2VudCAtPSBleHRyYUFtdFRvUmVtb3ZlO1xuICAgICAgICAgIGFkZGl0aW9uYWxQZXJjZW50RnJvbUNvbHVtbnNUb1NtYWxsIC09IGV4dHJhQW10VG9SZW1vdmU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbFdpZHRoSW5QZXJjZW50OiBzdHJpbmcgPSBjYWxjdWxhdGVkUGVyY2VudC50b1N0cmluZygpICsgJyUnO1xuICAgICAgdGhpcy5jbGFzc1dpZHRoc1tjbGFzc0luZGV4XSA9IGNvbFdpZHRoSW5QZXJjZW50O1xuICAgIH0pO1xuXG4gICAgbGV0IHJlbWFpbmluZ1BlcmNUb0Rpc3BlcnNlOiBudW1iZXIgPSB0b3RhbFBlcmNNb3ZlZCArIGFkZGl0aW9uYWxQZXJjZW50RnJvbUNvbHVtbnNUb1NtYWxsO1xuICAgIGNvbnN0IG1heFBlcmNzQ2FuTW92ZVBlckNvbDogYW55W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gZmlyc3RHcmlkT3JkZXJJbmRleEFmdGVyQ29sdW1uR3JvdXA7IGkgPCB0aGlzLmdyaWRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2xzSW5kZXggPSB0aGlzLmdyaWRPcmRlcltpXSAtIDE7XG4gICAgICBsZXQgcGVyYzogbnVtYmVyID0gTnVtYmVyKHRoaXMuY2xhc3NXaWR0aHNbY2xzSW5kZXhdLnRvU3RyaW5nKCkucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICBsZXQgbWluV2lkdGhQZXJjOiBudW1iZXIgPSAgKHRoaXMubWluV2lkdGhzW2Nsc0luZGV4XSAvIHRvdGFsVGFibGVXaWR0aCAqIDEwMCk7XG4gICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaSArIDEpID09PSAtMSkge1xuICAgICAgICBtYXhQZXJjc0Nhbk1vdmVQZXJDb2wucHVzaCh7IFxuICAgICAgICAgIG1vdmVBbXQ6IHBlcmNlbnRNb3ZlZCA+IDAgPyBwZXJjIC0gbWluV2lkdGhQZXJjIDogcGVyYyxcbiAgICAgICAgICBjbGFzc0luZGV4OiBjbHNJbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbFBlcmNzQ2FuTW92ZTogbnVtYmVyID0gbWF4UGVyY3NDYW5Nb3ZlUGVyQ29sLnJlZHVjZSgocHJldjogbnVtYmVyLCBjdXJyOiBhbnkpID0+IHByZXYgKyBjdXJyLm1vdmVBbXQsIDAuMDAwMDAwMSk7XG4gICAgbWF4UGVyY3NDYW5Nb3ZlUGVyQ29sLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29uc3QgcGVyY09mVG90YWxNb3ZlbWVudEFsbG93ZWQ6IG51bWJlciA9IGl0ZW0ubW92ZUFtdCAvIHRvdGFsUGVyY3NDYW5Nb3ZlO1xuICAgICAgY29uc3QgcGVyY09mUmVtYWluaW5nRGlzcGVyc2VtZW50OiBudW1iZXIgPSBwZXJjT2ZUb3RhbE1vdmVtZW50QWxsb3dlZCAqIHJlbWFpbmluZ1BlcmNUb0Rpc3BlcnNlO1xuICAgICAgY29uc3QgcGVyYzogbnVtYmVyID0gTnVtYmVyKHRoaXMuY2xhc3NXaWR0aHNbaXRlbS5jbGFzc0luZGV4XS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJykpO1xuICAgICAgY29uc3QgZGlzcGVyc2VkV2lkdGg6IG51bWJlciA9IHBlcmMgLSBwZXJjT2ZSZW1haW5pbmdEaXNwZXJzZW1lbnQ7XG4gICAgICB0aGlzLmNsYXNzV2lkdGhzW2l0ZW0uY2xhc3NJbmRleF0gPSBkaXNwZXJzZWRXaWR0aCArICclJztcbiAgICB9KTtcblxuICAgIG5ld1dpZHRoID0gbmV3V2lkdGhJblBlcmNlbnQgLyAxMDAgKiB0b3RhbFRhYmxlV2lkdGg7XG4gICAgbGV0IGFtb3VudE1vdmVkOiBudW1iZXIgPSBuZXdXaWR0aCAtIHRvdGFsUHJldkdyb3VwV2lkdGhzO1xuICAgIGFtb3VudE1vdmVkID0gTWF0aC5yb3VuZChhbW91bnRNb3ZlZCAqIDEwMCkgLyAxMDA7IC8vIHJvdW5kIHRvIDIgZGVjaW1hbCBwb2ludHNcbiAgICB0aGlzLnRvdGFsQ29tcHV0ZWRXaWR0aCArPSBhbW91bnRNb3ZlZDtcblxuICAgIGNvbnN0IGdyaWRUZW1wbGF0ZUNvbHVtbnM6IHN0cmluZyA9IHRoaXMuY29uc3RydWN0R3JpZFRlbXBsYXRlQ29sdW1ucygpO1xuICAgIHRoaXMuZ3JpZFRlbXBsYXRlVHlwZXMuZm9yRWFjaChzdHlsZU9iaiA9PiB7ICAgICAgXG4gICAgICBzdHlsZU9iai5zdHlsZS5pbm5lckhUTUwgPSB0aGlzLmlkICsgJyAuJyArIHRoaXMucmVvcmRlcmFibGVDbGFzcyArICcgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6JyArIGdyaWRUZW1wbGF0ZUNvbHVtbnMgKyAnOyB9JztcbiAgICAgIHRoaXMuc2V0U3R5bGVDb250ZW50KCk7XG4gICAgfSk7XG4gICBcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlV2lkdGhzSW5QaXhlbHMobmV3V2lkdGg6IG51bWJlciwgc29ydGFibGVXaWR0aHM6IElTb3J0YWJsZVdpZHRoSXRlbVtdLCB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZTogbnVtYmVyKTogdm9pZCB7XG5cbiAgICBsZXQgcmVtYWluaW5nV2lkdGg6IG51bWJlciA9IHRoaXMudG90YWxDb21wdXRlZFdpZHRoIC0gbmV3V2lkdGg7XG4gICAgXG4gICAgc29ydGFibGVXaWR0aHMuZm9yRWFjaCgoaXRlbTogSVNvcnRhYmxlV2lkdGhJdGVtKSA9PiB7XG4gICAgICBjb25zdCBtYXhQZXJjT2ZSZW1haW5pbmc6IG51bWJlciA9IDEgLyB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZTtcbiAgICAgIGxldCBhbW91bnRNb3ZlZDogbnVtYmVyID0gMDtcbiAgICAgIGNvbnN0IHJlc2l6ZUlEOiBzdHJpbmcgPSB0aGlzLmlkICsgJyAuJyArIGl0ZW0uY2xhc3NOYW1lO1xuXG4gICAgICBpZiAoaXRlbS53aWR0aCAtIGl0ZW0ubWluV2lkdGggPCBtYXhQZXJjT2ZSZW1haW5pbmcgKiByZW1haW5pbmdXaWR0aCkge1xuICAgICAgICBhbW91bnRNb3ZlZCA9IGl0ZW0ud2lkdGggLSBpdGVtLm1pbldpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW1vdW50TW92ZWQgPSBtYXhQZXJjT2ZSZW1haW5pbmcgKiByZW1haW5pbmdXaWR0aDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgYW1vdW50TW92ZWQgPSBNYXRoLnJvdW5kKGFtb3VudE1vdmVkICogMTAwKSAvIDEwMDsgLy8gcm91bmQgdG8gMiBkZWNpbWFsIHBvaW50c1xuXG4gICAgICBjb25zdCBjbGFzc0luZGV4OiBudW1iZXIgPSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMuaW5kZXhPZihpdGVtLmNsYXNzTmFtZSk7XG4gICAgICB0aGlzLmNsYXNzV2lkdGhzW2NsYXNzSW5kZXhdID0gKGl0ZW0ud2lkdGggLSBhbW91bnRNb3ZlZCk7XG4gICAgICBcbiAgICAgIGNvbnN0IG1hcmt1cEl0ZW06IGFueSA9IHRoaXMuc3R5bGVzQnlDbGFzcy5maWx0ZXIoc3R5bGUgPT4gc3R5bGUuaWQgPT09IHJlc2l6ZUlEKVswXTtcbiAgICAgIGxldCBtYXJrdXAgPSByZXNpemVJRCArICcgeyB3aWR0aDogJyArIChpdGVtLndpZHRoIC0gYW1vdW50TW92ZWQpICsgJ3B4IH0nO1xuICAgICAgbWFya3VwSXRlbS5tYXJrdXAgPSBtYXJrdXA7XG4gICAgICBtYXJrdXBJdGVtLndpZHRoID0gKGl0ZW0ud2lkdGggLSBhbW91bnRNb3ZlZCkudG9TdHJpbmcoKTtcblxuICAgICAgdGhpcy50b3RhbENvbXB1dGVkV2lkdGggLT0gYW1vdW50TW92ZWQ7XG4gICAgfSk7XG5cbiAgICBjb25zdCBncmlkVGVtcGxhdGVDb2x1bW5zOiBzdHJpbmcgPSB0aGlzLmNvbnN0cnVjdEdyaWRUZW1wbGF0ZUNvbHVtbnMoKTtcblxuICAgIHRoaXMuZ3JpZFRlbXBsYXRlVHlwZXMuZm9yRWFjaChzdHlsZU9iaiA9PiB7XG4gICAgICBzdHlsZU9iai5zdHlsZS5pbm5lckhUTUwgPSB0aGlzLmlkICsgJyAuJyArIHRoaXMucmVvcmRlcmFibGVDbGFzcyArICcgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6JyArIGdyaWRUZW1wbGF0ZUNvbHVtbnMgKyAnOyB9JztcbiAgICAgIHRoaXMuc2V0U3R5bGVDb250ZW50KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGZpdFdpZHRoc1RvT25lSHVuZHJlZFBlcmNlbnQoKTogdm9pZCB7XG4gICAgY29uc3QgbnVtZXJpY2FsV2lkdGhzOiBudW1iZXJbXSA9IHRoaXMuY2xhc3NXaWR0aHMubWFwKCh3ZHRoOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IE51bWJlcih3ZHRoLnJlcGxhY2UoJyUnLCAnJykpKTtcbiAgICBjb25zdCB3aWR0aFRvdGFsOiBudW1iZXIgPSBudW1lcmljYWxXaWR0aHMucmVkdWNlKChwcmV2OiBudW1iZXIsIHdkdGg6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIHByZXYgKyB3ZHRoO1xuICAgIH0sIDApO1xuXG4gICAgY29uc3Qgc2NhbGVkV2lkdGhzOiB7IHdpZHRoOiBudW1iZXIsIGluZGV4OiBudW1iZXIgfVtdID0gbnVtZXJpY2FsV2lkdGhzLm1hcCgod2R0aDogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogd2R0aCAvIHdpZHRoVG90YWwgKiAxMDAsXG4gICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2NhbGVkV2lkdGhzLmZvckVhY2goKGl0ZW06IHsgd2lkdGg6IG51bWJlciwgaW5kZXg6IG51bWJlciB9LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICB0aGlzLmNsYXNzV2lkdGhzW2l0ZW0uaW5kZXhdID0gc2NhbGVkV2lkdGhzW2l0ZW0uaW5kZXhdLndpZHRoLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlV2lkdGhzKG5ld1dpZHRoOiBudW1iZXIpIHtcbiAgICBjb25zdCBjdXJyZW50V2lkdGhzOiBudW1iZXJbXSA9IHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZS5tYXAoKHJlc2l6ZUNsYXNzOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENsYXNzV2lkdGhJblBpeGVscyhyZXNpemVDbGFzcyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3J0YWJsZVdpZHRoczogSVNvcnRhYmxlV2lkdGhJdGVtW10gPSBjdXJyZW50V2lkdGhzLm1hcCgodywgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbldpZHRoOiB0aGlzLm1pbldpZHRoc1tpbmRleF0sXG4gICAgICAgIHdpZHRoOiB3LFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZVtpbmRleF1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHZpc2libGVTb3J0YWJsZVdpZHRoczogSVNvcnRhYmxlV2lkdGhJdGVtW10gPSBzb3J0YWJsZVdpZHRocy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gIXRoaXMuY29sdW1uSXNIaWRkZW5XaXRoQ2xhc3MoaXRlbS5jbGFzc05hbWUpO1xuICAgIH0pXG5cbiAgICBjb25zdCB0b3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZTogbnVtYmVyID0gdGhpcy5nZXRUb3RhbEdyb3VwZWRDb2x1bW5zVmlzaWJsZSh2aXNpYmxlU29ydGFibGVXaWR0aHMpO1xuXG4gICAgaWYgKHRoaXMucmVzaXplQ29sdW1uV2lkdGhCeVBlcmNlbnQpIHtcbiAgICAgIHRoaXMudXBkYXRlV2lkdGhzSW5QZXJjZW50KG5ld1dpZHRoLCB2aXNpYmxlU29ydGFibGVXaWR0aHMsIHRvdGFsR3JvdXBlZENvbHVtbnNWaXNpYmxlLCBzb3J0YWJsZVdpZHRocyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBkYXRlV2lkdGhzSW5QaXhlbHMobmV3V2lkdGgsIHZpc2libGVTb3J0YWJsZVdpZHRocywgdG90YWxHcm91cGVkQ29sdW1uc1Zpc2libGUpO1xuICAgIH1cblxuICAgIHRoaXMuZ2VuZXJhdGVXaWR0aFN0eWxlKCk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlV2lkdGhTdHlsZSgpIHtcbiAgICBsZXQgaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5zdHlsZXNCeUNsYXNzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpbm5lckhUTUwgKz0gaXRlbS5tYXJrdXA7XG4gICAgfSk7XG4gICAgdGhpcy53aWR0aFN0eWxlIS5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gICAgdGhpcy5zZXRTdHlsZUNvbnRlbnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVzaXphYmxlQ2xhc3NlcyhlbDogRWxlbWVudCB8IGFueSk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gZWwgPyBlbFsnZGF0YUNsYXNzZXMnXSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIHNldFJlc2l6YWJsZVN0eWxlcygpIHtcblxuICAgIGNvbnN0IGFsbEVsZW1lbnRzV2l0aERhdGFSZXNpemFibGU6IGFueSA9IHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3NlcztcbiAgICBsZXQgZWw6IEVsZW1lbnQ7XG4gICAgY29uc3QgY2xhc3Nlc1VzZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG4gICAgbGV0IHN0eWxlOiBIVE1MU3R5bGVFbGVtZW50O1xuICAgIGxldCBzdHlsZVRleHQgPSAnJztcblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICB9IGVsc2Uge1xuICAgICAgZnJhZ21lbnQgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLndpZHRoU3R5bGVGcmFnbWVudDtcbiAgICAgIHN0eWxlID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS53aWR0aFN0eWxlO1xuICAgIH1cbiAgICBsZXQgbWFya3VwOiBzdHJpbmc7XG5cbiAgICBpZiAodGhpcy5saW5rQ2xhc3MgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbCA9IGFsbEVsZW1lbnRzV2l0aERhdGFSZXNpemFibGVbaV07XG4gICAgICAgIGNvbnN0IHJlc2l6ZUNsYXNzZXM6IHN0cmluZ1tdID0gdGhpcy5nZXRSZXNpemFibGVDbGFzc2VzKGVsKTtcblxuICAgICAgICByZXNpemVDbGFzc2VzLmZvckVhY2goKHJlc2l6ZUNsczogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGNsYXNzZXNVc2VkLmluZGV4T2YocmVzaXplQ2xzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RWw6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShyZXNpemVDbHMpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRpbmdXaWR0aCA9ICEhdGhpcy5pbml0aWFsV2lkdGhzW3Jlc2l6ZUNsc10gPyB0aGlzLmluaXRpYWxXaWR0aHNbcmVzaXplQ2xzXSA6IGZpcnN0RWwub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAvLyBPdmVycmlkZSBwZXJjZW50YWdlIGlmIHdlIGhhdmUgd2lkdGhQZXJjZW50IGVuYWJsZWRcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0aW5nV2lkdGhQZXJjZW50ID0gdGhpcy5pbml0aWFsV2lkdGhzW3Jlc2l6ZUNsc107XG4gICAgICAgICAgICBjb25zdCByZXNpemVJRDogc3RyaW5nID0gdGhpcy5pZCArICcgLicgKyByZXNpemVDbHM7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCB8fCBzdGFydGluZ1dpZHRoLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSkge1xuICAgICAgICAgICAgICBtYXJrdXAgPSByZXNpemVJRCArICcgeyB3aWR0aDogJyArIDEwMCArICclfSc7XG4gICAgICAgICAgICAgIHRoaXMucmVzaXplQ29sdW1uV2lkdGhCeVBlcmNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICB0aGlzLmF0dGFjaENvbnRlbnRSZXNpemVTZW5zb3IoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1hcmt1cCA9IHJlc2l6ZUlEICsgJyB7IHdpZHRoOiAnICsgc3RhcnRpbmdXaWR0aCArICdweCB9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0eWxlVGV4dCArPSBtYXJrdXA7XG4gICAgICAgICAgICB0aGlzLnN0eWxlc0J5Q2xhc3MucHVzaCh7IHN0eWxlLCBpZDogcmVzaXplSUQsIHJlc2l6ZUNsYXNzOiByZXNpemVDbHMsIG1hcmt1cCwgd2lkdGg6IHN0YXJ0aW5nV2lkdGggfSk7XG4gICAgICAgICAgICBjbGFzc2VzVXNlZC5wdXNoKHJlc2l6ZUNscyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdHlsZXNCeUNsYXNzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdHlsZXNCeUNsYXNzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUuaW5uZXJIVE1MID0gc3R5bGVUZXh0O1xuICAgIH1cbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgdGhpcy53aWR0aFN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy53aWR0aFN0eWxlRnJhZ21lbnQgPSBmcmFnbWVudDtcblxuICAgIHRoaXMuYWRkU3R5bGUoc3R5bGUsIGZhbHNlKTtcblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgaWYgKHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdID0ge307XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZERpcmVjdGl2ZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3R5bGVzQnlDbGFzcyA9IHRoaXMuc3R5bGVzQnlDbGFzcztcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10ud2lkdGhTdHlsZUZyYWdtZW50ID0gZnJhZ21lbnQ7XG4gICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLndpZHRoU3R5bGUgPSBzdHlsZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFN0eWxlKHN0eWxlOiBIVE1MU3R5bGVFbGVtZW50LCBhZGRUb0NvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3R5bGVMaXN0LmluZGV4T2Yoc3R5bGUpID09PSAtMSkge1xuICAgICAgdGhpcy5zdHlsZUxpc3QucHVzaChzdHlsZSk7XG4gICAgfVxuXG4gICAgaWYgKGFkZFRvQ29udGVudCkge1xuICAgICAgdGhpcy5zZXRTdHlsZUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFN0eWxlQ29udGVudCgpOiB2b2lkIHtcbiAgICB0aGlzLnN0eWxlQ29udGVudCA9ICcnO1xuICAgIHRoaXMuc3R5bGVMaXN0LmZvckVhY2goc3R5bGUgPT4ge1xuICAgICAgdGhpcy5zdHlsZUNvbnRlbnQgKz0gc3R5bGUuaW5uZXJIVE1MO1xuICAgIH0pO1xuICAgIHRoaXMuaGVhZFN0eWxlIS5pbm5lckhUTUwgPSB0aGlzLnN0eWxlQ29udGVudDtcbiAgfVxuXG4gIHB1YmxpYyBtb3ZlU3R5bGVDb250ZW50VG9Qcm9taW5lbnQoKTogdm9pZCB7XG4gICAgdGhpcy5oZWFkVGFnLmFwcGVuZENoaWxkKHRoaXMuaGVhZFN0eWxlISk7XG4gIH1cblxuICBwcml2YXRlIHNldFJlb3JkZXJTdHlsZXMoKSB7XG4gICAgaWYgKHRoaXMubGlua0NsYXNzID09PSB1bmRlZmluZWQgfHwgKHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10gJiYgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5yZW9yZGVySGlnaGxpZ2h0U3R5bGUgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIGNvbnN0IGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBzdHlsZS5pbm5lckhUTUwgPSB0aGlzLmlkICsgJyAuaGlnaGxpZ2h0LWxlZnQgZGl2OmFmdGVyLCAnICsgdGhpcy5pZCArICcgLmhpZ2hsaWdodC1yaWdodCBkaXY6YWZ0ZXIgeyBoZWlnaHQ6IDIwMHB4ICFpbXBvcnRhbnQgfSc7XG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICB0aGlzLnJlb3JkZXJIaWdobGlnaHRTdHlsZSA9IHN0eWxlO1xuICAgICAgdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGVGcmFnbWVudCA9IGZyYWdtZW50O1xuXG4gICAgICB0aGlzLmFkZFN0eWxlKHN0eWxlLCBmYWxzZSk7XG5cbiAgICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnJlb3JkZXJIaWdobGlnaHRTdHlsZSA9IHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlO1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnJlb3JkZXJIaWdobGlnaHRTdHlsZUZyYWdtZW50ID0gdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGVGcmFnbWVudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGUgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnJlb3JkZXJIaWdobGlnaHRTdHlsZTtcbiAgICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnJlb3JkZXJIaWdobGlnaHRTdHlsZUZyYWdtZW50O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29sU3BhbihlbGVtZW50OiBFbGVtZW50KTogbnVtYmVyIHtcbiAgICBjb25zdCBjb2xTcGFuOiBzdHJpbmcgfCBudWxsID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nKTtcbiAgICByZXR1cm4gY29sU3BhbiA9PT0gbnVsbCA/IDEgOiBOdW1iZXIoY29sU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQ29sdW1uU3BhbnNBcmVUaGVTYW1lKGNvbFNwYW5zOiBudW1iZXJbXSkge1xuXG4gICAgaWYgKGNvbFNwYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vIGNvbHVtbnMgYXBwZWFyIHRvIGV4aXN0LicpO1xuICAgIH1cbiAgICBjb25zdCBjb2xMZW5ndGg6IG51bWJlciA9IGNvbFNwYW5zWzBdO1xuICAgIGNvbnN0IGludmFsaWRDb2xMZW5ndGhzOiBudW1iZXJbXSA9IGNvbFNwYW5zLmZpbHRlcihpdGVtID0+IGl0ZW0gIT09IGNvbExlbmd0aCk7XG4gICAgaWYgKGludmFsaWRDb2xMZW5ndGhzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdHcmlkIGNvbHVtbiBsZW5ndGhzIGRvIG5vdCBtYXRjaC4gIFBsZWFzZSBjaGVjayB5b3VyIGNvbHNwYW5zLicpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25Qb2ludGVyVXAoZXZlbnQ6IGFueSkge1xuXG4gICAgY29uc3QgdGhzOiBHcmlkRGlyZWN0aXZlID0gZG9jdW1lbnRbJ2N1cnJlbnRHcmlkRGlyZWN0aXZlJ107XG4gICAgdGhzLnJlbW92ZVBvaW50ZXJMaXN0ZW5lcnMoKTtcbiAgICBpZiAodGhzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW9yZGVyaW5nKSB7XG5cbiAgICAgIHRocy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVvcmRlcmluZyA9IGZhbHNlO1xuICAgICAgdGhzLnJlbW92ZURyYWdBbmREcm9wQ29tcG9uZW50KCk7XG4gICAgICBpZiAoIXRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRocy5yZW1vdmVFbGVtZW50SGlnaGxpZ2h0KHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50KTtcbiAgICAgIHRocy5yZW1vdmVIaWdobGlnaHRzKCk7XG5cbiAgICAgIGlmICh0aHMucmVvcmRlckdyaXBzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICB0aHMucmVvcmRlckNvbHVtbnMoZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICB0aHMuY29sdW1uUmVvcmRlckVuZC5lbWl0KHtcbiAgICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgICAgY29sdW1uRHJhZ2dlZDogdGhzLmRyYWdnaW5nQ29sdW1uLFxuICAgICAgICBjb2x1bW5Ib3ZlcmVkOiB0aHMubGFzdERyYWdnZWRPdmVyRWxlbWVudFxuICAgICAgfSk7XG4gICAgICBjb25zdCBjdXN0b21SZW9yZGVyRW5kRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoQ29sdW1uUmVvcmRlckV2ZW50Lk9OX1JFT1JERVJfRU5ELCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICAgICAgY29sdW1uRHJhZ2dlZDogdGhzLmRyYWdnaW5nQ29sdW1uLFxuICAgICAgICAgIGNvbHVtbkhvdmVyZWQ6IHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tUmVvcmRlckVuZEV2ZW50KTtcbiAgICAgIHRocy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50ID0gbnVsbDtcbiAgICAgIHRocy5sYXN0TW92ZURpcmVjdGlvbiA9IC0xO1xuICAgICAgdGhzLmRyYWdnaW5nQ29sdW1uIS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgICAgdGhzLmRyYWdnaW5nQ29sdW1uID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCF0aHMuZHJhZ2dpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhzLmNvbHVtblJlc2l6ZUVuZC5lbWl0KHtcbiAgICAgIHBvaW50ZXJFdmVudDogZXZlbnQsXG4gICAgICBjb2x1bW5XaWR0aDogdGhzLnRvdGFsQ29tcHV0ZWRXaWR0aCxcbiAgICAgIGNvbHVtbk1pbldpZHRoOiB0aHMudG90YWxDb21wdXRlZE1pbldpZHRoLFxuICAgICAgY2xhc3Nlc0JlaW5nUmVzaXplZDogdGhzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemVcbiAgICB9KTtcbiAgICBjb25zdCBjdXN0b21SZXNpemVFbmRFdmVudCA9IG5ldyBDdXN0b21FdmVudChDb2x1bW5SZXNpemVFdmVudC5PTl9SRVNJWkVfRU5ELCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgcG9pbnRlckV2ZW50OiBldmVudCxcbiAgICAgICAgY29sdW1uV2lkdGg6IHRocy50b3RhbENvbXB1dGVkV2lkdGgsXG4gICAgICAgIGNvbHVtbk1pbldpZHRoOiB0aHMudG90YWxDb21wdXRlZE1pbldpZHRoLFxuICAgICAgICBjbGFzc2VzQmVpbmdSZXNpemVkOiB0aHMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRocy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbVJlc2l6ZUVuZEV2ZW50KTtcbiAgICB0aHMuZW5kRHJhZyhldmVudCk7XG4gIH1cblxuICBwcml2YXRlIGFkZFBvaW50ZXJMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5kb2N1bWVudFsnY3VycmVudEdyaWREaXJlY3RpdmUnXSA9IHRoaXM7XG4gICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMub25Qb2ludGVyTW92ZSk7XG4gICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLm9uUG9pbnRlclVwKTtcbiAgfVxuICBwcml2YXRlIHJlbW92ZVBvaW50ZXJMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5kb2N1bWVudFsnY3VycmVudEdyaWREaXJlY3RpdmUnXSA9IG51bGw7XG4gICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMub25Qb2ludGVyTW92ZSk7XG4gICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLm9uUG9pbnRlclVwKTtcbiAgfVxuXG4gIHByaXZhdGUgZW5kRHJhZyhldmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnRvdGFsQ29tcHV0ZWRNaW5XaWR0aCA9IDA7XG4gICAgdGhpcy50b3RhbENvbXB1dGVkV2lkdGggPSAwO1xuICAgIHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZSA9IFtdO1xuICAgIHRoaXMubWluV2lkdGhzID0gW107XG4gICAgdGhpcy5zdGFydGluZ1dpZHRocyA9IFtdO1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdEdyaWQoKSB7XG4gICAgaWYgKHRoaXMubGlua0NsYXNzID09PSB1bmRlZmluZWQgfHwgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmhlYWRTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICB0aGlzLmhlYWRTdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgIHRoaXMuaGVhZFRhZy5hcHBlbmRDaGlsZCh0aGlzLmhlYWRTdHlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVhZFN0eWxlID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5oZWFkU3R5bGU7XG4gICAgfVxuXG4gICAgdGhpcy5nZW5lcmF0ZUNvbnRhaW5lcklEKCk7XG4gICAgdGhpcy5nZW5lcmF0ZVZpZXdwb3J0SUQoKTtcbiAgICB0aGlzLmF0dGFjaENvbnRlbnRSZXNpemVTZW5zb3IoKTtcbiAgICB0aGlzLnNldFJlc2l6YWJsZVN0eWxlcygpO1xuICAgIHRoaXMuc2V0UmVvcmRlclN0eWxlcygpO1xuICAgIHRoaXMuZ2VuZXJhdGVDb2x1bW5Hcm91cHMoKTtcblxuICAgIHRoaXMuc2V0R3JpZFRlbXBsYXRlQ2xhc3NlcygpO1xuICAgIFxuXG4gICAgaWYgKHRoaXMubGlua0NsYXNzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdHlsZXNCeUNsYXNzKSB7XG4gICAgICB0aGlzLnN0eWxlc0J5Q2xhc3MgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN0eWxlc0J5Q2xhc3M7XG4gICAgICB0aGlzLmNsYXNzV2lkdGhzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5jbGFzc1dpZHRocztcbiAgICB9XG4gICAgaWYgKHRoaXMubGlua0NsYXNzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5jbGFzc1dpZHRocykge1xuICAgICAgdGhpcy5jbGFzc1dpZHRocyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uY2xhc3NXaWR0aHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NXaWR0aHMgPSB0aGlzLmNhbGN1bGF0ZVdpZHRoc0Zyb21TdHlsZXMoKTtcbiAgICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNsYXNzV2lkdGhzID0gdGhpcy5jbGFzc1dpZHRocztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldEdyaWRPcmRlcigpO1xuICAgIHRoaXMuZW1pdEdyaWRJbml0aWFsaXphdGlvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRHcmlkVGVtcGxhdGVDbGFzc2VzKCk6IHZvaWQge1xuICAgIGxldCBpbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBoaWdoZXN0TGVuOiBudW1iZXIgPSAwO1xuICAgIFxuICAgIGxldCBncm91cDogYW55O1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucGFyZW50R3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgZ3JvdXAgPSB0aGlzLnBhcmVudEdyb3Vwc1tpbmRleF07XG4gICAgICBpZiAoZ3JvdXAubGVuZ3RoID4gaGlnaGVzdExlbikge1xuICAgICAgICBoaWdoZXN0TGVuID0gZ3JvdXAubGVuZ3RoO1xuICAgICAgICBpbmQgPSBpbmRleDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG5cbiAgICBpZiAodGhpcy5wYXJlbnRHcm91cHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aGlzLnBhcmVudEdyb3Vwc1tpbmRdLmZvckVhY2goKGl0ZW0yLCBpbmRleCkgPT4ge1xuICAgICAgICB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXMucHVzaCh0aGlzLmdldFJlc2l6YWJsZUNsYXNzZXMoaXRlbTIpWzBdKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgIGlmICghdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkVGVtcGxhdGVDbGFzc2VzKSB7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZFRlbXBsYXRlQ2xhc3NlcyA9IHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3NlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnZlcmlmeUxpbmtlZFRlbXBsYXRlQ2xhc3Nlc01hdGNoKCk7XG4gICAgICB9XG4gICAgICBcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZlcmlmeUxpbmtlZFRlbXBsYXRlQ2xhc3Nlc01hdGNoKCk6IHZvaWQge1xuICAgIGxldCBjb2x1bW5zQXJlVGhlU2FtZTogYm9vbGVhbiA9IHRydWU7XG4gICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlQ2xhc3Nlcy5mb3JFYWNoKChpdGVtOiBhbnksIGluZGV4OiBhbnkpID0+IHtcbiAgICAgIGlmIChpdGVtICE9PSB0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXNbaW5kZXhdKSB7XG4gICAgICAgIGNvbHVtbnNBcmVUaGVTYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjb2x1bW5zQXJlVGhlU2FtZSkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvbHVtbiBjbGFzc2VzIG11c3QgbWF0Y2ggZm9yIGxpbmtlZCB0YWJsZXM6XFxuXFxuICR7dGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlQ2xhc3Nlc31cXG4gICBkb2VzIG5vdCBtYXRjaFxcbiAke3RoaXMuZ3JpZFRlbXBsYXRlQ2xhc3Nlc31cXG5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGN1bGF0ZVdpZHRoc0Zyb21TdHlsZXMoKTogYW55W10ge1xuICAgIGlmICghdGhpcy5zdHlsZXNCeUNsYXNzWzBdLndpZHRoLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSAmJiB0aGlzLmNsYXNzV2lkdGhzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnJlc2l6ZUNvbHVtbldpZHRoQnlQZXJjZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZXNCeUNsYXNzLm1hcCgoc3R5bGVPYmosIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiAoTWF0aC5yb3VuZCgoMSAvIHRoaXMuc3R5bGVzQnlDbGFzcy5sZW5ndGgpICogMTAwMDApIC8gMTAwKS50b1N0cmluZygpICsgJyUnO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc0J5Q2xhc3MubWFwKChzdHlsZU9iaiwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHN0eWxlT2JqLndpZHRoLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSkge1xuICAgICAgICAgIHJldHVybiBzdHlsZU9iai53aWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gTnVtYmVyKHN0eWxlT2JqLndpZHRoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdEdyaWRJbml0aWFsaXphdGlvbigpIHtcbiAgICBjb25zdCBlbWl0dGVyT2JqID0ge1xuICAgICAgZ3JpZENvbXBvbmVudDogdGhpcyxcbiAgICAgIGdyaWRFbGVtZW50OiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgIH07XG4gICAgdGhpcy5wcmVHcmlkSW5pdGlhbGl6ZS5lbWl0KGVtaXR0ZXJPYmopO1xuICAgIHRoaXMuZ3JpZEluaXRpYWxpemUuZW1pdChlbWl0dGVyT2JqKTtcblxuICAgIGNvbnN0IGN1c3RvbUdyaWRJbml0aWFsaXplZEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEdyaWRFdmVudC5PTl9JTklUSUFMSVpFRCwge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGdyaWRDb21wb25lbnQ6IGVtaXR0ZXJPYmouZ3JpZENvbXBvbmVudCxcbiAgICAgICAgZ3JpZEVsZW1lbnQ6IGVtaXR0ZXJPYmouZ3JpZENvbXBvbmVudCxcbiAgICAgICAgdHlwZTogR3JpZEV2ZW50Lk9OX0lOSVRJQUxJWkVEXG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbUdyaWRJbml0aWFsaXplZEV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRHJhZ0FuZERyb3BDb21wb25lbnQoKSB7XG4gICAgY29uc3QgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PiA9IHRoaXMub3Blbk1vZGFsKERyYWdBbmREcm9wR2hvc3RDb21wb25lbnQsIHRoaXMuRFJBR19BTkRfRFJPUF9HSE9TVF9PVkVSTEFZX0RBVEEsIHt9KTtcbiAgICB0aGlzLmRyYWdBbmREcm9wR2hvc3RDb21wb25lbnQgPSBjb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gIH1cblxuICBvcGVuTW9kYWwoXG4gICAgY29tcG9uZW50VHlwZTogQ29tcG9uZW50VHlwZTx1bmtub3duPixcbiAgICB0b2tlbjogSW5qZWN0aW9uVG9rZW48YW55PixcbiAgICBkYXRhOiBhbnksIHBvc2l0aW9uU3RyYXRlZ3k6IFBvc2l0aW9uU3RyYXRlZ3kgfCBudWxsID0gbnVsbCxcbiAgICBvdmVybGF5Q29uZmlnOiBPdmVybGF5Q29uZmlnIHwgbnVsbCA9IG51bGxcbiAgKTogQ29tcG9uZW50UmVmPHVua25vd24+IHtcblxuICAgIGlmICghcG9zaXRpb25TdHJhdGVneSkge1xuICAgICAgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMub3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5nbG9iYWwoKVxuICAgICAgLmNlbnRlckhvcml6b250YWxseSgpXG4gICAgICAuY2VudGVyVmVydGljYWxseSgpO1xuICAgIH1cbiAgIFxuICAgIGlmICghb3ZlcmxheUNvbmZpZykge1xuICAgICAgb3ZlcmxheUNvbmZpZyA9IG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICAgIGJhY2tkcm9wQ2xhc3M6ICdtb2RhbC1iZycsXG4gICAgICAgIHBhbmVsQ2xhc3M6ICdtb2RhbC1jb250YWluZXInLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSxcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vdmVybGF5UmVmID0gdGhpcy5vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcblxuICAgIHRoaXMuaW5qZWN0b3IgPSB0aGlzLmNyZWF0ZUluamVjdG9yKGRhdGEsIHRva2VuKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lclBvcnRhbDogQ29tcG9uZW50UG9ydGFsPHVua25vd24+ID0gbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnRUeXBlLCBudWxsLCB0aGlzLmluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjx1bmtub3duPiA9IHRoaXMub3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcblxuICAgIHJldHVybiBjb250YWluZXJSZWY7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUluamVjdG9yKGRhdGFUb1Bhc3M6IGFueSwgdG9rZW46IGFueSk6IEluamVjdG9yIHtcbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdGhpcy5pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IHRva2VuLCB1c2VWYWx1ZTogZGF0YVRvUGFzcyB9XG4gICAgICBdXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgc2V0RHJhZ0FuZERyb3BQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMuZHJhZ0FuZERyb3BHaG9zdENvbXBvbmVudCEubGVmdCA9IHg7XG4gICAgdGhpcy5kcmFnQW5kRHJvcEdob3N0Q29tcG9uZW50IS50b3AgPSB5O1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVEcmFnQW5kRHJvcENvbXBvbmVudCgpIHtcbiAgICBpZiAodGhpcy5vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLm92ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRQYXJlbnRHcm91cHMoYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTogYW55W10pOiB2b2lkIHtcbiAgICBjb25zdCBjb2xTcGFuczogbnVtYmVyW10gPSBbXTtcbiAgICBsZXQgY3VyclNwYW5Db3VudDogbnVtYmVyID0gMDtcbiAgICBsZXQgbGFzdFBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGxldCBjaGlsZHJlbiE6IEVsZW1lbnRbXTtcbiAgICBsZXQgY29sdW1uU3RhcnQ6IG51bWJlciA9IDE7XG4gICAgbGV0IGNvbFJhbmdlczogbnVtYmVyW11bXSA9IFtdO1xuXG4gICAgdGhpcy5jb2xSYW5nZUdyb3Vwcy5wdXNoKGNvbFJhbmdlcyk7XG5cbiAgICBsZXQgaXRlbTogYW55O1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhbGxFbGVtZW50c1dpdGhEYXRhUmVzaXphYmxlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaXRlbTogRWxlbWVudCA9IGFsbEVsZW1lbnRzV2l0aERhdGFSZXNpemFibGVbaW5kZXhdO1xuICAgICAgY29uc3Qgc3BhbjogbnVtYmVyID0gdGhpcy5nZXRDb2xTcGFuKGl0ZW0pO1xuICAgICAgXG4gICAgICBpZiAoaXRlbS5wYXJlbnRFbGVtZW50ICE9PSBsYXN0UGFyZW50KSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICAgIGNvbFNwYW5zLnB1c2goY3VyclNwYW5Db3VudCk7XG4gICAgICAgICAgY29sdW1uU3RhcnQgPSAxO1xuICAgICAgICAgIGNvbFJhbmdlcyA9IFtdO1xuICAgICAgICAgIHRoaXMuY29sUmFuZ2VHcm91cHMucHVzaChjb2xSYW5nZXMpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJTcGFuQ291bnQgPSAwO1xuICAgICAgICBsYXN0UGFyZW50ID0gaXRlbS5wYXJlbnRFbGVtZW50O1xuICAgICAgICBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudEdyb3Vwcy5wdXNoKGNoaWxkcmVuKTtcbiAgICAgIH1cbiAgICAgIGNvbFJhbmdlcy5wdXNoKFtjb2x1bW5TdGFydCwgKHNwYW4gKyBjb2x1bW5TdGFydCldKTtcbiAgICAgIGN1cnJTcGFuQ291bnQgKz0gc3BhbjtcbiAgICAgIGNvbHVtblN0YXJ0ICs9IHNwYW47XG4gICAgICBjaGlsZHJlbi5wdXNoKGl0ZW0pO1xuICAgIH1cblxuICAgIGNvbFNwYW5zLnB1c2goY3VyclNwYW5Db3VudCk7XG5cbiAgICB0aGlzLnZhbGlkYXRlQ29sdW1uU3BhbnNBcmVUaGVTYW1lKGNvbFNwYW5zKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDb2x1bW5Hcm91cHMoKSB7XG4gICAgY29uc3QgYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTogYW55ID0gdGhpcy5jb2x1bW5zV2l0aERhdGFDbGFzc2VzO1xuICAgIGNvbnN0IGFycjogRWxlbWVudFtdID0gYWxsRWxlbWVudHNXaXRoRGF0YVJlc2l6YWJsZTtcbiAgICBsZXQgY29sT3JkZXI6IG51bWJlciA9IDE7XG4gICAgbGV0IGxhc3RQYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbGFzdEdyb3VwOiBJQ29sdW1uRGF0YVtdIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGxhc3RPcmRlcjogbnVtYmVyID0gMDtcbiAgICBsZXQgbGFzdEluZGV4OiBudW1iZXIgPSAwO1xuICAgIGxldCBzcGFuQ291bnQ6IG51bWJlciA9IDA7XG4gICAgbGV0IGNvbERhdGFHcm91cDogYW55W10gPSBbXTtcblxuICAgIHRoaXMuY29sRGF0YUdyb3Vwcy5wdXNoKGNvbERhdGFHcm91cCk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYXJyLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaXRlbTogRWxlbWVudCB8IG51bGwgPSBhcnJbaW5kZXhdO1xuXG4gICAgICBpZiAoaXRlbS5wYXJlbnRFbGVtZW50ICE9PSBsYXN0UGFyZW50KSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICAgIGNvbE9yZGVyID0gMTtcbiAgICAgICAgICBsYXN0R3JvdXAgPSBjb2xEYXRhR3JvdXA7XG4gICAgICAgICAgbGFzdE9yZGVyID0gaW5kZXg7XG4gICAgICAgICAgbGFzdEluZGV4ID0gMDtcbiAgICAgICAgICBjb2xEYXRhR3JvdXAgPSBbXTtcbiAgICAgICAgICB0aGlzLmNvbERhdGFHcm91cHMucHVzaChjb2xEYXRhR3JvdXApO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RQYXJlbnQgPSBpdGVtLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb2xPcmRlciA9IGluZGV4ICsgMSAtIGxhc3RPcmRlcjtcblxuICAgICAgaWYgKGxhc3RHcm91cCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAobGFzdEdyb3VwW2xhc3RJbmRleF0uc3BhbiA8IChjb2xPcmRlciAtIHNwYW5Db3VudCkpIHtcbiAgICAgICAgICBzcGFuQ291bnQgKz0gbGFzdEdyb3VwW2xhc3RJbmRleF0uc3BhbjtcbiAgICAgICAgICBsYXN0SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuY29sRGF0YSA9IHtcbiAgICAgICAgb3JkZXI6IGNvbE9yZGVyLFxuICAgICAgICBsYXN0RGF0YVNwYW46IChjb2xPcmRlciAtIHNwYW5Db3VudCksXG4gICAgICAgIG50aENoaWxkOiBjb2xPcmRlcixcbiAgICAgICAgc3BhbjogdGhpcy5nZXRDb2xTcGFuKGl0ZW0pLFxuICAgICAgICBzdWJHcm91cHM6IFtdLFxuICAgICAgICBwYXJlbnQ6IGl0ZW0ucGFyZW50RWxlbWVudCBhcyBFbGVtZW50LFxuICAgICAgICBjaGlsZDogaXRlbSxcbiAgICAgICAgbGlua2VkQ2hpbGRyZW46IFtdLFxuICAgICAgICBzdWJDb2x1bW5MZW5ndGg6IDBcbiAgICAgIH07XG4gICAgICBjb2xEYXRhR3JvdXAucHVzaCh0aGlzLmNvbERhdGEpO1xuICAgIH1cbiAgICBcbiAgICBsZXQgZ3JvdXBzV2VyZVNldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAmJiB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHMpIHtcbiAgICAgIHRoaXMudmVyaWZ5TGlua2VkR3JvdXBTdHJ1Y3R1cmVzTWF0Y2godGhpcy5jb2xEYXRhR3JvdXBzLCB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHMpO1xuICAgICAgZ3JvdXBzV2VyZVNldCA9IHRydWU7XG4gICAgICB0aGlzLmNvbERhdGFHcm91cHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHM7XG4gICAgICB0aGlzLmNvbERhdGFHcm91cHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmNvbERhdGFHcm91cHM7XG4gICAgfVxuXG4gICAgXG5cbiAgICBpZiAodGhpcy5saW5rQ2xhc3MpIHtcbiAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uY29sRGF0YUdyb3VwcyA9IHRoaXMuY29sRGF0YUdyb3VwcztcbiAgICB9XG5cbiAgICBpZiAoIWdyb3Vwc1dlcmVTZXQpIHtcbiAgICAgIGxldCBjb2x1bW5Hcm91cDogYW55O1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwLCBsZW4gPSB0aGlzLmNvbERhdGFHcm91cHMubGVuZ3RoOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgICBjb2x1bW5Hcm91cCA9IHRoaXMuY29sRGF0YUdyb3Vwc1tpbmRleF07XG4gICAgICAgIGlmIChpbmRleCA8IHRoaXMuY29sRGF0YUdyb3Vwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgdGhpcy5nZW5lcmF0ZVN1Ykdyb3VwKGNvbHVtbkdyb3VwLCB0aGlzLmNvbERhdGFHcm91cHNbaW5kZXggKyAxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09PSBsZW4gLSAxKSB7XG4gICAgICAgICAgdGhpcy5vcmRlclN1Ykdyb3Vwcyhjb2x1bW5Hcm91cCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgXG4gICAgICB0aGlzLnNldExpbmtlZEhlYWRlckNvbnRhaW5lckNsYXNzZXMoKTtcbiAgICAgIHRoaXMuc2V0TGlua2VkQ2hpbGRyZW4oKTtcblxuICAgICAgaWYgKHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLnN1Ykdyb3VwU3R5bGVPYmpzKSB7XG4gICAgICAgIHRoaXMuZ3JpZFRlbXBsYXRlVHlwZXMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3MhXS5ncmlkVGVtcGxhdGVUeXBlcztcbiAgICAgICAgdGhpcy5zdHlsZUxpc3QgPSAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uc3R5bGVMaXN0O1xuICAgICAgICB0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uc3ViR3JvdXBTdHlsZU9ianM7XG4gICAgICAgIHRoaXMuc3ViR3JvdXBTdHlsZXMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3MhXS5zdWJHcm91cFN0eWxlcztcbiAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50cyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLnN1Ykdyb3VwRnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmdyaWRPcmRlciA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLmdyaWRPcmRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZlcmlmeUxpbmtlZEdyb3VwU3RydWN0dXJlc01hdGNoKGNvbERhdGFHcm91cHMxOiBJQ29sdW1uRGF0YVtdW10sIGNvbERhdGFHcm91cHMyOiBJQ29sdW1uRGF0YVtdW10pOiB2b2lkIHtcbiAgICBsZXQgY29sdW1uR3JvdXBzQXJlVGhlU2FtZTogYm9vbGVhbiA9IHRydWU7XG4gICAgaWYgKGNvbERhdGFHcm91cHMxLmxlbmd0aCAhPT0gY29sRGF0YUdyb3VwczIubGVuZ3RoKSB7XG4gICAgICBjb2x1bW5Hcm91cHNBcmVUaGVTYW1lID0gZmFsc2U7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sRGF0YUdyb3VwczEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDE6IElDb2x1bW5EYXRhW10gPSBjb2xEYXRhR3JvdXBzMVtpXTtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDI6IElDb2x1bW5EYXRhW10gPSBjb2xEYXRhR3JvdXBzMltpXTtcbiAgICAgIGlmIChjb2xEYXRhR3JvdXAxLmxlbmd0aCAhPT0gY29sRGF0YUdyb3VwMi5sZW5ndGgpIHtcbiAgICAgICAgY29sdW1uR3JvdXBzQXJlVGhlU2FtZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNvbHVtbkdyb3Vwc0FyZVRoZVNhbWUpIHtcbiAgICAgIHRocm93IEVycm9yKGBUaGUgaGVhZGVyIHN0cnVjdHVyZSBmb3IgbGlua2VkIHRhYmxlcyBkb2VzIG5vdCBtYXRjaC5cXG5QbGVhc2UgY2hlY2sgeW91ciBjb2x1bW4gc3BhbnMuYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIaWRkZW5DbGFzc0ZvckFsbExpbmtlZFBhcmVudEhlYWRlcnMoKTogSFRNTEVsZW1lbnRbXSB7XG5cbiAgICBjb25zdCBmbGF0dGVuZWRIaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHlbXSA9IHRoaXMuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG4gICAgY29uc3QgZmxhdHRlbmVkSGVpcmFyY2h5TGVuTWluMTogbnVtYmVyID0gZmxhdHRlbmVkSGllcmFyY2h5Lmxlbmd0aCAtIDE7XG5cbiAgICAvLyBzdGFydCBhdCB0aGUgZW5kIHRvIGdldCB0aGUgZGVlcGVzdCBjaGlsZCBwb3NzaWJsZVxuICAgIGZvciAobGV0IGkgPSBmbGF0dGVuZWRIZWlyYXJjaHlMZW5NaW4xOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkSGllcmFyY2h5W2ldO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnRzUmVzaG93bjogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgIGNvbnN0IHN0YXJ0SW5kZXg6IG51bWJlciA9IHRoaXMuY29sRGF0YUdyb3Vwcy5sZW5ndGggLSAyO1xuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29sRGF0YUdyb3VwOiBJQ29sdW1uRGF0YVtdID0gdGhpcy5jb2xEYXRhR3JvdXBzW2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xEYXRhR3JvdXAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sdW1uRGF0YTogSUNvbHVtbkRhdGEgPSBjb2xEYXRhR3JvdXBbal07XG4gICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQ6IGFueSA9IGNvbHVtbkRhdGEuY2hpbGQgYXMgYW55O1xuICAgICAgICBjb25zdCBwYXJlbnRXYXNIaWRkZW46IGJvb2xlYW4gPSBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW47XG4gICAgICAgIGxldCBoaWRkZW5DaGlsZENvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgY29uc3Qgc3ViR3JvdXA6IElDb2x1bW5EYXRhID0gY29sdW1uRGF0YS5zdWJHcm91cHNba107XG4gICAgICAgICAgaWYgKChzdWJHcm91cC5jaGlsZCBhcyBhbnkpLmhpZGVDb2x1bW4pIHtcbiAgICAgICAgICAgIGhpZGRlbkNoaWxkQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGlmICghcGFyZW50V2FzSGlkZGVuICYmIGhpZGRlbkNoaWxkQ291bnQgPT09IGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFyZW50RWxlbWVudC5oaWRlQ29sdW1uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0SGlkZGVuQ2xhc3NGb3JDb2x1bW5Hcm91cChjb2x1bW5EYXRhLmNoaWxkLCBjb2xEYXRhR3JvdXBbal0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFyZW50V2FzSGlkZGVuICYmIGhpZGRlbkNoaWxkQ291bnQgPCBjb2x1bW5EYXRhLnN1Ykdyb3Vwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuaGlkZUNvbHVtbiA9IGZhbHNlO1xuICAgICAgICAgICAgZWxlbWVudHNSZXNob3duLnB1c2gocGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50c1Jlc2hvd247XG4gIH1cblxuICBwcml2YXRlIHNldEhpZGRlbkNsYXNzRm9yQWxsTGlua2VkSGVhZGVycyhlbGVtZW50OiBIVE1MRWxlbWVudCB8IGFueSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xEYXRhR3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xEYXRhR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbERhdGFHcm91cC5sZW5ndGg7IGorKykge1xuICAgICAgICB0aGlzLnNldEhpZGRlbkNsYXNzRm9yQ29sdW1uR3JvdXAoZWxlbWVudCwgY29sRGF0YUdyb3VwW2pdKTtcbiAgICAgICAgXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRIaWRkZW5DbGFzc0ZvckNvbHVtbkdyb3VwKGVsZW1lbnQ6IEVsZW1lbnQgfCBhbnksIGNvbHVtbkdyb3VwOiBJQ29sdW1uRGF0YSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbHVtbkRhdGE6IElDb2x1bW5EYXRhID0gY29sdW1uR3JvdXA7XG4gICAgaWYgKGNvbHVtbkRhdGEuY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgY29uc3QgaGlkZUNvbHVtbjogYm9vbGVhbiA9IGVsZW1lbnQuaGlkZUNvbHVtbjtcbiAgICAgIGlmIChoaWRlQ29sdW1uKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgfVxuICAgICAgY29sdW1uRGF0YS5saW5rZWRDaGlsZHJlbi5mb3JFYWNoKChoZWFkZXI6IEVsZW1lbnQgfCBhbnkpID0+IHtcbiAgICAgICAgaGVhZGVyLmhpZGVDb2x1bW4gPSBoaWRlQ29sdW1uO1xuICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgICBpZiAoaGlkZUNvbHVtbikge1xuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKHRoaXMuSElEREVOX0NPTFVNTl9DTEFTUyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkRhdGEuc3ViR3JvdXBzLmxlbmd0aCA7IGkrKykge1xuICAgICAgICBjb25zdCBzdWJHcm91cDogSUNvbHVtbkRhdGEgPSBjb2x1bW5EYXRhLnN1Ykdyb3Vwc1tpXTtcbiAgICAgICAgKHN1Ykdyb3VwLmNoaWxkIGFzIGFueSkuaGlkZUNvbHVtbiA9IGhpZGVDb2x1bW47XG4gICAgICAgIHRoaXMuc2V0SGlkZGVuQ2xhc3NGb3JDb2x1bW5Hcm91cChzdWJHcm91cC5jaGlsZCwgc3ViR3JvdXApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRSZWxhdGVkSGVhZGVycyhlbGVtZW50OiBFbGVtZW50KTogKEVsZW1lbnQgfCBhbnkpW10ge1xuICAgIGlmICgoZWxlbWVudCBhcyBhbnkpLnJlbGF0ZWRFbGVtZW50cykge1xuICAgICAgcmV0dXJuIChlbGVtZW50IGFzIGFueSkucmVsYXRlZEVsZW1lbnRzO1xuICAgIH1cbiAgICBsZXQgcmVsYXRlZEVsZW1lbnRzOiAoSFRNTEVsZW1lbnQgfCBhbnkpW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sRGF0YUdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29sRGF0YUdyb3VwOiBJQ29sdW1uRGF0YVtdID0gdGhpcy5jb2xEYXRhR3JvdXBzW2ldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xEYXRhR3JvdXAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sdW1uRGF0YTogSUNvbHVtbkRhdGEgPSBjb2xEYXRhR3JvdXBbal07XG4gICAgICAgIGlmIChlbGVtZW50ID09PSBjb2x1bW5EYXRhLmNoaWxkIHx8IHRoaXMuZ2V0UmVsYXRlZEhlYWRlcihlbGVtZW50KSA9PT0gY29sdW1uRGF0YS5jaGlsZCkge1xuICAgICAgICAgIHJlbGF0ZWRFbGVtZW50cy5wdXNoKGNvbHVtbkRhdGEuY2hpbGQpO1xuICAgICAgICAgIGNvbHVtbkRhdGEubGlua2VkQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICByZWxhdGVkRWxlbWVudHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlbGF0ZWRFbGVtZW50cztcbiAgfVxuXG4gIHB1YmxpYyBnZXRSZWxhdGVkSGVhZGVyKGVsZW1lbnQ6IEVsZW1lbnQpOkVsZW1lbnQgfCBhbnkge1xuICAgIGlmICgoZWxlbWVudCBhcyBhbnkpLnJlbGF0ZWRFbGVtZW50KSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQgYXMgYW55KS5yZWxhdGVkRWxlbWVudDtcbiAgICB9XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50OiBIVE1MRWxlbWVudCB8IGFueSA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbERhdGFHcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDogSUNvbHVtbkRhdGFbXSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tpXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sRGF0YUdyb3VwLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbkRhdGE6IElDb2x1bW5EYXRhID0gY29sRGF0YUdyb3VwW2pdO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZENoaWxkcmVuOiBFbGVtZW50W10gPSBjb2x1bW5EYXRhLmxpbmtlZENoaWxkcmVuLmZpbHRlcihjaGlsZCA9PiBjaGlsZCA9PT0gZWxlbWVudCk7XG4gICAgICAgIGlmIChmaWx0ZXJlZENoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZWxhdGVkRWxlbWVudCA9IGNvbHVtbkRhdGEuY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgKGVsZW1lbnQgYXMgYW55KS5yZWxhdGVkRWxlbWVudCA9IHJlbGF0ZWRFbGVtZW50ID8gcmVsYXRlZEVsZW1lbnQgOiBlbGVtZW50O1xuICAgIHJldHVybiAoZWxlbWVudCBhcyBhbnkpLnJlbGF0ZWRFbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRMaW5rZWRDaGlsZHJlbigpOiB2b2lkIHtcbiAgICBsZXQgZGF0YUluZGV4OiBudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xEYXRhR3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2xEYXRhR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbERhdGFHcm91cC5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBjb2x1bW5EYXRhOiBJQ29sdW1uRGF0YSA9IGNvbERhdGFHcm91cFtqXTtcbiAgICAgICAgY29uc3QgY29sdW1uOiBIVE1MRWxlbWVudCA9IHRoaXMuY29sdW1uc1dpdGhEYXRhQ2xhc3Nlc1tkYXRhSW5kZXggKyBqXTtcbiAgICAgICAgY29sdW1uRGF0YS5saW5rZWRDaGlsZHJlbi5wdXNoKGNvbHVtbik7XG4gICAgICB9XG4gICAgICBkYXRhSW5kZXggKz0gY29sRGF0YUdyb3VwLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBzZXRMaW5rZWRIZWFkZXJDb250YWluZXJDbGFzc2VzKCk6IHZvaWQge1xuICAgIGxldCBkYXRhSW5kZXg6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbERhdGFHcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbERhdGFHcm91cDogSUNvbHVtbkRhdGFbXSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tpXTtcbiAgICAgIGNvbnN0IGNvbHVtbjogSFRNTEVsZW1lbnQgPSB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXNbZGF0YUluZGV4XTtcbiAgICAgIGRhdGFJbmRleCArPSBjb2xEYXRhR3JvdXAubGVuZ3RoO1xuICAgICAgY29uc3QgY29udGFpbmVyQ2xhc3MgPSAnY29sdW1uLWNvbnRhaW5lci0nICsgaTtcbiAgICAgIHRoaXMuYWRkQ2xhc3NUb0xpbmtlZEhlYWRlcihjb2x1bW4ucGFyZW50RWxlbWVudCEsIGNvbnRhaW5lckNsYXNzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZENsYXNzVG9MaW5rZWRIZWFkZXIoZWxlbWVudDogRWxlbWVudCwgY2xzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVTdWJHcm91cChjdXJyZW50R3JvdXA6IGFueSwgc3ViR3JvdXA6IGFueSk6IHZvaWQge1xuXG4gICAgbGV0IGluZGV4Q291bnQ6IG51bWJlciA9IDA7XG4gICAgY3VycmVudEdyb3VwLmZvckVhY2goXG4gICAgICAoZ3JvdXA6IElDb2x1bW5EYXRhLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzTGVuOiBudW1iZXIgPSAoZ3JvdXAuY2hpbGQgYXMgYW55KS5kYXRhQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgIGxldCBzdWJDbGFzc0NvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBsZXQgbnVtT2ZTdWJDb2x1bW5zOiBudW1iZXIgPSAwO1xuICAgICAgICB3aGlsZSAoc3ViQ2xhc3NDb3VudCA8IGNsYXNzTGVuKSB7XG4gICAgICAgICAgc3ViQ2xhc3NDb3VudCArPSAoc3ViR3JvdXBbaW5kZXhDb3VudF0uY2hpbGQgYXMgYW55KS5kYXRhQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgICAgZ3JvdXAuc3ViR3JvdXBzLnB1c2goc3ViR3JvdXBbaW5kZXhDb3VudF0pO1xuICAgICAgICAgIGluZGV4Q291bnQrKztcbiAgICAgICAgICBudW1PZlN1YkNvbHVtbnMrKztcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50R3JvdXBbaW5kZXhdLnN1YkNvbHVtbkxlbmd0aCA9IG51bU9mU3ViQ29sdW1ucztcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBvcmRlclN1Ykdyb3Vwcyhjb2x1bW5Hcm91cDogSUNvbHVtbkRhdGFbXSwgY29sdW1uUGxhY2VtZW50OiBudW1iZXIgPSAxLCBwbGFjZW1lbnRTdGFydDogbnVtYmVyID0gMCwgb3JkZXI6IG51bWJlciA9IDEpIHtcbiAgICBsZXQgc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQ7XG4gICAgbGV0IGNvbnRhaW5lcklEOiBzdHJpbmc7XG4gICAgbGV0IGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50O1xuICAgIGxldCBzZWxlY3Rvcjogc3RyaW5nO1xuXG4gICAgaWYgKHRoaXMubGlua0NsYXNzKSB7XG4gICAgICBpZiAodGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdWJHcm91cFN0eWxlT2Jqcykge1xuICAgICAgICB0aGlzLmhlYWRTdHlsZSA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uaGVhZFN0eWxlO1xuICAgICAgICB0aGlzLmdyaWRUZW1wbGF0ZVR5cGVzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlVHlwZXM7XG4gICAgICAgIHRoaXMuc3R5bGVMaXN0ID0gIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3R5bGVMaXN0O1xuICAgICAgICB0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdWJHcm91cFN0eWxlT2JqcztcbiAgICAgICAgdGhpcy5zdWJHcm91cFN0eWxlcyA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3ViR3JvdXBTdHlsZXM7XG4gICAgICAgIHRoaXMuc3ViR3JvdXBGcmFnbWVudHMgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN1Ykdyb3VwRnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmdyaWRPcmRlciA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZE9yZGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5oZWFkU3R5bGUgPSB0aGlzLmhlYWRTdHlsZTtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzIV0uZ3JpZFRlbXBsYXRlVHlwZXMgPSB0aGlzLmdyaWRUZW1wbGF0ZVR5cGVzO1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN0eWxlTGlzdCA9IHRoaXMuc3R5bGVMaXN0O1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLnN1Ykdyb3VwU3R5bGVPYmpzID0gdGhpcy5zdWJHcm91cFN0eWxlT2JqcztcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5zdWJHcm91cFN0eWxlcyA9IHRoaXMuc3ViR3JvdXBTdHlsZXM7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uc3ViR3JvdXBGcmFnbWVudHMgPSB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRPcmRlciA9IHRoaXMuZ3JpZE9yZGVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsYWNlbWVudFN0YXJ0ID0gY29sdW1uUGxhY2VtZW50IC0gMTtcbiAgICBjb2x1bW5Hcm91cC5zb3J0KChjb2x1bW5EYXRhMTogSUNvbHVtbkRhdGEsIGNvbHVtbkRhdGEyOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbHVtbkRhdGExLm9yZGVyIC0gY29sdW1uRGF0YTIub3JkZXI7XG4gICAgfSk7XG5cbiAgICBjb2x1bW5Hcm91cC5mb3JFYWNoKChjb2x1bW5EYXRhOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgY29sdW1uRGF0YS5vcmRlciA9IGNvbHVtblBsYWNlbWVudDtcblxuICAgICAgY29uc3QgdGFnTmFtZTogc3RyaW5nID0gY29sdW1uRGF0YS5jaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGNvbnRhaW5lcklEID0gJ2NvbHVtbi1jb250YWluZXItJyArIEFycmF5LmZyb20oY29sdW1uRGF0YSEucGFyZW50IS5wYXJlbnRFbGVtZW50IS5jaGlsZHJlbikuaW5kZXhPZihjb2x1bW5EYXRhLnBhcmVudCk7XG4gICAgICBjb25zdCBwYXJlbnRJbmRleCA9IEFycmF5LmZyb20oY29sdW1uRGF0YSEucGFyZW50IS5wYXJlbnRFbGVtZW50IS5jaGlsZHJlbikuaW5kZXhPZihjb2x1bW5EYXRhLnBhcmVudCk7XG4gICAgICBcbiAgICAgIHRoaXMuYWRkQ2xhc3NUb0xpbmtlZEhlYWRlcihjb2x1bW5EYXRhLnBhcmVudCwgY29udGFpbmVySUQpO1xuICAgICAgXG4gICAgICBzZWxlY3RvciA9IHRoaXMuaWQgKyAnIC4nICsgY29udGFpbmVySUQgKyAnICcgKyB0YWdOYW1lICsgJzpudGgtY2hpbGQoJyArIChjb2x1bW5EYXRhLm50aENoaWxkKS50b1N0cmluZygpICsgJyknO1xuICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGlmICh0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSkge1xuICAgICAgICBzdHlsZSA9IHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgdGhpcy5zdWJHcm91cFN0eWxlcy5wdXNoKHN0eWxlKTtcbiAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50cy5wdXNoKGZyYWdtZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb2x1bW5TdHlsZShzdHlsZSwgZnJhZ21lbnQsIHNlbGVjdG9yLCBjb2x1bW5QbGFjZW1lbnQsIGNvbHVtblBsYWNlbWVudCArIGNvbHVtbkRhdGEuc3BhbiwgY29sdW1uRGF0YS5vcmRlcik7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLnBhcmVudEdyb3Vwc1twYXJlbnRJbmRleF0pIHtcbiAgICAgICAgaWYgKCh0aGlzLnBhcmVudEdyb3Vwc1twYXJlbnRJbmRleF0ubGVuZ3RoKSA9PT0gKGNvbHVtbkRhdGEub3JkZXIpKSB7XG4gICAgICAgICAgdGhpcy5sYXN0Q29sdW1uc1twYXJlbnRJbmRleF0gPSBjb2x1bW5EYXRhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2x1bW5EYXRhLnN1Ykdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMub3JkZXJTdWJHcm91cHMoY29sdW1uRGF0YS5zdWJHcm91cHMsIGNvbHVtblBsYWNlbWVudCwgcGxhY2VtZW50U3RhcnQsIG9yZGVyKyspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZWN0b3IgPSB0aGlzLmlkICsgJyAnICsgdGFnTmFtZSArICc6bnRoLWNoaWxkKCcgKyAoY29sdW1uRGF0YS5udGhDaGlsZCkudG9TdHJpbmcoKSArICcpJztcbiAgICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGlmICh0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSkge1xuICAgICAgICAgIHN0eWxlID0gdGhpcy5zdWJHcm91cFN0eWxlT2Jqc1tzZWxlY3Rvcl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgIHRoaXMuc3ViR3JvdXBTdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgICAgdGhpcy5zdWJHcm91cEZyYWdtZW50cy5wdXNoKGZyYWdtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q29sdW1uU3R5bGUoc3R5bGUsIGZyYWdtZW50LCBzZWxlY3RvciwgY29sdW1uUGxhY2VtZW50LCBjb2x1bW5QbGFjZW1lbnQgKyBjb2x1bW5EYXRhLnNwYW4sIGNvbHVtbkRhdGEub3JkZXIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkT3JkZXJbY29sdW1uUGxhY2VtZW50IC0gMV0gPSBjb2x1bW5EYXRhLm50aENoaWxkO1xuXG4gICAgICAgIGNvbnN0IGhhc1Npc3RlclRhZzogYm9vbGVhbiA9IHRhZ05hbWUgPT09ICd0aCcgfHwgdGFnTmFtZSA9PT0gJ3RkJztcbiAgICAgICAgbGV0IHNpc3RlclRhZzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGlmIChoYXNTaXN0ZXJUYWcpIHtcbiAgICAgICAgICBzaXN0ZXJUYWcgPSB0YWdOYW1lID09PSAndGgnID8gJ3RkJyA6ICd0aCc7XG5cbiAgICAgICAgICBzZWxlY3RvciA9IHRoaXMuaWQgKyAnICcgKyBzaXN0ZXJUYWcgKyAnOm50aC1jaGlsZCgnICsgKGNvbHVtbkRhdGEubnRoQ2hpbGQpLnRvU3RyaW5nKCkgKyAnKSc7XG4gICAgICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgICAgaWYgKHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdKSB7XG4gICAgICAgICAgICBzdHlsZSA9IHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgIHRoaXMuc3ViR3JvdXBTdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzLnB1c2goZnJhZ21lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldENvbHVtblN0eWxlKHN0eWxlLCBmcmFnbWVudCwgc2VsZWN0b3IsIGNvbHVtblBsYWNlbWVudCwgY29sdW1uUGxhY2VtZW50ICsgY29sdW1uRGF0YS5zcGFuLCBjb2x1bW5EYXRhLm9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29sdW1uUGxhY2VtZW50ICs9IGNvbHVtbkRhdGEuc3BhbjtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q29sdW1uU3R5bGUoc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQsIGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50LCBzZWxlY3Rvcjogc3RyaW5nLCBncmlkU3RhcnQ6IG51bWJlciwgZ3JpZEVuZDogbnVtYmVyLCBvcmRlcjogbnVtYmVyKTogdm9pZCB7XG4gICAgc3R5bGUuaW5uZXJIVE1MID0gc2VsZWN0b3IgKyAnIHsgZ3JpZC1jb2x1bW4tc3RhcnQ6ICcgKyAoZ3JpZFN0YXJ0KS50b1N0cmluZygpICsgJzsgZ3JpZC1jb2x1bW4tZW5kOiAnICsgKGdyaWRFbmQpLnRvU3RyaW5nKCkgKyAnOyBvcmRlcjogJyArIChvcmRlcikudG9TdHJpbmcoKSArICc7IH0nO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB0aGlzLmFkZFN0eWxlKHN0eWxlKTtcbiAgICB0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSA9IHN0eWxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRHcmlkT3JkZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZ3JpZFRlbXBsYXRlQ29sdW1uczogc3RyaW5nID0gdGhpcy5jb25zdHJ1Y3RHcmlkVGVtcGxhdGVDb2x1bW5zKCk7XG5cbiAgICBpZiAodGhpcy5jb2xEYXRhR3JvdXBzWzBdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcWlyZXNOZXdTdHlsZU9iamVjdHM6IGJvb2xlYW4gPSB0aGlzLmxpbmtDbGFzcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzc10uZ3JpZE9yZGVyU3R5bGVzID09PSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmNvbERhdGFHcm91cHMuZm9yRWFjaCgoY29sdW1uR3JvdXA6IElDb2x1bW5EYXRhW10sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgc3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQ7XG4gICAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG5cbiAgICAgIGNvbnN0IHNlbGVjdG9yOiBzdHJpbmcgPSB0aGlzLmlkICsgJyAuJyArIHRoaXMucmVvcmRlcmFibGVDbGFzcztcbiAgICAgIGxldCBzdHlsZUFscmVhZHlFeGlzdGVkOiBib29sZWFuID0gZmFsc2U7ICAgICAgXG5cbiAgICAgIGlmICh0aGlzLnN1Ykdyb3VwU3R5bGVPYmpzW3NlbGVjdG9yXSkge1xuICAgICAgICBzdHlsZSA9IHRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdO1xuICAgICAgICBzdHlsZUFscmVhZHlFeGlzdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAocmVxaXJlc05ld1N0eWxlT2JqZWN0cykge1xuICAgICAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnJhZ21lbnQgPSB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3MhXS5ncmlkT3JkZXJGcmFnbWVudHNbaW5kZXhdO1xuICAgICAgICBzdHlsZSA9IHRoaXMuZ3JpZFNlcnZpY2UubGlua2VkRGlyZWN0aXZlT2Jqc1t0aGlzLmxpbmtDbGFzcyFdLmdyaWRPcmRlclN0eWxlc1tpbmRleF07XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgIH1cbiAgICAgIHN0eWxlLmlubmVySFRNTCA9IHNlbGVjdG9yICsgJyB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogJyArIGdyaWRUZW1wbGF0ZUNvbHVtbnMgKyAnOyB9JztcblxuICAgICAgXG4gICAgICBpZiAoIXRoaXMuc3ViR3JvdXBTdHlsZU9ianNbc2VsZWN0b3JdICYmIHJlcWlyZXNOZXdTdHlsZU9iamVjdHMpIHtcbiAgICAgICAgdGhpcy5ncmlkT3JkZXJTdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgIHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzLnB1c2goZnJhZ21lbnQhKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJHcm91cFN0eWxlT2Jqc1tzZWxlY3Rvcl0gPSBzdHlsZTtcbiAgICAgIFxuICAgICAgdGhpcy5hZGRTdHlsZShzdHlsZSk7XG4gICAgICBpZiAoIXN0eWxlQWxyZWFkeUV4aXN0ZWQpIHtcbiAgICAgICAgdGhpcy5tb3ZlU3R5bGVDb250ZW50VG9Qcm9taW5lbnQoKTtcbiAgICAgICAgdGhpcy5ncmlkVGVtcGxhdGVUeXBlcy5wdXNoKHsgc3R5bGUgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICB0aGlzLm9yZGVyU3ViR3JvdXBzKGNvbHVtbkdyb3VwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmxpbmtDbGFzcyAmJiB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRPcmRlclN0eWxlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmdyaWRTZXJ2aWNlLmxpbmtlZERpcmVjdGl2ZU9ianNbdGhpcy5saW5rQ2xhc3NdLmdyaWRPcmRlckZyYWdtZW50cyA9IHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzO1xuICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkT3JkZXJTdHlsZXMgPSB0aGlzLmdyaWRPcmRlclN0eWxlcztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldE9mZnNldChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYLFxuICAgICAgdG9wOiByZWN0LnRvcCArIHdpbmRvdy5zY3JvbGxZXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUoZWw6IEhUTUxFbGVtZW50IHwgbnVsbCk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XG4gICAgd2hpbGUgKGVsICE9PSBudWxsICYmIGVsLmdldEF0dHJpYnV0ZSgndGFibGVqc0dyaWQnKSA9PT0gbnVsbCkge1xuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBwcml2YXRlIGVsZW1lbnRSZWZVbmRlclBvaW50KGV2ZW50OiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgcmV0dXJuIGVsZW1lbnRzLmZpbHRlcihpdGVtID0+IGl0ZW0gPT09IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5sZW5ndGggPiAwO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemVHcmlwVW5kZXJQb2ludChldmVudDogYW55KTogRWxlbWVudFtdIHtcbiAgICBjb25zdCByZXNpemFibGVFbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgY29uc3QgZWxlbWVudHM6IEVsZW1lbnRbXSA9IHJlc2l6YWJsZUVsZW1lbnRzLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIHJldHVybiBpdGVtLmdldEF0dHJpYnV0ZSgncmVzaXphYmxlR3JpcCcpICE9PSBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBlbGVtZW50cztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVvcmRlckNvbHNVbmRlclBvaW50KGV2ZW50OiBhbnkpOiBFbGVtZW50W10ge1xuICAgIGNvbnN0IHJlb3JkZXJDb2xFbGVtZW50czogRWxlbWVudFtdID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgY29uc3QgZWxlbWVudHM6IEVsZW1lbnRbXSA9IHJlb3JkZXJDb2xFbGVtZW50cy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5nZXRBdHRyaWJ1dGUoJ3Jlb3JkZXJDb2wnKSAhPT0gbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gZWxlbWVudHM7XG4gIH1cblxuICBwcml2YXRlIGdldFJlb3JkZXJIYW5kbGVzVW5kZXJQb2ludChldmVudDogYW55KTogRWxlbWVudFtdIHtcbiAgICBjb25zdCByZW9yZGVyR3JpcEVsZW1lbnRzOiBFbGVtZW50W10gPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICBjb25zdCBlbGVtZW50czogRWxlbWVudFtdID0gcmVvcmRlckdyaXBFbGVtZW50cy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5nZXRBdHRyaWJ1dGUoJ3Jlb3JkZXJHcmlwJykgIT09IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsZW1lbnRzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemFibGVFbGVtZW50cyhldmVudDogYW55KTogRWxlbWVudFtdIHtcbiAgICBjb25zdCByZXNpemFibGVFbGVtZW50cyA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgIGxldCBlbGVtZW50czogRWxlbWVudFtdID0gcmVzaXphYmxlRWxlbWVudHMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uZ2V0QXR0cmlidXRlKCd0YWJsZWpzRGF0YUNvbENsYXNzZXMnKSAhPT0gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IG5vRWxlbWVudHNGb3VuZDogYm9vbGVhbiA9IGVsZW1lbnRzLmxlbmd0aCA9PT0gMDtcbiAgICBjb25zdCBpdGVyYXRpb25MZW46IG51bWJlciA9IG5vRWxlbWVudHNGb3VuZCA/IDEgOiBlbGVtZW50cy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaXRlcmF0aW9uTGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSByZXNpemFibGVFbGVtZW50c1swXTtcbiAgICAgIGxldCBwYXJlbnRFbGVtZW50OiBFbGVtZW50IHwgbnVsbCA9IGl0ZW0ucGFyZW50RWxlbWVudDtcbiAgICAgIHdoaWxlKHBhcmVudEVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZm91bmRHcmlwUGFyZW50OiBib29sZWFuID0gIW5vRWxlbWVudHNGb3VuZCAmJiBwYXJlbnRFbGVtZW50ID09PSBlbGVtZW50c1tpXTtcbiAgICAgICAgY29uc3QgZm91bmRQYXJlbnRXaXRoQ29sQ2xhc3NlczogYm9vbGVhbiA9IG5vRWxlbWVudHNGb3VuZCAmJiBwYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGFibGVqc0RhdGFDb2xDbGFzc2VzJykgIT09IG51bGw7XG4gICAgICAgIGlmIChmb3VuZEdyaXBQYXJlbnQgfHwgZm91bmRQYXJlbnRXaXRoQ29sQ2xhc3Nlcykge1xuICAgICAgICAgIGVsZW1lbnRzID0gW3BhcmVudEVsZW1lbnRdO1xuICAgICAgICAgIHBhcmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50IS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50cztcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVIaWdobGlnaHRzKGVsVG9FeGNsdWRlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsLCBtb3ZlRGlyZWN0aW9uOiBudW1iZXIgPSAtMik6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudHNXaXRoSGlnaGxpZ2h0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbS5lbCAhPT0gZWxUb0V4Y2x1ZGUgfHwgaXRlbS5tb3ZlRGlyZWN0aW9uICE9PSBtb3ZlRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudEhpZ2hsaWdodChpdGVtLmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVFbGVtZW50SGlnaGxpZ2h0KGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodC1sZWZ0Jyk7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0LXJpZ2h0Jyk7XG4gIH1cblxuICBwcml2YXRlIHJlb3JkZXJDb2x1bW5zKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCBkcmFnZ2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMubGFzdERyYWdnZWRPdmVyRWxlbWVudDtcbiAgICBjb25zdCBlbFJlY3Q6IGFueSA9IGRyYWdnYWJsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZWxYOiBudW1iZXIgPSBlbFJlY3QubGVmdDtcbiAgICBjb25zdCBlbFc6IG51bWJlciA9IGVsUmVjdC53aWR0aDtcblxuICAgIHRoaXMucmVtb3ZlRWxlbWVudEhpZ2hsaWdodChkcmFnZ2FibGVFbGVtZW50KTtcbiAgICBpZiAodGhpcy5kcmFnZ2luZ0NvbHVtbiA9PT0gZHJhZ2dhYmxlRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgbW92ZURpcmVjdGlvbjogbnVtYmVyID0gMDtcbiAgICBpZiAoKGV2ZW50LmNsaWVudFggLSBlbFgpID49IGVsVyAvIDIpIHtcbiAgICAgIG1vdmVEaXJlY3Rpb24gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3ZlRGlyZWN0aW9uID0gMDtcbiAgICB9XG5cbiAgICBsZXQgY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kOiBudW1iZXIgPSAtMTtcbiAgICBsZXQgY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb2xSYW5nZURyb3BwZWRQYXJlbnRJbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb2xSYW5nZURyb3BwZWRDaGlsZEluZDogbnVtYmVyID0gLTE7XG4gICAgbGV0IGRyYWdnZWRJbmQ6IG51bWJlciA9IC0xO1xuICAgIGxldCBkcm9wcGVkSW5kOiBudW1iZXIgPSAtMTtcbiAgICBsZXQgZHJhZ2dlZEdyb3VwOiBFbGVtZW50W10gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0IHBHcm91cDogYW55ID0gdGhpcy5wYXJlbnRHcm91cHMuZm9yRWFjaCgoZ3JvdXAsIGdyb3VwSW5kKSA9PlxuICAgICAgZ3JvdXAuZm9yRWFjaChcbiAgICAgICAgKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuZHJhZ2dpbmdDb2x1bW4pIHtcbiAgICAgICAgICAgIGNvbFJhbmdlRHJhZ2dlZFBhcmVudEluZCA9IGdyb3VwSW5kO1xuICAgICAgICAgICAgY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQgPSBpbmRleDtcbiAgICAgICAgICAgIGRyYWdnZWRJbmQgPSBpbmRleDtcbiAgICAgICAgICAgIGRyYWdnZWRHcm91cCA9IGdyb3VwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbSA9PT0gZHJhZ2dhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgY29sUmFuZ2VEcm9wcGVkUGFyZW50SW5kID0gZ3JvdXBJbmQ7XG4gICAgICAgICAgICBjb2xSYW5nZURyb3BwZWRDaGlsZEluZCA9IGluZGV4O1xuICAgICAgICAgICAgZHJvcHBlZEluZCA9IGluZGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgICk7XG5cbiAgICBsZXQgcGFyZW50UmFuZ2VzOiBudW1iZXJbXVtdIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgdGVtcFJhbmdlczogbnVtYmVyW11bXVtdID0gdGhpcy5jb2xSYW5nZUdyb3Vwcy5jb25jYXQoKTtcbiAgICBsZXQgcGFyZW50UmFuZ2VJbmRleDogbnVtYmVyID0gLTE7XG4gICAgdGVtcFJhbmdlcy5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcbiAgICB0ZW1wUmFuZ2VzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIXBhcmVudFJhbmdlcyAmJiBpdGVtLmxlbmd0aCA8IGRyYWdnZWRHcm91cCEubGVuZ3RoKSB7XG4gICAgICAgIHBhcmVudFJhbmdlcyA9IGl0ZW07XG4gICAgICAgIHBhcmVudFJhbmdlSW5kZXggPSB0aGlzLmNvbFJhbmdlR3JvdXBzLmluZGV4T2YoaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZnJvbU9yZGVyOiBudW1iZXIgPSAoY29sUmFuZ2VEcmFnZ2VkQ2hpbGRJbmQgKyAxKTtcbiAgICBjb25zdCB0b09yZGVyOiBudW1iZXIgPSAoY29sUmFuZ2VEcm9wcGVkQ2hpbGRJbmQgKyAxKTtcblxuICAgIC8vIGlmIGhhcyB0byBzdGF5IHdpdGhpbiByYW5nZXMsIGdldCByYW5nZXMgYW5kIHN3YXBcbiAgICBpZiAocGFyZW50UmFuZ2VJbmRleCA9PT0gdGhpcy5jb2xSYW5nZUdyb3Vwcy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmNvbFJhbmdlR3JvdXBzW3BhcmVudFJhbmdlSW5kZXhdLmZvckVhY2goXG4gICAgICAgIHJhbmdlID0+IHtcbiAgICAgICAgICBjb25zdCBsb3dSYW5nZTogbnVtYmVyID0gcmFuZ2VbMF07XG4gICAgICAgICAgY29uc3QgaGlnaFJhbmdlOiBudW1iZXIgPSByYW5nZVsxXTtcbiAgICAgICAgICBpZiAoZnJvbU9yZGVyID49IGxvd1JhbmdlICYmIGZyb21PcmRlciA8IGhpZ2hSYW5nZSAmJiB0b09yZGVyID49IGxvd1JhbmdlICYmIHRvT3JkZXIgPCBoaWdoUmFuZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGExOiBJQ29sdW1uRGF0YSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tjb2xSYW5nZURyYWdnZWRQYXJlbnRJbmRdLmZpbHRlcihpdGVtID0+IGl0ZW0ubnRoQ2hpbGQgPT09IGZyb21PcmRlcilbMF07XG4gICAgICAgICAgICBjb25zdCBkYXRhMjogSUNvbHVtbkRhdGEgPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5maWx0ZXIoaXRlbSA9PiBpdGVtLm50aENoaWxkID09PSB0b09yZGVyKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5zbGljZShyYW5nZVswXSAtIDEsIHJhbmdlWzFdIC0gMSk7XG4gICAgICAgICAgICByYW5nZUdyb3VwLnNvcnQoKGl0ZW0xOiBJQ29sdW1uRGF0YSwgaXRlbTI6IElDb2x1bW5EYXRhKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtMS5vcmRlciAtIGl0ZW0yLm9yZGVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByYW5nZUdyb3VwLnNwbGljZShyYW5nZUdyb3VwLmluZGV4T2YoZGF0YTEpLCAxKTtcbiAgICAgICAgICAgIHJhbmdlR3JvdXAuc3BsaWNlKHJhbmdlR3JvdXAuaW5kZXhPZihkYXRhMikgKyBtb3ZlRGlyZWN0aW9uLCAwLCBkYXRhMSk7XG4gICAgICAgICAgICByYW5nZUdyb3VwLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGl0ZW0ub3JkZXIgPSBpbmRleCArIDE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRhdGExOiBJQ29sdW1uRGF0YSA9IHRoaXMuY29sRGF0YUdyb3Vwc1tjb2xSYW5nZURyYWdnZWRQYXJlbnRJbmRdLmZpbHRlcihpdGVtID0+IGl0ZW0ubnRoQ2hpbGQgPT09IGZyb21PcmRlcilbMF07XG4gICAgICBjb25zdCBkYXRhMjogSUNvbHVtbkRhdGEgPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5maWx0ZXIoaXRlbSA9PiBpdGVtLm50aENoaWxkID09PSB0b09yZGVyKVswXTtcbiAgICAgIGNvbnN0IHJhbmdlR3JvdXA6IElDb2x1bW5EYXRhW10gPSB0aGlzLmNvbERhdGFHcm91cHNbY29sUmFuZ2VEcmFnZ2VkUGFyZW50SW5kXS5jb25jYXQoKTtcbiAgICAgIHJhbmdlR3JvdXAuc29ydCgoaXRlbTE6IElDb2x1bW5EYXRhLCBpdGVtMjogSUNvbHVtbkRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0xLm9yZGVyIC0gaXRlbTIub3JkZXI7XG4gICAgICB9KTtcbiAgICAgIHJhbmdlR3JvdXAuc3BsaWNlKHJhbmdlR3JvdXAuaW5kZXhPZihkYXRhMSksIDEpO1xuICAgICAgcmFuZ2VHcm91cC5zcGxpY2UocmFuZ2VHcm91cC5pbmRleE9mKGRhdGEyKSArIG1vdmVEaXJlY3Rpb24sIDAsIGRhdGExKTtcbiAgICAgIHJhbmdlR3JvdXAuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaXRlbS5vcmRlciA9IGluZGV4ICsgMTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnNldEdyaWRPcmRlcigpO1xuXG4gICAgLy8gbmVlZCB0byBzZXQgYSBjbGFzcyB0byByZXNpemUgLSBkZWZhdWx0IHRvIGZpcnN0IHNvIGNvbHVtbiB3aWR0aHMgYXJlIHVwZGF0ZWRcbiAgICBjb25zdCBmaXJzdEl0ZW1XaWR0aDogbnVtYmVyID0gdGhpcy5nZXRGaXJzdFZpc2libGVJdGVtV2lkdGgoKTtcbiAgICB0aGlzLnNldE1pbmltdW1XaWR0aHMoKTtcblxuICAgIC8vIHVwZGF0ZSB3aWR0aHMgYnkgZmlyc3QgaXRlbVxuICAgIHRoaXMudG90YWxDb21wdXRlZFdpZHRoID0gZmlyc3RJdGVtV2lkdGg7XG4gICAgdGhpcy51cGRhdGVXaWR0aHMoZmlyc3RJdGVtV2lkdGgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRBdmVyYWdlQ29sdW1uV2lkdGgoKTogbnVtYmVyIHtcbiAgICBsZXQgdG90YWxUYWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLnZpZXdwb3J0IS5jbGllbnRXaWR0aDtcbiAgICByZXR1cm4gdG90YWxUYWJsZVdpZHRoIC8gdGhpcy5jbGFzc1dpZHRocy5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGdldEZpcnN0VmlzaWJsZUl0ZW1XaWR0aCgpOiBudW1iZXIge1xuICAgIGxldCBmaXJzdFZpc2libGVJdGVtSW5kZXg6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyaWRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2xhc3NJbmRleCA9IHRoaXMuZ3JpZE9yZGVyW2ldIC0gMTtcbiAgICAgIGlmICghdGhpcy5jb2x1bW5Jc0hpZGRlbldpdGhDbGFzcyh0aGlzLmdyaWRUZW1wbGF0ZUNsYXNzZXNbY2xhc3NJbmRleF0pKSB7XG4gICAgICAgIGZpcnN0VmlzaWJsZUl0ZW1JbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRDbGFzc2VzVG9SZXNpemUgPSBbdGhpcy5zdHlsZXNCeUNsYXNzW3RoaXMuZ3JpZE9yZGVyW2ZpcnN0VmlzaWJsZUl0ZW1JbmRleF0gLSAxXS5yZXNpemVDbGFzc107XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudENsYXNzZXNUb1Jlc2l6ZS5tYXAoKHJlc2l6ZUNsYXNzOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENsYXNzV2lkdGhJblBpeGVscyhyZXNpemVDbGFzcyk7XG4gICAgfSlbMF07XG4gIH1cblxuICBwcml2YXRlIHNldExpbmtlZENvbHVtbkluZGljZXNGcm9tTWFzdGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzID0gdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkRGlyZWN0aXZlLmhpZGRlbkNvbHVtbkluZGljZXM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNYXN0ZXJDb2x1bW5JbmRpY2VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxpbmtDbGFzcykge1xuICAgICAgdGhpcy5ncmlkU2VydmljZS5saW5rZWREaXJlY3RpdmVPYmpzW3RoaXMubGlua0NsYXNzXS5ncmlkRGlyZWN0aXZlLmhpZGRlbkNvbHVtbkluZGljZXMgPSB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVIaWRkZW5Db2x1bW5JbmRpY2VzKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0TGlua2VkQ29sdW1uSW5kaWNlc0Zyb21NYXN0ZXIoKTtcbiAgICB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMgPSB0aGlzLmdldEhpZGRlbkNvbHVtbkluZGljZXMoKTtcbiAgICB0aGlzLnVwZGF0ZU1hc3RlckNvbHVtbkluZGljZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0R3JpZFRlbXBsYXRlQ29sdW1ucygpOiBzdHJpbmcge1xuICAgIHRoaXMudXBkYXRlSGlkZGVuQ29sdW1uSW5kaWNlcygpO1xuXG4gICAgdGhpcy5yZXNpemVNYWtlVXBQZXJjZW50ID0gMDtcbiAgICB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQgPSAwO1xuICAgIGxldCByZW1haW5pbmdDb2xzOiBudW1iZXIgPSB0aGlzLmdyaWRPcmRlci5sZW5ndGggLSB0aGlzLmhpZGRlbkNvbHVtbkluZGljZXMubGVuZ3RoO1xuICAgIHRoaXMuaGlkZGVuQ29sdW1uSW5kaWNlcy5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgICAgY29uc3QgY2xhc3NXaWR0aEluZGV4OiBudW1iZXIgPSB0aGlzLmdyaWRPcmRlcltpbmRleCAtIDFdO1xuICAgICAgY29uc3QgYW10OiBzdHJpbmcgPSB0aGlzLmNsYXNzV2lkdGhzW2NsYXNzV2lkdGhJbmRleCAtIDFdLnRvU3RyaW5nKCk7XG4gICAgICBpZiAoYW10LmluY2x1ZGVzKCclJykpIHtcbiAgICAgICAgdGhpcy5yZXNpemVNYWtlVXBQZXJjZW50ICs9IE51bWJlcihhbXQucmVwbGFjZSgnJScsICcnKSk7XG4gICAgICB9XG4gICAgICBcbiAgICB9KTtcbiAgICBpZiAodGhpcy5yZXNpemVNYWtlVXBQZXJjZW50ICE9PSAwKSB7XG4gICAgICB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQgPXRoaXMucmVzaXplTWFrZVVwUGVyY2VudCAvIHJlbWFpbmluZ0NvbHM7XG4gICAgfVxuXG4gICAgbGV0IHN0cjogc3RyaW5nID0gJyc7XG4gICAgdGhpcy5ncmlkT3JkZXIuZm9yRWFjaCgob3JkZXIsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgd2R0aDogbnVtYmVyID0gTnVtYmVyKHRoaXMuY2xhc3NXaWR0aHNbb3JkZXIgLSAxXS50b1N0cmluZygpLnJlcGxhY2UoJyUnLCAnJykpO1xuICAgICAgd2R0aCA9IHdkdGggPCAwID8gMCA6IHdkdGg7XG4gICAgICBpZiAodGhpcy5jbGFzc1dpZHRoc1tvcmRlciAtIDFdLnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSkge1xuICAgICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaW5kZXggKyAxKSAhPT0gLTEpIHtcbiAgICAgICAgICBzdHIgKz0gJyAwJSc7XG4gICAgICAgICAgdGhpcy5jbGFzc1dpZHRoc1tvcmRlciAtIDFdID0gJzAlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgKz0gJyAnICsgKHdkdGggKyB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQpLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICAgICAgdGhpcy5jbGFzc1dpZHRoc1tvcmRlciAtIDFdID0gKHdkdGggKyB0aGlzLnJlc2l6ZU1ha2VVcFBlckNvbFBlcmNlbnQpLnRvU3RyaW5nKCkgKyAnJSc7XG4gICAgICAgIH0gICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5oaWRkZW5Db2x1bW5JbmRpY2VzLmluZGV4T2YoaW5kZXggKyAxKSAhPT0gLTEpIHtcbiAgICAgICAgICBzdHIgKz0gJyAwcHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciArPSAnICcgKyB3ZHRoLnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xuXG4gIH1cblxuICBwcml2YXRlIGdldEhpZGRlbkNvbHVtbkluZGljZXMoKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IGhpZGRlbkNvbHVtbkluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgdGhpcy5jb2xEYXRhR3JvdXBzLmZvckVhY2goKGNvbHVtbkdyb3VwOiBJQ29sdW1uRGF0YVtdLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHRoaXMub3JkZXJTdWJDb2xzKGhpZGRlbkNvbHVtbkluZGljZXMsIGNvbHVtbkdyb3VwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBoaWRkZW5Db2x1bW5JbmRpY2VzO1xuICB9XG5cbiAgcHJpdmF0ZSBvcmRlclN1YkNvbHMoYXJyOiBudW1iZXJbXSwgY29sdW1uR3JvdXA6IElDb2x1bW5EYXRhW10sIGNvbHVtblBsYWNlbWVudDogbnVtYmVyID0gMSwgcGxhY2VtZW50U3RhcnQ6IG51bWJlciA9IDAsIHBhcmVudElzSGlkZGVuOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBwbGFjZW1lbnRTdGFydCA9IGNvbHVtblBsYWNlbWVudCAtIDE7XG5cbiAgICBjb2x1bW5Hcm91cC5zb3J0KChjb2x1bW5EYXRhMTogSUNvbHVtbkRhdGEsIGNvbHVtbkRhdGEyOiBJQ29sdW1uRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbHVtbkRhdGExLm9yZGVyIC0gY29sdW1uRGF0YTIub3JkZXI7XG4gICAgfSk7XG5cbiAgICBjb2x1bW5Hcm91cC5mb3JFYWNoKGNvbHVtbkRhdGEgPT4ge1xuXG4gICAgICBjb25zdCBzdGFydEluZGV4OiBudW1iZXIgPSBjb2x1bW5QbGFjZW1lbnQ7XG4gICAgICBjb25zdCBjb2x1bW5FbGVtZW50OiBFbGVtZW50IHwgYW55ID0gdGhpcy5nZXRSZWxhdGVkSGVhZGVyKGNvbHVtbkRhdGEuY2hpbGQpO1xuICAgICAgY29uc3QgaGFzU3ViR3JvdXBzOiBib29sZWFuID0gY29sdW1uRGF0YS5zdWJHcm91cHMubGVuZ3RoID4gMDtcblxuICAgICAgaWYgKChjb2x1bW5FbGVtZW50LmhpZGVDb2x1bW4gfHwgcGFyZW50SXNIaWRkZW4pICYmICFoYXNTdWJHcm91cHMgJiYgYXJyLmluZGV4T2Yoc3RhcnRJbmRleCkgPT09IC0xKSB7XG4gICAgICAgIGFyci5wdXNoKHN0YXJ0SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzU3ViR3JvdXBzKSB7XG4gICAgICAgIHRoaXMub3JkZXJTdWJDb2xzKGFyciwgY29sdW1uRGF0YS5zdWJHcm91cHMsIGNvbHVtblBsYWNlbWVudCwgcGxhY2VtZW50U3RhcnQsIGNvbHVtbkVsZW1lbnQuaGlkZUNvbHVtbik7XG4gICAgICB9XG4gICAgICBjb2x1bW5QbGFjZW1lbnQgKz0gY29sdW1uRGF0YS5zcGFuO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRSZW9yZGVySGlnaGxpZ2h0SGVpZ2h0KGRyYWdnYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZHJhZ2dhYmxlVG9wOiBudW1iZXIgPSB0aGlzLmdldE9mZnNldChkcmFnZ2FibGVFbGVtZW50KS50b3A7XG4gICAgY29uc3QgY29udGFpbmVyVG9wOiBudW1iZXIgPSB0aGlzLmdldE9mZnNldCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkudG9wO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodFN0cjogc3RyaW5nID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodDogbnVtYmVyID0gTnVtYmVyKGNvbnRhaW5lckhlaWdodFN0ci5zdWJzdHIoMCwgY29udGFpbmVySGVpZ2h0U3RyLmxlbmd0aCAtIDIpKTtcbiAgICBjb25zdCBoaWdobGlnaHRIZWlnaHQ6IG51bWJlciA9IGNvbnRhaW5lckhlaWdodCAtIChkcmFnZ2FibGVUb3AgLSBjb250YWluZXJUb3ApIC0gMTtcblxuICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlIS5pbm5lckhUTUwgPSB0aGlzLmlkICsgJyAuaGlnaGxpZ2h0LWxlZnQgZGl2OmFmdGVyLCAnICsgdGhpcy5pZCArICcgLmhpZ2hsaWdodC1yaWdodCBkaXY6YWZ0ZXIgeyBoZWlnaHQ6ICcgKyBoaWdobGlnaHRIZWlnaHQgKyAncHggIWltcG9ydGFudCB9JztcbiAgICB0aGlzLnNldFN0eWxlQ29udGVudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXRyaWV2ZU9yQ3JlYXRlRWxlbWVudElEKGVsOiBIVE1MRWxlbWVudCwgaGFzTGlua0NsYXNzOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGxldCBpZDogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCA9IGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkIHx8IGlkID09PSBudWxsKSB7XG4gICAgICBpZCA9ICd0YWJsZWpzLWJvZHktaWQnO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgY29uc3Qgc29tZUlEOiBzdHJpbmcgPSBoYXNMaW5rQ2xhc3MgPyAnJyA6IHRoaXMuZ2VuZXJhdGVHcmlkSUQoZWwpO1xuICAgIHJldHVybiAnIycgKyBpZCArIHNvbWVJRDtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVHcmlkSUQoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICBsZXQgZ3JpZElEOiBzdHJpbmcgfCBudWxsID0gZWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgaWYgKGdyaWRJRCA9PT0gbnVsbCkge1xuICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcbiAgICAgICAgd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWlkLScgKyBpLnRvU3RyaW5nKCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGdyaWRJRCA9ICdncmlkLWlkLScgKyBpLnRvU3RyaW5nKCk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoZ3JpZElEKTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdpZCcsIGdyaWRJRCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnIC4nICsgZ3JpZElEOyAvLyAnICMnICsgZ3JpZElEO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNvbnRhaW5lcklEKCkge1xuICAgIFRhYmxlanNHcmlkUHJveHkuR1JJRF9DT1VOVCsrO1xuICAgIGNvbnN0IGhhc0xpbmtDbGFzczogYm9vbGVhbiA9IHRoaXMubGlua0NsYXNzICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKCFoYXNMaW5rQ2xhc3MpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJldHJpZXZlT3JDcmVhdGVFbGVtZW50SUQodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlkID0gJy4nICsgdGhpcy5saW5rQ2xhc3M7XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudEdyaWRJRDogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50KTtcblxuICAgIGlmIChwYXJlbnRHcmlkSUQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJldHJpZXZlT3JDcmVhdGVFbGVtZW50SUQocGFyZW50R3JpZElELCBoYXNMaW5rQ2xhc3MpICsgJyAnICsgdGhpcy5pZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlVmlld3BvcnRJRCgpIHtcbiAgICBjb25zdCB2aWV3cG9ydHM6IEhUTUxFbGVtZW50W10gPSB0aGlzLmluZmluaXRlU2Nyb2xsVmlld3BvcnRzO1xuICAgIGlmICh2aWV3cG9ydHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy52aWV3cG9ydCA9IHZpZXdwb3J0c1swXTtcbiAgICAgIHRoaXMudmlld3BvcnRJRCA9IHRoaXMudmlld3BvcnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njcm9sbC12aWV3cG9ydC1pZC0nICsgaS50b1N0cmluZygpKSAhPT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXdwb3J0SUQgPSAnc2Nyb2xsLXZpZXdwb3J0LWlkLScgKyBpLnRvU3RyaW5nKCk7XG4gICAgICB0aGlzLnZpZXdwb3J0LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLnZpZXdwb3J0SUQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoQ29udGVudFJlc2l6ZVNlbnNvcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZXNpemVDb2x1bW5XaWR0aEJ5UGVyY2VudCkge1xuICAgICAgaWYgKHRoaXMudmlld3BvcnQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnZpZXdwb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdBIHZpZXdwb3J0IGhhcyBub3QgYmUgZGVjbGFyZWQuICBUcnkgYWRkaW5nIHRoZSB0YWJsZWpzVmlld3BvcnQgZGlyZWN0aXZlIHRvIHlvdXIgdGJvZHkgdGFnLicpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmNvbnRlbnRSZXNpemVTZW5zb3IpIHtcbiAgICAgICAgdGhpcy5jb250ZW50UmVzaXplU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcih0aGlzLnZpZXdwb3J0LmZpcnN0RWxlbWVudENoaWxkISwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U2Nyb2xsYmFyQWRqdXN0bWVudFN0eWxlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJBZGp1c3RtZW50U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICB0aGlzLnNldFNjcm9sbGJhckFkanVzdG1lbnRTdHlsZSgpO1xuICAgICAgICB0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRTdHlsZSk7XG4gIFxuICAgICAgICB0aGlzLmFkZFN0eWxlKHRoaXMuc2Nyb2xsYmFyQWRqdXN0bWVudFN0eWxlLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cbiAgXG4gIHByaXZhdGUgc2V0U2Nyb2xsYmFyQWRqdXN0bWVudFN0eWxlKCk6IHZvaWQge1xuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnZpZXdwb3J0IS5vZmZzZXRXaWR0aCAtIHRoaXMudmlld3BvcnQhLmNsaWVudFdpZHRoO1xuICAgIHRoaXMuc2Nyb2xsYmFyQWRqdXN0bWVudFN0eWxlIS5pbm5lckhUTUwgPSAnIycgKyB0aGlzLnZpZXdwb3J0SUQgKyAnIC5yZW9yZGVyYWJsZS10YWJsZS1yb3cgeyBtYXJnaW4tcmlnaHQ6IC0nICsgdGhpcy5zY3JvbGxiYXJXaWR0aCArICdweDsgfSc7XG4gICAgdGhpcy5zZXRTdHlsZUNvbnRlbnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5kb2N1bWVudFsnc2VsZWN0aW9uJ10pIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRbJ3NlbGVjdGlvbiddLmVtcHR5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRSZXNpemFibGVHcmlwKGVsOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoZnJvbU11dGF0aW9uICYmICF0aGlzLmlzQ3VzdG9tRWxlbWVudCkge1xuICAgICAgdGhpcy5tdXRhdGlvblJlc2l6YWJsZUdyaXBzLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2l6YWJsZUdyaXBzLnB1c2goZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkUmVzaXphYmxlQ29sdW1uKGVsOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoZnJvbU11dGF0aW9uICYmICF0aGlzLmlzQ3VzdG9tRWxlbWVudCkge1xuICAgICAgdGhpcy5tdXRhdGlvblJlc2l6YWJsZUNvbHVtbnMucHVzaChlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzaXphYmxlQ29sdW1ucy5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFJlb3JkZXJHcmlwKGVsOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoZnJvbU11dGF0aW9uICYmICF0aGlzLmlzQ3VzdG9tRWxlbWVudCkge1xuICAgICAgdGhpcy5tdXRhdGlvblJlb3JkZXJHcmlwcy5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW9yZGVyR3JpcHMucHVzaChlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRSZW9yZGVyYWJsZUNvbHVtbihlbDogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKGZyb21NdXRhdGlvbiAmJiAhdGhpcy5pc0N1c3RvbUVsZW1lbnQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25SZW9yZGVyYWJsZUNvbHVtbnMucHVzaChlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVvcmRlcmFibGVDb2x1bW5zLnB1c2goZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkQ29sdW1uc1dpdGhEYXRhQ2xhc3NlcyhlbDogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKGZyb21NdXRhdGlvbiAmJiAhdGhpcy5pc0N1c3RvbUVsZW1lbnQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25Db2x1bW5zV2l0aERhdGFDbGFzc2VzLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXMucHVzaChlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRSb3coZWw6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmIChmcm9tTXV0YXRpb24gJiYgIXRoaXMuaXNDdXN0b21FbGVtZW50KSB7XG4gICAgICB0aGlzLm11dGF0aW9uUm93cy5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb3dzLnB1c2goZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkSW5maW5pdGVTY3JvbGxWaWV3cG9ydChlbDogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKGZyb21NdXRhdGlvbiAmJiAhdGhpcy5pc0N1c3RvbUVsZW1lbnQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25JbmZpbml0ZVNjcm9sbFZpZXdwb3J0cy5wdXNoKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbmZpbml0ZVNjcm9sbFZpZXdwb3J0cy5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVN0eWxlc0Zyb21IZWFkKCkge1xuICAgIHRoaXMuc3R5bGVMaXN0ID0gW107XG4gICAgaWYgKHRoaXMuaGVhZFRhZy5jb250YWlucyh0aGlzLmhlYWRTdHlsZSkpIHtcbiAgICAgIHRoaXMuaGVhZFRhZy5yZW1vdmVDaGlsZCh0aGlzLmhlYWRTdHlsZSEpO1xuICAgICAgdGhpcy5oZWFkU3R5bGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy53aWR0aFN0eWxlRnJhZ21lbnQgJiYgdGhpcy53aWR0aFN0eWxlRnJhZ21lbnQuY29udGFpbnModGhpcy53aWR0aFN0eWxlKSkge1xuICAgICAgdGhpcy53aWR0aFN0eWxlRnJhZ21lbnQhLnJlbW92ZUNoaWxkKHRoaXMud2lkdGhTdHlsZSEpO1xuICAgICAgdGhpcy53aWR0aFN0eWxlRnJhZ21lbnQgPSBudWxsO1xuICAgICAgdGhpcy53aWR0aFN0eWxlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQgJiYgdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGVGcmFnbWVudC5jb250YWlucyh0aGlzLnJlb3JkZXJIaWdobGlnaHRTdHlsZSkpIHtcbiAgICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQucmVtb3ZlQ2hpbGQodGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGUhKTtcbiAgICAgIHRoaXMucmVvcmRlckhpZ2hsaWdodFN0eWxlRnJhZ21lbnQgPSBudWxsO1xuICAgICAgdGhpcy5yZW9yZGVySGlnaGxpZ2h0U3R5bGUgPSBudWxsO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5zdWJHcm91cEZyYWdtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuc3ViR3JvdXBGcmFnbWVudHNbaV0gJiYgKHRoaXMuc3ViR3JvdXBGcmFnbWVudHNbaV0gYXMgRG9jdW1lbnRGcmFnbWVudCkuY29udGFpbnModGhpcy5zdWJHcm91cFN0eWxlc1tpXSkpIHtcbiAgICAgICAgKHRoaXMuc3ViR3JvdXBGcmFnbWVudHNbaV0gYXMgRG9jdW1lbnRGcmFnbWVudCkucmVtb3ZlQ2hpbGQodGhpcy5zdWJHcm91cFN0eWxlc1tpXSEpO1xuICAgICAgICB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzW2ldID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdWJHcm91cFN0eWxlc1tpXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmdyaWRPcmRlckZyYWdtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzW2ldICYmICh0aGlzLmdyaWRPcmRlckZyYWdtZW50c1tpXSBhcyBEb2N1bWVudEZyYWdtZW50KS5jb250YWlucyh0aGlzLmdyaWRPcmRlclN0eWxlc1tpXSkpIHtcbiAgICAgICAgKHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzW2ldIGFzIERvY3VtZW50RnJhZ21lbnQpLnJlbW92ZUNoaWxkKHRoaXMuZ3JpZE9yZGVyU3R5bGVzW2ldISk7XG4gICAgICAgIHRoaXMuZ3JpZE9yZGVyRnJhZ21lbnRzW2ldID0gbnVsbDtcbiAgICAgICAgdGhpcy5ncmlkT3JkZXJTdHlsZXNbaV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcblxuICAgIHRoaXMucmVtb3ZlUG9pbnRlckxpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5saW5rQ2xhc3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZW1vdmVTdHlsZXNGcm9tSGVhZCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pbml0aWFsV2lkdGhTZXR0aW5nc1N1YnNjcmlwdGlvbiQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFdpZHRoU2V0dGluZ3NTdWJzY3JpcHRpb24kLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhpZGRlbkNvbHVtbkNoYW5nZXNTdWJzY3JpcHRpb24kKSB7XG4gICAgICB0aGlzLmhpZGRlbkNvbHVtbkNoYW5nZXNTdWJzY3JpcHRpb24kLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFuaW1hdGlvbkZyYW1lSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpZDogbnVtYmVyID0gdGhpcy5hbmltYXRpb25GcmFtZUlEc1tpXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZG9jdW1lbnRbJ3NlbGVjdGlvbiddKSB7XG4gICAgICB0aGlzLmRvY3VtZW50WydzZWxlY3Rpb24nXS5lbXB0eSgpO1xuICAgIH1cbiAgICBpZiAoZG9jdW1lbnRbJ2N1cnJlbnRHcmlkRGlyZWN0aXZlJ10gPT09IHRoaXMpIHtcbiAgICAgIGRvY3VtZW50WydjdXJyZW50R3JpZERpcmVjdGl2ZSddID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZG9jdW1lbnRbJ2hhc1BvaW50ZXJEb3duTGlzdGVuZXInXSkge1xuICAgICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMucG9pbnRlckxpc3RlbmVyRnVuYyk7XG4gICAgICB0aGlzLmRvY3VtZW50WydoYXNQb2ludGVyRG93bkxpc3RlbmVyJ10gPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdyaWREaXJlY3RpdmUgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdyaWREaXJlY3RpdmUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5ncmlkRGlyZWN0aXZlID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmdyaWREaXJlY3RpdmUgPSBudWxsO1xuICAgIH07XG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpcmVjdGl2ZSA9PT0gdGhpcykge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZGlyZWN0aXZlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29udGVudFJlc2l6ZVNlbnNvcikge1xuICAgICAgdGhpcy5jb250ZW50UmVzaXplU2Vuc29yLmRldGFjaCgpO1xuICAgICAgdGhpcy5jb250ZW50UmVzaXplU2Vuc29yID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMubGlua0NsYXNzKSB7XG4gICAgICB0aGlzLmdyaWRUZW1wbGF0ZVR5cGVzID0gW107XG4gICAgICB0aGlzLnN0eWxlTGlzdCA9IFtdO1xuICAgICAgdGhpcy5zdWJHcm91cFN0eWxlT2JqcyA9IG51bGw7XG4gICAgICB0aGlzLnN1Ykdyb3VwU3R5bGVzID0gW107XG4gICAgICB0aGlzLnN1Ykdyb3VwRnJhZ21lbnRzID0gW107XG4gICAgICB0aGlzLmdyaWRPcmRlciA9IFtdO1xuICAgIH1cbiAgICB0aGlzLndpZHRoU3R5bGUgPSBudWxsO1xuICAgIHRoaXMuZ3JpZE9yZGVyU3R5bGVzID0gW107XG4gICAgdGhpcy5ncmlkT3JkZXJGcmFnbWVudHMgPSBbXTtcbiAgICB0aGlzLnNjcm9sbGJhckFkanVzdG1lbnRGcmFnbWVudCA9IG51bGw7XG4gICAgdGhpcy5zY3JvbGxiYXJBZGp1c3RtZW50U3R5bGUgPSBudWxsO1xuXG4gICAgdGhpcy5zdHlsZXNCeUNsYXNzID0gW107XG4gICAgdGhpcy5jdXJyZW50Q2xhc3Nlc1RvUmVzaXplID0gW107XG4gICAgdGhpcy5zdGFydGluZ1dpZHRocyA9IFtdO1xuICAgIHRoaXMubWluV2lkdGhzID0gW107XG4gICAgdGhpcy5yZXNpemFibGVHcmlwcyA9IFtdO1xuICAgIHRoaXMucmVzaXphYmxlQ29sdW1ucyA9IFtdO1xuICAgIHRoaXMucmVvcmRlckdyaXBzID0gW107XG4gICAgdGhpcy5yZW9yZGVyYWJsZUNvbHVtbnMgPSBbXTtcbiAgICB0aGlzLmNvbHVtbnNXaXRoRGF0YUNsYXNzZXMgPSBbXTtcbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmluZmluaXRlU2Nyb2xsVmlld3BvcnRzID0gW107XG5cblxuICAgIHRoaXMuZ3JpZFRlbXBsYXRlQ2xhc3NlcyA9IFtdO1xuICAgIHRoaXMuZ3JpZE9yZGVyID0gW107XG4gICAgdGhpcy5jbGFzc1dpZHRocyA9IFtdO1xuICAgIHRoaXMuZ3JpZFRlbXBsYXRlVHlwZXMgPSBbXTtcbiAgICB0aGlzLmRyYWdnaW5nQ29sdW1uID0gbnVsbDtcbiAgICB0aGlzLmNvbFJhbmdlR3JvdXBzID0gW107XG4gICAgdGhpcy5sYXN0RHJhZ2dlZE92ZXJFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLm11dGF0aW9uUmVzaXphYmxlQ29sdW1ucyA9IFtdO1xuICAgIHRoaXMubXV0YXRpb25SZXNpemFibGVHcmlwcyA9IFtdO1xuICAgIHRoaXMubXV0YXRpb25SZW9yZGVyR3JpcHMgPSBbXTtcbiAgICB0aGlzLm11dGF0aW9uUmVvcmRlcmFibGVDb2x1bW5zID0gW107XG4gICAgdGhpcy5tdXRhdGlvbkNvbHVtbnNXaXRoRGF0YUNsYXNzZXMgPSBbXTtcbiAgICB0aGlzLm11dGF0aW9uUm93cyA9IFtdO1xuICAgIHRoaXMubXV0YXRpb25JbmZpbml0ZVNjcm9sbFZpZXdwb3J0cyA9IFtdO1xuXG4gICAgdGhpcy5oZWFkU3R5bGUgPSBudWxsO1xuICAgIHRoaXMuc3R5bGVMaXN0ID0gW107XG4gICAgdGhpcy5pbml0aWFsV2lkdGhzID0gW107XG4gICAgdGhpcy5sYXN0Q29sdW1ucyA9IFtdO1xuXG4gICAgdGhpcy5wb2ludGVyTGlzdGVuZXJGdW5jID0gbnVsbDtcblxuICAgIHRoaXMucGFyZW50R3JvdXBzID0gW107XG5cbiAgICB0aGlzLmNvbERhdGEgPSBudWxsO1xuICAgIHRoaXMuY29sRGF0YUdyb3VwcyA9IFtdO1xuICAgIHRoaXMuZWxlbWVudHNXaXRoSGlnaGxpZ2h0ID0gW107XG4gIH1cblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTb3J0YWJsZVdpZHRoSXRlbSB7XG4gIG1pbldpZHRoOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xufVxuIl19