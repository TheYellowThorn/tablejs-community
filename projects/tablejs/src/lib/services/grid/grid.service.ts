import { Injectable } from '@angular/core';
import { IColumnData } from './../../shared/interfaces/i-column-data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  public linkedDirectiveObjs: any = {};
  public containsInitialWidthSettings: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);

  constructor() { }

  getParentTablejsGridDirective(el: HTMLElement | null): HTMLElement | null {
    while (el !== null && el.getAttribute('tablejsGrid') === null) {
      el = el.parentElement;
    }
    return el;
  }

  triggerHasInitialWidths(hasWidths: boolean): void {
    this.containsInitialWidthSettings.next(hasWidths);
  }
}

interface ILinkedGrid {
  classWidths: number[];
  stylesByClass: any[];
  widthStyle: HTMLStyleElement;
  widthStyleFragment: DocumentFragment;
  reorderHighlightStyle: HTMLStyleElement;
  reorderHighlightStyleFragment: DocumentFragment;
  subGroupStyles: HTMLStyleElement[];
  subGroupFragments: DocumentFragment[];
  subGroupStyleObjs: any;
  gridOrder: number[];
  gridOrderStyles: HTMLStyleElement[];
  gridOrderFragments: DocumentFragment[];
  colDataGroups: IColumnData[][];
}
