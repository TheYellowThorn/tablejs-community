import { AfterViewInit, Directive, ChangeDetectorRef, ContentChild,
  ElementRef, EmbeddedViewRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewRef, OnDestroy, Renderer2, RendererFactory2, ComponentFactoryResolver} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GridService } from './../../services/grid/grid.service';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { Range } from './../../shared/classes/scrolling/range';
import { IScrollOptions } from './../../shared/interfaces/scrolling/i-scroll-options';
import { ScrollDispatcherService } from './../../services/scroll-dispatcher/scroll-dispatcher.service';
import { GridDirective } from './../../directives/grid/grid.directive';
import { TablejsForOfContext } from './../../directives/virtual-for/virtual-for.directive';
import { IVirtualNexus } from './../../shared/interfaces/i-virtual-nexus';
import { OperatingSystemService } from './../../services/operating-system/operating-system.service';
import { ScrollPrevSpacerComponent } from '../../components/scroll-prev-spacer/scroll-prev-spacer.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]',
  host: { style: 'contain: content;'}
})
export class ScrollViewportDirective implements AfterViewInit, OnDestroy, OnInit {

  @ContentChild('templateRef', { static: true }) public templateRef: TemplateRef<any> | null = null;

  @Input() templateID: string | null = '';
  @Input() generateCloneMethod: ((template: HTMLElement, items: any[], index: number) => Node) | null = null;
  private _arrowUpSpeed: string | number = 1;
  get arrowUpSpeed(): string | number {
      return Number(this._arrowUpSpeed);
  }
  @Input() set arrowUpSpeed(value: string | number) {
      this._arrowUpSpeed = Number(value);
  }

  private _arrowDownSpeed: string | number = 1;
  get arrowDownSpeed(): string | number {
      return Number(this._arrowDownSpeed);
  }
  @Input() set arrowDownSpeed(value: string | number) {
      this._arrowDownSpeed = Number(value);
  }

  private _preItemOverflow: string | number = 1;
  get preItemOverflow(): string | number {
      return Number(this._preItemOverflow);
  }
  @Input() set preItemOverflow(value: string | number) {
      this._preItemOverflow = Number(value);
  }

  private _postItemOverflow: string | number = 1;
  get postItemOverflow(): string | number {
      return Number(this._postItemOverflow);
  }
  @Input() set postItemOverflow(value: string | number) {
      this._postItemOverflow = Number(value);
  }

  private _itemLoadLimit: string | number = Infinity;
  get itemLoadLimit(): string | number {
      return Number(this._itemLoadLimit);
  }
  @Input() set itemLoadLimit(value: string | number) {
      this._itemLoadLimit = Number(value);
  }

  items: any[] | null = null;

  // Custom Elements Inputs
  @Input() templateid: string | null = null;
  @Input() preitemoverflow: number = 1;
  @Input() postitemoverflow: number = 1;
  @Input() arrowupspeed: number = 1;
  @Input() arrowdownspeed: number = 1;
  @Input() itemloadlimit: number = Infinity;
  @Input() fillViewportScrolling: any;

  @Output() itemAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() rangeUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewportScrolled: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewportReady: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewportInitialized: EventEmitter<any> = new EventEmitter<any>();

  private containerHeight: number | null = null;
  private heightLookup: any = {};
  private itemVisibilityLookup: any = {};
  public listElm: HTMLElement | null = null;
  public listContent: HTMLElement | null = null;
  public prevSpacer: HTMLElement | null = null;
  public postSpacer: HTMLElement | null = null;
  public gridDirective: GridDirective | null = null;
  public virtualForChangesSubscription$: Subscription;
  public pauseViewportRenderUpdates: boolean = false;

  public range: Range = { startIndex: 0, endIndex: 1, extendedStartIndex: 0, extendedEndIndex: 1 };
  public lastRange: Range = { startIndex: this.range.startIndex, endIndex: this.range.endIndex, extendedStartIndex: this.range.extendedStartIndex, extendedEndIndex: this.range.extendedEndIndex };
  public lastScrollTop: number = 0;
  public currentScrollTop: number = 0;
  public currentScrollChange: number = 0;
  public template: HTMLElement | null = null;
  private estimatedFullContentHeight: number = 0;
  private estimatedPreListHeight: number = 0;
  private estimatedPostListHeight: number = 0;
  private totalItemsCounted: number = 0;
  private totalHeightCount: number = 0;
  private itemName: string = '';
  private avgItemHeight: number | undefined;
  private overflowHeightCount: number = 0;
  public scrollChangeByFirstIndexedItem: number = 0;
  private lastVisibleItemHeight: number = Infinity;
  private adjustedStartIndex: number | null = null;
  private forcedEndIndex: number | undefined = undefined;
  private placeholderObject: any = {};

  private postItemOverflowCount: number = -1;
  private preItemOverflowCount: number = -1;
  private lastVisibleItemOverflow: number = 0;
  private preOverflowHeight: number = 0;
  private mouseIsOverViewport: boolean = false;
  private lastHeight: number = 0;

  private observer: MutationObserver | null = null;
  private handleMouseOver: Function | null = null;
  private handleMouseOut: Function | null = null;
  private handleKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private cloneFromTemplateRef: boolean = false;
  private viewportHasScrolled: boolean = false;
  private templateContext: TablejsForOfContext<any, any> | null = null;

  public virtualNexus: IVirtualNexus | null = null;

  private _cloneMethod: ((template: HTMLElement, items: any[], index: number) => Node) | null = null;
  private renderer: Renderer2;

  constructor(
    public elementRef: ElementRef,
    public gridService: GridService,
    @Inject(DOCUMENT) private document: any,
    private directiveRegistrationService: DirectiveRegistrationService,
    private scrollDispatcherService: ScrollDispatcherService,
    private operatingSystem: OperatingSystemService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef | null,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.elementRef.nativeElement.scrollViewportDirective = this;
  }

  public handleScroll(e: Event) {

    e.preventDefault();

    this.currentScrollTop = this.listContent!.scrollTop;
    this.currentScrollChange = this.currentScrollTop - this.lastScrollTop;
    this.scrollChangeByFirstIndexedItem += this.currentScrollChange;
    this.lastVisibleItemOverflow -= this.currentScrollChange;

    const newRange = this.getRangeChange(this.scrollChangeByFirstIndexedItem);
    this.updateScrollFromRange(newRange);

    this.scrollDispatcherService.dispatchViewportScrolledEvents(this.viewportScrolled, this.lastScrollTop, this.scrollChangeByFirstIndexedItem, this, this.elementRef.nativeElement);

  }

  private registerViewportToElement() {
    this.elementRef.nativeElement.scrollViewport = this;
  }

  private attachMutationObserver(): void {
    const ths: any = this;
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        ths.updateMutations(mutation);
      });
    });

    this.observer.observe(this.listContent!, {
      // configure it to listen to attribute changes
      attributes: true,
      subtree: true,
      childList: true
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

  private getChildNodes(node: Node) {
    node.childNodes.forEach(childNode => {
      this.directiveRegistrationService.registerNodeAttributes(childNode);
      if (childNode.childNodes) {
        this.getChildNodes(childNode);
      }
    });
  }

  public registerCustomElementsInputs(viewport: HTMLElement) {
    this.templateID = viewport.getAttribute('templateID');
    this.preItemOverflow = Number(viewport.getAttribute('preItemOverflow'));
    this.postItemOverflow = Number(viewport.getAttribute('postItemOverflow'));
    this.itemLoadLimit = Number(viewport.getAttribute('itemLoadLimit'));
    this.arrowUpSpeed = Number(viewport.getAttribute('arrowUpSpeed'));
    this.arrowDownSpeed = Number(viewport.getAttribute('arrowDownSpeed'));
    this.fillViewportScrolling = viewport.getAttribute('fillViewportScrolling');
  }

  private convertCustomElementsVariables() {
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

  private createTBodies() {
    this.listElm = this.elementRef.nativeElement;
    let body: HTMLElement | null = this.listElm!.getElementsByTagName('tbody')[0];
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
    this.listElm!.appendChild(this.listContent);

    if (this.fillViewportScrolling !== undefined && this.fillViewportScrolling !== null) {
      const coverBody = document.createElement('tbody');
      coverBody.style.display = 'block';
      coverBody.style.position = 'absolute';
      coverBody.style.width = '100%';
      coverBody.style.height = '100%';
      coverBody.style.overflow = 'auto';
      coverBody.style.pointerEvents = 'none';
      coverBody.style.visibility = 'false';
      this.listElm!.appendChild(coverBody);
    }

    this.directiveRegistrationService.registerViewportOnGridDirective(this.listContent);

    const compFactory = this.componentFactoryResolver.resolveComponentFactory(ScrollPrevSpacerComponent);
    const componentRef = this.virtualNexus!.virtualForDirective._viewContainer.createComponent<ScrollPrevSpacerComponent>(compFactory, null, this.virtualNexus!.virtualForDirective._viewContainer.injector);
    this.virtualNexus!.virtualForDirective._viewContainer.detach(0);
    const ref: EmbeddedViewRef<any> = this.virtualNexus!.virtualForDirective._viewContainer.createEmbeddedView(componentRef.instance.template, undefined, 0);
    this.prevSpacer = ref.rootNodes[0];

    this.postSpacer = document.createElement('tr');
    this.postSpacer.setAttribute('tablejsPostSpacer', '');
    this.postSpacer.style.display = 'block';
    this.postSpacer.style.position = 'relative';
    this.listContent.appendChild(this.postSpacer);
  }

  private addScrollHandler(): void {
    this.listContent!.addEventListener('scroll', (e) => {
      this.handleScroll(e);
    });
  }

  public rerenderRowAt(index: number, updateScrollPosition: boolean = false): void {
    if (!this.viewportHasScrolled) {
      return;
    }
    const ind = index - this.adjustedStartIndex!;
    const itemName: string = 'item' + index;

    if (ind > this.items!.length - 1 || this.itemVisibilityLookup[this.itemName] !== true) {
      return;
    }

    const indexMap: any = {};
    for (let i = 1; i < this.virtualNexus!.virtualForDirective._viewContainer.length; i++) {
      indexMap[(this.virtualNexus!.virtualForDirective._viewContainer.get(i) as EmbeddedViewRef<any>).rootNodes[0].index] = i;
    };
    const detachedRef: ViewRef | null = this.virtualNexus!.virtualForDirective._viewContainer.detach(indexMap[index]);
    const child: HTMLElement = (detachedRef as EmbeddedViewRef<any>).rootNodes[0];
    detachedRef!.destroy();
    
    this.templateContext = new TablejsForOfContext<any, any>(this.items![index], this.virtualNexus!.virtualForDirective._tablejsForOf, index, this.items!.length);
    const ref: EmbeddedViewRef<any> = this.virtualNexus!.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus!.virtualForDirective._template, this.templateContext, indexMap[index]);
    this.virtualNexus!.virtualForDirective._viewContainer.move(ref, indexMap[index]);
    let clone: any = ref.rootNodes[0];
    clone.index = index;
    this.cdr!.detectChanges();

    this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, child, index, this, this.elementRef.nativeElement);

    const lookupHeight: number = clone.offsetHeight;
    const oldHeight: number = this.heightLookup[itemName];
    this.heightLookup[itemName] = lookupHeight;

    clone.lastHeight = lookupHeight;

    this.addResizeSensor(clone, index);

    if (oldHeight) {
      this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
    } else {
      this.updateEstimatedHeight(lookupHeight);
    }

    if (updateScrollPosition) {
      this.refreshViewport();
    }

    this.scrollDispatcherService.dispatchUpdateItemEvents(this.itemUpdated, clone, index, this, this.elementRef.nativeElement);
    this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, clone, index, this, this.elementRef.nativeElement);
  }

  private viewportRendered() {
    this.virtualNexus = this.directiveRegistrationService.getVirtualNexusFromViewport(this);

    if (this.virtualNexus && this.virtualNexus.virtualForDirective) {
      this.items = this.virtualNexus.virtualForDirective._tablejsForOf;

      this.virtualForChangesSubscription$ = this.virtualNexus.virtualForDirective.changes.subscribe(item => {
        const isTheSameArray = this.items === item.tablejsForOf;
        this.items = item.tablejsForOf;

        const scrollToOptions = { index: 0, scrollAfterIndexedItem: 0 };
        if (isTheSameArray) {
          scrollToOptions.index = this.range.startIndex as number;
          scrollToOptions.scrollAfterIndexedItem = this.scrollChangeByFirstIndexedItem;

          // array has changed...rerender current elements
          const listChildren = Array.from(this.listContent!.childNodes);
        } else {
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
        generateCloneMethod: this._cloneMethod!
      });
    }
    this.scrollDispatcherService.dispatchViewportReadyEvents(this.viewportReady, this, this.elementRef.nativeElement);
  }

  public scrollToBottom(): void {
    this.range.startIndex = this.items!.length;
    this.scrollToExact(this.range.startIndex, 0);
  }

  public scrollToTop(): void {
    this.scrollToExact(0, 0);
  }

  public pageUp(): void {
    let heightCount: number = this.scrollChangeByFirstIndexedItem;
    if (this.range.startIndex === 0) {
      this.scrollToExact(0, 0);
      return;
    }
    for (let i = this.range.startIndex! - 1; i >= 0; i--) {
      const lookupHeight: number = this.heightLookup['item' + i] ? this.heightLookup['item' + i] : this.avgItemHeight;
      heightCount += lookupHeight;
      if (heightCount >= this.containerHeight! || i === 0) {
        const overflowDifference: number = heightCount >= this.containerHeight! ? heightCount - this.containerHeight! : 0;
        this.scrollToExact(i, overflowDifference);
        break;
      }
    }
  }

  public pageDown(): void {
    this.range.startIndex = this.range.endIndex! - 1;
    const overflowDifference: number = this.heightLookup['item' + (this.range.endIndex! - 1).toString()] - this.lastVisibleItemOverflow;
    this.scrollToExact(this.range.startIndex, overflowDifference);
  }

  private addArrowListeners() {
    this.elementRef.nativeElement.addEventListener('mouseenter', this.handleMouseOver = (e: MouseEvent) => {
      this.mouseIsOverViewport = true;
    });
    this.elementRef.nativeElement.addEventListener('mouseleave', this.handleMouseOut = (e: MouseEvent) => {
      this.mouseIsOverViewport = false;
    });

    document.addEventListener('keydown', this.handleKeyDown = (e: KeyboardEvent) => {

      if (this.mouseIsOverViewport) {

        const isMac = this.operatingSystem.isMac();

        switch (e.code) {
          case 'ArrowDown':
            if (isMac && e.metaKey) {
              e.preventDefault();
              this.scrollToBottom();
            } else {
              e.preventDefault();
              this.range.startIndex! += Number(this.arrowDownSpeed);
              this.scrollToExact(this.range.startIndex!, 0);
            }
            break;
          case 'ArrowUp':
            if (isMac && e.metaKey) {
              e.preventDefault();
              this.scrollToTop();
            } else {
              if (this.scrollChangeByFirstIndexedItem === 0) {
                e.preventDefault();
                this.range.startIndex! -= Number(this.arrowUpSpeed);
                this.scrollToExact(this.range.startIndex!, 0);
              } else {
                e.preventDefault();
                this.scrollChangeByFirstIndexedItem = 0;
                this.scrollToExact(this.range.startIndex!, 0);
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


  public ngAfterViewInit() {
    this.gridDirective = (this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement)! as any)['gridDirective'];
    this.gridDirective!.scrollViewportDirective = this;

    this.gridDirective!.preGridInitialize.pipe(take(1)).subscribe(res => {
      this.cdr!.detectChanges();
      this.refreshContainerHeight();

      this.refreshViewport();
      // placeholder object is used only to initialize first grid render
      if (this.items![0] === this.placeholderObject) {
        this.items!.shift();
      }
    });

    this.viewportRendered();
    this.addArrowListeners();
  }

  public ngOnInit() {
    this.registerViewportToElement();
    this._cloneMethod = this.generateCloneMethod;
  }

  public ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('mouseenter', this.handleMouseOver);
    this.elementRef.nativeElement.removeEventListener('mouseleave', this.handleMouseOut);
    document.removeEventListener('keydown', this.handleKeyDown!);
    if (this.virtualForChangesSubscription$) {
      this.virtualForChangesSubscription$.unsubscribe();
    }
  }

  private setScrollSpacers(): void {

    const numItemsAfterShownList = this.items!.length - this.range.extendedEndIndex!;
    const numItemsBeforeShownList = this.adjustedStartIndex;

    const totalUnshownItems = numItemsBeforeShownList! + numItemsAfterShownList;

    const beforeItemHeightPercent = totalUnshownItems !== 0 ? numItemsBeforeShownList! / totalUnshownItems : 0;
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

    this.prevSpacer!.style.height = this.estimatedPreListHeight.toString() + 'px';
    this.postSpacer!.style.height = this.estimatedPostListHeight.toString() + 'px';

  }

  private setHeightByListHeightDifference(liHeight: number, listHeight: number) {
    return liHeight - listHeight;
  }

  private removePreScrollItems(lastIndex: number, index: number) {
    if (lastIndex < index) {
      for (let i = lastIndex; i < index; i++) {
        const firstRef: ViewRef | null = this.virtualNexus!.virtualForDirective._viewContainer.get(1);
        if (firstRef) {
          const firstChild = (firstRef as EmbeddedViewRef<any>).rootNodes[0];
          const itemName = 'item' + i;
          this.itemVisibilityLookup[itemName] = false;
  
          const detachedRef: ViewRef | null = this.virtualNexus!.virtualForDirective._viewContainer.detach(1);
          detachedRef!.destroy();
          this.cdr!.detectChanges();

          this.removeResizeSensor(firstChild, i);
          this.lastHeight -= this.heightLookup[itemName];
          this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, firstChild, i, this, this.elementRef.nativeElement);
        }
      }
    }
  }
  private removePostScrollItems(lastEndIndex: number, endIndex: number) {
    if (lastEndIndex >= this.items!.length) {
      lastEndIndex = this.items!.length - 1;
    }

    for (let i = lastEndIndex; i >= endIndex; i--) {
      const lastChild = this.getPreviousSibling(this.listContent!.lastElementChild);
      if (lastChild) {
        const itemName = 'item' + i;
        this.itemVisibilityLookup[itemName] = false;

        const detachedRef: ViewRef | null = this.virtualNexus!.virtualForDirective._viewContainer.detach(this.virtualNexus!.virtualForDirective._viewContainer.length - 1);
        detachedRef!.destroy();
        this.cdr!.detectChanges();

        this.removeResizeSensor(lastChild, i);
        this.lastHeight -= this.heightLookup[itemName];
        this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, (detachedRef as EmbeddedViewRef<any>).rootNodes[0], i, this, this.elementRef.nativeElement);
      }
    }
  }

  public updateItems(items: any[], scrollToOptions: any = {index: -1, scrollAfterIndexedItem: 0 }): void {
    if (this.pauseViewportRenderUpdates) {
      return;
    }
    for (let i = this.virtualNexus!.virtualForDirective._viewContainer.length - 1; i > 0; i--) {
      const detachedRef: ViewRef | null = this.virtualNexus!.virtualForDirective._viewContainer.detach(i);
      detachedRef!.destroy();
    }
    this.cdr!.detectChanges();

    this.resetToInitialValues();
    this.items = items;
    if (this.virtualNexus) {
      this.virtualNexus.virtualForDirective._tablejsForOf = items;
    }

    if (scrollToOptions.index !== -1) {
      this.scrollToExact(scrollToOptions.index, scrollToOptions.scrollAfterIndexedItem);
    }
  }

  public resetToInitialValues(): void {
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

  public recalculateRowHeight(index: number): void {
    const itemName: string = 'item' + index;
    const indexMap: any = {};
    for (let i = 1; i < this.virtualNexus!.virtualForDirective._viewContainer.length; i++) {
      indexMap[(this.virtualNexus!.virtualForDirective._viewContainer.get(i) as EmbeddedViewRef<any>).rootNodes[0].index] = i;
    };
    const rowRef: EmbeddedViewRef<any> = this.virtualNexus!.virtualForDirective._viewContainer.get(indexMap[index]) as EmbeddedViewRef<any>;
    const rowEl: HTMLElement | any = rowRef.rootNodes[0];

    const lookupHeight: number = rowEl.offsetHeight;
    const heightDifference: number = lookupHeight - this.heightLookup[itemName];
    this.updateEstimatedHeightFromResize(this.heightLookup[itemName], lookupHeight);
    this.heightLookup[itemName] = lookupHeight;

    rowEl.lastHeight = lookupHeight;
    this.lastHeight += heightDifference;
  }

  private updateEstimatedHeightFromResize(oldHeight: number, newHeight: number): void {
    this.totalHeightCount += (newHeight - oldHeight);
    this.avgItemHeight = (this.totalHeightCount / this.totalItemsCounted);
    this.estimatedFullContentHeight = this.avgItemHeight * this.items!.length;
  }
  private updateEstimatedHeight(height: number) {
    this.totalHeightCount += height;
    this.totalItemsCounted++;

    this.avgItemHeight = (this.totalHeightCount / this.totalItemsCounted);
    this.estimatedFullContentHeight = this.avgItemHeight * this.items!.length;
  }

  public getPreviousSibling(el: Node | Element | null): any {
    if (!el) {
      return null;
    }
    let prev = el.previousSibling;
    while (prev !== null && prev !== undefined && prev.nodeType !== 1) {
      prev = prev.previousSibling;
    }
    return prev;
  }
  public getNextSibling(el: Element | null): any {
    if (!el) {
      return null;
    }
    let next = el.nextSibling;
    while (next !== null && next !== undefined && next.nodeType !== 1) {
      next = next.nextSibling;
    }
    return next;
  }

  private getEstimatedChildInsertions(remainingHeight: number): number {
    return Math.ceil(remainingHeight / this.avgItemHeight!);
  }

  private setLastRangeToCurrentRange() {
    this.lastRange.startIndex = this.range.startIndex;
    this.lastRange.endIndex = this.range.endIndex;
    this.lastRange.extendedStartIndex = this.range.extendedStartIndex;
    this.lastRange.extendedEndIndex = this.range.extendedEndIndex;
  }

  private resetLastHeight() {
    if (!this.lastHeight) {
      this.lastHeight = 0;
    }
  }

  private maintainIndexInBounds(index: number) {
    if (index > this.items!.length - 1) {
      index = this.items!.length - 1;
    } else if (index < 0) {
      index = 0;
    }
    return index;
  }

  private maintainEndIndexInBounds(index: number) {
    if (index > this.items!.length) {
      index = this.items!.length;
    } else if (index < 0) {
      index = 0;
    }
    return index;
  }

  public showRange(startIndex: number, endIndex: number, overflow: number = 0): void {
    this.updateItems(this.items!, {index: startIndex, scrollAfterIndexedItem: endIndex });
    startIndex = this.maintainIndexInBounds(startIndex);
    endIndex = this.maintainEndIndexInBounds(endIndex);
    if (endIndex <= startIndex) {
      endIndex = startIndex + 1;
    }

    const oldContainerHeight: number = this.containerHeight!;
    const oldPreItemOverflow: number = Number(this.preItemOverflow);
    const oldPostItemOverflow: number = Number(this.postItemOverflow);

    this.preItemOverflow = 0;
    this.postItemOverflow = 0;
    this.containerHeight = 100000;
    this.forcedEndIndex = endIndex;

    this.scrollToExact(startIndex, overflow);

    const rangeToKeep: Range = { ...this.range};
    const lastRangeToKeep: Range = { ...this.lastRange };

    this.preItemOverflow = oldPreItemOverflow;
    this.postItemOverflow = oldPostItemOverflow;
    this.containerHeight = oldContainerHeight;
    this.forcedEndIndex = undefined;

    this.range = rangeToKeep;
    this.lastRange = lastRangeToKeep;

  }

  public getDisplayedContentsHeight(): number {
    return this.lastHeight;
  }

  public refreshContainerHeight(): void {
    this.containerHeight = this.listContent!.clientHeight;
  }

  public allItemsFitViewport(recalculateContainerHeight: boolean = false, refreshViewport: boolean = false): boolean {
    if (recalculateContainerHeight) {
      this.cdr!.detectChanges();
      this.refreshContainerHeight();
    }
    if (refreshViewport) {
      this.refreshViewport(true);
    }
    return this.range.startIndex === this.range.extendedStartIndex &&
            this.range.endIndex === this.range.extendedEndIndex && 
            this.lastHeight <= this.containerHeight!;
  }

  public getCurrentScrollPosition(): any {
    return {
      index: this.range.startIndex,
      overflow: this.scrollChangeByFirstIndexedItem,
      lastItemOverflow: this.lastVisibleItemOverflow > 0 ? 0 : this.lastVisibleItemOverflow
    }
  }

  private setHeightsForOverflowCalculations(itemIndex: number, scrollToIndex: number, itemHeight: number) {
    this.lastHeight += itemHeight;

    if (itemIndex < scrollToIndex) {
      this.preOverflowHeight += itemHeight;
    }

    if (itemIndex >= scrollToIndex) {
      this.overflowHeightCount += itemHeight;
      if (this.overflowHeightCount >= this.containerHeight!) {
        this.postItemOverflowCount++;

        if (this.postItemOverflowCount === 0) {
          this.lastVisibleItemHeight = this.heightLookup['item' + itemIndex];
        }
      }
    }
  }

  private addResizeSensor(el: any, index: number): void {
  }
  private removeResizeSensor(el: any, index: number): void {
  }

  public onTransitionEnd: (_e: any) => void = (e) => {
  }
  public onTransitionRun: (_e: any) => void = (e) => {
  }
  public onTransitionStart: (_e: any) => void = (e) => {
  }
  public onTransitionCancel: (_e: any) => void = (e) => {
  }

  public getCloneFromTemplateRef(index: number): HTMLElement {
    let clone: HTMLElement;

    this.templateContext = new TablejsForOfContext<any, any>(this.items![index], this.virtualNexus!.virtualForDirective._tablejsForOf, index, this.items!.length);
    const viewRef = this.virtualNexus!.virtualForDirective._template.createEmbeddedView(this.templateContext);
    viewRef.detectChanges();
    clone = viewRef.rootNodes[0];

    return clone;
  }

  private addScrollItems(index: number, overflow: number): void {
    const scrollingUp = index < this.lastRange.startIndex!;

    this.range.extendedStartIndex = this.adjustedStartIndex;
    this.range.startIndex = index;
    this.overflowHeightCount = -overflow;
    this.preOverflowHeight = 0;
    const firstEl = this.getNextSibling(this.listContent!.firstElementChild);
    this.lastHeight = 0;
    let batchSize: number = this.avgItemHeight !== undefined && isNaN(this.avgItemHeight) === false ? this.getEstimatedChildInsertions(this.containerHeight! - this.lastHeight) + Number(this.preItemOverflow) + Number(this.postItemOverflow) : 1;
    let itemsToBatch: any[] = [];
    let itemBefore: Node;
    let indexBefore: number;
    const firstRef: ViewRef | null = this.virtualNexus!.virtualForDirective._viewContainer.get(1);
    const appendToEnd: boolean = firstRef === null;
    for (let i = this.adjustedStartIndex!; i < this.adjustedStartIndex! + Number(this.itemLoadLimit); i++) {
      if (i < 0) {
        continue;
      }
      if (i > this.items!.length - 1) {
        break;
      }

      this.itemName = 'item' + i;
      // only insert item if it is not already visible
      const itemIsInvisible: boolean = this.itemVisibilityLookup[this.itemName] !== true;

      if (itemIsInvisible) {
        itemBefore = !scrollingUp ? this.postSpacer : firstEl;

        indexBefore = !scrollingUp || appendToEnd ? this.virtualNexus!.virtualForDirective._viewContainer.length : this.virtualNexus!.virtualForDirective._viewContainer.indexOf(firstRef!);

        this.itemVisibilityLookup[this.itemName] = true;

        this.templateContext = new TablejsForOfContext<any, any>(this.items![i], this.virtualNexus!.virtualForDirective._tablejsForOf, i, this.items!.length);
        const ref: EmbeddedViewRef<any> = this.virtualNexus!.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus!.virtualForDirective._template, this.templateContext, indexBefore);
        this.virtualNexus!.virtualForDirective._viewContainer.move(ref, indexBefore);

        const prev: any = ref.rootNodes[0];
        prev.index = i;
        
        itemsToBatch.push({ index: i, name: this.itemName, item: prev, before: itemBefore });

        this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, prev, i, this, this.elementRef.nativeElement);
      } else {
        itemsToBatch.push({ index: i, name: this.itemName, item: null, before: null });
        this.setHeightsForOverflowCalculations(i, index, this.heightLookup[this.itemName]);
      }

      if (itemsToBatch.length === batchSize || i === this.items!.length - 1 || this.postItemOverflowCount >= Number(this.postItemOverflow)) {
        for (let j = 0; j < itemsToBatch.length; j++) {
          const batchObj: any = itemsToBatch[j];
          const name: string = batchObj.name;
          const ind: number = batchObj.index;
          const oldHeight: number = this.heightLookup[name];

          if (batchObj.item === null) {
            continue;
          }

          this.cdr!.detectChanges();
          const lookupHeight: number = batchObj.item.offsetHeight;

          this.heightLookup[name] = lookupHeight;

          batchObj.item.lastHeight = lookupHeight;
          this.addResizeSensor(batchObj.item, batchObj.index);

          if (oldHeight) {
            this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
          } else {
            this.updateEstimatedHeight(lookupHeight);
          }
          this.setHeightsForOverflowCalculations(ind, index, lookupHeight);
        }
        batchSize = this.getEstimatedChildInsertions(this.containerHeight! - this.lastHeight) + Number(this.preItemOverflow) + Number(this.postItemOverflow);
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
      } else {
        if (i === this.forcedEndIndex - 1) {
          break;
        }
      }
    }
    let itemName: string;
    let endIndexFound: boolean = false;
    let heightCount: number = -overflow;
    for (let i = this.range.startIndex; i < this.range.extendedEndIndex!; i++) {
      itemName = 'item' + i;
      heightCount += this.heightLookup[itemName];

      if (this.forcedEndIndex !== undefined) {
        if (i === this.forcedEndIndex - 1) {
          this.range.endIndex = i + 1;
          this.lastVisibleItemOverflow = heightCount - this.containerHeight!;

          endIndexFound = true;
          break;
        }
      } else {
        if (heightCount >= this.containerHeight! && !endIndexFound) {
          this.range.endIndex = i + 1;
          this.lastVisibleItemOverflow = heightCount - this.containerHeight!;

          endIndexFound = true;
          break;
        }
      }
    }
  }

  private addMissingPostScrollItemsAndUpdateOverflow(index: number, overflow: number): number {

    let firstEl;
    let itemsToBatch: any[] = [];
    let batchSize: number;

    if (this.overflowHeightCount <= this.containerHeight!) {
      batchSize = this.getEstimatedChildInsertions(this.containerHeight!) + Number(this.preItemOverflow);
      this.preItemOverflowCount = -1;
      this.preOverflowHeight = 0;

      firstEl = this.getNextSibling(this.listContent!.firstElementChild);

      let heightCount = 0;
      let count = 0;

      for (let i = this.range.endIndex! - 1; i >= 0; i--) {
        this.itemName = 'item' + i;

        count++;
        if (i <= this.range.extendedStartIndex! && this.itemVisibilityLookup[this.itemName] !== true) {

          this.itemVisibilityLookup[this.itemName] = true;

          this.templateContext = new TablejsForOfContext<any, any>(this.items![i], this.virtualNexus!.virtualForDirective._tablejsForOf, i, this.items!.length);
          const ref: EmbeddedViewRef<any> = this.virtualNexus!.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus!.virtualForDirective._template, this.templateContext, 1);
          this.virtualNexus!.virtualForDirective._viewContainer.move(ref, 1);
          const prev: any = ref.rootNodes[0];
          prev.index = i;
          this.cdr!.detectChanges();

          itemsToBatch.push({ index: i, name: this.itemName, item: prev, before: firstEl });
          this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, prev, i, this, this.elementRef.nativeElement);
          firstEl = prev;

          this.range.extendedStartIndex = i;
          this.adjustedStartIndex = i;
        } else {
          itemsToBatch.push({ index: i, name: this.itemName, item: null, before: null });

          heightCount += this.heightLookup[this.itemName];
          if (heightCount > this.containerHeight!) {
            this.preItemOverflowCount++;
            if (this.preItemOverflowCount === 0) {
              overflow = heightCount - this.containerHeight!;
              this.range.startIndex = i;
              index = i;
            } else {
              this.preOverflowHeight += this.heightLookup[this.itemName];
            }
            this.range.extendedStartIndex = i;
            this.adjustedStartIndex = i;
          }
        }

        if (itemsToBatch.length === batchSize || i === 0) {
          for (let j = 0; j < itemsToBatch.length; j++) {
            const batchObj: any = itemsToBatch[j];
            if (batchObj.item === null) {
              continue;
            }
            const name: string = batchObj.name;
            const ind: number = batchObj.index;
            const lookupHeight: number = batchObj.item.offsetHeight;
            const oldHeight: number = this.heightLookup[name];
            this.heightLookup[name] = lookupHeight;

            batchObj.item.lastHeight = lookupHeight;
            this.addResizeSensor(batchObj.item, batchObj.index);
            if (oldHeight) {
              this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
            } else {
              this.updateEstimatedHeight(lookupHeight);
            }

            heightCount += lookupHeight;

            if (heightCount > this.containerHeight!) {
              this.preItemOverflowCount++;
              if (this.preItemOverflowCount === 0) {
                overflow = heightCount - this.containerHeight!;
                this.range.startIndex = batchObj.index;
                index = batchObj.index;
              } else {
                this.preOverflowHeight += lookupHeight;
              }
              this.range.extendedStartIndex = batchObj.index;
              this.adjustedStartIndex = batchObj.index;
            }

          }
          batchSize = this.getEstimatedChildInsertions(this.containerHeight! - this.lastHeight) + Number(this.preItemOverflow);
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

  public scrollToExact(index: number, overflow: number = 0): void {
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

    this.removePreScrollItems(this.lastRange.extendedStartIndex!, Math.min(this.adjustedStartIndex, this.lastRange.extendedEndIndex!));

    this.addScrollItems(index, overflow);

    this.removePostScrollItems(this.lastRange.extendedEndIndex! - 1, Math.max(this.lastRange.extendedStartIndex!, this.range.extendedEndIndex));

    if (!this.forcedEndIndex) {
      overflow = this.addMissingPostScrollItemsAndUpdateOverflow(index, overflow);
    }

    this.setLastRangeToCurrentRange();

    this.setScrollSpacers();

    this.lastScrollTop = this.preOverflowHeight + overflow + this.estimatedPreListHeight;
    this.listContent!.scrollTop = this.lastScrollTop;
    this.currentScrollTop = this.lastScrollTop;

    this.scrollChangeByFirstIndexedItem = overflow;
    this.scrollDispatcherService.dispatchRangeUpdateEvents(this.rangeUpdated, this.range, this, this.elementRef.nativeElement);

    this.viewportHasScrolled = true;

  }

  private getRangeChange(scrollChange: number) {
    let heightCount = 0;
    let rangeStartCount = 0;
    let overflow = 0;
    const newRange: Range = { startIndex: null, endIndex: null, extendedStartIndex: null, extendedEndIndex: null };
    let itemName;

    if (scrollChange > 0) {
      for (let i = this.range.startIndex; i! <= this.range.endIndex! + Number(this.itemLoadLimit); i!++) {
        overflow = scrollChange - heightCount;
        itemName = 'item' + i;
        if (this.heightLookup[itemName]) {
          heightCount += this.heightLookup[itemName];
        } else {
          heightCount += this.avgItemHeight!;
        }

        if (heightCount >= scrollChange) {
          break;
        }

        rangeStartCount++;
      }

      newRange.startIndex = this.range.startIndex! + rangeStartCount;
      newRange.endIndex = rangeStartCount < this.range.endIndex! - this.range.startIndex! ? this.range.endIndex : newRange.startIndex + 1;
    }

    if (scrollChange < 0) {
      rangeStartCount = -1;
      overflow = scrollChange;
      for (let i = this.range.startIndex! - 1; i >= 0; i--) {
        itemName = 'item' + i;
        if (this.heightLookup[itemName]) {
          overflow += this.heightLookup[itemName];
          heightCount += this.heightLookup[itemName];
        } else {
          overflow += this.avgItemHeight!;
          heightCount += this.avgItemHeight!;
        }

        if (overflow >= 0) {
          break;
        }

        rangeStartCount--;
      }

      newRange.startIndex = this.range.startIndex! + rangeStartCount >= 0 ? this.range.startIndex! + rangeStartCount : 0;
      newRange.endIndex = rangeStartCount < this.range.endIndex! - this.range.startIndex! ? this.range.endIndex : newRange.startIndex + 1;
    }

    this.scrollChangeByFirstIndexedItem = overflow;

    return newRange;
  }

  public refreshViewport(recalculateRows: boolean = false): void {
    if (recalculateRows) {
      for (let i = this.range.extendedStartIndex!; i < this.range.extendedEndIndex!; i++) {
        this.recalculateRowHeight(i);
      }
    }
    this.scrollToExact(this.range.startIndex!, this.scrollChangeByFirstIndexedItem);
  }

  public updateScrollFromRange(newRange: Range): void {
    if (newRange.startIndex !== null) {
      if (this.range.startIndex !== newRange.startIndex || this.lastVisibleItemOverflow < 0) {
        this.range.startIndex = newRange.startIndex;
        this.range.endIndex = newRange.endIndex;

        this.refreshViewport();
      } else {
        this.lastScrollTop = this.currentScrollTop;
      }
    }
    this.lastScrollTop = this.currentScrollTop;
  }

  private initScroll(options: IScrollOptions) {
    this.items = options.items;
    this._cloneMethod = options.generateCloneMethod;
    const itemsAreEmpty: boolean = this.items.length === 0;
    let index = options.initialIndex ? options.initialIndex : 0;

    if (this.virtualNexus && this.virtualNexus.virtualForDirective._template) {
      setTimeout(() => {
        this.cloneFromTemplateRef = true;
        this.verifyViewportIsReady();
        this.initFirstScroll(index);
      });
    } else {
      this.template = document.getElementById(this.templateID!);
      this.verifyViewportIsReady();
      this.initFirstScroll(index);
    }
  }

  private verifyViewportIsReady() {
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

  private initFirstScroll(index: number): void {
    const itemsAreEmpty: boolean = this.items!.length === 0;
    this.refreshContainerHeight();
    if (itemsAreEmpty) {
      this.items!.push(this.placeholderObject);
      this.scrollToExact(index, 0);
      const node: HTMLElement = (this.virtualNexus!.virtualForDirective._viewContainer.get(1) as EmbeddedViewRef<any>).rootNodes[0];
      this.renderer!.setStyle(node, 'height', '0px');
      this.renderer!.setStyle(node, 'minHeight', '0px');
      this.renderer!.setStyle(node, 'overflow', 'hidden');
    } else {
      this.scrollToExact(index, 0);
    }
    this.scrollDispatcherService.dispatchViewportInitializedEvents(this.viewportInitialized, this, this.elementRef.nativeElement);
  }

  private itemsAreSet(): boolean {
    return !!this.items;
  }
  private cloneMethodIsSet(): boolean {
    return !!this._cloneMethod;
  }
  private templateIsSet(): boolean {
    return this.virtualNexus!.virtualForDirective._template !== undefined && this.virtualNexus!.virtualForDirective._template !== null;
  }

}
