import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: `[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],
  [tablejsViewport], [tablejsviewport], [tablejs-viewport]`,
  host: { class: 'tablejs-infinite-scroll-viewport tablejs-table-width' }
})
export class InfiniteScrollDirective implements AfterViewInit {

  constructor(public elementRef: ElementRef, public gridService: GridService) {
  }

  ngAfterViewInit() {
    this.registerColumnOnGridDirective();
  }

  registerColumnOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null && el['gridDirective']) {
      el['gridDirective'].addInfiniteScrollViewport(this.elementRef.nativeElement);
    }
  }

}
