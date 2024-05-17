import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[reorderCol], [reordercol]'
})
export class ReorderColDirective implements AfterViewInit {

  constructor(public elementRef: ElementRef, public gridService: GridService) {
  }

  ngAfterViewInit() {
    this.registerColumnOnGridDirective();
  }

  registerColumnOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null) {
      el['gridDirective'].addReorderableColumn(this.elementRef.nativeElement);
    }
  }

}
