import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]'
})
export class DataColClassDirective implements AfterViewInit, OnDestroy {

  @Input() tablejsDataColClass: string | undefined | null = '';
  @Input() initialWidth: string | undefined | null;

  public timeoutID: any;

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
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      this.registerInitialColumnWidthOnGridDirective();
    }, 1);
  }

  registerInitialColumnWidthOnGridDirective() {
    if (this.initialWidth === undefined) {
      this.gridService.triggerHasInitialWidths(false);
      console.log('[Performance Alert] Add an initialWidth value on the tablejsDataColClass directive for a significant performance boost.');
      return;
    }

    this.gridService.triggerHasInitialWidths(true);
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null && el['gridDirective']) {
      el['gridDirective'].initialWidths[this.tablejsDataColClass!] = this.initialWidth;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutID);
  }
}
