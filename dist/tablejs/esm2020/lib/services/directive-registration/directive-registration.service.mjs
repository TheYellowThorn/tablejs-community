import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../grid/grid.service";
export class DirectiveRegistrationService {
    constructor(gridService) {
        this.gridService = gridService;
        this.nexuses = [];
    }
    setVirtualNexus(virtualForDirective, scrollViewportDirective) {
        const nexus = {
            scrollViewportDirective,
            virtualForDirective
        };
        this.nexuses.push(nexus);
        return nexus;
    }
    getVirtualNexusFromViewport(scrollViewportDirective) {
        return this.nexuses.filter((nexus) => nexus.scrollViewportDirective === scrollViewportDirective)[0];
    }
    registerNodeAttributes(node) {
        if (node.getAttribute) {
            if (node.getAttribute('reordergrip') !== null) {
                this.registerReorderGripOnGridDirective(node, true);
            }
            if (node.getAttribute('resizablegrip') !== null) {
                this.registerResizableGripOnGridDirective(node, true);
            }
            if (node.getAttribute('tablejsDataColClasses') !== null) {
                this.registerDataColClassesOnGridDirective(node, true);
            }
            if (node.getAttribute('tablejsDataColClass') !== null) {
                this.registerDataColClassOnGridDirective(node, true);
            }
            if (node.getAttribute('tablejsGridRow') !== null) {
                this.registerRowsOnGridDirective(node, true);
            }
        }
    }
    registerReorderGripOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].addReorderGrip(node, fromMutation);
        }
    }
    registerResizableGripOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].addResizableGrip(node, fromMutation);
        }
    }
    registerDataColClassesOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        node.dataClasses = node.getAttribute('tablejsdatacolclasses').replace(new RegExp(' ', 'g'), '').split(',');
        el['gridDirective'].addColumnsWithDataClasses(node, fromMutation);
    }
    registerDataColClassOnGridDirective(node, fromMutation = false) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (!el) {
            return;
        }
        const cls = node.getAttribute('tablejsDataColClass');
        if (cls) {
            node.classList.add(cls);
        }
        const initialWidth = node.getAttribute('initialWidth');
        this.gridService.triggerHasInitialWidths(initialWidth ? true : false);
        el['gridDirective'].initialWidths[cls] = initialWidth;
    }
    registerRowsOnGridDirective(node, fromMutation = false) {
        node.classList.add('reorderable-table-row');
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].addRow(node, fromMutation);
        }
    }
    registerViewportOnGridDirective(node) {
        const el = this.gridService.getParentTablejsGridDirective(node);
        if (el !== null) {
            el['gridDirective'].infiniteScrollViewports = [node];
        }
    }
}
DirectiveRegistrationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DirectiveRegistrationService, deps: [{ token: i1.GridService }], target: i0.ɵɵFactoryTarget.Injectable });
DirectiveRegistrationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DirectiveRegistrationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: DirectiveRegistrationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.GridService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL3NlcnZpY2VzL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24vZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVMzQyxNQUFNLE9BQU8sNEJBQTRCO0lBRXZDLFlBQW1CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBRW5DLFlBQU8sR0FBb0IsRUFBRSxDQUFDO0lBRlMsQ0FBQztJQUl6QyxlQUFlLENBQUMsbUJBQWtELEVBQUUsdUJBQWdEO1FBQ3pILE1BQU0sS0FBSyxHQUFrQjtZQUMzQix1QkFBdUI7WUFDdkIsbUJBQW1CO1NBQ3BCLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSwyQkFBMkIsQ0FBQyx1QkFBZ0Q7UUFDakYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQW9CLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsS0FBSyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JILENBQUM7SUFFTSxzQkFBc0IsQ0FBQyxJQUFTO1FBQ3JDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUM3QyxJQUFJLENBQUMsa0NBQWtDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JEO1lBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUs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QyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUM1QyxNQUFNLEVBQUUsR0FBNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRixJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDZixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztTQUNoRDtJQUNILENBQUM7SUFFTSwrQkFBK0IsQ0FBQyxJQUFpQjtRQUN0RCxNQUFNLEVBQUUsR0FBNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRixJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDZixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0RDtJQUNILENBQUM7O3lIQXRGVSw0QkFBNEI7NkhBQTVCLDRCQUE0QixjQUYzQixNQUFNOzJGQUVQLDRCQUE0QjtrQkFIeEMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vZ3JpZC9ncmlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgfSBmcm9tICcuLy4uLy4uL2RpcmVjdGl2ZXMvc2Nyb2xsLXZpZXdwb3J0L3Njcm9sbC12aWV3cG9ydC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVmlydHVhbEZvckRpcmVjdGl2ZSB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy92aXJ0dWFsLWZvci92aXJ0dWFsLWZvci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSVZpcnR1YWxOZXh1cyB9IGZyb20gJy4vLi4vLi4vc2hhcmVkL2ludGVyZmFjZXMvaS12aXJ0dWFsLW5leHVzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlUmVnaXN0cmF0aW9uU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkgeyB9XG5cbiAgcHJpdmF0ZSBuZXh1c2VzOiBJVmlydHVhbE5leHVzW10gPSBbXTtcblxuICBwdWJsaWMgc2V0VmlydHVhbE5leHVzKHZpcnR1YWxGb3JEaXJlY3RpdmU6IFZpcnR1YWxGb3JEaXJlY3RpdmU8YW55LCBhbnk+LCBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUpOiBJVmlydHVhbE5leHVzIHtcbiAgICBjb25zdCBuZXh1czogSVZpcnR1YWxOZXh1cyA9IHtcbiAgICAgIHNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlLFxuICAgICAgdmlydHVhbEZvckRpcmVjdGl2ZVxuICAgIH07XG4gICAgdGhpcy5uZXh1c2VzLnB1c2gobmV4dXMpO1xuICAgIHJldHVybiBuZXh1cztcbiAgfVxuXG4gIHB1YmxpYyBnZXRWaXJ0dWFsTmV4dXNGcm9tVmlld3BvcnQoc2Nyb2xsVmlld3BvcnREaXJlY3RpdmU6IFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlKTogSVZpcnR1YWxOZXh1cyB7XG4gICAgcmV0dXJuIHRoaXMubmV4dXNlcy5maWx0ZXIoKG5leHVzOiBJVmlydHVhbE5leHVzKSA9PiBuZXh1cy5zY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSA9PT0gc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUpWzBdO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTm9kZUF0dHJpYnV0ZXMobm9kZTogYW55KSB7XG4gICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3Jlb3JkZXJncmlwJykgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlclJlb3JkZXJHcmlwT25HcmlkRGlyZWN0aXZlKG5vZGUsIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCdyZXNpemFibGVncmlwJykgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlclJlc2l6YWJsZUdyaXBPbkdyaWREaXJlY3RpdmUobm9kZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNEYXRhQ29sQ2xhc3NlcycpICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJEYXRhQ29sQ2xhc3Nlc09uR3JpZERpcmVjdGl2ZShub2RlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSgndGFibGVqc0RhdGFDb2xDbGFzcycpICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJEYXRhQ29sQ2xhc3NPbkdyaWREaXJlY3RpdmUobm9kZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNHcmlkUm93JykgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlclJvd3NPbkdyaWREaXJlY3RpdmUobm9kZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUmVvcmRlckdyaXBPbkdyaWREaXJlY3RpdmUobm9kZTogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUobm9kZSk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZFJlb3JkZXJHcmlwKG5vZGUsIGZyb21NdXRhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUmVzaXphYmxlR3JpcE9uR3JpZERpcmVjdGl2ZShub2RlOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZShub2RlKTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkUmVzaXphYmxlR3JpcChub2RlLCBmcm9tTXV0YXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlckRhdGFDb2xDbGFzc2VzT25HcmlkRGlyZWN0aXZlKG5vZGU6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKG5vZGUpO1xuICAgIChub2RlIGFzIGFueSkuZGF0YUNsYXNzZXMgPSBub2RlLmdldEF0dHJpYnV0ZSgndGFibGVqc2RhdGFjb2xjbGFzc2VzJykhLnJlcGxhY2UobmV3IFJlZ0V4cCgnICcsICdnJyksICcnKS5zcGxpdCgnLCcpO1xuICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkQ29sdW1uc1dpdGhEYXRhQ2xhc3Nlcyhub2RlLCBmcm9tTXV0YXRpb24pO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyRGF0YUNvbENsYXNzT25HcmlkRGlyZWN0aXZlKG5vZGU6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKG5vZGUpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2xzOiBzdHJpbmcgfCBhbnkgfCBudWxsID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNEYXRhQ29sQ2xhc3MnKTtcbiAgICBpZiAoY2xzKSB7XG4gICAgICBub2RlLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdGlhbFdpZHRoID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2luaXRpYWxXaWR0aCcpO1xuICAgIHRoaXMuZ3JpZFNlcnZpY2UudHJpZ2dlckhhc0luaXRpYWxXaWR0aHMoaW5pdGlhbFdpZHRoID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmluaXRpYWxXaWR0aHNbY2xzXSA9IGluaXRpYWxXaWR0aDtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclJvd3NPbkdyaWREaXJlY3RpdmUobm9kZTogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdyZW9yZGVyYWJsZS10YWJsZS1yb3cnKTtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZShub2RlKTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkUm93KG5vZGUsIGZyb21NdXRhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyVmlld3BvcnRPbkdyaWREaXJlY3RpdmUobm9kZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZShub2RlKTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uaW5maW5pdGVTY3JvbGxWaWV3cG9ydHMgPSBbbm9kZV07XG4gICAgfVxuICB9XG59XG4iXX0=