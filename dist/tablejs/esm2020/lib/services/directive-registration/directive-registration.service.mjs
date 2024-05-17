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
    clearVirtualNexus(nexus) {
        if (!nexus) {
            return;
        }
        nexus.scrollViewportDirective = null;
        nexus.virtualForDirective = null;
        const index = this.nexuses.indexOf(nexus);
        if (index === -1) {
            return;
        }
        this.nexuses.splice(index, 1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL3NlcnZpY2VzL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24vZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVMzQyxNQUFNLE9BQU8sNEJBQTRCO0lBRXZDLFlBQW1CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBRW5DLFlBQU8sR0FBb0IsRUFBRSxDQUFDO0lBRlMsQ0FBQztJQUl6QyxlQUFlLENBQUMsbUJBQWtELEVBQUUsdUJBQWdEO1FBQ3pILE1BQU0sS0FBSyxHQUFrQjtZQUMzQix1QkFBdUI7WUFDdkIsbUJBQW1CO1NBQ3BCLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxLQUFvQjtRQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTztTQUNSO1FBQ0QsS0FBSyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztRQUNyQyxLQUFLLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVoQyxDQUFDO0lBRU0sMkJBQTJCLENBQUMsdUJBQWdEO1FBQ2pGLE9B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O1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tICcuLy4uL2dyaWQvZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlIH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL3Njcm9sbC12aWV3cG9ydC9zY3JvbGwtdmlld3BvcnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IFZpcnR1YWxGb3JEaXJlY3RpdmUgfSBmcm9tICcuLy4uLy4uL2RpcmVjdGl2ZXMvdmlydHVhbC1mb3IvdmlydHVhbC1mb3IuZGlyZWN0aXZlJztcbmltcG9ydCB7IElWaXJ0dWFsTmV4dXMgfSBmcm9tICcuLy4uLy4uL3NoYXJlZC9pbnRlcmZhY2VzL2ktdmlydHVhbC1uZXh1cyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZVJlZ2lzdHJhdGlvblNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHsgfVxuXG4gIHByaXZhdGUgbmV4dXNlczogSVZpcnR1YWxOZXh1c1tdID0gW107XG5cbiAgcHVibGljIHNldFZpcnR1YWxOZXh1cyh2aXJ0dWFsRm9yRGlyZWN0aXZlOiBWaXJ0dWFsRm9yRGlyZWN0aXZlPGFueSwgYW55Piwgc2Nyb2xsVmlld3BvcnREaXJlY3RpdmU6IFNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlKTogSVZpcnR1YWxOZXh1cyB7XG4gICAgY29uc3QgbmV4dXM6IElWaXJ0dWFsTmV4dXMgPSB7XG4gICAgICBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSxcbiAgICAgIHZpcnR1YWxGb3JEaXJlY3RpdmVcbiAgICB9O1xuICAgIHRoaXMubmV4dXNlcy5wdXNoKG5leHVzKTtcbiAgICByZXR1cm4gbmV4dXM7XG4gIH1cblxuICBwdWJsaWMgY2xlYXJWaXJ0dWFsTmV4dXMobmV4dXM6IElWaXJ0dWFsTmV4dXMpOiB2b2lkIHtcbiAgICBpZiAoIW5leHVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5leHVzLnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlID0gbnVsbDtcbiAgICBuZXh1cy52aXJ0dWFsRm9yRGlyZWN0aXZlID0gbnVsbDtcbiAgICBjb25zdCBpbmRleDogbnVtYmVyID0gdGhpcy5uZXh1c2VzLmluZGV4T2YobmV4dXMpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uZXh1c2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgXG4gIH1cblxuICBwdWJsaWMgZ2V0VmlydHVhbE5leHVzRnJvbVZpZXdwb3J0KHNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlOiBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSk6IElWaXJ0dWFsTmV4dXMge1xuICAgIHJldHVybiB0aGlzLm5leHVzZXMuZmlsdGVyKChuZXh1czogSVZpcnR1YWxOZXh1cykgPT4gbmV4dXMuc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUgPT09IHNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlKVswXTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck5vZGVBdHRyaWJ1dGVzKG5vZGU6IGFueSkge1xuICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSkge1xuICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCdyZW9yZGVyZ3JpcCcpICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJSZW9yZGVyR3JpcE9uR3JpZERpcmVjdGl2ZShub2RlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSgncmVzaXphYmxlZ3JpcCcpICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJSZXNpemFibGVHcmlwT25HcmlkRGlyZWN0aXZlKG5vZGUsIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCd0YWJsZWpzRGF0YUNvbENsYXNzZXMnKSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRGF0YUNvbENsYXNzZXNPbkdyaWREaXJlY3RpdmUobm9kZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNEYXRhQ29sQ2xhc3MnKSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRGF0YUNvbENsYXNzT25HcmlkRGlyZWN0aXZlKG5vZGUsIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCd0YWJsZWpzR3JpZFJvdycpICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJSb3dzT25HcmlkRGlyZWN0aXZlKG5vZGUsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclJlb3JkZXJHcmlwT25HcmlkRGlyZWN0aXZlKG5vZGU6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKG5vZGUpO1xuICAgIGlmIChlbCAhPT0gbnVsbCkge1xuICAgICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5hZGRSZW9yZGVyR3JpcChub2RlLCBmcm9tTXV0YXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclJlc2l6YWJsZUdyaXBPbkdyaWREaXJlY3RpdmUobm9kZTogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUobm9kZSk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZFJlc2l6YWJsZUdyaXAobm9kZSwgZnJvbU11dGF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJEYXRhQ29sQ2xhc3Nlc09uR3JpZERpcmVjdGl2ZShub2RlOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZShub2RlKTtcbiAgICAobm9kZSBhcyBhbnkpLmRhdGFDbGFzc2VzID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ3RhYmxlanNkYXRhY29sY2xhc3NlcycpIS5yZXBsYWNlKG5ldyBSZWdFeHAoJyAnLCAnZycpLCAnJykuc3BsaXQoJywnKTtcbiAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZENvbHVtbnNXaXRoRGF0YUNsYXNzZXMobm9kZSwgZnJvbU11dGF0aW9uKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlckRhdGFDb2xDbGFzc09uR3JpZERpcmVjdGl2ZShub2RlOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZShub2RlKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNsczogc3RyaW5nIHwgYW55IHwgbnVsbCA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0YWJsZWpzRGF0YUNvbENsYXNzJyk7XG4gICAgaWYgKGNscykge1xuICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gICAgfVxuICAgIGNvbnN0IGluaXRpYWxXaWR0aCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpbml0aWFsV2lkdGgnKTtcbiAgICB0aGlzLmdyaWRTZXJ2aWNlLnRyaWdnZXJIYXNJbml0aWFsV2lkdGhzKGluaXRpYWxXaWR0aCA/IHRydWUgOiBmYWxzZSk7XG4gICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5pbml0aWFsV2lkdGhzW2Nsc10gPSBpbml0aWFsV2lkdGg7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSb3dzT25HcmlkRGlyZWN0aXZlKG5vZGU6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgncmVvcmRlcmFibGUtdGFibGUtcm93Jyk7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUobm9kZSk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmFkZFJvdyhub2RlLCBmcm9tTXV0YXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclZpZXdwb3J0T25HcmlkRGlyZWN0aXZlKG5vZGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUobm9kZSk7XG4gICAgaWYgKGVsICE9PSBudWxsKSB7XG4gICAgICBlbFsnZ3JpZERpcmVjdGl2ZSddLmluZmluaXRlU2Nyb2xsVmlld3BvcnRzID0gW25vZGVdO1xuICAgIH1cbiAgfVxufVxuIl19