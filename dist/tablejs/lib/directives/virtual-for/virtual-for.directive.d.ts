import { DoCheck, ElementRef, IterableDiffers, NgIterable, OnDestroy, TemplateRef, TrackByFunction, ViewContainerRef } from '@angular/core';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { IVirtualNexus } from './../../shared/interfaces/i-virtual-nexus';
import { Subject, Subscription } from 'rxjs';
import { Range } from './../../shared/classes/scrolling/range';
import * as i0 from "@angular/core";
export declare class TablejsForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
    $implicit: T;
    tablejsVirtualForOf: U;
    index: number;
    count: number;
    constructor($implicit: T, tablejsVirtualForOf: U, index: number, count: number);
    get first(): boolean;
    get last(): boolean;
    get even(): boolean;
    get odd(): boolean;
}
export declare class VirtualForDirective<T, U extends NgIterable<T> = NgIterable<T>> implements DoCheck, OnDestroy {
    _viewContainer: ViewContainerRef;
    _template: TemplateRef<TablejsForOfContext<T, U>> | null;
    private _differs;
    private elementRef;
    private directiveRegistrationService;
    virtualNexus: IVirtualNexus | null;
    changes: Subject<any>;
    rangeUpdatedSubscription$: Subscription;
    set tablejsVirtualForOf(tablejsVirtualForOf: U | undefined | null);
    _tablejsForOf: U | undefined | null;
    private _lastTablejsForOf;
    private _differ;
    private _tablejsVirtualForTrackBy;
    private _scrollViewportDirective;
    private _lastRange;
    private _renderedItems;
    private _parent;
    /**
     * Asserts the correct type of the context for the template that `TablejsForOf` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `TablejsForOf` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard<T, U extends NgIterable<T>>(dir: VirtualForDirective<T, U>, ctx: any): ctx is TablejsForOfContext<T, U>;
    /**
     * A reference to the template that is stamped out for each item in the iterable.
     * @see [template reference variable](guide/template-reference-variables)
     */
    set tablejsVirtualForTemplate(value: TemplateRef<TablejsForOfContext<T, U>>);
    get template(): TemplateRef<TablejsForOfContext<T, U>>;
    get tablejsVirtualForTrackBy(): TrackByFunction<T> | undefined | null;
    set tablejsVirtualForTrackBy(fn: TrackByFunction<T> | undefined | null);
    constructor(_viewContainer: ViewContainerRef, _template: TemplateRef<TablejsForOfContext<T, U>> | null, _differs: IterableDiffers, elementRef: ElementRef, directiveRegistrationService: DirectiveRegistrationService);
    rangeIsDifferent(range1: Range, range2: Range): boolean;
    renderedItemsNeedUpdate(): boolean;
    private _onRenderedDataChange;
    ngDoCheck(): void;
    updateItems(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VirtualForDirective<any, any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<VirtualForDirective<any, any>, "[tablejsVirtualFor][tablejsVirtualForOf]", never, { "tablejsVirtualForOf": "tablejsVirtualForOf"; "tablejsVirtualForTemplate": "tablejsVirtualForTemplate"; "tablejsVirtualForTrackBy": "tablejsVirtualForTrackBy"; }, {}, never, never, false, never>;
}
