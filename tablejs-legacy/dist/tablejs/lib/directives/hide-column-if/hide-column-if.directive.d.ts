import { ElementRef } from '@angular/core';
import { IColumnHierarchy } from '../../shared/interfaces/i-column-hierarchy';
import { GridService } from './../../services/grid/grid.service';
export declare class HideColumnIfDirective {
    elementRef: ElementRef;
    gridService: GridService;
    private _hideColumn;
    private gridDirective;
    HIDDEN_COLUMN_CLASS: string;
    showOffspringLimited: boolean;
    changeTriggeredBy: IColumnHierarchy | null;
    canHide: boolean;
    set tablejsHideColumnIf(hide: boolean | undefined | null);
    get tablejsHideColumnIf(): boolean | undefined | null;
    getVisibleSiblingsByColumn(hierarchyList: IColumnHierarchy[], level: number): IColumnHierarchy[];
    updateHeadersThatCanHide(): void;
    getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy: IColumnHierarchy[]): IColumnHierarchy[];
    allColumnsShareTheSameAncestor(commonAncestor: IColumnHierarchy, columnHierarchies: IColumnHierarchy[], flattenedColumnHierarchy: IColumnHierarchy[]): boolean;
    hideAllOffspring(columnHierarchy: IColumnHierarchy): void;
    showAllOffspring(columnHierarchy: IColumnHierarchy): void;
    allSiblingsAreHidden(columnHierarchy: IColumnHierarchy, flattenedColumnHierarchy: IColumnHierarchy[]): boolean;
    setAllAncestors(currentColumnHierarchy: IColumnHierarchy, flattenedColumnHierarchy: IColumnHierarchy[], hidden: boolean): void;
    constructor(elementRef: ElementRef, gridService: GridService);
}
//# sourceMappingURL=hide-column-if.directive.d.ts.map