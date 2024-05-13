import { EventEmitter, Injectable } from '@angular/core';
import { ScrollViewportEvent } from './../../shared/classes/events/scroll-viewport-event';
import { Range } from './../../shared/classes/scrolling/range';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';

@Injectable({
  providedIn: 'root'
})
export class ScrollDispatcherService {

  constructor() { }

  public dispatchAddItemEvents(eventEmitter: EventEmitter<any>, element: Node, i: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void {
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

  public dispatchUpdateItemEvents(eventEmitter: EventEmitter<any>, element: Node, index: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void {
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

  public dispatchRemoveItemEvents(eventEmitter: EventEmitter<any>, element: Node, i: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void {
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

  public dispatchViewportReadyEvents(eventEmitter: EventEmitter<any>, viewport: ScrollViewportDirective, viewportElement: HTMLElement) {
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

  public dispatchViewportInitializedEvents(eventEmitter: EventEmitter<any>, viewport: ScrollViewportDirective, viewportElement: HTMLElement) {
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

  public dispatchRangeUpdateEvents(eventEmitter: EventEmitter<any>, range: Range, viewport: ScrollViewportDirective, viewportElement: HTMLElement) {
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

  public dispatchViewportScrolledEvents(eventEmitter: EventEmitter<any>, scrollTop: number, overflow: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement) {
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
