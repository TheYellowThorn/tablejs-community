import { EventEmitter } from '@angular/core';
import { Range } from './../../shared/classes/scrolling/range';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import * as i0 from "@angular/core";
export declare class ScrollDispatcherService {
    constructor();
    dispatchAddItemEvents(eventEmitter: EventEmitter<any>, element: Node, i: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    dispatchUpdateItemEvents(eventEmitter: EventEmitter<any>, element: Node, index: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    dispatchRemoveItemEvents(eventEmitter: EventEmitter<any>, element: Node, i: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    dispatchViewportReadyEvents(eventEmitter: EventEmitter<any>, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    dispatchViewportInitializedEvents(eventEmitter: EventEmitter<any>, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    dispatchRangeUpdateEvents(eventEmitter: EventEmitter<any>, range: Range, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    dispatchViewportScrolledEvents(eventEmitter: EventEmitter<any>, scrollTop: number, overflow: number, viewport: ScrollViewportDirective, viewportElement: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollDispatcherService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScrollDispatcherService>;
}