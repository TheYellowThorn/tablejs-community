import { AfterViewInit, ComponentRef, ComponentFactory, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, OnDestroy, Inject, InjectionToken, Injector, Input, Output, ViewContainerRef, RendererFactory2 } from '@angular/core';
import { DragAndDropGhostComponent } from './../../components/drag-and-drop-ghost/drag-and-drop-ghost.component';
import { DOCUMENT } from '@angular/common';
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
import { Subject, Subscription } from 'rxjs';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { IColumnHierarchy } from '../../shared/interfaces/i-column-hierarchy';
import { IColumnHideChange } from '../../shared/interfaces/events/i-column-hide-change';
import { HideColumnIfDirective } from '../hide-column-if/hide-column-if.directive';

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
  viewport: HTMLElement | null | undefined = null;
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
  pointerListenerFunc: any;

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
  subGroupStyles: (HTMLStyleElement | null)[] = [];
  subGroupFragments: (DocumentFragment | null)[] = [];
  gridOrderStyles: (HTMLStyleElement | null)[] = [];
  gridOrderFragments: (DocumentFragment | null)[] = [];
  subGroupStyleObjs: any = {};
  scrollbarAdjustmentFragment: DocumentFragment | null = null;
  scrollbarAdjustmentStyle: HTMLStyleElement | null = null;
  resizeMakeUpPercent: number = 0;
  resizeMakeUpPerColPercent: number = 0;

  scrollViewportDirective: ScrollViewportDirective | null = null;
  overlayRef: OverlayRef;
  hiddenColumnIndices: number[] = [];
  public hiddenColumnChanges: Subject<IColumnHideChange | null> = new Subject<IColumnHideChange | null>();
  private hiddenColumnChangesSubscription$: Subscription;
  public HIDDEN_COLUMN_CLASS: string = 'column-is-hidden';

  private injector: Injector;
  private DRAG_AND_DROP_GHOST_OVERLAY_DATA = new InjectionToken<any>('DRAG_AND_DROP_GHOST_OVERLAY_DATA');

  private animationFrameIDs: number[] = [];

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
    private elementRef: ElementRef,
    private resolver: ComponentFactoryResolver,
    private gridService: GridService,
    private directiveRegistrationService: DirectiveRegistrationService,
    @Inject(DOCUMENT) private document: any,
    private overlay: Overlay,
    private scrollDispatcherService: ScrollDispatcherService,
    private operatingSystem: OperatingSystemService,
    private rendererFactory: RendererFactory2) {
    super();
    console.warn('TableJS has been moved!  Please install the newest versions from https://www.npmjs.com/package/@tablejs/community (npm install @tablejs/community).');
    this.registerDirectiveToElement();
    this.attachMutationObserver();
  }

  private registerDirectiveToElement() {
    this.elementRef.nativeElement.gridDirective = this;
    this.elementRef.nativeElement.parentElement.gridDirective = this;
  }

  private attachMutationObserver(): void {
    if (!this.observer) {
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
    

    const viewport = this.elementRef.nativeElement.querySelector('*[tablejsScrollViewport]');
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
        this.rendererFactory
      );

      this.scrollViewportDirective.registerCustomElementsInputs(viewport);

      this.scrollViewportDirective.ngOnInit();
      this.scrollViewportDirective.ngAfterViewInit();

    }
    

    // Close observer if directives are registering

    this.elementRef.nativeElement.directive = this;
    if (!this.document['hasPointerDownListener']) {
      this.pointerListenerFunc = (e: Event) => {
        let el: HTMLElement | any | null = e.target as HTMLElement;
        if (el) {
          while (el !== null && el.getAttribute('tablejsGrid') === null) {
            el = el.parentElement;
          }
          if (el) {
            el['directive'].onPointerDown(e);
          }
        }
      }
      this.document.addEventListener('pointerdown', this.pointerListenerFunc);
      this.document['hasPointerDownListener'] = true;
    }
    const animationFrameID: number = window.requestAnimationFrame((timestamp) => {
      this.onEnterFrame(this, timestamp);
    });
    this.animationFrameIDs.push(animationFrameID);
  }

  private onEnterFrame(ths: any, timestamp: any) {

    if (this.columnsWithDataClasses.length > 0) {
      this.observer?.disconnect();
    }

    if (this.columnsWithDataClasses.length === 0 && this.mutationColumnsWithDataClasses.length === 0) {
      const animationFrameID: number = window.requestAnimationFrame((tmstamp) => {
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

    const allElementsWithDataResizable: any = this.columnsWithDataClasses;
    const el = allElementsWithDataResizable[0];
    const resizeClasses: string[] = this.getResizableClasses(el);
    const resizeCls = resizeClasses[0];
    const firstEl: HTMLElement = this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];

    
    if (!this.initialWidthSettingsSubscription$) {
      this.initialWidthSettingsSubscription$ = this.gridService.containsInitialWidthSettings.subscribe(hasWidths => {
        this.initialWidthsAreSet = hasWidths;
      });
    }
   
    if (!this.hiddenColumnChangesSubscription$) {
      this.hiddenColumnChangesSubscription$ = this.hiddenColumnChanges.subscribe(
        (change: IColumnHideChange | null) => {

          if (change) {
            const relatedHeader: Element | any = this.getRelatedHeader(change.hierarchyColumn.element);
            relatedHeader.hideColumn = change.hidden;
            

            if (change.wasTriggeredByThisColumn) {
              this.updateHiddenColumnIndices();
              const hideColumnIf: HideColumnIfDirective = (change.hierarchyColumn.element as any).hideColumnIf;
              hideColumnIf.updateHeadersThatCanHide();
              
            }

            if (!change.hidden) {
              if (change.wasTriggeredByThisColumn) {
                this.currentClassesToResize = this.getResizableClasses(relatedHeader);
                const avgWidthPerColumn: number = this.getAverageColumnWidth();
                this.setMinimumWidths();
                const totalTableWidth: number = this.viewport!.clientWidth;
                let newWidth: number = avgWidthPerColumn * this.currentClassesToResize.length;
                this.currentClassesToResize.forEach(className => {
                  const classIndex: number = this.gridTemplateClasses.indexOf(className);
                  if (this.resizeColumnWidthByPercent) {
                    this.classWidths[classIndex] = (avgWidthPerColumn / totalTableWidth * 100).toString() + '%';
                    // average all percentages
                  } else {
                    this.classWidths[classIndex] = Math.max(avgWidthPerColumn, this.minWidths[classIndex]);
                  }
                })
                
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
    const maxColumnsPerRow: number = this.parentGroups[this.parentGroups.length - 1].length;

    if (firstEl === undefined || firstEl === null) {
      const animationFrameID: number = window.requestAnimationFrame((tmstamp) => {
        ths.onEnterFrame(ths, tmstamp);
      });
      this.animationFrameIDs.push(animationFrameID);
    } else {
      const keys: any[] = Object.keys(this.initialWidths);
      if (this.initialWidthsAreSet === true && keys.length < maxColumnsPerRow) {
        const animationFrameID: number = window.requestAnimationFrame((tmstamp) => {
          ths.awaitWidths(ths, tmstamp);
        });
        this.animationFrameIDs.push(animationFrameID);
      } else {
        this.checkForGridInitReady();
      }
    }
  }

  public canHideColumn(column: Element): boolean {
    return (column as any).hideColumnIf.canHide;
  }

  public getFlattenedHierarchy(): IColumnHierarchy[] {
    const hierarchy: any = this.getColumnHierarchy();
    return hierarchy.columnGroups.reduce((prev: any, curr: any) => {
      let arr: any[] = [curr];
      if (curr.subColumns) {
        arr = arr.concat(this.getSubColumns(curr));
      }
      return prev.concat(arr);
    }, []);
  }

  private getSubColumns(item: any): any[] {
    if (item.subColumns.length === 0) {
      return [];
    }
    let arr: any[] = [];
    for (let i = 0; i < item.subColumns.length; i++) {
      const subItem: any = item.subColumns[i];
      arr = arr.concat(subItem);
      if (subItem.subColumns.length > 0) {
        arr = arr.concat(this.getSubColumns(subItem));
      }
    }
    
    return arr;
  }

  public getColumnHierarchy(): any {
    const hierarchy: any = {
      columnGroups: []
    };
    const highestLevelGroup: IColumnData[] = this.colDataGroups[0];
    const hierarchyGroup: IColumnHierarchy[] = highestLevelGroup.map((item: IColumnData) => {
      let levelCount: number = 0;
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

  getHierarchySubColumns(item: IColumnData, levelCount: number): IColumnHierarchy[] {
    levelCount++;
    if (!item.subGroups || item.subGroups.length === 0) {
      return [];
    }
    const subColumns: IColumnHierarchy[] = item.subGroups.map((subItem: IColumnData) => {
      return {
        level: levelCount,
        element: subItem.child,
        parent: subItem.parent,
        parentColumn: item.child,
        subColumns: this.getHierarchySubColumns(subItem, levelCount)
      }
    });

    return subColumns;

  }

  public checkForGridInitReady(): void {
    const allElementsWithDataResizable: any = this.columnsWithDataClasses;
    const el = allElementsWithDataResizable[0];
    const resizeClasses: string[] = this.getResizableClasses(el);
    const resizeCls: any = resizeClasses[0];
    const keys: any[] = Object.keys(this.initialWidths);
    const maxColumnsPerRow: number = this.parentGroups[this.parentGroups.length - 1].length;

    if (this.initialWidthsAreSet === true && (keys.length < maxColumnsPerRow || !this.initialWidths[resizeCls])) {
      const animationFrameID: number = window.requestAnimationFrame((tmstamp) => {
        this.awaitWidths(this, tmstamp);
      });
      this.animationFrameIDs.push(animationFrameID);
    } else if (this.initialWidthsAreSet === undefined) {
      const animationFrameID: number = window.requestAnimationFrame((tmstamp) => {
        this.awaitWidths(this, tmstamp);
      });
      this.animationFrameIDs.push(animationFrameID);
    } else {
      if (!this.linkClass) {
        this.initGrid();
      } else {
        const animationFrameID: number = window.requestAnimationFrame((tmstamp) => {
          this.awaitSingleFrame(this, tmstamp);
        });
        this.animationFrameIDs.push(animationFrameID);
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

      this.attachReorderGhost(this.draggingColumn);
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

    // disallow resizing the rightmost column with percent sizing
    if (this.resizeColumnWidthByPercent) {
      const lastColumnClass: string = this.getLastVisibleColumnClass();
      if (this.currentClassesToResize.indexOf(lastColumnClass) !== -1) {
        this.dragging = false;
      }
    }    

    this.currentClassesToResize.forEach((className: string) => {
      const wdth: number = this.getClassWidthInPixels(className);
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

  private getClassWidthInPixels(className: string): number {
    const classIndex: number = this.gridTemplateClasses.indexOf(className);
    let wdth: string = this.classWidths[classIndex];
    if (this.resizeColumnWidthByPercent) {
      wdth = wdth.replace('%', ''); // remove px
      let totalTableWidth: number = this.viewport!.clientWidth;
      wdth = (Number(wdth) / 100 * totalTableWidth).toString();
    }
    return Number(wdth);
  }

  private setMinimumWidths(): void {
    this.gridTemplateClasses.forEach(className => {
      const firstEl: Element = this.elementRef.nativeElement.querySelector('.' + className);
      const minWidth: string = window.getComputedStyle(firstEl).getPropertyValue('min-width');
      let wdth: number = Number(minWidth.substring(0, minWidth.length - 2)); // remove px
      wdth = Number(wdth) < this.defaultTableMinWidth ? this.defaultTableMinWidth : wdth; // account for minimum TD size in tables
      if (this.currentClassesToResize.indexOf(className) !== -1 && !this.columnIsHiddenWithClass(className)) {
        this.totalComputedMinWidth += wdth;
      }
      this.minWidths.push(wdth);
    });
  }

  private attachReorderGhost(column: HTMLElement): void {
    this.dragAndDropGhostComponent?.updateView((column as any).reorderGhost, (column as any).reorderGhostContext)
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
      const dragNDropX = event.pageX - ths.dragOffsetX;
      const dragNDropY = event.pageY - ths.dragOffsetY;
      ths.setDragAndDropPosition(dragNDropX, dragNDropY);

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
      let draggedGroup: IColumnData[] | Element[] | null = null;

      const pGroup: any = ths.colDataGroups.forEach((group: IColumnData[], groupInd: number) =>
        group.forEach((columnData: IColumnData, index: number) => {
            const item: Element | null = columnData.child;
            if (item === ths.getRelatedHeader(ths.draggingColumn as HTMLElement)) {
              colRangeDraggedParentInd = groupInd;
              colRangeDraggedChildInd = ths.getRangePosition(columnData); // index;
              draggedInd = index;
              draggedGroup = group;
            }
            if (item === ths.getRelatedHeader(ths.lastDraggedOverElement as HTMLElement)) {
              colRangeDroppedParentInd = groupInd;
              colRangeDroppedChildInd = ths.getRangePosition(columnData); // index;
              droppedInd = index;
            }
        })
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
    let mouseOffset: number = Math.round(event.clientX) - Math.round(ths.startX);
    const widthsNeedUpdating: boolean = Math.round(event.clientX) !== ths.startX;
    ths.startX = Math.round(event.clientX); // reset starting X
    let newWidth: number = ths.totalComputedWidth + mouseOffset;
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

  private getLastVisibleColumnClass(): string {
    let highestOrderIndex: number = 0;
    let lastVisibleColumnClass: string = '';

    this.gridTemplateClasses.forEach(className => {
      const classNameIndex: number = this.gridTemplateClasses.indexOf(className);
      const gridOrderIndex: number = this.gridOrder.indexOf(classNameIndex + 1);
      if (this.hiddenColumnIndices.indexOf(gridOrderIndex + 1) === -1) {
        if (gridOrderIndex > highestOrderIndex) {
          highestOrderIndex = gridOrderIndex;
          lastVisibleColumnClass = className;
        }
      }
    });
    return lastVisibleColumnClass;
  }

  private getRangePosition(columnData: IColumnData): number {
    let subGroups: IColumnData[] = columnData.subGroups;
    let child: IColumnData = columnData;
    while (subGroups.length > 0) {
      child = subGroups[0];
      subGroups = child.subGroups;
    }
    return child.nthChild - 1;
  }

  private columnIsHiddenWithClass(className: string): boolean {
    const classNameIndex: number = this.gridTemplateClasses.indexOf(className);
    const gridOrderIndex: number = this.gridOrder.indexOf(classNameIndex + 1);
    return this.hiddenColumnIndices.indexOf(gridOrderIndex + 1) !== -1;
  }

  private getTotalGroupedColumnsVisible(sortableWidths: ISortableWidthItem[]): number {
    const len: number = sortableWidths.length;
    let totalGroupedColumnsVisible: number = 0;
    for (let i = 0; i < len; i++) {
      const item: any = sortableWidths[i];
      if (!this.columnIsHiddenWithClass(item.className)) {
        totalGroupedColumnsVisible++;
      }
    }
    return totalGroupedColumnsVisible;
  }

  private getFirstGridOrderIndexAfterColumnGroup(sortableWidthGroup: ISortableWidthItem[]): number {
    let maxIndex: number = -1;
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
  private getPostColumnWidthTotal(startingIndex: number): number {
    let count: number = 0;
    for (let i = startingIndex; i < this.gridOrder.length; i++) {
      const clsIndex = this.gridOrder[i] - 1;
      let perc: number = Number(this.classWidths[clsIndex].toString().replace('%', ''));
      if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
        count += perc;
      }
    }
    return count;
  }

  // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
  private getPostColumnMinimumWidthTotal(startingIndex: number): number {
    let count: number = 0;
    for (let i = startingIndex; i < this.gridOrder.length; i++) {
      const clsIndex = this.gridOrder[i] - 1;
      let perc: number = Number(this.minWidths[clsIndex].toString().replace('%', ''));
      if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
        count += perc;
      }
    }
    return count;
  }

  // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
  private getPreviousColumnWidthTotal(sortableWidthGroup: ISortableWidthItem[]): number {
    let count: number = 0;
    let minIndex = Infinity;
    sortableWidthGroup.forEach(classItem => {
      const columnIndx = this.gridTemplateClasses.indexOf(classItem.className);
      const gridOrderIndex = this.gridOrder.indexOf(columnIndx + 1);
      if (minIndex > gridOrderIndex) {
        minIndex = gridOrderIndex;
      }
    });
    for (let i = 0; i < minIndex; i++) {
      const classIndx: number = this.gridOrder[i] - 1;
      const wdth: number = Number(this.classWidths[classIndx].toString().replace('%', ''));
      count += wdth;
    }
    return count;
  }

  private updateWidthsInPercent(newWidth: number, sortableWidths: ISortableWidthItem[], totalGroupedColumnsVisible: number, sortableWidthGroup: ISortableWidthItem[]): void {

    let totalTableWidth: number = this.viewport!.clientWidth;
    let newWidthInPercent: number = newWidth / totalTableWidth * 100;
    
    const classMinWidths: number[] = sortableWidths.map((item: ISortableWidthItem) => item.minWidth);
    const groupMinWidthCalc: number = classMinWidths.reduce((prev: number, curr: number) => prev + curr);
    
    const firstGridOrderIndexAfterColumnGroup: number = this.getFirstGridOrderIndexAfterColumnGroup(sortableWidthGroup);
    const colsPastMinWidthCalc: number = this.getPostColumnMinimumWidthTotal(firstGridOrderIndexAfterColumnGroup);
    const colsPastMinWidthInPercent: number = colsPastMinWidthCalc / totalTableWidth * 100;
    const colsPastWidthPerc: number = this.getPostColumnWidthTotal(firstGridOrderIndexAfterColumnGroup);

    let prevColPercentTotal: number = 0;
    prevColPercentTotal = this.getPreviousColumnWidthTotal(sortableWidthGroup);
    const percentMoved: number = (prevColPercentTotal + newWidthInPercent + colsPastWidthPerc) - 100;

    if (prevColPercentTotal + newWidthInPercent + colsPastMinWidthInPercent > 100) {
      const actualPerCanMove: number = 100 - (prevColPercentTotal + colsPastMinWidthInPercent);
      newWidthInPercent = actualPerCanMove;
    }
    if (newWidth < groupMinWidthCalc) {
      newWidthInPercent = groupMinWidthCalc / totalTableWidth * 100;
    }

    sortableWidths.sort((item1: any, item2: any) => {
      const wdth1: number = item1.width;
      const wdth2: number = item2.width;
      if (wdth1 === wdth2) {
        return 0;
      }
      return wdth1 < wdth2 ? -1 : 1;
    });
    
    const mappedGroupWidthsInPixels: number[] = sortableWidths.map(item => item.width);
    const totalPrevGroupWidths: number = mappedGroupWidthsInPixels.reduce((prev: number, curr: number) => prev + curr);
    const dispersedPercs: number[] = sortableWidths.map(item => item.width / totalPrevGroupWidths);
    const totalPercMoved: number = newWidthInPercent - (totalPrevGroupWidths / totalTableWidth * 100);


    let additionalPercentFromColumnsToSmall: number = 0;
    const sortableWidthsLen: number = sortableWidths.length;
    sortableWidths.forEach((item: ISortableWidthItem, index: number) => {
      const classIndex: number = this.gridTemplateClasses.indexOf(item.className);
      const minWidthInPercent: number = this.minWidths[classIndex] / totalTableWidth * 100;
    
      let calculatedPercent: number = dispersedPercs[index] * newWidthInPercent;
      if (calculatedPercent < minWidthInPercent) {
        additionalPercentFromColumnsToSmall += minWidthInPercent - calculatedPercent;
        calculatedPercent = minWidthInPercent;
      } else {
        const itemsRemaining: number = sortableWidthsLen - index - 1;
        if (itemsRemaining !== 0) {
          const extraAmtToRemove: number = additionalPercentFromColumnsToSmall / itemsRemaining;
          calculatedPercent -= extraAmtToRemove;
          additionalPercentFromColumnsToSmall -= extraAmtToRemove;
        }
      }
      const colWidthInPercent: string = calculatedPercent.toString() + '%';
      this.classWidths[classIndex] = colWidthInPercent;
    });

    let remainingPercToDisperse: number = totalPercMoved + additionalPercentFromColumnsToSmall;
    const maxPercsCanMovePerCol: any[] = [];
    for (let i = firstGridOrderIndexAfterColumnGroup; i < this.gridOrder.length; i++) {
      const clsIndex = this.gridOrder[i] - 1;
      let perc: number = Number(this.classWidths[clsIndex].toString().replace('%', ''));
      let minWidthPerc: number =  (this.minWidths[clsIndex] / totalTableWidth * 100);
      if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
        maxPercsCanMovePerCol.push({ 
          moveAmt: percentMoved > 0 ? perc - minWidthPerc : perc,
          classIndex: clsIndex
        });
      }
    }

    const totalPercsCanMove: number = maxPercsCanMovePerCol.reduce((prev: number, curr: any) => prev + curr.moveAmt, 0.0000001);
    maxPercsCanMovePerCol.forEach((item: any) => {
      const percOfTotalMovementAllowed: number = item.moveAmt / totalPercsCanMove;
      const percOfRemainingDispersement: number = percOfTotalMovementAllowed * remainingPercToDisperse;
      const perc: number = Number(this.classWidths[item.classIndex].toString().replace('%', ''));
      const dispersedWidth: number = perc - percOfRemainingDispersement;
      this.classWidths[item.classIndex] = dispersedWidth + '%';
    });

    newWidth = newWidthInPercent / 100 * totalTableWidth;
    let amountMoved: number = newWidth - totalPrevGroupWidths;
    amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points
    this.totalComputedWidth += amountMoved;

    const gridTemplateColumns: string = this.constructGridTemplateColumns();
    this.gridTemplateTypes.forEach(styleObj => {      
      styleObj.style.innerHTML = this.id + ' .' + this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
      this.setStyleContent();
    });
   
  }

  private updateWidthsInPixels(newWidth: number, sortableWidths: ISortableWidthItem[], totalGroupedColumnsVisible: number): void {

    let remainingWidth: number = this.totalComputedWidth - newWidth;
    
    sortableWidths.forEach((item: ISortableWidthItem) => {
      const maxPercOfRemaining: number = 1 / totalGroupedColumnsVisible;
      let amountMoved: number = 0;
      const resizeID: string = this.id + ' .' + item.className;

      if (item.width - item.minWidth < maxPercOfRemaining * remainingWidth) {
        amountMoved = item.width - item.minWidth;
      } else {
        amountMoved = maxPercOfRemaining * remainingWidth;
      }
      
      amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points

      const classIndex: number = this.gridTemplateClasses.indexOf(item.className);
      this.classWidths[classIndex] = (item.width - amountMoved);
      
      const markupItem: any = this.stylesByClass.filter(style => style.id === resizeID)[0];
      let markup = resizeID + ' { width: ' + (item.width - amountMoved) + 'px }';
      markupItem.markup = markup;
      markupItem.width = (item.width - amountMoved).toString();

      this.totalComputedWidth -= amountMoved;
    });

    const gridTemplateColumns: string = this.constructGridTemplateColumns();

    this.gridTemplateTypes.forEach(styleObj => {
      styleObj.style.innerHTML = this.id + ' .' + this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
      this.setStyleContent();
    });
  }

  private fitWidthsToOneHundredPercent(): void {
    const numericalWidths: number[] = this.classWidths.map((wdth: string, index: number) => Number(wdth.replace('%', '')));
    const widthTotal: number = numericalWidths.reduce((prev: number, wdth: number) => {
      return prev + wdth;
    }, 0);

    const scaledWidths: { width: number, index: number }[] = numericalWidths.map((wdth: number, index: number) => {
      return {
        width: wdth / widthTotal * 100,
        index: index
      }
    });

    scaledWidths.forEach((item: { width: number, index: number }, index: number) => {
      this.classWidths[item.index] = scaledWidths[item.index].width.toString() + '%';
    })
  }

  private updateWidths(newWidth: number) {
    const currentWidths: number[] = this.currentClassesToResize.map((resizeClass: string) => {
      return this.getClassWidthInPixels(resizeClass);
    });

    const sortableWidths: ISortableWidthItem[] = currentWidths.map((w, index) => {
      return {
        minWidth: this.minWidths[index],
        width: w,
        className: this.currentClassesToResize[index]
      }
    });

    const visibleSortableWidths: ISortableWidthItem[] = sortableWidths.filter(item => {
      return !this.columnIsHiddenWithClass(item.className);
    })

    const totalGroupedColumnsVisible: number = this.getTotalGroupedColumnsVisible(visibleSortableWidths);

    if (this.resizeColumnWidthByPercent) {
      this.updateWidthsInPercent(newWidth, visibleSortableWidths, totalGroupedColumnsVisible, sortableWidths);
    } else {
      this.updateWidthsInPixels(newWidth, visibleSortableWidths, totalGroupedColumnsVisible);
    }

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
              this.attachContentResizeSensor();
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
        this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective = this;
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
    if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
      this.headStyle = document.createElement('style');
      this.headStyle.type = 'text/css';
      this.headTag.appendChild(this.headStyle);
    } else {
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
    } else {
      this.classWidths = this.calculateWidthsFromStyles();
      if (this.linkClass) {
        this.gridService.linkedDirectiveObjs[this.linkClass].classWidths = this.classWidths;
      }
    }

    this.setGridOrder();
    this.emitGridInitialization();
  }

  private setGridTemplateClasses(): void {
    let ind: number = -1;
    let highestLen: number = 0;
    
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
    
    if (this.linkClass) {
      if (!this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses) {
        this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses = this.gridTemplateClasses;
      } else {
        
        this.verifyLinkedTemplateClassesMatch();
      }
      
    }
  }

  private verifyLinkedTemplateClassesMatch(): void {
    let columnsAreTheSame: boolean = true;
    this.gridService.linkedDirectiveObjs[this.linkClass!].gridTemplateClasses.forEach((item: any, index: any) => {
      if (item !== this.gridTemplateClasses[index]) {
        columnsAreTheSame = false;
      }
    });
    if (!columnsAreTheSame) {
      throw Error(`Column classes must match for linked tables:\n\n ${this.gridService.linkedDirectiveObjs[this.linkClass!].gridTemplateClasses}\n   does not match\n ${this.gridTemplateClasses}\n`);
    }
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
    return [];
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
    const componentRef: ComponentRef<any> = this.openModal(DragAndDropGhostComponent, this.DRAG_AND_DROP_GHOST_OVERLAY_DATA, {});
    this.dragAndDropGhostComponent = componentRef.instance;
  }

  openModal(
    componentType: ComponentType<unknown>,
    token: InjectionToken<any>,
    data: any, positionStrategy: PositionStrategy | null = null,
    overlayConfig: OverlayConfig | null = null
  ): ComponentRef<unknown> {

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

    const containerPortal: ComponentPortal<unknown> = new ComponentPortal(componentType, null, this.injector);
    const containerRef: ComponentRef<unknown> = this.overlayRef.attach(containerPortal);

    return containerRef;
  }

  private createInjector(dataToPass: any, token: any): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: token, useValue: dataToPass }
      ]
    })
  }

  private setDragAndDropPosition(x: number, y: number) {
    this.dragAndDropGhostComponent!.left = x;
    this.dragAndDropGhostComponent!.top = y;
  }

  private removeDragAndDropComponent() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private setParentGroups(allElementsWithDataResizable: any[]): void {
    const colSpans: number[] = [];
    let currSpanCount: number = 0;
    let lastParent: Element | null = null;
    let children!: Element[];
    let columnStart: number = 1;
    let colRanges: number[][] = [];

    this.colRangeGroups.push(colRanges);

    let item: any;
    for (let index = 0; index < allElementsWithDataResizable.length; index++) {
      const item: Element = allElementsWithDataResizable[index];
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

  private generateColumnGroups() {
    const allElementsWithDataResizable: any = this.columnsWithDataClasses;
    const arr: Element[] = allElementsWithDataResizable;
    let colOrder: number = 1;
    let lastParent: Element | null = null;
    let lastGroup: IColumnData[] | null = null;
    let lastOrder: number = 0;
    let lastIndex: number = 0;
    let spanCount: number = 0;
    let colDataGroup: any[] = [];

    this.colDataGroups.push(colDataGroup);

    for (let index = 0; index < arr.length; index++) {
      const item: Element | null = arr[index];

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
        parent: item.parentElement as Element,
        child: item,
        linkedChildren: [],
        subColumnLength: 0
      };
      colDataGroup.push(this.colData);
    }
    
    let groupsWereSet: boolean = false;
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
      let columnGroup: any;
      for (let index = 0, len = this.colDataGroups.length; index < len; index++) {
        columnGroup = this.colDataGroups[index];
        if (index < this.colDataGroups.length - 1) {
          this.generateSubGroup(columnGroup, this.colDataGroups[index + 1]);
        }
        if (index === len - 1) {
          this.orderSubGroups(columnGroup);
        }
      }
    } else {
      
      this.setLinkedHeaderContainerClasses();
      this.setLinkedChildren();

      if (this.gridService.linkedDirectiveObjs[this.linkClass!].subGroupStyleObjs) {
        this.gridTemplateTypes = this.gridService.linkedDirectiveObjs[this.linkClass!].gridTemplateTypes;
        this.styleList =  this.gridService.linkedDirectiveObjs[this.linkClass!].styleList;
        this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass!].subGroupStyleObjs;
        this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass!].subGroupStyles;
        this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass!].subGroupFragments;
        this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass!].gridOrder;
      }
    }
  }

  private verifyLinkedGroupStructuresMatch(colDataGroups1: IColumnData[][], colDataGroups2: IColumnData[][]): void {
    let columnGroupsAreTheSame: boolean = true;
    if (colDataGroups1.length !== colDataGroups2.length) {
      columnGroupsAreTheSame = false;
    }
    for (let i = 0; i < colDataGroups1.length; i++) {
      const colDataGroup1: IColumnData[] = colDataGroups1[i];
      const colDataGroup2: IColumnData[] = colDataGroups2[i];
      if (colDataGroup1.length !== colDataGroup2.length) {
        columnGroupsAreTheSame = false;
      }
    }
    if (!columnGroupsAreTheSame) {
      throw Error(`The header structure for linked tables does not match.\nPlease check your column spans.`);
    }
  }

  private setHiddenClassForAllLinkedParentHeaders(): HTMLElement[] {

    const flattenedHierarchy: IColumnHierarchy[] = this.getFlattenedHierarchy();
    const flattenedHeirarchyLenMin1: number = flattenedHierarchy.length - 1;

    // start at the end to get the deepest child possible
    for (let i = flattenedHeirarchyLenMin1; i >= 0; i--) {
      const columnHierarchy: IColumnHierarchy = flattenedHierarchy[i];
    }

    const elementsReshown: HTMLElement[] = [];
    const startIndex: number = this.colDataGroups.length - 2;
    for (let i = startIndex; i >= 0; i--) {
      const colDataGroup: IColumnData[] = this.colDataGroups[i];
      for (let j = 0; j < colDataGroup.length; j++) {
        const columnData: IColumnData = colDataGroup[j];
        const parentElement: any = columnData.child as any;
        const parentWasHidden: boolean = parentElement.hideColumn;
        let hiddenChildCount: number = 0;
        for (let k = 0; k < columnData.subGroups.length; k++) {
          const subGroup: IColumnData = columnData.subGroups[k];
          if ((subGroup.child as any).hideColumn) {
            hiddenChildCount++;
          }
        }
        if (columnData.subGroups.length !== 0) {
          if (!parentWasHidden && hiddenChildCount === columnData.subGroups.length) {
            parentElement.hideColumn = true;
            this.setHiddenClassForColumnGroup(columnData.child, colDataGroup[j]);
          } else if (parentWasHidden && hiddenChildCount < columnData.subGroups.length) {
            parentElement.hideColumn = false;
            elementsReshown.push(parentElement);
          }
        }
      }
    }
    return elementsReshown;
  }

  private setHiddenClassForAllLinkedHeaders(element: HTMLElement | any): void {
    for (let i = 0; i < this.colDataGroups.length; i++) {
      const colDataGroup: IColumnData[] = this.colDataGroups[i];
      for (let j = 0; j < colDataGroup.length; j++) {
        this.setHiddenClassForColumnGroup(element, colDataGroup[j]);
        
      }
    }
  }

  private setHiddenClassForColumnGroup(element: Element | any, columnGroup: IColumnData): void {
    const columnData: IColumnData = columnGroup;
    if (columnData.child === element) {
      element.classList.remove(this.HIDDEN_COLUMN_CLASS);
      const hideColumn: boolean = element.hideColumn;
      if (hideColumn) {
        element.classList.add(this.HIDDEN_COLUMN_CLASS);
      }
      columnData.linkedChildren.forEach((header: Element | any) => {
        header.hideColumn = hideColumn;
        header.classList.remove(this.HIDDEN_COLUMN_CLASS);
        if (hideColumn) {
          header.classList.add(this.HIDDEN_COLUMN_CLASS);
        }
      });

      for (let i = 0; i < columnData.subGroups.length ; i++) {
        const subGroup: IColumnData = columnData.subGroups[i];
        (subGroup.child as any).hideColumn = hideColumn;
        this.setHiddenClassForColumnGroup(subGroup.child, subGroup);
      }
    }
  }

  public getRelatedHeaders(element: Element): (Element | any)[] {
    if ((element as any).relatedElements) {
      return (element as any).relatedElements;
    }
    let relatedElements: (HTMLElement | any)[] = [];
    for (let i = 0; i < this.colDataGroups.length; i++) {
      const colDataGroup: IColumnData[] = this.colDataGroups[i];
      for (let j = 0; j < colDataGroup.length; j++) {
        const columnData: IColumnData = colDataGroup[j];
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

  public getRelatedHeader(element: Element):Element | any {
    if ((element as any).relatedElement) {
      return (element as any).relatedElement;
    }
    let relatedElement: HTMLElement | any = null;
    for (let i = 0; i < this.colDataGroups.length; i++) {
      const colDataGroup: IColumnData[] = this.colDataGroups[i];
      for (let j = 0; j < colDataGroup.length; j++) {
        const columnData: IColumnData = colDataGroup[j];
        const filteredChildren: Element[] = columnData.linkedChildren.filter(child => child === element);
        if (filteredChildren.length > 0) {
          relatedElement = columnData.child;
        }
      }
    }
    (element as any).relatedElement = relatedElement ? relatedElement : element;
    return (element as any).relatedElement;
  }

  private setLinkedChildren(): void {
    let dataIndex: number = 0;
    for (let i = 0; i < this.colDataGroups.length; i++) {
      const colDataGroup: IColumnData[] = this.colDataGroups[i];
      for (let j = 0; j < colDataGroup.length; j++) {
        const columnData: IColumnData = colDataGroup[j];
        const column: HTMLElement = this.columnsWithDataClasses[dataIndex + j];
        columnData.linkedChildren.push(column);
      }
      dataIndex += colDataGroup.length;
    }
  }
  private setLinkedHeaderContainerClasses(): void {
    let dataIndex: number = 0;
    for (let i = 0; i < this.colDataGroups.length; i++) {
      const colDataGroup: IColumnData[] = this.colDataGroups[i];
      const column: HTMLElement = this.columnsWithDataClasses[dataIndex];
      dataIndex += colDataGroup.length;
      const containerClass = 'column-container-' + i;
      this.addClassToLinkedHeader(column.parentElement!, containerClass);
    }
  }

  private addClassToLinkedHeader(element: Element, cls: string): void {
    if (!element.classList.contains(cls)) {
      element.classList.add(cls);
    }
  }

  private generateSubGroup(currentGroup: any, subGroup: any): void {

    let indexCount: number = 0;
    currentGroup.forEach(
      (group: IColumnData, index: number) => {
        const classLen: number = (group.child as any).dataClasses.length;
        let subClassCount: number = 0;
        let numOfSubColumns: number = 0;
        while (subClassCount < classLen) {
          subClassCount += (subGroup[indexCount].child as any).dataClasses.length;
          group.subGroups.push(subGroup[indexCount]);
          indexCount++;
          numOfSubColumns++;
        }
        currentGroup[index].subColumnLength = numOfSubColumns;
      }
    );
  }

  private orderSubGroups(columnGroup: IColumnData[], columnPlacement: number = 1, placementStart: number = 0, order: number = 1) {
    let style: HTMLStyleElement;
    let containerID: string;
    let fragment: DocumentFragment;
    let selector: string;

    if (this.linkClass) {
      if (this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs) {
        this.headStyle = this.gridService.linkedDirectiveObjs[this.linkClass].headStyle;
        this.gridTemplateTypes = this.gridService.linkedDirectiveObjs[this.linkClass!].gridTemplateTypes;
        this.styleList =  this.gridService.linkedDirectiveObjs[this.linkClass].styleList;
        this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs;
        this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles;
        this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments;
        this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder;
      } else {
        this.gridService.linkedDirectiveObjs[this.linkClass].headStyle = this.headStyle;
        this.gridService.linkedDirectiveObjs[this.linkClass!].gridTemplateTypes = this.gridTemplateTypes;
        this.gridService.linkedDirectiveObjs[this.linkClass].styleList = this.styleList;
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

    columnGroup.forEach((columnData: IColumnData) => {
      columnData.order = columnPlacement;

      const tagName: string = columnData.child.tagName.toLowerCase();

      containerID = 'column-container-' + Array.from(columnData!.parent!.parentElement!.children).indexOf(columnData.parent);
      const parentIndex = Array.from(columnData!.parent!.parentElement!.children).indexOf(columnData.parent);
      
      this.addClassToLinkedHeader(columnData.parent, containerID);
      
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

      this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
      
      if (this.parentGroups[parentIndex]) {
        if ((this.parentGroups[parentIndex].length) === (columnData.order)) {
          this.lastColumns[parentIndex] = columnData;
        }
      }

      if (columnData.subGroups.length > 0) {
        this.orderSubGroups(columnData.subGroups, columnPlacement, placementStart, order++);
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

        this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
        
        this.gridOrder[columnPlacement - 1] = columnData.nthChild;

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
          this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
        }
      }
      columnPlacement += columnData.span;
    });
  }

  private setColumnStyle(style: HTMLStyleElement, fragment: DocumentFragment, selector: string, gridStart: number, gridEnd: number, order: number): void {
    style.innerHTML = selector + ' { grid-column-start: ' + (gridStart).toString() + '; grid-column-end: ' + (gridEnd).toString() + '; order: ' + (order).toString() + '; }';
    fragment.appendChild(style);
    this.addStyle(style);
    this.subGroupStyleObjs[selector] = style;
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

      const selector: string = this.id + ' .' + this.reorderableClass;
      let styleAlreadyExisted: boolean = false;      

      if (this.subGroupStyleObjs[selector]) {
        style = this.subGroupStyleObjs[selector];
        styleAlreadyExisted = true;
      } else if (reqiresNewStyleObjects) {
        fragment = document.createDocumentFragment();
        style = document.createElement('style');
        style.type = 'text/css';
        fragment.appendChild(style);
      } else {
        fragment = this.gridService.linkedDirectiveObjs[this.linkClass!].gridOrderFragments[index];
        style = this.gridService.linkedDirectiveObjs[this.linkClass!].gridOrderStyles[index];
        fragment.appendChild(style);
      }
      style.innerHTML = selector + ' { display: grid; grid-template-columns: ' + gridTemplateColumns + '; }';

      
      if (!this.subGroupStyleObjs[selector] && reqiresNewStyleObjects) {
        this.gridOrderStyles.push(style);
        this.gridOrderFragments.push(fragment!);
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

    this.removeElementHighlight(draggableElement);
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
    if (parentRangeIndex === this.colRangeGroups.length - 1) {
      this.colRangeGroups[parentRangeIndex].forEach(
        range => {
          const lowRange: number = range[0];
          const highRange: number = range[1];
          if (fromOrder >= lowRange && fromOrder < highRange && toOrder >= lowRange && toOrder < highRange) {
            const data1: IColumnData = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === fromOrder)[0];
            const data2: IColumnData = this.colDataGroups[colRangeDraggedParentInd].filter(item => item.nthChild === toOrder)[0];
            const rangeGroup: IColumnData[] = this.colDataGroups[colRangeDraggedParentInd].slice(range[0] - 1, range[1] - 1);
            rangeGroup.sort((item1: IColumnData, item2: IColumnData) => {
              return item1.order - item2.order;
            });
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
      rangeGroup.splice(rangeGroup.indexOf(data1), 1);
      rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
      rangeGroup.forEach((item, index) => {
        item.order = index + 1;
      });
    }
    
    this.setGridOrder();

    // need to set a class to resize - default to first so column widths are updated
    const firstItemWidth: number = this.getFirstVisibleItemWidth();
    this.setMinimumWidths();

    // update widths by first item
    this.totalComputedWidth = firstItemWidth;
    this.updateWidths(firstItemWidth);
  }

  private getAverageColumnWidth(): number {
    let totalTableWidth: number = this.viewport!.clientWidth;
    return totalTableWidth / this.classWidths.length;
  }

  private getFirstVisibleItemWidth(): number {
    let firstVisibleItemIndex: number = 0;
    for (let i = 0; i < this.gridOrder.length; i++) {
      const classIndex = this.gridOrder[i] - 1;
      if (!this.columnIsHiddenWithClass(this.gridTemplateClasses[classIndex])) {
        firstVisibleItemIndex = i;
        break;
      }
    }
    this.currentClassesToResize = [this.stylesByClass[this.gridOrder[firstVisibleItemIndex] - 1].resizeClass];
    return this.currentClassesToResize.map((resizeClass: string) => {
      return this.getClassWidthInPixels(resizeClass);
    })[0];
  }

  private setLinkedColumnIndicesFromMaster(): void {
    if (this.linkClass) {
      this.hiddenColumnIndices = this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective.hiddenColumnIndices;
    }
  }

  private updateMasterColumnIndices(): void {
    if (this.linkClass) {
      this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective.hiddenColumnIndices = this.hiddenColumnIndices;
    }
  }

  private updateHiddenColumnIndices(): void {
    this.setLinkedColumnIndicesFromMaster();
    this.hiddenColumnIndices = this.getHiddenColumnIndices();
    this.updateMasterColumnIndices();
  }

  private constructGridTemplateColumns(): string {
    this.updateHiddenColumnIndices();

    this.resizeMakeUpPercent = 0;
    this.resizeMakeUpPerColPercent = 0;
    let remainingCols: number = this.gridOrder.length - this.hiddenColumnIndices.length;
    this.hiddenColumnIndices.forEach((index) => {
      const classWidthIndex: number = this.gridOrder[index - 1];
      const amt: string = this.classWidths[classWidthIndex - 1].toString();
      if (amt.includes('%')) {
        this.resizeMakeUpPercent += Number(amt.replace('%', ''));
      }
      
    });
    if (this.resizeMakeUpPercent !== 0) {
      this.resizeMakeUpPerColPercent =this.resizeMakeUpPercent / remainingCols;
    }

    let str: string = '';
    this.gridOrder.forEach((order, index) => {
      let wdth: number = Number(this.classWidths[order - 1].toString().replace('%', ''));
      wdth = wdth < 0 ? 0 : wdth;
      if (this.classWidths[order - 1].toString().includes('%')) {
        if (this.hiddenColumnIndices.indexOf(index + 1) !== -1) {
          str += ' 0%';
          this.classWidths[order - 1] = '0%';
        } else {
          str += ' ' + (wdth + this.resizeMakeUpPerColPercent).toString() + '%';
          this.classWidths[order - 1] = (wdth + this.resizeMakeUpPerColPercent).toString() + '%';
        }    
      } else {
        if (this.hiddenColumnIndices.indexOf(index + 1) !== -1) {
          str += ' 0px';
        } else {
          str += ' ' + wdth.toString() + 'px';
        }
      }

    });
    return str;

  }

  private getHiddenColumnIndices(): number[] {
    const hiddenColumnIndices: number[] = [];
    this.colDataGroups.forEach((columnGroup: IColumnData[], index) => {
      if (index === 0) {
        this.orderSubCols(hiddenColumnIndices, columnGroup);
      }
    });

    return hiddenColumnIndices;
  }

  private orderSubCols(arr: number[], columnGroup: IColumnData[], columnPlacement: number = 1, placementStart: number = 0, parentIsHidden: boolean = false) {
    placementStart = columnPlacement - 1;

    columnGroup.sort((columnData1: IColumnData, columnData2: IColumnData) => {
      return columnData1.order - columnData2.order;
    });

    columnGroup.forEach(columnData => {

      const startIndex: number = columnPlacement;
      const columnElement: Element | any = this.getRelatedHeader(columnData.child);
      const hasSubGroups: boolean = columnData.subGroups.length > 0;

      if ((columnElement.hideColumn || parentIsHidden) && !hasSubGroups && arr.indexOf(startIndex) === -1) {
        arr.push(startIndex);
      }

      if (hasSubGroups) {
        this.orderSubCols(arr, columnData.subGroups, columnPlacement, placementStart, columnElement.hideColumn);
      }
      columnPlacement += columnData.span;
    });
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

  private retrieveOrCreateElementID(el: HTMLElement, hasLinkClass: boolean = false): string {
    let id: string | undefined | null = document.body.getAttribute('id');
    if (id === undefined || id === null) {
      id = 'tablejs-body-id';
    }
    document.body.setAttribute('id', id);
    const someID: string = hasLinkClass ? '' : this.generateGridID(el);
    return '#' + id + someID;
  }

  private generateGridID(el: HTMLElement) {
      let gridID: string | null = el.getAttribute('id');
      if (gridID === null) {
        let i: number = 0;
        while (document.getElementById('grid-id-' + i.toString()) !== null) {
          i++;
        }
        gridID = 'grid-id-' + i.toString();
        el.classList.add(gridID);
        el.setAttribute('id', gridID);
      }

      return ' .' + gridID; // ' #' + gridID;
  }

  private generateContainerID() {
    TablejsGridProxy.GRID_COUNT++;
    const hasLinkClass: boolean = this.linkClass !== undefined;
    if (!hasLinkClass) {
      this.id = this.retrieveOrCreateElementID(this.elementRef.nativeElement);
    } else {
      this.id = '.' + this.linkClass;
    }
    const parentGridID: HTMLElement | null = this.getParentTablejsGridDirective(this.elementRef.nativeElement.parentElement);

    if (parentGridID !== null) {
      this.id = this.retrieveOrCreateElementID(parentGridID, hasLinkClass) + ' ' + this.id;
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
      if (!this.contentResizeSensor) {
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
    this.styleList = [];
    if (this.headTag.contains(this.headStyle)) {
      this.headTag.removeChild(this.headStyle!);
      this.headStyle = null;
    }
    if (this.widthStyleFragment && this.widthStyleFragment.contains(this.widthStyle)) {
      this.widthStyleFragment!.removeChild(this.widthStyle!);
      this.widthStyleFragment = null;
      this.widthStyle = null;
    }
    if (this.reorderHighlightStyleFragment && this.reorderHighlightStyleFragment.contains(this.reorderHighlightStyle)) {
      this.reorderHighlightStyleFragment.removeChild(this.reorderHighlightStyle!);
      this.reorderHighlightStyleFragment = null;
      this.reorderHighlightStyle = null;
    }
    for (let i = 0, len = this.subGroupFragments.length; i < len; i++) {
      if (this.subGroupFragments[i] && (this.subGroupFragments[i] as DocumentFragment).contains(this.subGroupStyles[i])) {
        (this.subGroupFragments[i] as DocumentFragment).removeChild(this.subGroupStyles[i]!);
        this.subGroupFragments[i] = null;
        this.subGroupStyles[i] = null;
      }
    }
    for (let i = 0, len = this.gridOrderFragments.length; i < len; i++) {
      if (this.gridOrderFragments[i] && (this.gridOrderFragments[i] as DocumentFragment).contains(this.gridOrderStyles[i])) {
        (this.gridOrderFragments[i] as DocumentFragment).removeChild(this.gridOrderStyles[i]!);
        this.gridOrderFragments[i] = null;
        this.gridOrderStyles[i] = null;
      }
    }
  }

  public ngOnDestroy() {

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
      const id: number = this.animationFrameIDs[i];
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
    };
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

export interface ISortableWidthItem {
  minWidth: number;
  width: number;
  className: string;
}
