import { ElementRef, OnDestroy } from '@angular/core';
import { IColumnHierarchy } from '../../shared/interfaces/i-column-hierarchy';
import { GridService } from './../../services/grid/grid.service';
import * as i0 from "@angular/core";
export declare class HideColumnIfDirective implements OnDestroy {
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
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HideColumnIfDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<HideColumnIfDirective, "[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]", never, { "tablejsHideColumnIf": "tablejsHideColumnIf"; }, {}, never, never, false, never>;
}
