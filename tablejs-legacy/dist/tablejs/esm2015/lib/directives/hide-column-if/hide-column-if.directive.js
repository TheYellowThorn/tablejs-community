import { Directive, ElementRef, Input } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
export class HideColumnIfDirective {
    constructor(elementRef, gridService) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this._hideColumn = false;
        this.HIDDEN_COLUMN_CLASS = 'column-is-hidden';
        this.showOffspringLimited = false;
        this.changeTriggeredBy = null;
        this.canHide = true;
        this.elementRef.nativeElement.hideColumnIf = this;
    }
    set tablejsHideColumnIf(hide) {
        const wasLimited = this.showOffspringLimited;
        const wasTriggeredBy = this.changeTriggeredBy;
        this.showOffspringLimited = false;
        this.changeTriggeredBy = null;
        const el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
        if (el !== null) {
            this.gridDirective = el['gridDirective'];
            const columnVisibilityChanged = this._hideColumn !== hide;
            if (!columnVisibilityChanged) {
                this.gridDirective.hiddenColumnChanges.next(null);
                return;
            }
            this._hideColumn = hide;
            const flattenedColumnHierarchy = this.gridDirective.getFlattenedHierarchy();
            const currentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === this.gridDirective.getRelatedHeader(this.elementRef.nativeElement);
            })[0];
            if (!wasTriggeredBy) {
                this.changeTriggeredBy = currentColumnHierarchy;
            }
            if (hide) {
                const lowestLevelColHierarchiesVisible = this.getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy);
                const allLowestLevelColumnsHidden = lowestLevelColHierarchiesVisible.length === 0;
                if (allLowestLevelColumnsHidden || this.allColumnsShareTheSameAncestor(currentColumnHierarchy, lowestLevelColHierarchiesVisible, flattenedColumnHierarchy)) {
                    this._hideColumn = false;
                    this.gridDirective.hiddenColumnChanges.next(null);
                    return;
                }
                this.gridDirective.getRelatedHeaders(this.elementRef.nativeElement).forEach((element) => {
                    element.classList.add(this.HIDDEN_COLUMN_CLASS);
                });
                this.hideAllOffspring(currentColumnHierarchy);
                if (this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy)) {
                    this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, true);
                }
            }
            else {
                this.gridDirective.getRelatedHeaders(this.elementRef.nativeElement).forEach((element) => {
                    element.classList.remove(this.HIDDEN_COLUMN_CLASS);
                });
                this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, false);
                if (!wasLimited) {
                    this.showAllOffspring(currentColumnHierarchy);
                }
            }
            const triggerHierarchy = !wasTriggeredBy ? currentColumnHierarchy : null;
            this.changeTriggeredBy = null;
            this.gridDirective.hiddenColumnChanges.next({ hierarchyColumn: currentColumnHierarchy, wasTriggeredByThisColumn: triggerHierarchy !== null, hidden: this._hideColumn === true });
        }
    }
    get tablejsHideColumnIf() {
        return this._hideColumn;
    }
    getVisibleSiblingsByColumn(hierarchyList, level) {
        const visibleSiblings = hierarchyList.filter((hierarchy) => {
            return hierarchy.level === level && hierarchy.element.hideColumnIf.tablejsHideColumnIf === false;
        });
        return visibleSiblings;
    }
    updateHeadersThatCanHide() {
        const flattenedColumnHierarchy = this.gridDirective.getFlattenedHierarchy();
        for (let i = 0; i < flattenedColumnHierarchy.length; i++) {
            const columnHierarchy = flattenedColumnHierarchy[i];
            const element = columnHierarchy.element;
            const hideColumnIf = element.hideColumnIf;
            hideColumnIf.canHide = true;
        }
        let visibleSiblings = this.getVisibleSiblingsByColumn(flattenedColumnHierarchy, 0);
        if (visibleSiblings.length === 1) {
            let solitarySibling = visibleSiblings[0];
            solitarySibling.element.hideColumnIf.canHide = false;
            let subColumns = solitarySibling.subColumns;
            let count = 0;
            while (solitarySibling && subColumns.length !== 0) {
                visibleSiblings = this.getVisibleSiblingsByColumn(subColumns, ++count);
                solitarySibling = visibleSiblings.length === 1 ? visibleSiblings[0] : null;
                if (solitarySibling) {
                    solitarySibling.element.hideColumnIf.canHide = false;
                    subColumns = solitarySibling.subColumns;
                }
            }
        }
    }
    getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy) {
        const lowestLevelColHierarchiesVisible = [];
        const sortedByLevelColumnHierarchy = flattenedColumnHierarchy.concat().sort((colHier1, colHier2) => {
            return colHier2.level - colHier1.level;
        });
        const baseLevel = sortedByLevelColumnHierarchy[0].level;
        for (let i = 0; i < sortedByLevelColumnHierarchy.length; i++) {
            const hierarchy = sortedByLevelColumnHierarchy[i];
            if (hierarchy.level !== baseLevel) {
                break;
            }
            if (!hierarchy.element.hideColumnIf.tablejsHideColumnIf) {
                lowestLevelColHierarchiesVisible.push(hierarchy);
            }
        }
        return lowestLevelColHierarchiesVisible;
    }
    allColumnsShareTheSameAncestor(commonAncestor, columnHierarchies, flattenedColumnHierarchy) {
        const hierarchiesWithCommonAncestor = [];
        for (let i = 0; i < columnHierarchies.length; i++) {
            const currentColumnHierarchy = columnHierarchies[i];
            let parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === currentColumnHierarchy.parentColumn;
            })[0];
            while (parentColumnHierarchy) {
                if (parentColumnHierarchy === commonAncestor) {
                    hierarchiesWithCommonAncestor.push(currentColumnHierarchy);
                    break;
                }
                const columnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                    return hierarchy.element === parentColumnHierarchy.element;
                })[0];
                parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                    return hierarchy.element === columnHierarchy.parentColumn;
                })[0];
            }
        }
        return columnHierarchies.length === hierarchiesWithCommonAncestor.length;
    }
    hideAllOffspring(columnHierarchy) {
        for (let i = 0; i < columnHierarchy.subColumns.length; i++) {
            const child = this.gridDirective.getRelatedHeader(columnHierarchy.subColumns[i].element);
            child.hideColumnIf.changeTriggeredBy = columnHierarchy;
            child.hideColumnIf.tablejsHideColumnIf = true;
        }
    }
    showAllOffspring(columnHierarchy) {
        for (let i = 0; i < columnHierarchy.subColumns.length; i++) {
            const child = this.gridDirective.getRelatedHeader(columnHierarchy.subColumns[i].element);
            child.hideColumnIf.changeTriggeredBy = columnHierarchy;
            child.hideColumnIf.tablejsHideColumnIf = false;
            child.hideColumnIf.canHide = true;
        }
    }
    allSiblingsAreHidden(columnHierarchy, flattenedColumnHierarchy) {
        let parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
            return hierarchy.element === columnHierarchy.parentColumn;
        })[0];
        let hiddenSiblingCount = 0;
        let totalSiblings;
        if (parentColumnHierarchy) {
            totalSiblings = parentColumnHierarchy.subColumns.length;
            parentColumnHierarchy.subColumns.forEach((subColumn) => {
                if (this.gridDirective.getRelatedHeader(subColumn.element).hideColumnIf.tablejsHideColumnIf) {
                    hiddenSiblingCount++;
                }
            });
        }
        else {
            const topLevelSiblings = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.level === 0;
            });
            totalSiblings = topLevelSiblings.length;
            for (let i = 0; i < topLevelSiblings.length; i++) {
                const topLevelSibling = topLevelSiblings[i];
                if (this.gridDirective.getRelatedHeader(topLevelSibling.element).hideColumnIf.tablejsHideColumnIf) {
                    hiddenSiblingCount++;
                }
            }
        }
        return hiddenSiblingCount === totalSiblings;
    }
    setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, hidden) {
        let parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
            return hierarchy.element === currentColumnHierarchy.parentColumn;
        })[0];
        const allSiblingsHidden = this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy);
        let parentSiblingsAreAllHidden = hidden ? allSiblingsHidden : true;
        while (parentColumnHierarchy && parentSiblingsAreAllHidden) {
            const parentElement = parentColumnHierarchy.element;
            parentElement.hideColumnIf.changeTriggeredBy = currentColumnHierarchy;
            parentElement.hideColumnIf.showOffspringLimited = true;
            parentElement.hideColumnIf.tablejsHideColumnIf = hidden;
            parentElement.hideColumnIf.canHide = true;
            const columnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === parentColumnHierarchy.element;
            })[0];
            parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy) => {
                return hierarchy.element === columnHierarchy.parentColumn;
            })[0];
        }
    }
}
HideColumnIfDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]'
            },] }
];
HideColumnIfDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: GridService }
];
HideColumnIfDirective.propDecorators = {
    tablejsHideColumnIf: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlkZS1jb2x1bW4taWYuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvaGlkZS1jb2x1bW4taWYvaGlkZS1jb2x1bW4taWYuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFNakUsTUFBTSxPQUFPLHFCQUFxQjtJQTBPaEMsWUFBbUIsVUFBc0IsRUFBUyxXQUF3QjtRQUF2RCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUF4T2xFLGdCQUFXLEdBQStCLEtBQUssQ0FBQztRQUVqRCx3QkFBbUIsR0FBVyxrQkFBa0IsQ0FBQztRQUNqRCx5QkFBb0IsR0FBWSxLQUFLLENBQUM7UUFDdEMsc0JBQWlCLEdBQTRCLElBQUksQ0FBQztRQUNsRCxZQUFPLEdBQVksSUFBSSxDQUFDO1FBb085QixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ25ELENBQUM7SUFuT0QsSUFBb0IsbUJBQW1CLENBQUMsSUFBZ0M7UUFFdEUsTUFBTSxVQUFVLEdBQVksSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBQ3RELE1BQU0sY0FBYyxHQUE0QixJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFFdkUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1FBRTlCLE1BQU0sRUFBRSxHQUE2QixJQUFJLENBQUMsV0FBVyxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7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QyxDQUFDLENBQUMsQ0FBQztZQUVOLHFCQUFxQixHQUFHLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQTJCLEVBQUUsRUFBRTtnQkFDdEYsT0FBTyxTQUFTLENBQUMsT0FBTyxLQUFLLGVBQWUsQ0FBQyxZQUFZLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUNILENBQUM7OztZQTNPRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdFQUF3RTthQUNuRjs7O1lBUG1CLFVBQVU7WUFFckIsV0FBVzs7O2tDQWVqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSUNvbHVtbkhpZXJhcmNoeSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbnRlcmZhY2VzL2ktY29sdW1uLWhpZXJhcmNoeSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JpZERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vZ3JpZC9ncmlkLmRpcmVjdGl2ZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t0YWJsZWpzSGlkZUNvbHVtbklmXSwgW3RhYmxlanNoaWRlY29sdW1uaWZdLCBbdGFibGVqcy1oaWRlLWNvbHVtbi1pZl0nXG59KVxuZXhwb3J0IGNsYXNzIEhpZGVDb2x1bW5JZkRpcmVjdGl2ZSB7XG5cbiAgcHJpdmF0ZSBfaGlkZUNvbHVtbjogYm9vbGVhbiB8IHVuZGVmaW5lZCB8IG51bGwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncmlkRGlyZWN0aXZlOiBHcmlkRGlyZWN0aXZlIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgSElEREVOX0NPTFVNTl9DTEFTUzogc3RyaW5nID0gJ2NvbHVtbi1pcy1oaWRkZW4nO1xuICBwdWJsaWMgc2hvd09mZnNwcmluZ0xpbWl0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGNoYW5nZVRyaWdnZXJlZEJ5OiBJQ29sdW1uSGllcmFyY2h5IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBjYW5IaWRlOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKSBwdWJsaWMgc2V0IHRhYmxlanNIaWRlQ29sdW1uSWYoaGlkZTogYm9vbGVhbiB8IHVuZGVmaW5lZCB8IG51bGwpIHtcbiAgICBcbiAgICBjb25zdCB3YXNMaW1pdGVkOiBib29sZWFuID0gdGhpcy5zaG93T2Zmc3ByaW5nTGltaXRlZDtcbiAgICBjb25zdCB3YXNUcmlnZ2VyZWRCeTogSUNvbHVtbkhpZXJhcmNoeSB8IG51bGwgPSB0aGlzLmNoYW5nZVRyaWdnZXJlZEJ5O1xuXG4gICAgdGhpcy5zaG93T2Zmc3ByaW5nTGltaXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY2hhbmdlVHJpZ2dlcmVkQnkgPSBudWxsO1xuICAgIFxuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSA9IGVsWydncmlkRGlyZWN0aXZlJ107XG5cbiAgICAgIGNvbnN0IGNvbHVtblZpc2liaWxpdHlDaGFuZ2VkOiBib29sZWFuID0gdGhpcy5faGlkZUNvbHVtbiAhPT0gaGlkZTtcbiAgICAgIGlmICghY29sdW1uVmlzaWJpbGl0eUNoYW5nZWQpIHtcbiAgICAgICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5oaWRkZW5Db2x1bW5DaGFuZ2VzLm5leHQobnVsbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faGlkZUNvbHVtbiA9IGhpZGU7XG5cbiAgICAgIGNvbnN0IGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSA9IHRoaXMuZ3JpZERpcmVjdGl2ZSEuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG4gICAgICBjb25zdCBjdXJyZW50Q29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgIHJldHVybiBoaWVyYXJjaHkuZWxlbWVudCA9PT0gdGhpcy5ncmlkRGlyZWN0aXZlIS5nZXRSZWxhdGVkSGVhZGVyKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH0pWzBdO1xuXG4gICAgICBpZiAoIXdhc1RyaWdnZXJlZEJ5KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVHJpZ2dlcmVkQnkgPSBjdXJyZW50Q29sdW1uSGllcmFyY2h5O1xuICAgICAgfVxuXG4gICAgICBpZiAoaGlkZSkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgbG93ZXN0TGV2ZWxDb2xIaWVyYXJjaGllc1Zpc2libGU6IElDb2x1bW5IaWVyYXJjaHlbXSA9IHRoaXMuZ2V0TG93ZXN0TGV2ZWxDb2x1bW5IaWVyYXJjaGllc1Zpc2libGUoZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5KTtcblxuICAgICAgICBjb25zdCBhbGxMb3dlc3RMZXZlbENvbHVtbnNIaWRkZW46IGJvb2xlYW4gPSBsb3dlc3RMZXZlbENvbEhpZXJhcmNoaWVzVmlzaWJsZS5sZW5ndGggPT09IDA7XG4gICAgICAgIGlmIChhbGxMb3dlc3RMZXZlbENvbHVtbnNIaWRkZW4gfHwgdGhpcy5hbGxDb2x1bW5zU2hhcmVUaGVTYW1lQW5jZXN0b3IoY3VycmVudENvbHVtbkhpZXJhcmNoeSwgbG93ZXN0TGV2ZWxDb2xIaWVyYXJjaGllc1Zpc2libGUsIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSkpIHtcbiAgICAgICAgICB0aGlzLl9oaWRlQ29sdW1uID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5oaWRkZW5Db2x1bW5DaGFuZ2VzLm5leHQobnVsbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyaWREaXJlY3RpdmUhLmdldFJlbGF0ZWRIZWFkZXJzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5mb3JFYWNoKChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaGlkZUFsbE9mZnNwcmluZyhjdXJyZW50Q29sdW1uSGllcmFyY2h5KTtcbiAgICAgICAgaWYgKHRoaXMuYWxsU2libGluZ3NBcmVIaWRkZW4oY3VycmVudENvbHVtbkhpZXJhcmNoeSwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QWxsQW5jZXN0b3JzKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHksIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSEuZ2V0UmVsYXRlZEhlYWRlcnModGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZvckVhY2goKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuSElEREVOX0NPTFVNTl9DTEFTUyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0QWxsQW5jZXN0b3JzKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHksIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSwgZmFsc2UpO1xuICAgICAgICBpZiAoIXdhc0xpbWl0ZWQpIHtcbiAgICAgICAgICB0aGlzLnNob3dBbGxPZmZzcHJpbmcoY3VycmVudENvbHVtbkhpZXJhcmNoeSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICBcbiAgICAgIGNvbnN0IHRyaWdnZXJIaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgfCBudWxsID0gIXdhc1RyaWdnZXJlZEJ5ID8gY3VycmVudENvbHVtbkhpZXJhcmNoeSA6IG51bGw7XG4gICAgICB0aGlzLmNoYW5nZVRyaWdnZXJlZEJ5ID0gbnVsbDtcbiAgICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSEuaGlkZGVuQ29sdW1uQ2hhbmdlcy5uZXh0KHsgaGllcmFyY2h5Q29sdW1uOiBjdXJyZW50Q29sdW1uSGllcmFyY2h5LCB3YXNUcmlnZ2VyZWRCeVRoaXNDb2x1bW46IHRyaWdnZXJIaWVyYXJjaHkgIT09IG51bGwsIGhpZGRlbjogdGhpcy5faGlkZUNvbHVtbiA9PT0gdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGdldCB0YWJsZWpzSGlkZUNvbHVtbklmKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZUNvbHVtbjtcbiAgfVxuXG4gIGdldFZpc2libGVTaWJsaW5nc0J5Q29sdW1uKGhpZXJhcmNoeUxpc3Q6IElDb2x1bW5IaWVyYXJjaHlbXSwgbGV2ZWw6IG51bWJlcik6IElDb2x1bW5IaWVyYXJjaHlbXSB7XG4gICAgY29uc3QgdmlzaWJsZVNpYmxpbmdzOiBJQ29sdW1uSGllcmFyY2h5W10gPSBoaWVyYXJjaHlMaXN0LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICByZXR1cm4gaGllcmFyY2h5LmxldmVsID09PSBsZXZlbCAmJiAoaGllcmFyY2h5LmVsZW1lbnQgYXMgYW55KS5oaWRlQ29sdW1uSWYudGFibGVqc0hpZGVDb2x1bW5JZiA9PT0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZpc2libGVTaWJsaW5ncztcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVIZWFkZXJzVGhhdENhbkhpZGUoKTogdm9pZCB7XG4gICAgY29uc3QgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5W10gPSB0aGlzLmdyaWREaXJlY3RpdmUhLmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgPSBmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHlbaV07XG4gICAgICBjb25zdCBlbGVtZW50OiBhbnkgPSBjb2x1bW5IaWVyYXJjaHkuZWxlbWVudCBhcyBhbnk7XG4gICAgICBjb25zdCBoaWRlQ29sdW1uSWY6IEhpZGVDb2x1bW5JZkRpcmVjdGl2ZSA9IGVsZW1lbnQuaGlkZUNvbHVtbklmO1xuICAgICAgaGlkZUNvbHVtbklmLmNhbkhpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBsZXQgdmlzaWJsZVNpYmxpbmdzOiBJQ29sdW1uSGllcmFyY2h5W10gPSB0aGlzLmdldFZpc2libGVTaWJsaW5nc0J5Q29sdW1uKGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSwgMCk7XG5cbiAgICBpZiAodmlzaWJsZVNpYmxpbmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGV0IHNvbGl0YXJ5U2libGluZzogSUNvbHVtbkhpZXJhcmNoeSB8IG51bGwgPSB2aXNpYmxlU2libGluZ3NbMF07XG4gICAgICAoc29saXRhcnlTaWJsaW5nLmVsZW1lbnQgYXMgYW55KS5oaWRlQ29sdW1uSWYuY2FuSGlkZSA9IGZhbHNlO1xuICAgICAgbGV0IHN1YkNvbHVtbnM6IElDb2x1bW5IaWVyYXJjaHlbXSA9ICBzb2xpdGFyeVNpYmxpbmcuc3ViQ29sdW1ucztcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcbiAgICAgIHdoaWxlIChzb2xpdGFyeVNpYmxpbmcgJiYgc3ViQ29sdW1ucy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICB2aXNpYmxlU2libGluZ3MgPSB0aGlzLmdldFZpc2libGVTaWJsaW5nc0J5Q29sdW1uKHN1YkNvbHVtbnMsICsrY291bnQpO1xuICAgICAgICAgIHNvbGl0YXJ5U2libGluZyA9IHZpc2libGVTaWJsaW5ncy5sZW5ndGggPT09IDEgPyB2aXNpYmxlU2libGluZ3NbMF0gOiBudWxsO1xuICAgICAgICAgIGlmIChzb2xpdGFyeVNpYmxpbmcpIHtcbiAgICAgICAgICAgIChzb2xpdGFyeVNpYmxpbmcuZWxlbWVudCBhcyBhbnkpLmhpZGVDb2x1bW5JZi5jYW5IaWRlID0gZmFsc2U7XG4gICAgICAgICAgICBzdWJDb2x1bW5zID0gc29saXRhcnlTaWJsaW5nLnN1YkNvbHVtbnM7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMb3dlc3RMZXZlbENvbHVtbkhpZXJhcmNoaWVzVmlzaWJsZShmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHlbXSk6IElDb2x1bW5IaWVyYXJjaHlbXSB7XG5cbiAgICBjb25zdCBsb3dlc3RMZXZlbENvbEhpZXJhcmNoaWVzVmlzaWJsZTogSUNvbHVtbkhpZXJhcmNoeVtdID0gW107XG4gICAgY29uc3Qgc29ydGVkQnlMZXZlbENvbHVtbkhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeVtdID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmNvbmNhdCgpLnNvcnQoKGNvbEhpZXIxOiBJQ29sdW1uSGllcmFyY2h5LCBjb2xIaWVyMjogSUNvbHVtbkhpZXJhcmNoeSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbEhpZXIyLmxldmVsIC0gY29sSGllcjEubGV2ZWw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBiYXNlTGV2ZWw6IG51bWJlciA9IHNvcnRlZEJ5TGV2ZWxDb2x1bW5IaWVyYXJjaHlbMF0ubGV2ZWw7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3J0ZWRCeUxldmVsQ29sdW1uSGllcmFyY2h5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBoaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgPSBzb3J0ZWRCeUxldmVsQ29sdW1uSGllcmFyY2h5W2ldO1xuICAgICAgaWYgKGhpZXJhcmNoeS5sZXZlbCAhPT0gYmFzZUxldmVsKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCEoaGllcmFyY2h5LmVsZW1lbnQgYXMgYW55KS5oaWRlQ29sdW1uSWYudGFibGVqc0hpZGVDb2x1bW5JZikge1xuICAgICAgICBsb3dlc3RMZXZlbENvbEhpZXJhcmNoaWVzVmlzaWJsZS5wdXNoKGhpZXJhcmNoeSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvd2VzdExldmVsQ29sSGllcmFyY2hpZXNWaXNpYmxlO1xuICB9XG5cbiAgcHVibGljIGFsbENvbHVtbnNTaGFyZVRoZVNhbWVBbmNlc3Rvcihjb21tb25BbmNlc3RvcjogSUNvbHVtbkhpZXJhcmNoeSwgY29sdW1uSGllcmFyY2hpZXM6IElDb2x1bW5IaWVyYXJjaHlbXSwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5W10pOiBib29sZWFuIHtcblxuICAgIGNvbnN0IGhpZXJhcmNoaWVzV2l0aENvbW1vbkFuY2VzdG9yOiBJQ29sdW1uSGllcmFyY2h5W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkhpZXJhcmNoaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gY29sdW1uSGllcmFyY2hpZXNbaV07XG4gICAgICBsZXQgcGFyZW50Q29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5IHwgbnVsbCA9IGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeS5maWx0ZXIoKGhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeSkgPT4ge1xuICAgICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGN1cnJlbnRDb2x1bW5IaWVyYXJjaHkucGFyZW50Q29sdW1uO1xuICAgICAgfSlbMF07XG5cbiAgICAgIHdoaWxlIChwYXJlbnRDb2x1bW5IaWVyYXJjaHkpIHtcbiAgICAgICAgaWYgKHBhcmVudENvbHVtbkhpZXJhcmNoeSA9PT0gY29tbW9uQW5jZXN0b3IpIHtcbiAgICAgICAgICBoaWVyYXJjaGllc1dpdGhDb21tb25BbmNlc3Rvci5wdXNoKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGhpZXJhcmNoeS5lbGVtZW50ID09PSBwYXJlbnRDb2x1bW5IaWVyYXJjaHkhLmVsZW1lbnQ7XG4gICAgICAgIH0pWzBdO1xuICAgICAgICBcbiAgICAgICAgcGFyZW50Q29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGhpZXJhcmNoeS5lbGVtZW50ID09PSBjb2x1bW5IaWVyYXJjaHkucGFyZW50Q29sdW1uO1xuICAgICAgICB9KVswXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbHVtbkhpZXJhcmNoaWVzLmxlbmd0aCA9PT0gaGllcmFyY2hpZXNXaXRoQ29tbW9uQW5jZXN0b3IubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGhpZGVBbGxPZmZzcHJpbmcoY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5IaWVyYXJjaHkuc3ViQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQ6IGFueSA9IHRoaXMuZ3JpZERpcmVjdGl2ZSEuZ2V0UmVsYXRlZEhlYWRlcihjb2x1bW5IaWVyYXJjaHkuc3ViQ29sdW1uc1tpXS5lbGVtZW50KTtcbiAgICAgIGNoaWxkLmhpZGVDb2x1bW5JZi5jaGFuZ2VUcmlnZ2VyZWRCeSA9IGNvbHVtbkhpZXJhcmNoeTtcbiAgICAgIGNoaWxkLmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2hvd0FsbE9mZnNwcmluZyhjb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkhpZXJhcmNoeS5zdWJDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZDogYW55ID0gdGhpcy5ncmlkRGlyZWN0aXZlIS5nZXRSZWxhdGVkSGVhZGVyKGNvbHVtbkhpZXJhcmNoeS5zdWJDb2x1bW5zW2ldLmVsZW1lbnQpO1xuICAgICAgY2hpbGQuaGlkZUNvbHVtbklmLmNoYW5nZVRyaWdnZXJlZEJ5ID0gY29sdW1uSGllcmFyY2h5O1xuICAgICAgY2hpbGQuaGlkZUNvbHVtbklmLnRhYmxlanNIaWRlQ29sdW1uSWYgPSBmYWxzZTtcbiAgICAgIGNoaWxkLmhpZGVDb2x1bW5JZi5jYW5IaWRlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWxsU2libGluZ3NBcmVIaWRkZW4oY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5LCBmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHlbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBwYXJlbnRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgfCBudWxsID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGNvbHVtbkhpZXJhcmNoeS5wYXJlbnRDb2x1bW47XG4gICAgfSlbMF07XG5cbiAgICBsZXQgaGlkZGVuU2libGluZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCB0b3RhbFNpYmxpbmdzOiBudW1iZXI7XG5cbiAgICBpZiAocGFyZW50Q29sdW1uSGllcmFyY2h5KSB7XG4gICAgICB0b3RhbFNpYmxpbmdzID0gcGFyZW50Q29sdW1uSGllcmFyY2h5LnN1YkNvbHVtbnMubGVuZ3RoO1xuICAgICAgcGFyZW50Q29sdW1uSGllcmFyY2h5LnN1YkNvbHVtbnMuZm9yRWFjaCgoc3ViQ29sdW1uOiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmdyaWREaXJlY3RpdmUhLmdldFJlbGF0ZWRIZWFkZXIoc3ViQ29sdW1uLmVsZW1lbnQpLmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmKSB7XG4gICAgICAgICAgaGlkZGVuU2libGluZ0NvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0b3BMZXZlbFNpYmxpbmdzOiBJQ29sdW1uSGllcmFyY2h5W10gPSBmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHkuZmlsdGVyKChoaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkpID0+IHtcbiAgICAgICAgcmV0dXJuIGhpZXJhcmNoeS5sZXZlbCA9PT0gMDtcbiAgICAgIH0pO1xuICAgICAgdG90YWxTaWJsaW5ncyA9IHRvcExldmVsU2libGluZ3MubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3BMZXZlbFNpYmxpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvcExldmVsU2libGluZzogSUNvbHVtbkhpZXJhcmNoeSA9IHRvcExldmVsU2libGluZ3NbaV07XG4gICAgICAgIGlmICh0aGlzLmdyaWREaXJlY3RpdmUhLmdldFJlbGF0ZWRIZWFkZXIodG9wTGV2ZWxTaWJsaW5nLmVsZW1lbnQpLmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmKSB7XG4gICAgICAgICAgaGlkZGVuU2libGluZ0NvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhpZGRlblNpYmxpbmdDb3VudCA9PT0gdG90YWxTaWJsaW5ncztcbiAgfVxuXG4gIHB1YmxpYyBzZXRBbGxBbmNlc3RvcnMoY3VycmVudENvbHVtbkhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeSwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5W10sIGhpZGRlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGxldCBwYXJlbnRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgfCBudWxsID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGN1cnJlbnRDb2x1bW5IaWVyYXJjaHkucGFyZW50Q29sdW1uO1xuICAgIH0pWzBdO1xuXG4gICAgY29uc3QgYWxsU2libGluZ3NIaWRkZW46IGJvb2xlYW4gPSB0aGlzLmFsbFNpYmxpbmdzQXJlSGlkZGVuKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHksIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSk7XG4gICAgbGV0IHBhcmVudFNpYmxpbmdzQXJlQWxsSGlkZGVuOiBib29sZWFuID0gaGlkZGVuID8gYWxsU2libGluZ3NIaWRkZW4gOiB0cnVlO1xuXG4gICAgd2hpbGUgKHBhcmVudENvbHVtbkhpZXJhcmNoeSAmJiBwYXJlbnRTaWJsaW5nc0FyZUFsbEhpZGRlbikge1xuICAgICAgY29uc3QgcGFyZW50RWxlbWVudDogYW55ID0gcGFyZW50Q29sdW1uSGllcmFyY2h5LmVsZW1lbnQgYXMgYW55O1xuXG4gICAgICBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW5JZi5jaGFuZ2VUcmlnZ2VyZWRCeSA9IGN1cnJlbnRDb2x1bW5IaWVyYXJjaHk7XG4gICAgICBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW5JZi5zaG93T2Zmc3ByaW5nTGltaXRlZCA9IHRydWU7XG4gICAgICBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmID0gaGlkZGVuO1xuICAgICAgcGFyZW50RWxlbWVudC5oaWRlQ29sdW1uSWYuY2FuSGlkZSA9IHRydWU7XG4gICAgICBcblxuICAgICAgY29uc3QgY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgIHJldHVybiBoaWVyYXJjaHkuZWxlbWVudCA9PT0gcGFyZW50Q29sdW1uSGllcmFyY2h5IS5lbGVtZW50O1xuICAgICAgfSlbMF07XG4gICAgICBcbiAgICAgIHBhcmVudENvbHVtbkhpZXJhcmNoeSA9IGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeS5maWx0ZXIoKGhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeSkgPT4ge1xuICAgICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGNvbHVtbkhpZXJhcmNoeS5wYXJlbnRDb2x1bW47XG4gICAgICB9KVswXTsgICAgXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHB1YmxpYyBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHsgXG4gICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5oaWRlQ29sdW1uSWYgPSB0aGlzO1xuICB9XG5cbn1cbiJdfQ==