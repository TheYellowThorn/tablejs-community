import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[tablejsResizableGrip], [resizableGrip], [resizablegrip]'
})
export class ResizableGripDirective implements AfterViewInit {

  constructor(public elementRef: ElementRef, public gridService: GridService) {
  }

  ngAfterViewInit() {
    this.registerGripOnGridDirective();
  }

  registerGripOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null && el['gridDirective']) {
      el['gridDirective'].addResizableGrip(this.elementRef.nativeElement);
    }
  }

}
