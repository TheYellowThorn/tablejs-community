import { Injectable } from '@angular/core';
import { ScrollViewportEvent } from './../../shared/classes/events/scroll-viewport-event';
import * as i0 from "@angular/core";
export class ScrollDispatcherService {
    constructor() { }
    dispatchAddItemEvents(eventEmitter, element, i, viewport, viewportElement) {
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
    dispatchUpdateItemEvents(eventEmitter, element, index, viewport, viewportElement) {
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
    dispatchRemoveItemEvents(eventEmitter, element, i, viewport, viewportElement) {
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
    dispatchViewportReadyEvents(eventEmitter, viewport, viewportElement) {
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
    dispatchViewportInitializedEvents(eventEmitter, viewport, viewportElement) {
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
    dispatchRangeUpdateEvents(eventEmitter, range, viewport, viewportElement) {
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
    dispatchViewportScrolledEvents(eventEmitter, scrollTop, overflow, viewport, viewportElement) {
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
ScrollDispatcherService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollDispatcherService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ScrollDispatcherService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollDispatcherService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: ScrollDispatcherService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWRpc3BhdGNoZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3RhYmxlanMvc3JjL2xpYi9zZXJ2aWNlcy9zY3JvbGwtZGlzcGF0Y2hlci9zY3JvbGwtZGlzcGF0Y2hlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDOztBQU8xRixNQUFNLE9BQU8sdUJBQXVCO0lBRWxDLGdCQUFnQixDQUFDO0lBRVYscUJBQXFCLENBQUMsWUFBK0IsRUFBRSxPQUFhLEVBQUUsQ0FBUyxFQUFFLFFBQWlDLEVBQUUsZUFBNEI7UUFDckosWUFBWSxDQUFDLElBQUksQ0FBQztZQUNoQixPQUFPO1lBQ1AsS0FBSyxFQUFFLENBQUM7WUFDUixRQUFRO1lBQ1IsZUFBZTtTQUNoQixDQUFDLENBQUM7UUFDSCxNQUFNLGNBQWMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUU7WUFDeEUsTUFBTSxFQUFFO2dCQUNOLE9BQU87Z0JBQ1AsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsUUFBUTtnQkFDUixlQUFlO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsZUFBZSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sd0JBQXdCLENBQUMsWUFBK0IsRUFBRSxPQUFhLEVBQUUsS0FBYSxFQUFFLFFBQWlDLEVBQUUsZUFBNEI7UUFDNUosWUFBWSxDQUFDLElBQUksQ0FBQztZQUNoQixPQUFPO1lBQ1AsS0FBSztZQUNMLFFBQVE7WUFDUixlQUFlO1NBQ2hCLENBQUMsQ0FBQztRQUNILE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxXQUFXLENBQUMsbUJBQW1CLENBQUMsZUFBZSxFQUFFO1lBQzVF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QztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNjcm9sbFZpZXdwb3J0RXZlbnQgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL2V2ZW50cy9zY3JvbGwtdmlld3BvcnQtZXZlbnQnO1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9jbGFzc2VzL3Njcm9sbGluZy9yYW5nZSc7XG5pbXBvcnQgeyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy9zY3JvbGwtdmlld3BvcnQvc2Nyb2xsLXZpZXdwb3J0LmRpcmVjdGl2ZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbERpc3BhdGNoZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIHB1YmxpYyBkaXNwYXRjaEFkZEl0ZW1FdmVudHMoZXZlbnRFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiwgZWxlbWVudDogTm9kZSwgaTogbnVtYmVyLCB2aWV3cG9ydDogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsIHZpZXdwb3J0RWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBldmVudEVtaXR0ZXIuZW1pdCh7XG4gICAgICBlbGVtZW50LFxuICAgICAgaW5kZXg6IGksXG4gICAgICB2aWV3cG9ydCxcbiAgICAgIHZpZXdwb3J0RWxlbWVudFxuICAgIH0pO1xuICAgIGNvbnN0IGl0ZW1BZGRlZEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFNjcm9sbFZpZXdwb3J0RXZlbnQuT05fSVRFTV9BRERFRCwge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICB2aWV3cG9ydCxcbiAgICAgICAgdmlld3BvcnRFbGVtZW50XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmlld3BvcnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoaXRlbUFkZGVkRXZlbnQpO1xuICB9XG5cbiAgcHVibGljIGRpc3BhdGNoVXBkYXRlSXRlbUV2ZW50cyhldmVudEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+LCBlbGVtZW50OiBOb2RlLCBpbmRleDogbnVtYmVyLCB2aWV3cG9ydDogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsIHZpZXdwb3J0RWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBldmVudEVtaXR0ZXIuZW1pdCh7XG4gICAgICBlbGVtZW50LFxuICAgICAgaW5kZXgsXG4gICAgICB2aWV3cG9ydCxcbiAgICAgIHZpZXdwb3J0RWxlbWVudFxuICAgIH0pO1xuICAgIGNvbnN0IGl0ZW1VcGRhdGVkRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoU2Nyb2xsVmlld3BvcnRFdmVudC5PTl9JVEVNX1VQREFURUQsIHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBlbGVtZW50LFxuICAgICAgICBpbmRleCxcbiAgICAgICAgdmlld3BvcnQsXG4gICAgICAgIHZpZXdwb3J0RWxlbWVudFxuICAgICAgfVxuICAgIH0pO1xuICAgIHZpZXdwb3J0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGl0ZW1VcGRhdGVkRXZlbnQpO1xuICB9XG5cbiAgcHVibGljIGRpc3BhdGNoUmVtb3ZlSXRlbUV2ZW50cyhldmVudEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+LCBlbGVtZW50OiBOb2RlLCBpOiBudW1iZXIsIHZpZXdwb3J0OiBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSwgdmlld3BvcnRFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGV2ZW50RW1pdHRlci5lbWl0KHtcbiAgICAgIGVsZW1lbnQsXG4gICAgICBpbmRleDogaSxcbiAgICAgIHZpZXdwb3J0LFxuICAgICAgdmlld3BvcnRFbGVtZW50XG4gICAgfSk7XG4gICAgY29uc3QgaXRlbVJlbW92ZWRFdmVudCA9IG5ldyBDdXN0b21FdmVudChTY3JvbGxWaWV3cG9ydEV2ZW50Lk9OX0lURU1fUkVNT1ZFRCwge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICB2aWV3cG9ydCxcbiAgICAgICAgdmlld3BvcnRFbGVtZW50XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmlld3BvcnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoaXRlbVJlbW92ZWRFdmVudCk7XG4gIH1cblxuICBwdWJsaWMgZGlzcGF0Y2hWaWV3cG9ydFJlYWR5RXZlbnRzKGV2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4sIHZpZXdwb3J0OiBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSwgdmlld3BvcnRFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGV2ZW50RW1pdHRlci5lbWl0KHtcbiAgICAgIHZpZXdwb3J0LFxuICAgICAgdmlld3BvcnRFbGVtZW50XG4gICAgfSk7XG4gICAgY29uc3Qgdmlld3BvcnRSZWFkeUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFNjcm9sbFZpZXdwb3J0RXZlbnQuT05fVklFV1BPUlRfUkVBRFksIHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICB2aWV3cG9ydCxcbiAgICAgICAgdmlld3BvcnRFbGVtZW50XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmlld3BvcnRFbGVtZW50LmRpc3BhdGNoRXZlbnQodmlld3BvcnRSZWFkeUV2ZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNwYXRjaFZpZXdwb3J0SW5pdGlhbGl6ZWRFdmVudHMoZXZlbnRFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55Piwgdmlld3BvcnQ6IFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlLCB2aWV3cG9ydEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgZXZlbnRFbWl0dGVyLmVtaXQoe1xuICAgICAgdmlld3BvcnQsXG4gICAgICB2aWV3cG9ydEVsZW1lbnRcbiAgICB9KTtcbiAgICBjb25zdCB2aWV3cG9ydEluaXRpYWxpemVkRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoU2Nyb2xsVmlld3BvcnRFdmVudC5PTl9WSUVXUE9SVF9JTklUSUFMSVpFRCwge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIHZpZXdwb3J0LFxuICAgICAgICB2aWV3cG9ydEVsZW1lbnRcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2aWV3cG9ydEVsZW1lbnQuZGlzcGF0Y2hFdmVudCh2aWV3cG9ydEluaXRpYWxpemVkRXZlbnQpO1xuICB9XG5cbiAgcHVibGljIGRpc3BhdGNoUmFuZ2VVcGRhdGVFdmVudHMoZXZlbnRFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiwgcmFuZ2U6IFJhbmdlLCB2aWV3cG9ydDogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsIHZpZXdwb3J0RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBldmVudEVtaXR0ZXIuZW1pdCh7XG4gICAgICByYW5nZSxcbiAgICAgIHZpZXdwb3J0LFxuICAgICAgdmlld3BvcnRFbGVtZW50XG4gICAgfSk7XG4gICAgY29uc3QgcmFuZ2VVcGRhdGVkRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoU2Nyb2xsVmlld3BvcnRFdmVudC5PTl9JVEVNX0FEREVELCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIHZpZXdwb3J0LFxuICAgICAgICB2aWV3cG9ydEVsZW1lbnRcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2aWV3cG9ydEVsZW1lbnQuZGlzcGF0Y2hFdmVudChyYW5nZVVwZGF0ZWRFdmVudCk7XG4gIH1cblxuICBwdWJsaWMgZGlzcGF0Y2hWaWV3cG9ydFNjcm9sbGVkRXZlbnRzKGV2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4sIHNjcm9sbFRvcDogbnVtYmVyLCBvdmVyZmxvdzogbnVtYmVyLCB2aWV3cG9ydDogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsIHZpZXdwb3J0RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBldmVudEVtaXR0ZXIuZW1pdCh7XG4gICAgICBzY3JvbGxUb3AsXG4gICAgICBmaXJzdEl0ZW1PdmVyZmxvdzogb3ZlcmZsb3csXG4gICAgICB2aWV3cG9ydCxcbiAgICAgIHZpZXdwb3J0RWxlbWVudFxuICAgIH0pO1xuICAgIGNvbnN0IHZpZXdwb3J0U2Nyb2xsZWRFdmVudCA9IG5ldyBDdXN0b21FdmVudChTY3JvbGxWaWV3cG9ydEV2ZW50Lk9OX0lURU1fQURERUQsIHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBzY3JvbGxUb3AsXG4gICAgICAgIGZpcnN0SXRlbU92ZXJmbG93OiBvdmVyZmxvdyxcbiAgICAgICAgdmlld3BvcnQsXG4gICAgICAgIHZpZXdwb3J0RWxlbWVudFxuICAgICAgfVxuICAgIH0pO1xuICAgIHZpZXdwb3J0RWxlbWVudC5kaXNwYXRjaEV2ZW50KHZpZXdwb3J0U2Nyb2xsZWRFdmVudCk7XG4gIH1cbn1cbiJdfQ==