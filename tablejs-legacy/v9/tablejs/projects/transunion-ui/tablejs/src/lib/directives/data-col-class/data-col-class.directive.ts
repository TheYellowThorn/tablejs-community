import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]'
})
export class DataColClassDirective implements AfterViewInit {

  @Input() tablejsDataColClass: string | undefined | null = '';
  @Input() initialWidth: string | undefined | null;

  constructor(public elementRef: ElementRef, public gridService: GridService) { }

  ngAfterViewInit() {
    if (this.tablejsDataColClass !== '') {
      this.elementRef.nativeElement.classList.add(this.tablejsDataColClass);
      this.elementRef.nativeElement.setAttribute(
        'tablejsDataColClass',
        this.tablejsDataColClass
      );
      if (this.initialWidth) {
        this.elementRef.nativeElement.setAttribute(
          'initialWidth',
          this.initialWidth
        );
      }
    } else {
      throw Error('A class name must be supplied to the tablejsDataColClass directive.');
    }
    setTimeout(() => {
      this.registerInitialColumnWidthOnOnGridDirective();
    }, 1);
  }

  registerInitialColumnWidthOnOnGridDirective() {
    if (this.initialWidth === undefined) {
      this.gridService.triggerHasInitialWidths(false);
      console.log('[Performance Alert] Add an initialWidth value on the tablejsDataColClass directive for a significant performance boost.');
      return;
    }

    this.gridService.triggerHasInitialWidths(true);
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null) {
      el['gridDirective'].initialWidths[this.tablejsDataColClass!] = this.initialWidth;
    }
  }
}
