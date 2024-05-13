import { AfterViewInit, Directive, ElementRef, Input, TemplateRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[reorderCol], [reordercol]'
})
export class ReorderColDirective implements AfterViewInit {

  @Input() public reorderGhost: TemplateRef<any>;
  @Input() public reorderGhostContext: Object|null = null;

  constructor(public elementRef: ElementRef, public gridService: GridService) {
  }

  ngAfterViewInit() {
    this.registerColumnOnGridDirective();
  }

  registerColumnOnGridDirective() {
    const el: HTMLElement | any | null = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
    if (el !== null) {
      this.elementRef.nativeElement.reorderGhost = this.reorderGhost;
      this.elementRef.nativeElement.reorderGhostContext = this.reorderGhostContext;
      el['gridDirective'].addReorderableColumn(this.elementRef.nativeElement);
    }
  }

}
