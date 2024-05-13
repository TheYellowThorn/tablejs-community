import { Injectable } from '@angular/core';
import { GridService } from './../grid/grid.service';
import * as i0 from "@angular/core";
import * as i1 from "../grid/grid.service";
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
DirectiveRegistrationService.ɵprov = i0.ɵɵdefineInjectable({ factory: function DirectiveRegistrationService_Factory() { return new DirectiveRegistrationService(i0.ɵɵinject(i1.GridService)); }, token: DirectiveRegistrationService, providedIn: "root" });
DirectiveRegistrationService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DirectiveRegistrationService.ctorParameters = () => [
    { type: GridService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL3NlcnZpY2VzL2RpcmVjdGl2ZS1yZWdpc3RyYXRpb24vZGlyZWN0aXZlLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7QUFRckQsTUFBTSxPQUFPLDRCQUE0QjtJQUV2QyxZQUFtQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUVuQyxZQUFPLEdBQW9CLEVBQUUsQ0FBQztJQUZTLENBQUM7SUFJekMsZUFBZSxDQUFDLG1CQUFrRCxFQUFFLHVCQUFnRDtRQUN6SCxNQUFNLEtBQUssR0FBa0I7WUFDM0IsdUJBQXVCO1lBQ3ZCLG1CQUFtQjtTQUNwQixDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sMkJBQTJCLENBQUMsdUJBQWdEO1FBQ2pGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFvQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEtBQUssdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNySCxDQUFDO0lBRU0sc0JBQXNCLENBQUMsSUFBUztRQUNyQyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDN0MsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FB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aUIsRUFBRSxlQUF3QixLQUFLO1FBQ2pGLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDNUMsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUYsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2YsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDaEQ7SUFDSCxDQUFDO0lBRU0sK0JBQStCLENBQUMsSUFBaUI7UUFDdEQsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUYsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2YsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLHVCQUF1QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEQ7SUFDSCxDQUFDOzs7O1lBekZGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBUFEsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi8uLi9ncmlkL2dyaWQuc2VydmljZSc7XG5pbXBvcnQgeyBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy9zY3JvbGwtdmlld3BvcnQvc2Nyb2xsLXZpZXdwb3J0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBWaXJ0dWFsRm9yRGlyZWN0aXZlIH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL3ZpcnR1YWwtZm9yL3ZpcnR1YWwtZm9yLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJVmlydHVhbE5leHVzIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvaW50ZXJmYWNlcy9pLXZpcnR1YWwtbmV4dXMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBEaXJlY3RpdmVSZWdpc3RyYXRpb25TZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlKSB7IH1cblxuICBwcml2YXRlIG5leHVzZXM6IElWaXJ0dWFsTmV4dXNbXSA9IFtdO1xuXG4gIHB1YmxpYyBzZXRWaXJ0dWFsTmV4dXModmlydHVhbEZvckRpcmVjdGl2ZTogVmlydHVhbEZvckRpcmVjdGl2ZTxhbnksIGFueT4sIHNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlOiBTY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSk6IElWaXJ0dWFsTmV4dXMge1xuICAgIGNvbnN0IG5leHVzOiBJVmlydHVhbE5leHVzID0ge1xuICAgICAgc2Nyb2xsVmlld3BvcnREaXJlY3RpdmUsXG4gICAgICB2aXJ0dWFsRm9yRGlyZWN0aXZlXG4gICAgfTtcbiAgICB0aGlzLm5leHVzZXMucHVzaChuZXh1cyk7XG4gICAgcmV0dXJuIG5leHVzO1xuICB9XG5cbiAgcHVibGljIGdldFZpcnR1YWxOZXh1c0Zyb21WaWV3cG9ydChzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZTogU2Nyb2xsVmlld3BvcnREaXJlY3RpdmUpOiBJVmlydHVhbE5leHVzIHtcbiAgICByZXR1cm4gdGhpcy5uZXh1c2VzLmZpbHRlcigobmV4dXM6IElWaXJ0dWFsTmV4dXMpID0+IG5leHVzLnNjcm9sbFZpZXdwb3J0RGlyZWN0aXZlID09PSBzY3JvbGxWaWV3cG9ydERpcmVjdGl2ZSlbMF07XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJOb2RlQXR0cmlidXRlcyhub2RlOiBhbnkpIHtcbiAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSgncmVvcmRlcmdyaXAnKSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyUmVvcmRlckdyaXBPbkdyaWREaXJlY3RpdmUobm9kZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3Jlc2l6YWJsZWdyaXAnKSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyUmVzaXphYmxlR3JpcE9uR3JpZERpcmVjdGl2ZShub2RlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSgndGFibGVqc0RhdGFDb2xDbGFzc2VzJykgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckRhdGFDb2xDbGFzc2VzT25HcmlkRGlyZWN0aXZlKG5vZGUsIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCd0YWJsZWpzRGF0YUNvbENsYXNzJykgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckRhdGFDb2xDbGFzc09uR3JpZERpcmVjdGl2ZShub2RlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSgndGFibGVqc0dyaWRSb3cnKSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyUm93c09uR3JpZERpcmVjdGl2ZShub2RlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSZW9yZGVyR3JpcE9uR3JpZERpcmVjdGl2ZShub2RlOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgfCBhbnkgfCBudWxsID0gdGhpcy5ncmlkU2VydmljZS5nZXRQYXJlbnRUYWJsZWpzR3JpZERpcmVjdGl2ZShub2RlKTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIGVsWydncmlkRGlyZWN0aXZlJ10uYWRkUmVvcmRlckdyaXAobm9kZSwgZnJvbU11dGF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSZXNpemFibGVHcmlwT25HcmlkRGlyZWN0aXZlKG5vZGU6IEhUTUxFbGVtZW50LCBmcm9tTXV0YXRpb246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKG5vZGUpO1xuICAgIGlmIChlbCAhPT0gbnVsbCkge1xuICAgICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5hZGRSZXNpemFibGVHcmlwKG5vZGUsIGZyb21NdXRhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyRGF0YUNvbENsYXNzZXNPbkdyaWREaXJlY3RpdmUobm9kZTogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUobm9kZSk7XG4gICAgKG5vZGUgYXMgYW55KS5kYXRhQ2xhc3NlcyA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0YWJsZWpzZGF0YWNvbGNsYXNzZXMnKSEucmVwbGFjZShuZXcgUmVnRXhwKCcgJywgJ2cnKSwgJycpLnNwbGl0KCcsJyk7XG4gICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5hZGRDb2x1bW5zV2l0aERhdGFDbGFzc2VzKG5vZGUsIGZyb21NdXRhdGlvbik7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJEYXRhQ29sQ2xhc3NPbkdyaWREaXJlY3RpdmUobm9kZTogSFRNTEVsZW1lbnQsIGZyb21NdXRhdGlvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50IHwgYW55IHwgbnVsbCA9IHRoaXMuZ3JpZFNlcnZpY2UuZ2V0UGFyZW50VGFibGVqc0dyaWREaXJlY3RpdmUobm9kZSk7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjbHM6IHN0cmluZyB8IGFueSB8IG51bGwgPSBub2RlLmdldEF0dHJpYnV0ZSgndGFibGVqc0RhdGFDb2xDbGFzcycpO1xuICAgIGlmIChjbHMpIHtcbiAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgIH1cbiAgICBjb25zdCBpbml0aWFsV2lkdGggPSBub2RlLmdldEF0dHJpYnV0ZSgnaW5pdGlhbFdpZHRoJyk7XG4gICAgdGhpcy5ncmlkU2VydmljZS50cmlnZ2VySGFzSW5pdGlhbFdpZHRocyhpbml0aWFsV2lkdGggPyB0cnVlIDogZmFsc2UpO1xuICAgIGVsWydncmlkRGlyZWN0aXZlJ10uaW5pdGlhbFdpZHRoc1tjbHNdID0gaW5pdGlhbFdpZHRoO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUm93c09uR3JpZERpcmVjdGl2ZShub2RlOiBIVE1MRWxlbWVudCwgZnJvbU11dGF0aW9uOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoJ3Jlb3JkZXJhYmxlLXRhYmxlLXJvdycpO1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKG5vZGUpO1xuICAgIGlmIChlbCAhPT0gbnVsbCkge1xuICAgICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5hZGRSb3cobm9kZSwgZnJvbU11dGF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJWaWV3cG9ydE9uR3JpZERpcmVjdGl2ZShub2RlOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKG5vZGUpO1xuICAgIGlmIChlbCAhPT0gbnVsbCkge1xuICAgICAgZWxbJ2dyaWREaXJlY3RpdmUnXS5pbmZpbml0ZVNjcm9sbFZpZXdwb3J0cyA9IFtub2RlXTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==