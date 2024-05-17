import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]',
  host: { class: 'reorderable-table-row' }
})

export class GridRowDirective implements AfterViewInit {

  constructor(public elementRef: ElementRef, public gridService: GridService) {
  }

  ngAfterViewInit() {
    this.registerRowsOnGridDirective();
  }

  registerRowsOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null && el['gridDirective']) {
      el['gridDirective'].addRow(this.elementRef.nativeElement);
    }
  }

}
