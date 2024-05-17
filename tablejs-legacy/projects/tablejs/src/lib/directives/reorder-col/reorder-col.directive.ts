import { AfterViewInit, Directive, ElementRef, Input, TemplateRef, OnDestroy } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';

@Directive({
  selector: '[reorderCol], [reordercol]'
})
export class ReorderColDirective implements AfterViewInit, OnDestroy {

  @Input() public reorderGhost: TemplateRef<any> | null = null;
  @Input() public reorderGhostContext: Object | null = null;

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

  ngOnDestroy(): void {
    this.elementRef.nativeElement.reorderGhost = null;
    this.elementRef.nativeElement.reorderGhostContext = null;
    this.reorderGhost = null;
    this.reorderGhostContext = null;
  }

}
