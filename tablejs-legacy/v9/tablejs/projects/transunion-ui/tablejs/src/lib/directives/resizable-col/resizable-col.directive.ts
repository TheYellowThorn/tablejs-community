import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[tablejsResizableCol], [tablejsresizablecol], [tablejs-resizable-col]',
  host: { class: 'tablejs-resizable-col' }
})
export class ResizableColDirective implements AfterViewInit {

  constructor(public elementRef: ElementRef, public gridService: GridService) { }

  ngAfterViewInit() {
    this.registerColumnOnGridDirective();
  }

  registerColumnOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null) {
      el['gridDirective'].addResizableColumn(this.elementRef.nativeElement);
    }
  }

}
