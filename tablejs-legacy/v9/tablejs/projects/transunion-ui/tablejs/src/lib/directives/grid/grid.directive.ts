import { AfterViewInit, ComponentRef, ComponentFactory, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, OnDestroy, Inject, Input, Output, ViewContainerRef } from '@angular/core';
import { DragAndDropGhostComponent } from './../../components/drag-and-drop-ghost/drag-and-drop-ghost.component';
import { DOCUMENT } from '@angular/common';
import * as domtoimage from 'dom-to-image-improved';
import { TablejsGridProxy } from './../../shared/classes/tablejs-grid-proxy';
import { GridService } from './../../services/grid/grid.service';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { IColumnData } from './../../shared/interfaces/i-column-data';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { GridEvent } from './../../shared/classes/events/grid-event';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { ScrollDispatcherService } from './../../services/scroll-dispatcher/scroll-dispatcher.service';
import { OperatingSystemService } from './../../services/operating-system/operating-system.service';
import { ResizeSensor } from 'css-element-queries';
import { Subscription } from 'rxjs';


@Directive({
  selector: '[tablejsGrid],[tablejsgrid]',
  host: { class: 'tablejs-table-container tablejs-table-width' }
})
export class GridDirective extends TablejsGridProxy implements AfterViewInit, OnDestroy {

  dragging: boolean = false;
  reordering: boolean = false;
  startX: number = 0;
  startY: number = 0;
  stylesByClass: any[] = [];
  id: string | null = null;
  viewport: HTMLElement | null = null;
  viewportID: string | null = null;
  currentClassesToResize: string[] = [];
  startingWidths: number[] = [];
  minWidths: number[] = [];
  totalComputedMinWidth: number = 0;
  totalComputedWidth: number = 0;
  defaultTableMinWidth: number = 25;
  gridTemplateClasses: string[] = [];
  gridOrder: number[] = [];
  classWidths: any[] = [];
  gridTemplateTypes: any[] = [];
  draggingColumn: HTMLElement | null = null;
  colRangeGroups: number[][][] = [];
  lastDraggedOverElement: any = null;
  lastDraggedGroupIndex: number = -1;
  lastDraggedOverRect: ClientRect | null = null;
  lastDraggedGroupBoundingRects: ClientRect[] | null = null;
  lastMoveDirection: number = -1;
  resizableColumns: HTMLElement[] = [];
  resizableGrips: HTMLElement[] = [];
  reorderGrips: HTMLElement[] = [];
  reorderableColumns: HTMLElement[] = [];
  columnsWithDataClasses: HTMLElement[] = [];
  rows: HTMLElement[] = [];
  infiniteScrollViewports: HTMLElement[] = [];
  mutationResizableColumns: HTMLElement[] = [];
  mutationResizableGrips: HTMLElement[] = [];
  mutationReorderGrips: HTMLElement[] = [];
  mutationReorderableColumns: HTMLElement[] = [];
  mutationColumnsWithDataClasses: HTMLElement[] = [];
  mutationRows: HTMLElement[] = [];
  mutationInfiniteScrollViewports: HTMLElement[] = [];
  headTag: HTMLHeadElement = this.document.getElementsByTagName('head')[0];
  styleContent: string = '';
  headStyle: HTMLStyleElement | null = null;
  styleList: HTMLStyleElement[] = [];
  initialWidths: any[] = [];
  initialWidthsAreSet: boolean | undefined = undefined;
  lastColumns: any[] = [];
  contentResizeSensor: ResizeSensor | null = null;
  observer: MutationObserver | null = null;
  isCustomElement: boolean = false;

  parentGroups: Element[][] = [];

  colData: IColumnData | null = null;
  colDataGroups: IColumnData[][] = [];
  elementsWithHighlight: any[] = [];

  dragAndDropGhostComponent: DragAndDropGhostComponent | null = null;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;
  reorderHandleColOffset: number = 0;
  scrollbarWidth: number = 0;

  initialWidthSettingsSubscription$: Subscription;

  // class used for setting order
  reorderableClass: string = 'reorderable-table-row';

  // fragments
  widthStyle: HTMLStyleElement | null = null;
  widthStyleFragment: DocumentFragment | null = null;
  reorderHighlightStyle: HTMLStyleElement | null = null;
  reorderHighlightStyleFragment: DocumentFragment | null = null;
  subGroupStyles: HTMLStyleElement[] = [];
  subGroupFragments: (DocumentFragment | null)[] = [];
  gridOrderStyles: HTMLStyleElement[] = [];
  gridOrderFragments: (DocumentFragment | null)[] = [];
  subGroupStyleObjs: any = {};
  scrollbarAdjustmentFragment: DocumentFragment | null = null;
  scrollbarAdjustmentStyle: HTMLStyleElement | null = null;

  scrollViewportDirective: ScrollViewportDirective | null = null;

  @Input() dragAndDropGhostFilter: Function | null = null;
  @Input() linkClass: string | undefined = undefined;
  @Input() resizeColumnWidthByPercent: boolean = false;

  @Output() columnResizeStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnResize: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnResizeEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnReorder: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnReorderStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() dragOver: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnReorderEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() preGridInitialize: EventEmitter<any> = new EventEmitter<any>(true);
  @Output() gridInitialize: EventEmitter<any> = new EventEmitter<any>(true);

  constructor(
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private gridService: GridService,
    private directiveRegistrationService: DirectiveRegistrationService,
    @Inject(DOCUMENT) private document: any,
    private scrollDispatcherService: ScrollDispatcherService,
    private operatingSystem: OperatingSystemService) {
    super();

    this.registerDirectiveToElement();
    this.attachMutationObserver();
  }

  private registerDirectiveToElement() {
    this.elementRef.nativeElement.gridDirective = this;
    this.elementRef.nativeElement.parentElement.gridDirective = this;
  }

  private attachMutationObserver(): void {
    const ths: any = this;
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
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

  private updateMutations(mutation: MutationRecord): void {
    if (mutation.type === 'childList') {
      const addedNodes = Array.from(mutation.addedNodes);
      addedNodes.forEach(node => {

        this.directiveRegistrationService.registerNodeAttributes(node);
        this.getChildNodes(node);
      });
    }
  }

  private getChildNodes(node: any) {
    node.childNodes.forEach((childNode: any) => {
      this.directiveRegistrationService.registerNodeAttributes(childNode);
      if (childNode.getAttribute) {
        this.getChildNodes(childNode);
      }
    });
  }

  public ngAfterViewInit() {
    this.headStyle = document.createElement('style');
    this.headStyle.type = 'text/css';
    this.headTag.appendChild(this.headStyle);

    const viewport = this.elementRef.nativeElement.querySelector('*[tablejsScrollViewport');
    if (viewport !== null && (viewport.scrollViewportDirective === null || viewport.scrollViewportDirective === undefined)) {
      // attach directive
      const viewportRef: ElementRef = new ElementRef(viewport);

      this.scrollViewportDirective = new ScrollViewportDirective(
        viewportRef,
        this.gridService,
        this.document,
        this.directiveRegistrationService,
        this.scrollDispatcherService,
        this.operatingSystem,
        null,
        null
      );

      this.scrollViewportDirective.registerCustomElementsInputs(viewport);

      this.scrollViewportDirective.ngOnInit();
      this.scrollViewportDirective.ngAfterViewInit();

    }

    // Close observer if directives are registering

    this.elementRef.nativeElement.directive = this;
    if (!this.document['hasPointerDownListener']) {
      this.document.addEventListener('pointerdown', (e: Event) => {
        let el: HTMLElement | any | null = e.target as HTMLElement;
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

  private onEnterFrame(ths: any, timestamp: any) {
    if (this.columnsWithDataClasses.length > 0) {
      this.observer!.disconnect();
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

    const allElementsWithDataResizable: any = this.columnsWithDataClasses;
    const el = allElementsWithDataResizable[0];
    const resizeClasses: string[] = this.getResizableClasses(el);
    const resizeCls = resizeClasses[0];
    const firstEl: HTMLElement = this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];

    this.initialWidthSettingsSubscription$ = this.gridService.containsInitialWidthSettings.subscribe(hasWidths => {
      this.initialWidthsAreSet = hasWidths;
    });

    if (this.parentGroups.length === 0) {
      this.setParentGroups(allElementsWithDataResizable);
    }
    const maxColumnsPerRow: number = this.parentGroups[this.parentGroups.length - 1].length;

    if (firstEl === undefined || firstEl === null) {
      window.requestAnimationFrame((tmstamp) => {
        ths.onEnterFrame(ths, tmstamp);
      });
    } else {
      const keys: any[] = Object.keys(this.initialWidths);
      if (this.initialWidthsAreSet === true && keys.length < maxColumnsPerRow) {
        window.requestAnimationFrame((tmstamp) => {
          ths.awaitWidths(ths, tmstamp);
        });
      } else {
        this.checkForGridInitReady();
      }
    }
  }

  private setParentGroups(allElementsWithDataResizable: any[]): void {
    const colSpans: number[] = [];
    let currSpanCount: number = 0;
    let lastParent = null;
    let children!: Element[];
    let columnStart: number = 1;
    let colRanges: number[][] = [];

    this.colRangeGroups.push(colRanges);

    let item: any;
    for (let index = 0; index < allElementsWithDataResizable.length; index++) {
      item = allElementsWithDataResizable[index];

      const span: number = this.getColSpan(item);

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

  public checkForGridInitReady(): void {
    const allElementsWithDataResizable: any = this.columnsWithDataClasses;
    const el = allElementsWithDataResizable[0];
    const resizeClasses: string[] = this.getResizableClasses(el);
    const resizeCls: any = resizeClasses[0];
    const keys: any[] = Object.keys(this.initialWidths);
    const maxColumnsPerRow: number = this.parentGroups[this.parentGroups.length - 1].length;

    if (this.initialWidthsAreSet === true && (keys.length < maxColumnsPerRow || !this.initialWidths[resizeCls])) {
      window.requestAnimationFrame((tmstamp) => {
        this.awaitWidths(this, tmstamp);
      });
    } else if (this.initialWidthsAreSet === undefined) {
      window.requestAnimationFrame((tmstamp) => {
        this.awaitWidths(this, tmstamp);
      });
    } else {
      if (!this.linkClass) {
        this.initGrid();
      } else {
        window.requestAnimationFrame((tmstamp) => {
          this.awaitSingleFrame(this, tmstamp);
        });
      }
    }
  }

  private awaitWidths(ths: any, timestamp: any) {
    this.checkForGridInitReady();
  }

  private awaitSingleFrame(ths: any, timestamp: any) {
    this.initGrid();
  }

  private onPointerDown(event: any) {
    
    this.addPointerListeners();

    if (!this.getResizeGripUnderPoint(event)) {
      return;
    }
    // only drag on left mouse button
    if (event.button !== 0) { return; }
    
    // disables unwanted drag and drop functionality for selected text in browsers
    this.clearSelection();

    const el: HTMLElement = this.elementRef.nativeElement;
    let resizeHandles: HTMLElement[];

    if (this.elementRef.nativeElement.reordering) {
      return;
    }

    const reorderHandlesUnderPoint: Element[] = this.getReorderHandlesUnderPoint(event);
    const colsUnderPoint: Element[] = this.getReorderColsUnderPoint(event);
    if (reorderHandlesUnderPoint.length > 0 && colsUnderPoint.length > 0) {
      this.elementRef.nativeElement.reordering = true;
      this.draggingColumn = colsUnderPoint[0] as HTMLElement;

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
      const elRect: any = this.draggingColumn.getBoundingClientRect();
      this.dragOffsetX = (event.pageX - elRect.left) - window.scrollX;
      this.dragOffsetY = (event.pageY - elRect.top) - window.scrollY;

      this.removeDragAndDropComponent();
      this.createDragAndDropComponent();

      const dragNDropX = event.pageX - this.dragOffsetX;
      const dragNDropY = event.pageY - this.dragOffsetY;
      this.setDragAndDropPosition(dragNDropX, dragNDropY);

      this.copyColumnToJPeg();
      this.setReorderHighlightHeight(this.draggingColumn);

      this.lastDraggedOverElement = this.draggingColumn;
      this.parentGroups.forEach((arr, index) => {
        if (arr.indexOf(this.lastDraggedOverElement) !== -1) {
          this.lastDraggedGroupIndex = index;
        }
      });
      this.reorderHandleColOffset = (reorderHandlesUnderPoint[0] as HTMLElement).getBoundingClientRect().left - this.draggingColumn.getBoundingClientRect().left;
      this.lastDraggedGroupBoundingRects = this.parentGroups[this.lastDraggedGroupIndex].map(item => {
        const boundingRect = item.getBoundingClientRect();
        const rect: any = {
          left: (item as HTMLElement).getBoundingClientRect().left + this.getContainerScrollCount(item as HTMLElement),
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
      const resizableElements: Element[] = document.elementsFromPoint(event.clientX, event.clientY);

      const els: Element[] = resizableElements.filter(item => {
        let handleItem: Element | null = null;
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
    const elements: Element[] = this.getResizableElements(event);
    if (elements.length === 0) {
      return;
    }

    this.totalComputedMinWidth = 0;
    this.totalComputedWidth = 0;
    this.minWidths = [];
    this.startingWidths = [];
    this.currentClassesToResize = this.getResizableClasses(elements[0]);

    elements.forEach(resizeableElement => {
      this.lastColumns.forEach(lastColumns => {
        if ((resizeableElement === lastColumns.child) && this.resizeColumnWidthByPercent) {
          this.dragging = false;
        }
      });
    });


    this.currentClassesToResize.forEach(className => {
      const firstEl: Element = this.elementRef.nativeElement.querySelector('.' + className);
      const startingWidth: string = window.getComputedStyle(firstEl).getPropertyValue('width');
      let wdth: number = Number(startingWidth.substr(0, startingWidth.length - 2)); // remove px
      this.totalComputedWidth += wdth;
      this.startingWidths.push(wdth);

      const minWidth: string = window.getComputedStyle(firstEl).getPropertyValue('min-width');
      wdth = Number(minWidth.substr(0, minWidth.length - 2)); // remove px
      wdth = Number(wdth) < this.defaultTableMinWidth ? this.defaultTableMinWidth : wdth; // account for minimum TD size in tables
      this.totalComputedMinWidth += wdth;
      this.minWidths.push(wdth);
    });
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

  private copyColumnToJPeg() {
    if (this.dragAndDropGhostFilter === undefined) {
      this.dragAndDropGhostFilter = (el: HTMLElement) => {
        return el.tagName !== 'I';
      };
    }

    if (this.dragAndDropGhostFilter !== undefined) {
      domtoimage.toPng(this.draggingColumn, { quality: 0.9, filter: this.dragAndDropGhostFilter })
      .then((dataUrl: any) => {
        const img: HTMLImageElement = new Image();
        img.src = dataUrl;
        this.setDragAndDropHTML(img.outerHTML);
      })
      .catch(function (error: any) {
        console.error('oops, something went wrong!', error);
      });
    }
  }

  private getContainerScrollCount(el: HTMLElement | null): number {

    if (!el) {
      return 0;
    }
    let scrollXCount: number = el.scrollLeft;
    while (el !== document.body) {
      el = el!.parentElement;
      scrollXCount += el!.scrollLeft;
    }

    // include scrolling on tablejs-grid component
    scrollXCount += el!.parentElement!.scrollLeft;

    return scrollXCount;
  }

  private onPointerMove(event: any) {
    const ths: GridDirective = document['currentGridDirective'];

    if (ths.elementRef.nativeElement.reordering) {

      ths.clearSelection();
      const containerRect: any = (ths.viewContainerRef.element.nativeElement as HTMLElement).getBoundingClientRect();
      const dragNDropX = event.pageX - ths.dragOffsetX;
      const dragNDropY = event.pageY - ths.dragOffsetY;
      ths.setDragAndDropPosition(dragNDropX, dragNDropY);

      const reorderCols: HTMLElement[] = this.reorderableColumns;
      const trueMouseX: number = event.pageX - ths.reorderHandleColOffset + ths.getContainerScrollCount(ths.draggingColumn);

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

      let moveDirection: number = 0;
      let currentRect: ClientRect;
      let currentColIndex: number | undefined;

      for (const rect of ths.lastDraggedGroupBoundingRects!) {

        if (trueMouseX > rect.left && trueMouseX < rect.left + rect.width) {
          const elX: number = rect.left;
          const elW: number = rect.width;

          if ((trueMouseX - elX) >= elW / 2) {
            moveDirection = 1;
          } else {
            moveDirection = 0;
          }
          currentRect = rect;
          currentColIndex = ths.lastDraggedGroupBoundingRects!.indexOf(rect);
          break;
        }
      }

      if (currentColIndex === undefined) {
        return;
      }
      if (ths.lastDraggedOverRect === currentRect! && ths.lastMoveDirection === moveDirection) {
        return;
      }
      ths.lastMoveDirection = moveDirection;
      ths.lastDraggedOverRect = currentRect!;

      ths.removeElementHighlight(ths.lastDraggedOverElement);
      ths.removeHighlights(ths.lastDraggedOverElement, moveDirection);

      const draggableInColumn: Element = ths.parentGroups[ths.lastDraggedGroupIndex][currentColIndex];

      ths.lastDraggedOverElement = draggableInColumn;

      let colRangeDraggedParentInd: number = -1;
      let colRangeDraggedChildInd: number = -1;
      let colRangeDroppedParentInd: number = -1;
      let colRangeDroppedChildInd: number = -1;
      let draggedInd: number = -1;
      let droppedInd: number = -1;
      let draggedGroup: Element[] | null = null;
      const pGroup: any = ths.parentGroups.forEach((group, groupInd) =>
        group.forEach(
          (item, index) => {
            if (item === ths.draggingColumn) {
              colRangeDraggedParentInd = groupInd;
              colRangeDraggedChildInd = index;
              draggedInd = index;
              draggedGroup = group;
            }
            if (item === ths.lastDraggedOverElement) {
              colRangeDroppedParentInd = groupInd;
              colRangeDroppedChildInd = index;
              droppedInd = index;
            }
          }
        )
      );

      if (ths.draggingColumn === ths.lastDraggedOverElement) {
        return;
      }
      let parentRanges: number[][] | null = null;
      const tempRanges: number[][][] = ths.colRangeGroups.concat();
      let parentRangeIndex: number = -1;
      tempRanges.sort((a, b) => b.length - a.length);
      tempRanges.forEach((item, index) => {
        if (!parentRanges && item.length < draggedGroup!.length) {
          parentRanges = item;
          parentRangeIndex = ths.colRangeGroups.indexOf(item);
        }
      });
      const fromOrder: number = (colRangeDraggedChildInd + 1);
      const toOrder: number = (colRangeDroppedChildInd + 1);

      // if has to stay within ranges, get ranges and swap
      if (parentRanges !== null) {
        ths.colRangeGroups[parentRangeIndex].forEach(
          range => {
            const lowRange: number = range[0];
            const highRange: number = range[1];
            if (fromOrder >= lowRange && fromOrder < highRange && toOrder >= lowRange && toOrder < highRange) {
              if (colRangeDraggedParentInd === colRangeDroppedParentInd) {
                if (moveDirection === 1) {
                  ths.lastDraggedOverElement.classList.add('highlight-right');
                } else {
                  ths.lastDraggedOverElement.classList.add('highlight-left');
                }
                ths.elementsWithHighlight.push({ el: ths.lastDraggedOverElement, moveDirection });
              }
            }
          }
        );
      } else {
        if (colRangeDraggedParentInd === colRangeDroppedParentInd) {
          if (moveDirection === 1) {
            ths.lastDraggedOverElement.classList.add('highlight-right');
          } else {
            ths.lastDraggedOverElement.classList.add('highlight-left');
          }
          ths.elementsWithHighlight.push({ el: ths.lastDraggedOverElement, moveDirection });
        }
      }
    }
    
    if (!ths.dragging) {
      return;
    }
    const mouseOffset: number = Math.round(event.clientX) - Math.round(ths.startX);
    const widthsNeedUpdating: boolean = Math.round(event.clientX) !== ths.startX;
    ths.startX = Math.round(event.clientX); // reset starting X
    const newWidth: number = ths.totalComputedWidth + mouseOffset;
    const allowableWidthChange: number = newWidth - ths.totalComputedMinWidth;

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

  private updateWidths(newWidth: number) {

    const currentWidths: number[] = [];
    const styles: string[] = [];

    const cssClassesToFilter = this.currentClassesToResize.filter(resizeClass => {
      const firstEl: Element = this.elementRef.nativeElement.querySelector('.' + resizeClass);
      let wdth: string = window.getComputedStyle(firstEl).getPropertyValue('width');
      wdth = wdth.substr(0, wdth.length - 2); // remove px
      currentWidths.push(Number(wdth));
      let found: boolean = false;
      this.stylesByClass.map((item, index) => {

        if (resizeClass === item.resizeClass) {
          found = true;
          styles.push(this.stylesByClass[index]);
        }
      });
      return found;
    });

    const sortableWidths: any[] = [];
    currentWidths.map((w, index) => {
      sortableWidths.push(
        {
          minWidth: this.minWidths[index],
          width: w,
          widthDifference: w - this.minWidths[index],
          className: cssClassesToFilter[index],
          style: styles[index]
        }
      );
    });

    // sort objects by width in ascending order
    sortableWidths.sort((a, b) => {
      if (a.widthDifference < b.widthDifference) { return -1; }
      if (a.widthDifference > b.widthDifference) { return 1; }
      return 0;
    });

    const len: number = sortableWidths.length;
    let remainingWidth: number = this.totalComputedWidth - newWidth;
    let styleText = '';

    sortableWidths.forEach((item, index) => {


      const itemsRemaining: number = len - index;
      const maxPercOfRemaining: number = 1 / itemsRemaining;
      let amountMoved: number = 0;
      const resizeID: string = this.id + ' .' + item.className;
      const markupItem: any = this.stylesByClass.filter(style => style.id === resizeID)[0];

      if (item.width - item.minWidth < maxPercOfRemaining * remainingWidth) {
        const maxMovement: number = item.width - item.minWidth;
        amountMoved = item.width - item.minWidth;
      } else {
        amountMoved = maxPercOfRemaining * remainingWidth;
      }
      amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points

      if (this.classWidths[this.gridTemplateClasses.indexOf(item.className)].toString().includes('%')) {

        const columnIndex = this.gridTemplateClasses.indexOf(item.className);
        let currentWidthInPercent = this.classWidths[this.gridTemplateClasses.indexOf(item.className)].replace('%', '');
        currentWidthInPercent = Number(currentWidthInPercent);
        const currentWidthInPixel = item.width;
        const totalWidth = (currentWidthInPixel * 100) / currentWidthInPercent;
        const adujustedWidth = (item.width - amountMoved);
        let adjustedWidthInPercent = ((adujustedWidth * 100) / totalWidth);
        adjustedWidthInPercent = Math.round(adjustedWidthInPercent * 1000) / 1000;

        const widthDiff = currentWidthInPercent - adjustedWidthInPercent;
        const t = Math.round(widthDiff * 1000) / 1000; // round off to three
        let maxIndex = -1;
        sortableWidths.forEach(classItem => {
          const columnIndx = this.gridTemplateClasses.indexOf(classItem.className);
          const x = this.gridOrder.indexOf(columnIndx + 1);
          if (maxIndex < x) {
            maxIndex = x;
          }
        });
        const tc = this.gridOrder.length - (maxIndex + 1); // adjust from next column
        const previousVal = this.classWidths[columnIndex];
        this.classWidths[columnIndex] = adjustedWidthInPercent + '%';

        let totalSum = 0;
        for (let it = 0; it < this.classWidths.length; it++) {
          let temp = this.classWidths[it];
          temp = temp.includes('%') ? temp.replace('%', '') : temp;
          totalSum += (+temp);
        }
        let totalDiff = 0;
        if (totalSum > 100 || totalSum < 100) {
          totalDiff = 100 - totalSum;
          totalDiff = Math.round(totalDiff * 1000) / 1000;
        }
        // if totaldiff is positive need to add to width if -ve reduce from widths
        let perColumn = totalDiff / tc;
        perColumn = Math.round(perColumn * 1000) / 1000;
        for (let i = maxIndex + 1; i < this.gridOrder.length; i++) {
          const classIndex = this.gridOrder[i] - 1;
          let x = this.classWidths[classIndex];
          if (x.toString().includes('%')) {
            x = x.replace('%', '');
          }

          const width = Math.round(((+x) + perColumn) * 1000) / 1000;
          if (width < 1) {
            perColumn = perColumn + (perColumn / ((this.gridOrder.length - 1) - i));
            if (!isFinite(perColumn)) {
              this.classWidths[columnIndex] = previousVal;
            }
          } else {
            this.classWidths[classIndex] = ((+x) + perColumn).toFixed(2) + '%';
          }
        }

      } else {
        this.classWidths[this.gridTemplateClasses.indexOf(item.className)] = (item.width - amountMoved);
      }

      const gridTemplateColumns: string = this.constructGridTemplateColumns();

      this.gridTemplateTypes.forEach(styleObj => {
        styleObj.style.innerHTML = this.id + ' .' + this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
        this.setStyleContent();
        this.moveStyleContentToProminent();
      });

      let markup = resizeID + ' { width: ' + (item.width - amountMoved) + 'px }';
      markupItem.markup = markup;

      if (markupItem.width.toString().includes('%')) {
        markup = resizeID + ' { width: 100% }';
        markupItem.markup = markup;
        let currentWidthInPercent = markupItem.width.replace('%', '');
        currentWidthInPercent = Number(currentWidthInPercent);
        const currentWidthInPixel = item.width;
        const totalWidth = (currentWidthInPixel * 100) / currentWidthInPercent;
        const adujustedWidth = (item.width - amountMoved);
        const adjustedWidthInPercent = ((adujustedWidth * 100) / totalWidth).toFixed(2);
        markupItem.wdth = adjustedWidthInPercent + '%';

      } else {
        markupItem.width = (item.width - amountMoved).toString();
      }
      // markupItem.width = (item.width - amountMoved).toString();
      styleText += markup;

      this.totalComputedWidth -= amountMoved;
      remainingWidth -= amountMoved;
    });

    this.generateWidthStyle();
  }

  private generateWidthStyle() {
    let innerHTML = '';
    this.stylesByClass.forEach(item => {
      innerHTML += item.markup;
    });
    this.widthStyle!.innerHTML = innerHTML;
    this.setStyleContent();
  }

  private getResizableClasses(el: Element | any): string[] {
    return el ? el['dataClasses'] : null;
  }

  private setResizableStyles() {

    const allElementsWithDataResizable: any = this.columnsWithDataClasses;
    let el: Element;
    const classesUsed: string[] = [];

    let fragment: DocumentFragment;
    let style: HTMLStyleElement;
    let styleText = '';

    if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
      fragment = document.createDocumentFragment();
      style = document.createElement('style');
      style.type = 'text/css';
    } else {
      fragment = this.gridService.linkedDirectiveObjs[this.linkClass].widthStyleFragment;
      style = this.gridService.linkedDirectiveObjs[this.linkClass].widthStyle;
    }
    let markup: string;

    if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
      for (let i = 0; i < allElementsWithDataResizable.length; i++) {
        el = allElementsWithDataResizable[i];
        const resizeClasses: string[] = this.getResizableClasses(el);

        resizeClasses.forEach((resizeCls: any) => {
          if (classesUsed.indexOf(resizeCls) === -1) {
            const firstEl: HTMLElement = this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];
            const startingWidth = !!this.initialWidths[resizeCls] ? this.initialWidths[resizeCls] : firstEl.offsetWidth;
            // Override percentage if we have widthPercent enabled
            const startingWidthPercent = this.initialWidths[resizeCls];
            const resizeID: string = this.id + ' .' + resizeCls;
            if (this.resizeColumnWidthByPercent || startingWidth.toString().includes('%')) {
              markup = resizeID + ' { width: ' + 100 + '%}';
              this.resizeColumnWidthByPercent = true;
            } else {
              markup = resizeID + ' { width: ' + startingWidth + 'px }';
            }
            styleText += markup;
            this.stylesByClass.push({ style, id: resizeID, resizeClass: resizeCls, markup, width: startingWidth });
            classesUsed.push(resizeCls);
          }
        });
      }
    } else {
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
        this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass = this.stylesByClass;
      }
      this.gridService.linkedDirectiveObjs[this.linkClass].widthStyleFragment = fragment;
      this.gridService.linkedDirectiveObjs[this.linkClass].widthStyle = style;
    }
  }

  private addStyle(style: HTMLStyleElement, addToContent: boolean = true): void {
    if (this.styleList.indexOf(style) === -1) {
      this.styleList.push(style);
    }
    if (addToContent) {
      this.setStyleContent();
    }
  }

  private setStyleContent(): void {
    this.styleContent = '';
    this.styleList.forEach(style => {
      this.styleContent += style.innerHTML;
    });
    this.headStyle!.innerHTML = this.styleContent;
  }

  public moveStyleContentToProminent(): void {
    this.headTag.appendChild(this.headStyle!);
  }

  private setReorderStyles() {
    if (this.linkClass === undefined || (this.gridService.linkedDirectiveObjs[this.linkClass] && this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle === undefined)) {
      const fragment: DocumentFragment = document.createDocumentFragment();
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
    } else {
      this.reorderHighlightStyle = this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle;
      this.reorderHighlightStyleFragment = this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyleFragment;
    }
  }

  private getColSpan(element: Element): number {
    const colSpan: string | null = element.getAttribute('colspan');
    return colSpan === null ? 1 : Number(colSpan);
  }

  private validateColumnSpansAreTheSame(colSpans: number[]) {

    if (colSpans.length === 0) {
      throw Error('No columns appear to exist.');
    }
    const colLength: number = colSpans[0];
    const invalidColLengths: number[] = colSpans.filter(item => item !== colLength);
    if (invalidColLengths.length > 0) {
      throw Error('Grid column lengths do not match.  Please check your colspans.');
    }
  }

  private onPointerUp(event: any) {

    const ths: GridDirective = document['currentGridDirective'];
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
      ths.draggingColumn!.classList.remove('dragging');
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

  private addPointerListeners() {
    this.document['currentGridDirective'] = this;
    this.document.addEventListener('pointermove', this.onPointerMove);
    this.document.addEventListener('pointerup', this.onPointerUp);
  }
  private removePointerListeners() {
    this.document['currentGridDirective'] = null;
    this.document.removeEventListener('pointermove', this.onPointerMove);
    this.document.removeEventListener('pointerup', this.onPointerUp);
  }

  private endDrag(event: any): void {
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

  private initGrid() {
    this.generateContainerID();
    this.generateViewportID();
    this.attachContentResizeSensor();
    this.setResizableStyles();
    this.setReorderStyles();
    this.generateColumnGroups();

    let highestLen: number = 0;
    let ind: number = -1;
    let group: any;

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

    if (this.linkClass !== undefined && this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass) {
      this.stylesByClass = this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass;
      this.classWidths = this.gridService.linkedDirectiveObjs[this.linkClass].classWidths;
    }
    if (this.linkClass !== undefined && this.gridService.linkedDirectiveObjs[this.linkClass].classWidths) {
      this.classWidths = this.gridService.linkedDirectiveObjs[this.linkClass].classWidths;
    } else {
      this.classWidths = this.calculateWidthsFromStyles();
      if (this.linkClass) {
        this.gridService.linkedDirectiveObjs[this.linkClass].classWidths = this.classWidths;
      }
    }

    this.setGridOrder();
    this.emitGridInitialization();
  }

  private calculateWidthsFromStyles(): any[] {
    if (!this.stylesByClass[0].width.toString().includes('%') && this.classWidths.length === 0 && this.resizeColumnWidthByPercent) {
      return this.stylesByClass.map((styleObj, index) => {
        return (Math.round((1 / this.stylesByClass.length) * 10000) / 100).toString() + '%';
      });
    } else {
      return this.stylesByClass.map((styleObj, index) => {
        if (styleObj.width.toString().includes('%')) {
          return styleObj.width;
        } else {
          return Number(styleObj.width);
        }
      });
    }
  }

  private emitGridInitialization() {
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

  private createDragAndDropComponent() {
    const factory: ComponentFactory<DragAndDropGhostComponent> = this.resolver.resolveComponentFactory(DragAndDropGhostComponent);
    const componentRef: ComponentRef<DragAndDropGhostComponent> = this.viewContainerRef.createComponent(factory);
    this.dragAndDropGhostComponent = componentRef.instance;
  }

  private setDragAndDropPosition(x: number, y: number) {
    this.dragAndDropGhostComponent!.left = x;
    this.dragAndDropGhostComponent!.top = y;
  }

  private setDragAndDropHTML(html: string) {
    this.dragAndDropGhostComponent!.html = html;
  }

  private removeDragAndDropComponent() {
    this.viewContainerRef.clear();
  }

  private generateColumnGroups() {
    if (this.linkClass && this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups) {
      this.colDataGroups = this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups;
    } else {
      const allElementsWithDataResizable: any = this.columnsWithDataClasses;
      const arr: Element[] = allElementsWithDataResizable;
      let colOrder: number = 1;
      let lastParent = null;
      let lastGroup: IColumnData[] | null = null;
      let lastOrder: number = 0;
      let lastIndex: number = 0;
      let spanCount: number = 0;
      let colDataGroup: any[] = [];

      this.colDataGroups.push(colDataGroup);
      let item: any;
      for (let index = 0; index < arr.length; index++) {
        item = arr[index];
        let lastDataSpan: number = !!this.colData ? this.colData.span : 0;
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
          lastDataSpan = 0;
        }
        colOrder = index + 1 - lastOrder;
        if (lastGroup !== null) {
          if (lastGroup[lastIndex].span < (colOrder - spanCount)) {
            spanCount += lastGroup[lastIndex].span;
            lastIndex++;
          }

        }
        this.colData = {
          order: (colOrder - spanCount),
          lastDataSpan: (colOrder - spanCount),
          nthChild: colOrder,
          span: this.getColSpan(item),
          subGroups: [],
          parent: item.parentElement,
          child: item
        };
        colDataGroup.push(this.colData);
      }
    }

    if (this.linkClass) {
      this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups = this.colDataGroups;
    }

    let columnGroup: any;
    for (let index = 0, len = this.colDataGroups.length; index < len; index++) {
      columnGroup = this.colDataGroups[index];
      if (index < this.colDataGroups.length - 1) {
        this.generateSubGroup(columnGroup, this.colDataGroups[index + 1]);
      }
      if (index === 0) {
        this.orderSubGroups(columnGroup);
      }
    }
  }

  private generateSubGroup(currentGroup: any, subGroup: any): void {
    let indexCount: number = 0;
    currentGroup.forEach(
      (group: any, index: number) => {
        const groupSpan: number = group.span;
        for (let i = 0; i < groupSpan; i++) {
          group.subGroups.push(subGroup[indexCount]);
          indexCount++;
        }
      }
    );
  }

  private orderSubGroups(columnGroup: IColumnData[], columnPlacement: number = 1, placementStart: number = 0, parentOrder: number = 1) {
    let style: HTMLStyleElement;
    let containerID: string;
    let fragment: DocumentFragment;
    let selector: string;

    if (this.linkClass) {
      if (this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs) {
        this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs;
        this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles;
        this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments;
        this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder;
      } else {
        this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs = this.subGroupStyleObjs;
        this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles = this.subGroupStyles;
        this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments = this.subGroupFragments;
        this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder = this.gridOrder;
      }
    }

    placementStart = columnPlacement - 1;
    columnGroup.sort((columnData1: IColumnData, columnData2: IColumnData) => {
      return columnData1.order - columnData2.order;
    });

    columnGroup.forEach(columnData => {
      const tagName: string = columnData.child.tagName.toLowerCase();

      containerID = 'column-container-' + Array.from(columnData!.parent!.parentElement!.children).indexOf(columnData.parent);
      const parentIndex = Array.from(columnData!.parent!.parentElement!.children).indexOf(columnData.parent);
      columnData.parent.classList.add(containerID);
      selector = this.id + ' .' + containerID + ' ' + tagName + ':nth-child(' + (columnData.nthChild).toString() + ')';
      fragment = document.createDocumentFragment();

      if (this.subGroupStyleObjs[selector]) {
        style = this.subGroupStyleObjs[selector];
      } else {
        style = document.createElement('style');
        style.type = 'text/css';
        this.subGroupStyles.push(style);
        this.subGroupFragments.push(fragment);
      }
      style.innerHTML = selector + ' { grid-column-start: ' + (columnPlacement).toString() + '; grid-column-end: ' + (columnPlacement + columnData.span).toString() + '; order: ' + (columnData.order + placementStart).toString() + '; }';
      if (this.parentGroups[parentIndex]) {
        if ((this.parentGroups[parentIndex].length) === (columnData.order + placementStart)) {
          this.lastColumns[parentIndex] = columnData;
        }
      }

      if (this.subGroupStyleObjs[selector]) {
        fragment.appendChild(style);

        this.addStyle(style);

      }
      this.subGroupStyleObjs[selector] = style;

      if (columnData.subGroups.length > 0) {
        this.orderSubGroups(columnData.subGroups, columnPlacement, placementStart, columnData.lastDataSpan);
      } else {

        selector = this.id + ' ' + tagName + ':nth-child(' + (columnData.nthChild).toString() + ')';
        fragment = document.createDocumentFragment();
        if (this.subGroupStyleObjs[selector]) {
          style = this.subGroupStyleObjs[selector];
        } else {
          style = document.createElement('style');
          style.type = 'text/css';
          this.subGroupStyles.push(style);
          this.subGroupFragments.push(fragment);
        }
        style.innerHTML = selector + ' { grid-column-start: ' + (columnPlacement).toString() + '; grid-column-end: ' + (columnPlacement + columnData.span).toString() + '; order: ' + (columnData.order + placementStart).toString() + '; }';

        if (this.subGroupStyleObjs[selector]) {
          fragment.appendChild(style);

          this.addStyle(style);

        }
        this.subGroupStyleObjs[selector] = style;

        this.gridOrder[(columnData.order + placementStart) - 1] = columnData.nthChild;

        const hasSisterTag: boolean = tagName === 'th' || tagName === 'td';
        let sisterTag: string | null = null;
        if (hasSisterTag) {
          sisterTag = tagName === 'th' ? 'td' : 'th';

          selector = this.id + ' ' + sisterTag + ':nth-child(' + (columnData.nthChild).toString() + ')';
          fragment = document.createDocumentFragment();
          if (this.subGroupStyleObjs[selector]) {
            style = this.subGroupStyleObjs[selector];
          } else {
            style = document.createElement('style');
            style.type = 'text/css';
            this.subGroupStyles.push(style);
            this.subGroupFragments.push(fragment);
          }
          style.innerHTML = selector + ' { grid-column-start: ' + (columnPlacement).toString() + '; grid-column-end: ' + (columnPlacement + columnData.span).toString() + '; order: ' + (columnData.order + placementStart).toString() + '; }';

          if (this.subGroupStyleObjs[selector]) {
            fragment.appendChild(style);

            this.addStyle(style);

          }
          this.subGroupStyleObjs[selector] = style;
        }
      }
      columnPlacement += columnData.span;
    });
  }
  private setGridOrder(): void {
    const gridTemplateColumns: string = this.constructGridTemplateColumns();

    if (this.colDataGroups[0].length === 0) {
      return;
    }

    const reqiresNewStyleObjects: boolean = this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles === undefined;

    this.colDataGroups.forEach((columnGroup: IColumnData[], index) => {
      let style: HTMLStyleElement;
      let fragment: DocumentFragment;

      if (reqiresNewStyleObjects) {
        fragment = document.createDocumentFragment();
        style = document.createElement('style');
        style.type = 'text/css';
      } else {
        fragment = this.gridService.linkedDirectiveObjs[this.linkClass!].gridOrderFragments[index];
        style = this.gridService.linkedDirectiveObjs[this.linkClass!].gridOrderStyles[index];
      }
      style.innerHTML = this.id + ' .' + this.reorderableClass + ' { display: grid; grid-template-columns: ' + gridTemplateColumns + '; }';

      fragment.appendChild(style);
      if (reqiresNewStyleObjects) {
        this.gridOrderStyles.push(style);
        this.gridOrderFragments.push(fragment);
      }

      this.addStyle(style);
      this.moveStyleContentToProminent();

      this.gridTemplateTypes.push({ style });

      if (index === 0) {
        this.orderSubGroups(columnGroup);
      }
    });

    if (this.linkClass && this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles === undefined) {
      this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderFragments = this.gridOrderFragments;
      this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles = this.gridOrderStyles;
    }
  }

  private getOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  private getParentTablejsGridDirective(el: HTMLElement | null): HTMLElement | null {
    while (el !== null && el.getAttribute('tablejsGrid') === null) {
      el = el.parentElement;
    }
    return el;
  }

  private elementRefUnderPoint(event: any): boolean {
    const elements: Element[] = document.elementsFromPoint(event.clientX, event.clientY);
    console.log(elements, this.elementRef.nativeElement);
    return elements.filter(item => item === this.elementRef.nativeElement).length > 0;
  }

  private getResizeGripUnderPoint(event: any): Element[] {
    const resizableElements: Element[] = document.elementsFromPoint(event.clientX, event.clientY);
    const elements: Element[] = resizableElements.filter(item => {
      return item.getAttribute('resizableGrip') !== null;
    });
    return elements;
  }

  private getReorderColsUnderPoint(event: any): Element[] {
    const reorderColElements: Element[] = document.elementsFromPoint(event.clientX, event.clientY);
    const elements: Element[] = reorderColElements.filter(item => {
      return item.getAttribute('reorderCol') !== null;
    });
    return elements;
  }

  private getReorderHandlesUnderPoint(event: any): Element[] {
    const reorderGripElements: Element[] = document.elementsFromPoint(event.clientX, event.clientY);
    const elements: Element[] = reorderGripElements.filter(item => {
      return item.getAttribute('reorderGrip') !== null;
    });
    return elements;
  }

  private getResizableElements(event: any): Element[] {
    const resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
    let elements: Element[] = resizableElements.filter(item => {
      return item.getAttribute('tablejsDataColClasses') !== null;
    });

    const noElementsFound: boolean = elements.length === 0;
    const iterationLen: number = noElementsFound ? 1 : elements.length;

    for (let i: number = 0; i < iterationLen; i++) {
      const item = resizableElements[0];
      let parentElement: Element | null = item.parentElement;
      while(parentElement !== null) {
        const foundGripParent: boolean = !noElementsFound && parentElement === elements[i];
        const foundParentWithColClasses: boolean = noElementsFound && parentElement.getAttribute('tablejsDataColClasses') !== null;
        if (foundGripParent || foundParentWithColClasses) {
          elements = [parentElement];
          parentElement = null;
        } else {
          parentElement = parentElement!.parentElement;
        }
      }
    }
    return elements;
  }

  public removeHighlights(elToExclude: HTMLElement | null = null, moveDirection: number = -2): void {
    this.elementsWithHighlight.forEach(item => {
      if (item.el !== elToExclude || item.moveDirection !== moveDirection) {
        this.removeElementHighlight(item.el);
      }
    });
  }

  public removeElementHighlight(el: HTMLElement) {
    el.classList.remove('highlight-left');
    el.classList.remove('highlight-right');
  }

  private reorderColumns(event: any) {
    const draggableElement: HTMLElement = this.lastDraggedOverElement;
    const elRect: any = draggableElement.getBoundingClientRect();
    const elX: number = elRect.left;
    const elW: number = elRect.width;

    draggableElement.classList.remove('highlight-right');
    draggableElement.classList.remove('highlight-right');
    if (this.draggingColumn === draggableElement) {
      return;
    }
    let moveDirection: number = 0;
    if ((event.clientX - elX) >= elW / 2) {
      moveDirection = 1;
    } else {
      moveDirection = 0;
    }

    let colRangeDraggedParentInd: number = -1;
    let colRangeDraggedChildInd: number = -1;
    let colRangeDroppedParentInd: number = -1;
    let colRangeDroppedChildInd: number = -1;
    let draggedInd: number = -1;
    let droppedInd: number = -1;
    let draggedGroup: Element[] | null = null;

    const pGroup: any = this.parentGroups.forEach((group, groupInd) =>
      group.forEach(
        (item, index) => {
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
        }
      )
    );

    let parentRanges: number[][] | null = null;
    const tempRanges: number[][][] = this.colRangeGroups.concat();
    let parentRangeIndex: number = -1;
    tempRanges.sort((a, b) => b.length - a.length);
    tempRanges.forEach((item, index) => {
      if (!parentRanges && item.length < draggedGroup!.length) {
        parentRanges = item;
        parentRangeIndex = this.colRangeGroups.indexOf(item);
      }
    });
    const fromOrder: number = (colRangeDraggedChildInd + 1);
    const toOrder: number = (colRangeDroppedChildInd + 1);

    // if has to stay within ranges, get ranges and swap
    if (parentRanges !== null) {
      this.colRangeGroups[parentRangeIndex].forEach(
        range => {
          const lowRange: number = range[0];
          const highRange: number = range[1];
          const draggedLowRange: number = this.colRangeGroups[colRangeDraggedParentInd][colRangeDraggedChildInd][0];
          const draggedHighRange: number = this.colRangeGroups[colRangeDraggedParentInd][colRangeDraggedChildInd][1];
          if (fromOrder >= lowRange && fromOrder < highRange && toOrder >= lowRange && toOrder < highRange) {
            const data1: IColumnData = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === fromOrder)[0];
            const data2: IColumnData = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === toOrder)[0];
            const rangeGroup: IColumnData[] = this.colDataGroups[colRangeDraggedParentInd].slice(range[0] - 1, range[1] - 1);
            rangeGroup.sort((item1: IColumnData, item2: IColumnData) => {
              return item1.order - item2.order;
            });
            const origRangGroup = rangeGroup.concat();
            rangeGroup.splice(rangeGroup.indexOf(data1), 1);
            rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
            rangeGroup.forEach((item, index) => {
              item.order = index + 1;
            });
          }
        }
      );
    } else {
      const data1: IColumnData = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === fromOrder)[0];
      const data2: IColumnData = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === toOrder)[0];
      const rangeGroup: IColumnData[] = this.colDataGroups[colRangeDraggedParentInd].concat();
      rangeGroup.sort((item1: IColumnData, item2: IColumnData) => {
        return item1.order - item2.order;
      });
      const origRangGroup = rangeGroup.concat();
      rangeGroup.splice(rangeGroup.indexOf(data1), 1);
      rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
      rangeGroup.forEach((item, index) => {
        item.order = index + 1;
      });
    }

    this.setGridOrder();

    // need to set a class to resize - default to first so column widths are updated
    const t: number = this.totalComputedWidth;
    this.currentClassesToResize = [this.stylesByClass[0].resizeClass];
    this.updateWidths(t);
  }

  private constructGridTemplateColumns(): string {
    let str: string = '';
    this.gridOrder.forEach((order, index) => {
      let wdth: number = this.classWidths[order - 1];
      wdth = wdth < 0 ? 0 : wdth;
      if (this.classWidths[order - 1].toString().includes('%')) {
        str += ' ' + wdth.toString();
      } else {
        str += ' ' + wdth.toString() + 'px';
      }

    });
    return str;

  }

  private setReorderHighlightHeight(draggableElement: HTMLElement) {
    const draggableTop: number = this.getOffset(draggableElement).top;
    const containerTop: number = this.getOffset(this.elementRef.nativeElement).top;
    const containerHeightStr: string = window.getComputedStyle(this.elementRef.nativeElement).getPropertyValue('height');
    const containerHeight: number = Number(containerHeightStr.substr(0, containerHeightStr.length - 2));
    const highlightHeight: number = containerHeight - (draggableTop - containerTop) - 1;

    this.reorderHighlightStyle!.innerHTML = this.id + ' .highlight-left div:after, ' + this.id + ' .highlight-right div:after { height: ' + highlightHeight + 'px !important }';
    this.setStyleContent();
  }

  private retrieveOrCreateElementID(el: HTMLElement): string {
    let id: string | undefined | null = document.body.getAttribute('id');
    if (id === undefined || id === null) {
      id = 'tablejs-body-id';
    }
    document.body.setAttribute('id', id);
    return '#' + id;
  }

  private generateContainerID() {
    TablejsGridProxy.GRID_COUNT++;
    if (this.linkClass === undefined) {
      this.id = this.retrieveOrCreateElementID(this.elementRef.nativeElement);
    } else {
      this.id = '.' + this.linkClass;
    }

    const parentGridID: HTMLElement | null = this.getParentTablejsGridDirective(this.elementRef.nativeElement.parentElement);
    if (parentGridID !== null) {
      this.id = this.retrieveOrCreateElementID(parentGridID) + ' ' + this.id;
      // this.id = '#' + parentGridID.getAttribute('id') + ' ' + this.id;
      console.log('container id:', this.id);
    }
  }

  private generateViewportID() {
    const viewports: HTMLElement[] = this.infiniteScrollViewports;
    if (viewports.length > 0) {
      this.viewport = viewports[0];
      this.viewportID = this.viewport.getAttribute('id');
      let i: number = 0;
      while (document.getElementById('scroll-viewport-id-' + i.toString()) !== null) {
        i++;
      }
      this.viewportID = 'scroll-viewport-id-' + i.toString();
      this.viewport.setAttribute('id', this.viewportID);
    }
  }

  private attachContentResizeSensor(): void {
    if (this.resizeColumnWidthByPercent) {
      if (this.viewport === undefined || this.viewport === null) {
        throw Error('A viewport has not be declared.  Try adding the tablejsViewport directive to your tbody tag.');
      }
      this.contentResizeSensor = new ResizeSensor(this.viewport.firstElementChild!, () => {
        this.setScrollbarAdjustmentStyle();
      });
      this.scrollbarAdjustmentFragment = document.createDocumentFragment();
      this.scrollbarAdjustmentStyle = document.createElement('style');
      this.setScrollbarAdjustmentStyle();
      this.scrollbarAdjustmentFragment.appendChild(this.scrollbarAdjustmentStyle);

      this.addStyle(this.scrollbarAdjustmentStyle, false);

    }
  }
  
  private setScrollbarAdjustmentStyle(): void {
    this.scrollbarWidth = this.viewport!.offsetWidth - this.viewport!.clientWidth;
    this.scrollbarAdjustmentStyle!.innerHTML = '#' + this.viewportID + ' .reorderable-table-row { margin-right: -' + this.scrollbarWidth + 'px; }';
    this.setStyleContent();
  }

  private clearSelection() {
    if (window.getSelection) {
      const selection: Selection | null = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    } else if (this.document['selection']) {
      this.document['selection'].empty();
    }
  }

  private addResizableGrip(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationResizableGrips.push(el);
    } else {
      this.resizableGrips.push(el);
    }
  }

  private addResizableColumn(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationResizableColumns.push(el);
    } else {
      this.resizableColumns.push(el);
    }
  }

  private addReorderGrip(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationReorderGrips.push(el);
    } else {
      this.reorderGrips.push(el);
    }
  }

  private addReorderableColumn(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationReorderableColumns.push(el);
    } else {
      this.reorderableColumns.push(el);
    }
  }

  private addColumnsWithDataClasses(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationColumnsWithDataClasses.push(el);
    } else {
      this.columnsWithDataClasses.push(el);
    }
  }

  private addRow(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationRows.push(el);
    } else {
      this.rows.push(el);
    }
  }

  private addInfiniteScrollViewport(el: HTMLElement, fromMutation: boolean = false) {
    if (fromMutation && !this.isCustomElement) {
      this.mutationInfiniteScrollViewports.push(el);
    } else {
      this.infiniteScrollViewports.push(el);
    }
  }

  private removeStylesFromHead() {
    if (this.headTag.contains(this.headStyle)) {
      this.headTag.removeChild(this.headStyle!);
    }
    if (this.headTag.contains(this.widthStyle)) {
      this.headTag.removeChild(this.widthStyle!);
      this.widthStyleFragment = null;
    }
    if (this.headTag.contains(this.reorderHighlightStyle)) {
      this.headTag.removeChild(this.reorderHighlightStyle!);
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

  public ngOnDestroy() {
    this.document['hasPointerDownListener'] = false;
    this.observer!.disconnect();
    if (this.linkClass === undefined) {
      this.removeStylesFromHead();
    }
    this.initialWidthSettingsSubscription$.unsubscribe();
  }

}
