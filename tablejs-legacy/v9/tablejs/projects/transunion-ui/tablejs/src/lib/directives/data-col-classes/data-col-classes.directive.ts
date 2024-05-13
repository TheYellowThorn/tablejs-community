import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]'
})
export class DataColClassesDirective implements AfterViewInit {

  @Input() tablejsDataColClasses: string = '';

  constructor(public elementRef: ElementRef, public gridService: GridService) { }

  ngAfterViewInit() {
    this.cacheClassesOnElement();
    this.registerColumnsWithDataClassesOnGridDirective();
  }

  cacheClassesOnElement() {
    if (this.tablejsDataColClasses) {
      this.elementRef.nativeElement.setAttribute(
        'tablejsDataColClasses',
        this.tablejsDataColClasses
      );
    }
    this.elementRef.nativeElement.dataClasses = this.elementRef.nativeElement.getAttribute('tablejsDataColClasses').replace(new RegExp(' ', 'g'), '').split(',');
  }

  registerColumnsWithDataClassesOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null) {
      el['gridDirective'].addColumnsWithDataClasses(this.elementRef.nativeElement);
    }
  }

}
