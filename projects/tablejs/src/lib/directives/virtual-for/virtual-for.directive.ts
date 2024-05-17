
import { Directive, DoCheck, ElementRef, Input, IterableChanges, IterableDiffer, IterableDiffers, NgIterable, OnDestroy, TemplateRef, TrackByFunction, ViewContainerRef} from '@angular/core';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { IVirtualNexus } from './../../shared/interfaces/i-virtual-nexus';
import { Subject, Subscription } from 'rxjs';
import { ScrollViewportDirective } from './../scroll-viewport/scroll-viewport.directive';
import { Range } from './../../shared/classes/scrolling/range';

export class TablejsForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
  constructor(public $implicit: T, public tablejsVirtualForOf: U, public index: number, public count: number) {}

  get first(): boolean {
    return this.index === 0;
  }

  get last(): boolean {
    return this.index === this.count - 1;
  }

  get even(): boolean {
    return this.index % 2 === 0;
  }

  get odd(): boolean {
    return !this.even;
  }
}

@Directive({selector: '[tablejsVirtualFor][tablejsVirtualForOf]'})
export class VirtualForDirective<T, U extends NgIterable<T> = NgIterable<T>> implements DoCheck, OnDestroy {

  public virtualNexus: IVirtualNexus | null;
  public changes: Subject<any> = new Subject<any>();
  public rangeUpdatedSubscription$: Subscription;

  @Input()
  set tablejsVirtualForOf(tablejsVirtualForOf: U|undefined|null) {
    this._tablejsForOf = tablejsVirtualForOf;
    this._onRenderedDataChange();
  }

  public _tablejsForOf: U|undefined|null = null;
  private _lastTablejsForOf: U|undefined|null;
  private _differ: IterableDiffer<T>|null = null;
  private _tablejsVirtualForTrackBy: TrackByFunction<T> | undefined | null;
  private _scrollViewportDirective: ScrollViewportDirective | undefined | null;
  private _lastRange: Range;
  private _renderedItems: any[];
  private _parent: HTMLElement | undefined | null;
  /**
   * Asserts the correct type of the context for the template that `TablejsForOf` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `TablejsForOf` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T, U extends NgIterable<T>>(dir: VirtualForDirective<T, U>, ctx: any):
      ctx is TablejsForOfContext<T, U> {
    return true;
  }

  /**
   * A reference to the template that is stamped out for each item in the iterable.
   * @see [template reference variable](guide/template-reference-variables)
   */
  @Input()
  set tablejsVirtualForTemplate(value: TemplateRef<TablejsForOfContext<T, U>>) {
    if (value) {
      this._template = value;
    }
  }

  public get template(): TemplateRef<TablejsForOfContext<T, U>> {
    return this._template as TemplateRef<TablejsForOfContext<T, U>>;
  }

  @Input()
  get tablejsVirtualForTrackBy(): TrackByFunction<T> | undefined | null {
    return this._tablejsVirtualForTrackBy;
  }
  set tablejsVirtualForTrackBy(fn: TrackByFunction<T> | undefined | null) {
    this._tablejsVirtualForTrackBy = fn ?
        (index, item) => fn(index + (this._lastRange ? this._lastRange.extendedStartIndex! : 0), item) :
        undefined;

    this._onRenderedDataChange();
  }

  constructor(
      public _viewContainer: ViewContainerRef,
      public _template: TemplateRef<TablejsForOfContext<T, U>> | null,
      private _differs: IterableDiffers,
      private elementRef: ElementRef,
      private directiveRegistrationService: DirectiveRegistrationService) {
        
        this._parent = this._viewContainer.element.nativeElement.parentElement;

        while (this._parent !== null && this._parent !== undefined && (this._parent as any).scrollViewportDirective === undefined) {
          this._parent = this._parent.parentElement;
        }
        if (this._parent === null || this._parent === undefined) {
          throw Error('No scrollViewportDirective found for tablejsForOf.  Declare a scrollViewport using the scrollViewportDirective.');
        } else {
          
          this._scrollViewportDirective = (this._parent as any).scrollViewportDirective;
          this.directiveRegistrationService.setVirtualNexus(this, this._scrollViewportDirective!);
          
          this._lastRange = this._scrollViewportDirective!.range;

          this.rangeUpdatedSubscription$ = this._scrollViewportDirective!.rangeUpdated.subscribe(rangeObj => {
            if (this.rangeIsDifferent(this._lastRange, rangeObj.range)) {
              this._lastRange = rangeObj.range;
              this._renderedItems = Array.from(this._tablejsForOf as Iterable<any>).slice(this._lastRange.extendedStartIndex!, this._lastRange.extendedEndIndex!);
              this._onRenderedDataChange(false);
            }
          });
        }
      }

  rangeIsDifferent(range1: Range, range2: Range): boolean {
    return range1.endIndex === range2.endIndex && range1.extendedEndIndex === range2.extendedEndIndex && range1.startIndex === range2.startIndex && range1.extendedStartIndex === range2.extendedStartIndex;
  }

  renderedItemsNeedUpdate(): boolean {
    return this._renderedItems.length !== this._lastRange.extendedEndIndex! - this._lastRange.extendedStartIndex!;
  }

  private _onRenderedDataChange(updateRenderedItems: boolean = true) {
    if (!this._renderedItems) {
      return;
    }
    if (updateRenderedItems) {
      this._renderedItems = Array.from(this._tablejsForOf as Iterable<any>).slice(this._lastRange.extendedStartIndex!, this._lastRange.extendedEndIndex!);
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

  updateItems(): void {
    if (this._differ) {
      const scrollToOrigin = this._tablejsForOf !== this._lastTablejsForOf;
      let diffChanges: IterableChanges<any> | null = null;

      if (this.renderedItemsNeedUpdate()) {
        this._onRenderedDataChange();
      }

      try {
        diffChanges = this._differ.diff(this._renderedItems);
      } catch {
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

  ngOnDestroy(): void {
    this._lastTablejsForOf = null;
    this._tablejsForOf = null;
    this._differ = null;
    this._scrollViewportDirective = null;
    this._renderedItems = [];
    this._template = null;
    this._tablejsVirtualForTrackBy = null;
    if (this._parent) {
      (this._parent as any).scrollViewportDirective = null;
      this._parent = null;
    }   

    if (this.rangeUpdatedSubscription$) {
      this.rangeUpdatedSubscription$.unsubscribe();
    }
    
  }
}
