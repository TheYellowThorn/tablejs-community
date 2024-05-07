import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { IColumnHierarchy } from '../../shared/interfaces/i-column-hierarchy';
import { GridService } from './../../services/grid/grid.service';
import { GridDirective } from './../grid/grid.directive';

@Directive({
  selector: '[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]'
})
export class HideColumnIfDirective implements OnDestroy {

  private _hideColumn: boolean | undefined | null = false;
  private gridDirective: GridDirective | undefined;
  public HIDDEN_COLUMN_CLASS: string = 'column-is-hidden';
  public showOffspringLimited: boolean = false;
  public changeTriggeredBy: IColumnHierarchy | null = null;
  public canHide: boolean = true;

  @Input() public set tablejsHideColumnIf(hide: boolean | undefined | null) {
    
    const wasLimited: boolean = this.showOffspringLimited;
    const wasTriggeredBy: IColumnHierarchy | null = this.changeTriggeredBy;

    this.showOffspringLimited = false;
    this.changeTriggeredBy = null;
    
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null) {
      this.gridDirective = el['gridDirective'];

      const columnVisibilityChanged: boolean = this._hideColumn !== hide;
      if (!columnVisibilityChanged) {
        this.gridDirective!.hiddenColumnChanges.next(null);
        return;
      }

      this._hideColumn = hide;

      const flattenedColumnHierarchy = this.gridDirective!.getFlattenedHierarchy();
      const currentColumnHierarchy: IColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
        return hierarchy.element === this.gridDirective!.getRelatedHeader(this.elementRef.nativeElement);
      })[0];

      if (!wasTriggeredBy) {
        this.changeTriggeredBy = currentColumnHierarchy;
      }

      if (hide) {
        
        const lowestLevelColHierarchiesVisible: IColumnHierarchy[] = this.getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy);

        const allLowestLevelColumnsHidden: boolean = lowestLevelColHierarchiesVisible.length === 0;
        if (allLowestLevelColumnsHidden || this.allColumnsShareTheSameAncestor(currentColumnHierarchy, lowestLevelColHierarchiesVisible, flattenedColumnHierarchy)) {
          this._hideColumn = false;
          this.gridDirective!.hiddenColumnChanges.next(null);
          return;
        }
        
        this.gridDirective!.getRelatedHeaders(this.elementRef.nativeElement).forEach((element: HTMLElement) => {
          element.classList.add(this.HIDDEN_COLUMN_CLASS);
        });
        
        this.hideAllOffspring(currentColumnHierarchy);
        if (this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy)) {
          this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, true);
        }
      } else {
        this.gridDirective!.getRelatedHeaders(this.elementRef.nativeElement).forEach((element: HTMLElement) => {
          element.classList.remove(this.HIDDEN_COLUMN_CLASS);
        });

        this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, false);
        if (!wasLimited) {
          this.showAllOffspring(currentColumnHierarchy);
        }
      }

     
      const triggerHierarchy: IColumnHierarchy | null = !wasTriggeredBy ? currentColumnHierarchy : null;
      this.changeTriggeredBy = null;
      this.gridDirective!.hiddenColumnChanges.next({ hierarchyColumn: currentColumnHierarchy, wasTriggeredByThisColumn: triggerHierarchy !== null, hidden: this._hideColumn === true });
    }
  }
  public get tablejsHideColumnIf(): boolean | undefined | null {
    return this._hideColumn;
  }

  getVisibleSiblingsByColumn(hierarchyList: IColumnHierarchy[], level: number): IColumnHierarchy[] {
    const visibleSiblings: IColumnHierarchy[] = hierarchyList.filter((hierarchy: IColumnHierarchy) => {
      return hierarchy.level === level && (hierarchy.element as any).hideColumnIf.tablejsHideColumnIf === false;
    });
    return visibleSiblings;
  }

  public updateHeadersThatCanHide(): void {
    const flattenedColumnHierarchy: IColumnHierarchy[] = this.gridDirective!.getFlattenedHierarchy();
    for (let i = 0; i < flattenedColumnHierarchy.length; i++) {
      const columnHierarchy: IColumnHierarchy = flattenedColumnHierarchy[i];
      const element: any = columnHierarchy.element as any;
      const hideColumnIf: HideColumnIfDirective = element.hideColumnIf;
      hideColumnIf.canHide = true;
    }
    let visibleSiblings: IColumnHierarchy[] = this.getVisibleSiblingsByColumn(flattenedColumnHierarchy, 0);

    if (visibleSiblings.length === 1) {
      let solitarySibling: IColumnHierarchy | null = visibleSiblings[0];
      (solitarySibling.element as any).hideColumnIf.canHide = false;
      let subColumns: IColumnHierarchy[] =  solitarySibling.subColumns;
      let count: number = 0;
      while (solitarySibling && subColumns.length !== 0) {
          visibleSiblings = this.getVisibleSiblingsByColumn(subColumns, ++count);
          solitarySibling = visibleSiblings.length === 1 ? visibleSiblings[0] : null;
          if (solitarySibling) {
            (solitarySibling.element as any).hideColumnIf.canHide = false;
            subColumns = solitarySibling.subColumns;
          }
      }
    }
  }

  public getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy: IColumnHierarchy[]): IColumnHierarchy[] {

    const lowestLevelColHierarchiesVisible: IColumnHierarchy[] = [];
    const sortedByLevelColumnHierarchy: IColumnHierarchy[] = flattenedColumnHierarchy.concat().sort((colHier1: IColumnHierarchy, colHier2: IColumnHierarchy) => {
      return colHier2.level - colHier1.level;
    });

    const baseLevel: number = sortedByLevelColumnHierarchy[0].level;
    
    for (let i = 0; i < sortedByLevelColumnHierarchy.length; i++) {
      const hierarchy: IColumnHierarchy = sortedByLevelColumnHierarchy[i];
      if (hierarchy.level !== baseLevel) {
        break;
      }
      if (!(hierarchy.element as any).hideColumnIf.tablejsHideColumnIf) {
        lowestLevelColHierarchiesVisible.push(hierarchy);
      }
    }

    return lowestLevelColHierarchiesVisible;
  }

  public allColumnsShareTheSameAncestor(commonAncestor: IColumnHierarchy, columnHierarchies: IColumnHierarchy[], flattenedColumnHierarchy: IColumnHierarchy[]): boolean {

    const hierarchiesWithCommonAncestor: IColumnHierarchy[] = [];
    for (let i = 0; i < columnHierarchies.length; i++) {
      const currentColumnHierarchy: IColumnHierarchy = columnHierarchies[i];
      let parentColumnHierarchy: IColumnHierarchy | null = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
        return hierarchy.element === currentColumnHierarchy.parentColumn;
      })[0];

      while (parentColumnHierarchy) {
        if (parentColumnHierarchy === commonAncestor) {
          hierarchiesWithCommonAncestor.push(currentColumnHierarchy);
          break;
        }

        const columnHierarchy: IColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
          return hierarchy.element === parentColumnHierarchy!.element;
        })[0];
        
        parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
          return hierarchy.element === columnHierarchy.parentColumn;
        })[0];
      }
    }
    return columnHierarchies.length === hierarchiesWithCommonAncestor.length;
  }

  public hideAllOffspring(columnHierarchy: IColumnHierarchy): void {
    for (let i = 0; i < columnHierarchy.subColumns.length; i++) {
      const child: any = this.gridDirective!.getRelatedHeader(columnHierarchy.subColumns[i].element);
      child.hideColumnIf.changeTriggeredBy = columnHierarchy;
      child.hideColumnIf.tablejsHideColumnIf = true;
    }
  }

  public showAllOffspring(columnHierarchy: IColumnHierarchy): void {
    for (let i = 0; i < columnHierarchy.subColumns.length; i++) {
      const child: any = this.gridDirective!.getRelatedHeader(columnHierarchy.subColumns[i].element);
      child.hideColumnIf.changeTriggeredBy = columnHierarchy;
      child.hideColumnIf.tablejsHideColumnIf = false;
      child.hideColumnIf.canHide = true;
    }
  }

  public allSiblingsAreHidden(columnHierarchy: IColumnHierarchy, flattenedColumnHierarchy: IColumnHierarchy[]): boolean {
    let parentColumnHierarchy: IColumnHierarchy | null = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
      return hierarchy.element === columnHierarchy.parentColumn;
    })[0];

    let hiddenSiblingCount: number = 0;
    let totalSiblings: number;

    if (parentColumnHierarchy) {
      totalSiblings = parentColumnHierarchy.subColumns.length;
      parentColumnHierarchy.subColumns.forEach((subColumn: IColumnHierarchy) => {
        if (this.gridDirective!.getRelatedHeader(subColumn.element).hideColumnIf.tablejsHideColumnIf) {
          hiddenSiblingCount++;
        }
      });
    } else {
      const topLevelSiblings: IColumnHierarchy[] = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
        return hierarchy.level === 0;
      });
      totalSiblings = topLevelSiblings.length;
      for (let i = 0; i < topLevelSiblings.length; i++) {
        const topLevelSibling: IColumnHierarchy = topLevelSiblings[i];
        if (this.gridDirective!.getRelatedHeader(topLevelSibling.element).hideColumnIf.tablejsHideColumnIf) {
          hiddenSiblingCount++;
        }
      }
    }
    return hiddenSiblingCount === totalSiblings;
  }

  public setAllAncestors(currentColumnHierarchy: IColumnHierarchy, flattenedColumnHierarchy: IColumnHierarchy[], hidden: boolean): void {
    let parentColumnHierarchy: IColumnHierarchy | null = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
      return hierarchy.element === currentColumnHierarchy.parentColumn;
    })[0];

    const allSiblingsHidden: boolean = this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy);
    let parentSiblingsAreAllHidden: boolean = hidden ? allSiblingsHidden : true;

    while (parentColumnHierarchy && parentSiblingsAreAllHidden) {
      const parentElement: any = parentColumnHierarchy.element as any;

      parentElement.hideColumnIf.changeTriggeredBy = currentColumnHierarchy;
      parentElement.hideColumnIf.showOffspringLimited = true;
      parentElement.hideColumnIf.tablejsHideColumnIf = hidden;
      parentElement.hideColumnIf.canHide = true;
      

      const columnHierarchy: IColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
        return hierarchy.element === parentColumnHierarchy!.element;
      })[0];
      
      parentColumnHierarchy = flattenedColumnHierarchy.filter((hierarchy: IColumnHierarchy) => {
        return hierarchy.element === columnHierarchy.parentColumn;
      })[0];    
    }
  }

  constructor(public elementRef: ElementRef, public gridService: GridService) { 
   this.elementRef.nativeElement.hideColumnIf = this;
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.hideColumnIf = null;
  }

}
