import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./../../services/grid/grid.service";
export class HideColumnIfDirective {
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
    ngOnDestroy() {
        this.elementRef.nativeElement.hideColumnIf = null;
    }
}
HideColumnIfDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: HideColumnIfDirective, deps: [{ token: i0.ElementRef }, { token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive });
HideColumnIfDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.5", type: HideColumnIfDirective, selector: "[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]", inputs: { tablejsHideColumnIf: "tablejsHideColumnIf" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: HideColumnIfDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.GridService }]; }, propDecorators: { tablejsHideColumnIf: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlkZS1jb2x1bW4taWYuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdGFibGVqcy9zcmMvbGliL2RpcmVjdGl2ZXMvaGlkZS1jb2x1bW4taWYvaGlkZS1jb2x1bW4taWYuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDOzs7QUFReEUsTUFBTSxPQUFPLHFCQUFxQjtJQVNoQyxJQUFvQixtQkFBbUIsQ0FBQyxJQUFnQztRQUV0RSxNQUFNLFVBQVUsR0FBWSxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFDdEQsTUFBTSxjQUFjLEdBQTRCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUV2RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFFOUIsTUFBTSxFQUFFLEdBQTZCLElBQUksQ0FBQyxXQUFXLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuSCxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDZixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUV6QyxNQUFNLHVCQUF1QixHQUFZLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDO1lBQ25FLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLGFBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25ELE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGFBQWMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzdF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QUFDO1FBQ3RDLHNCQUFpQixHQUE0QixJQUFJLENBQUM7UUFDbEQsWUFBTyxHQUFZLElBQUksQ0FBQztRQW9POUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUNuRCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDcEQsQ0FBQzs7a0hBaFBVLHFCQUFxQjtzR0FBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBSGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdFQUF3RTtpQkFDbkY7MkhBVXFCLG1CQUFtQjtzQkFBdEMsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSUNvbHVtbkhpZXJhcmNoeSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbnRlcmZhY2VzL2ktY29sdW1uLWhpZXJhcmNoeSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vLi4vc2VydmljZXMvZ3JpZC9ncmlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JpZERpcmVjdGl2ZSB9IGZyb20gJy4vLi4vZ3JpZC9ncmlkLmRpcmVjdGl2ZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t0YWJsZWpzSGlkZUNvbHVtbklmXSwgW3RhYmxlanNoaWRlY29sdW1uaWZdLCBbdGFibGVqcy1oaWRlLWNvbHVtbi1pZl0nXG59KVxuZXhwb3J0IGNsYXNzIEhpZGVDb2x1bW5JZkRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgcHJpdmF0ZSBfaGlkZUNvbHVtbjogYm9vbGVhbiB8IHVuZGVmaW5lZCB8IG51bGwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBncmlkRGlyZWN0aXZlOiBHcmlkRGlyZWN0aXZlIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgSElEREVOX0NPTFVNTl9DTEFTUzogc3RyaW5nID0gJ2NvbHVtbi1pcy1oaWRkZW4nO1xuICBwdWJsaWMgc2hvd09mZnNwcmluZ0xpbWl0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGNoYW5nZVRyaWdnZXJlZEJ5OiBJQ29sdW1uSGllcmFyY2h5IHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyBjYW5IaWRlOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKSBwdWJsaWMgc2V0IHRhYmxlanNIaWRlQ29sdW1uSWYoaGlkZTogYm9vbGVhbiB8IHVuZGVmaW5lZCB8IG51bGwpIHtcbiAgICBcbiAgICBjb25zdCB3YXNMaW1pdGVkOiBib29sZWFuID0gdGhpcy5zaG93T2Zmc3ByaW5nTGltaXRlZDtcbiAgICBjb25zdCB3YXNUcmlnZ2VyZWRCeTogSUNvbHVtbkhpZXJhcmNoeSB8IG51bGwgPSB0aGlzLmNoYW5nZVRyaWdnZXJlZEJ5O1xuXG4gICAgdGhpcy5zaG93T2Zmc3ByaW5nTGltaXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY2hhbmdlVHJpZ2dlcmVkQnkgPSBudWxsO1xuICAgIFxuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCB8IGFueSB8IG51bGwgPSB0aGlzLmdyaWRTZXJ2aWNlLmdldFBhcmVudFRhYmxlanNHcmlkRGlyZWN0aXZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoZWwgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSA9IGVsWydncmlkRGlyZWN0aXZlJ107XG5cbiAgICAgIGNvbnN0IGNvbHVtblZpc2liaWxpdHlDaGFuZ2VkOiBib29sZWFuID0gdGhpcy5faGlkZUNvbHVtbiAhPT0gaGlkZTtcbiAgICAgIGlmICghY29sdW1uVmlzaWJpbGl0eUNoYW5nZWQpIHtcbiAgICAgICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5oaWRkZW5Db2x1bW5DaGFuZ2VzLm5leHQobnVsbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5faGlkZUNvbHVtbiA9IGhpZGU7XG5cbiAgICAgIGNvbnN0IGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSA9IHRoaXMuZ3JpZERpcmVjdGl2ZSEuZ2V0RmxhdHRlbmVkSGllcmFyY2h5KCk7XG4gICAgICBjb25zdCBjdXJyZW50Q29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgIHJldHVybiBoaWVyYXJjaHkuZWxlbWVudCA9PT0gdGhpcy5ncmlkRGlyZWN0aXZlIS5nZXRSZWxhdGVkSGVhZGVyKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH0pWzBdO1xuXG4gICAgICBpZiAoIXdhc1RyaWdnZXJlZEJ5KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVHJpZ2dlcmVkQnkgPSBjdXJyZW50Q29sdW1uSGllcmFyY2h5O1xuICAgICAgfVxuXG4gICAgICBpZiAoaGlkZSkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgbG93ZXN0TGV2ZWxDb2xIaWVyYXJjaGllc1Zpc2libGU6IElDb2x1bW5IaWVyYXJjaHlbXSA9IHRoaXMuZ2V0TG93ZXN0TGV2ZWxDb2x1bW5IaWVyYXJjaGllc1Zpc2libGUoZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5KTtcblxuICAgICAgICBjb25zdCBhbGxMb3dlc3RMZXZlbENvbHVtbnNIaWRkZW46IGJvb2xlYW4gPSBsb3dlc3RMZXZlbENvbEhpZXJhcmNoaWVzVmlzaWJsZS5sZW5ndGggPT09IDA7XG4gICAgICAgIGlmIChhbGxMb3dlc3RMZXZlbENvbHVtbnNIaWRkZW4gfHwgdGhpcy5hbGxDb2x1bW5zU2hhcmVUaGVTYW1lQW5jZXN0b3IoY3VycmVudENvbHVtbkhpZXJhcmNoeSwgbG93ZXN0TGV2ZWxDb2xIaWVyYXJjaGllc1Zpc2libGUsIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSkpIHtcbiAgICAgICAgICB0aGlzLl9oaWRlQ29sdW1uID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5ncmlkRGlyZWN0aXZlIS5oaWRkZW5Db2x1bW5DaGFuZ2VzLm5leHQobnVsbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyaWREaXJlY3RpdmUhLmdldFJlbGF0ZWRIZWFkZXJzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5mb3JFYWNoKChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLkhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaGlkZUFsbE9mZnNwcmluZyhjdXJyZW50Q29sdW1uSGllcmFyY2h5KTtcbiAgICAgICAgaWYgKHRoaXMuYWxsU2libGluZ3NBcmVIaWRkZW4oY3VycmVudENvbHVtbkhpZXJhcmNoeSwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5KSkge1xuICAgICAgICAgIHRoaXMuc2V0QWxsQW5jZXN0b3JzKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHksIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSEuZ2V0UmVsYXRlZEhlYWRlcnModGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZvckVhY2goKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuSElEREVOX0NPTFVNTl9DTEFTUyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0QWxsQW5jZXN0b3JzKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHksIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSwgZmFsc2UpO1xuICAgICAgICBpZiAoIXdhc0xpbWl0ZWQpIHtcbiAgICAgICAgICB0aGlzLnNob3dBbGxPZmZzcHJpbmcoY3VycmVudENvbHVtbkhpZXJhcmNoeSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICBcbiAgICAgIGNvbnN0IHRyaWdnZXJIaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgfCBudWxsID0gIXdhc1RyaWdnZXJlZEJ5ID8gY3VycmVudENvbHVtbkhpZXJhcmNoeSA6IG51bGw7XG4gICAgICB0aGlzLmNoYW5nZVRyaWdnZXJlZEJ5ID0gbnVsbDtcbiAgICAgIHRoaXMuZ3JpZERpcmVjdGl2ZSEuaGlkZGVuQ29sdW1uQ2hhbmdlcy5uZXh0KHsgaGllcmFyY2h5Q29sdW1uOiBjdXJyZW50Q29sdW1uSGllcmFyY2h5LCB3YXNUcmlnZ2VyZWRCeVRoaXNDb2x1bW46IHRyaWdnZXJIaWVyYXJjaHkgIT09IG51bGwsIGhpZGRlbjogdGhpcy5faGlkZUNvbHVtbiA9PT0gdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGdldCB0YWJsZWpzSGlkZUNvbHVtbklmKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZUNvbHVtbjtcbiAgfVxuXG4gIGdldFZpc2libGVTaWJsaW5nc0J5Q29sdW1uKGhpZXJhcmNoeUxpc3Q6IElDb2x1bW5IaWVyYXJjaHlbXSwgbGV2ZWw6IG51bWJlcik6IElDb2x1bW5IaWVyYXJjaHlbXSB7XG4gICAgY29uc3QgdmlzaWJsZVNpYmxpbmdzOiBJQ29sdW1uSGllcmFyY2h5W10gPSBoaWVyYXJjaHlMaXN0LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICByZXR1cm4gaGllcmFyY2h5LmxldmVsID09PSBsZXZlbCAmJiAoaGllcmFyY2h5LmVsZW1lbnQgYXMgYW55KS5oaWRlQ29sdW1uSWYudGFibGVqc0hpZGVDb2x1bW5JZiA9PT0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZpc2libGVTaWJsaW5ncztcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVIZWFkZXJzVGhhdENhbkhpZGUoKTogdm9pZCB7XG4gICAgY29uc3QgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5W10gPSB0aGlzLmdyaWREaXJlY3RpdmUhLmdldEZsYXR0ZW5lZEhpZXJhcmNoeSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgPSBmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHlbaV07XG4gICAgICBjb25zdCBlbGVtZW50OiBhbnkgPSBjb2x1bW5IaWVyYXJjaHkuZWxlbWVudCBhcyBhbnk7XG4gICAgICBjb25zdCBoaWRlQ29sdW1uSWY6IEhpZGVDb2x1bW5JZkRpcmVjdGl2ZSA9IGVsZW1lbnQuaGlkZUNvbHVtbklmO1xuICAgICAgaGlkZUNvbHVtbklmLmNhbkhpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBsZXQgdmlzaWJsZVNpYmxpbmdzOiBJQ29sdW1uSGllcmFyY2h5W10gPSB0aGlzLmdldFZpc2libGVTaWJsaW5nc0J5Q29sdW1uKGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSwgMCk7XG5cbiAgICBpZiAodmlzaWJsZVNpYmxpbmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGV0IHNvbGl0YXJ5U2libGluZzogSUNvbHVtbkhpZXJhcmNoeSB8IG51bGwgPSB2aXNpYmxlU2libGluZ3NbMF07XG4gICAgICAoc29saXRhcnlTaWJsaW5nLmVsZW1lbnQgYXMgYW55KS5oaWRlQ29sdW1uSWYuY2FuSGlkZSA9IGZhbHNlO1xuICAgICAgbGV0IHN1YkNvbHVtbnM6IElDb2x1bW5IaWVyYXJjaHlbXSA9ICBzb2xpdGFyeVNpYmxpbmcuc3ViQ29sdW1ucztcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcbiAgICAgIHdoaWxlIChzb2xpdGFyeVNpYmxpbmcgJiYgc3ViQ29sdW1ucy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICB2aXNpYmxlU2libGluZ3MgPSB0aGlzLmdldFZpc2libGVTaWJsaW5nc0J5Q29sdW1uKHN1YkNvbHVtbnMsICsrY291bnQpO1xuICAgICAgICAgIHNvbGl0YXJ5U2libGluZyA9IHZpc2libGVTaWJsaW5ncy5sZW5ndGggPT09IDEgPyB2aXNpYmxlU2libGluZ3NbMF0gOiBudWxsO1xuICAgICAgICAgIGlmIChzb2xpdGFyeVNpYmxpbmcpIHtcbiAgICAgICAgICAgIChzb2xpdGFyeVNpYmxpbmcuZWxlbWVudCBhcyBhbnkpLmhpZGVDb2x1bW5JZi5jYW5IaWRlID0gZmFsc2U7XG4gICAgICAgICAgICBzdWJDb2x1bW5zID0gc29saXRhcnlTaWJsaW5nLnN1YkNvbHVtbnM7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMb3dlc3RMZXZlbENvbHVtbkhpZXJhcmNoaWVzVmlzaWJsZShmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHlbXSk6IElDb2x1bW5IaWVyYXJjaHlbXSB7XG5cbiAgICBjb25zdCBsb3dlc3RMZXZlbENvbEhpZXJhcmNoaWVzVmlzaWJsZTogSUNvbHVtbkhpZXJhcmNoeVtdID0gW107XG4gICAgY29uc3Qgc29ydGVkQnlMZXZlbENvbHVtbkhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeVtdID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmNvbmNhdCgpLnNvcnQoKGNvbEhpZXIxOiBJQ29sdW1uSGllcmFyY2h5LCBjb2xIaWVyMjogSUNvbHVtbkhpZXJhcmNoeSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbEhpZXIyLmxldmVsIC0gY29sSGllcjEubGV2ZWw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBiYXNlTGV2ZWw6IG51bWJlciA9IHNvcnRlZEJ5TGV2ZWxDb2x1bW5IaWVyYXJjaHlbMF0ubGV2ZWw7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3J0ZWRCeUxldmVsQ29sdW1uSGllcmFyY2h5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBoaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgPSBzb3J0ZWRCeUxldmVsQ29sdW1uSGllcmFyY2h5W2ldO1xuICAgICAgaWYgKGhpZXJhcmNoeS5sZXZlbCAhPT0gYmFzZUxldmVsKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCEoaGllcmFyY2h5LmVsZW1lbnQgYXMgYW55KS5oaWRlQ29sdW1uSWYudGFibGVqc0hpZGVDb2x1bW5JZikge1xuICAgICAgICBsb3dlc3RMZXZlbENvbEhpZXJhcmNoaWVzVmlzaWJsZS5wdXNoKGhpZXJhcmNoeSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvd2VzdExldmVsQ29sSGllcmFyY2hpZXNWaXNpYmxlO1xuICB9XG5cbiAgcHVibGljIGFsbENvbHVtbnNTaGFyZVRoZVNhbWVBbmNlc3Rvcihjb21tb25BbmNlc3RvcjogSUNvbHVtbkhpZXJhcmNoeSwgY29sdW1uSGllcmFyY2hpZXM6IElDb2x1bW5IaWVyYXJjaHlbXSwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5W10pOiBib29sZWFuIHtcblxuICAgIGNvbnN0IGhpZXJhcmNoaWVzV2l0aENvbW1vbkFuY2VzdG9yOiBJQ29sdW1uSGllcmFyY2h5W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkhpZXJhcmNoaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gY29sdW1uSGllcmFyY2hpZXNbaV07XG4gICAgICBsZXQgcGFyZW50Q29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5IHwgbnVsbCA9IGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeS5maWx0ZXIoKGhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeSkgPT4ge1xuICAgICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGN1cnJlbnRDb2x1bW5IaWVyYXJjaHkucGFyZW50Q29sdW1uO1xuICAgICAgfSlbMF07XG5cbiAgICAgIHdoaWxlIChwYXJlbnRDb2x1bW5IaWVyYXJjaHkpIHtcbiAgICAgICAgaWYgKHBhcmVudENvbHVtbkhpZXJhcmNoeSA9PT0gY29tbW9uQW5jZXN0b3IpIHtcbiAgICAgICAgICBoaWVyYXJjaGllc1dpdGhDb21tb25BbmNlc3Rvci5wdXNoKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGhpZXJhcmNoeS5lbGVtZW50ID09PSBwYXJlbnRDb2x1bW5IaWVyYXJjaHkhLmVsZW1lbnQ7XG4gICAgICAgIH0pWzBdO1xuICAgICAgICBcbiAgICAgICAgcGFyZW50Q29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGhpZXJhcmNoeS5lbGVtZW50ID09PSBjb2x1bW5IaWVyYXJjaHkucGFyZW50Q29sdW1uO1xuICAgICAgICB9KVswXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbHVtbkhpZXJhcmNoaWVzLmxlbmd0aCA9PT0gaGllcmFyY2hpZXNXaXRoQ29tbW9uQW5jZXN0b3IubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGhpZGVBbGxPZmZzcHJpbmcoY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5IaWVyYXJjaHkuc3ViQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQ6IGFueSA9IHRoaXMuZ3JpZERpcmVjdGl2ZSEuZ2V0UmVsYXRlZEhlYWRlcihjb2x1bW5IaWVyYXJjaHkuc3ViQ29sdW1uc1tpXS5lbGVtZW50KTtcbiAgICAgIGNoaWxkLmhpZGVDb2x1bW5JZi5jaGFuZ2VUcmlnZ2VyZWRCeSA9IGNvbHVtbkhpZXJhcmNoeTtcbiAgICAgIGNoaWxkLmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2hvd0FsbE9mZnNwcmluZyhjb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkhpZXJhcmNoeS5zdWJDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZDogYW55ID0gdGhpcy5ncmlkRGlyZWN0aXZlIS5nZXRSZWxhdGVkSGVhZGVyKGNvbHVtbkhpZXJhcmNoeS5zdWJDb2x1bW5zW2ldLmVsZW1lbnQpO1xuICAgICAgY2hpbGQuaGlkZUNvbHVtbklmLmNoYW5nZVRyaWdnZXJlZEJ5ID0gY29sdW1uSGllcmFyY2h5O1xuICAgICAgY2hpbGQuaGlkZUNvbHVtbklmLnRhYmxlanNIaWRlQ29sdW1uSWYgPSBmYWxzZTtcbiAgICAgIGNoaWxkLmhpZGVDb2x1bW5JZi5jYW5IaWRlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWxsU2libGluZ3NBcmVIaWRkZW4oY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5LCBmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHlbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBwYXJlbnRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgfCBudWxsID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGNvbHVtbkhpZXJhcmNoeS5wYXJlbnRDb2x1bW47XG4gICAgfSlbMF07XG5cbiAgICBsZXQgaGlkZGVuU2libGluZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgIGxldCB0b3RhbFNpYmxpbmdzOiBudW1iZXI7XG5cbiAgICBpZiAocGFyZW50Q29sdW1uSGllcmFyY2h5KSB7XG4gICAgICB0b3RhbFNpYmxpbmdzID0gcGFyZW50Q29sdW1uSGllcmFyY2h5LnN1YkNvbHVtbnMubGVuZ3RoO1xuICAgICAgcGFyZW50Q29sdW1uSGllcmFyY2h5LnN1YkNvbHVtbnMuZm9yRWFjaCgoc3ViQ29sdW1uOiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmdyaWREaXJlY3RpdmUhLmdldFJlbGF0ZWRIZWFkZXIoc3ViQ29sdW1uLmVsZW1lbnQpLmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmKSB7XG4gICAgICAgICAgaGlkZGVuU2libGluZ0NvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0b3BMZXZlbFNpYmxpbmdzOiBJQ29sdW1uSGllcmFyY2h5W10gPSBmbGF0dGVuZWRDb2x1bW5IaWVyYXJjaHkuZmlsdGVyKChoaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkpID0+IHtcbiAgICAgICAgcmV0dXJuIGhpZXJhcmNoeS5sZXZlbCA9PT0gMDtcbiAgICAgIH0pO1xuICAgICAgdG90YWxTaWJsaW5ncyA9IHRvcExldmVsU2libGluZ3MubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3BMZXZlbFNpYmxpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvcExldmVsU2libGluZzogSUNvbHVtbkhpZXJhcmNoeSA9IHRvcExldmVsU2libGluZ3NbaV07XG4gICAgICAgIGlmICh0aGlzLmdyaWREaXJlY3RpdmUhLmdldFJlbGF0ZWRIZWFkZXIodG9wTGV2ZWxTaWJsaW5nLmVsZW1lbnQpLmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmKSB7XG4gICAgICAgICAgaGlkZGVuU2libGluZ0NvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhpZGRlblNpYmxpbmdDb3VudCA9PT0gdG90YWxTaWJsaW5ncztcbiAgfVxuXG4gIHB1YmxpYyBzZXRBbGxBbmNlc3RvcnMoY3VycmVudENvbHVtbkhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeSwgZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5W10sIGhpZGRlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGxldCBwYXJlbnRDb2x1bW5IaWVyYXJjaHk6IElDb2x1bW5IaWVyYXJjaHkgfCBudWxsID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGN1cnJlbnRDb2x1bW5IaWVyYXJjaHkucGFyZW50Q29sdW1uO1xuICAgIH0pWzBdO1xuXG4gICAgY29uc3QgYWxsU2libGluZ3NIaWRkZW46IGJvb2xlYW4gPSB0aGlzLmFsbFNpYmxpbmdzQXJlSGlkZGVuKGN1cnJlbnRDb2x1bW5IaWVyYXJjaHksIGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeSk7XG4gICAgbGV0IHBhcmVudFNpYmxpbmdzQXJlQWxsSGlkZGVuOiBib29sZWFuID0gaGlkZGVuID8gYWxsU2libGluZ3NIaWRkZW4gOiB0cnVlO1xuXG4gICAgd2hpbGUgKHBhcmVudENvbHVtbkhpZXJhcmNoeSAmJiBwYXJlbnRTaWJsaW5nc0FyZUFsbEhpZGRlbikge1xuICAgICAgY29uc3QgcGFyZW50RWxlbWVudDogYW55ID0gcGFyZW50Q29sdW1uSGllcmFyY2h5LmVsZW1lbnQgYXMgYW55O1xuXG4gICAgICBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW5JZi5jaGFuZ2VUcmlnZ2VyZWRCeSA9IGN1cnJlbnRDb2x1bW5IaWVyYXJjaHk7XG4gICAgICBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW5JZi5zaG93T2Zmc3ByaW5nTGltaXRlZCA9IHRydWU7XG4gICAgICBwYXJlbnRFbGVtZW50LmhpZGVDb2x1bW5JZi50YWJsZWpzSGlkZUNvbHVtbklmID0gaGlkZGVuO1xuICAgICAgcGFyZW50RWxlbWVudC5oaWRlQ29sdW1uSWYuY2FuSGlkZSA9IHRydWU7XG4gICAgICBcblxuICAgICAgY29uc3QgY29sdW1uSGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5ID0gZmxhdHRlbmVkQ29sdW1uSGllcmFyY2h5LmZpbHRlcigoaGllcmFyY2h5OiBJQ29sdW1uSGllcmFyY2h5KSA9PiB7XG4gICAgICAgIHJldHVybiBoaWVyYXJjaHkuZWxlbWVudCA9PT0gcGFyZW50Q29sdW1uSGllcmFyY2h5IS5lbGVtZW50O1xuICAgICAgfSlbMF07XG4gICAgICBcbiAgICAgIHBhcmVudENvbHVtbkhpZXJhcmNoeSA9IGZsYXR0ZW5lZENvbHVtbkhpZXJhcmNoeS5maWx0ZXIoKGhpZXJhcmNoeTogSUNvbHVtbkhpZXJhcmNoeSkgPT4ge1xuICAgICAgICByZXR1cm4gaGllcmFyY2h5LmVsZW1lbnQgPT09IGNvbHVtbkhpZXJhcmNoeS5wYXJlbnRDb2x1bW47XG4gICAgICB9KVswXTsgICAgXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHB1YmxpYyBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHsgXG4gICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5oaWRlQ29sdW1uSWYgPSB0aGlzO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaGlkZUNvbHVtbklmID0gbnVsbDtcbiAgfVxuXG59XG4iXX0=