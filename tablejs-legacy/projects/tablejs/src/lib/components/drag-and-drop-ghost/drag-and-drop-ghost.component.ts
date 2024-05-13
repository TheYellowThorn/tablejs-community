import { AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tablejs-drag-and-drop-ghost',
  templateUrl: './drag-and-drop-ghost.component.html',
  styleUrls: ['./drag-and-drop-ghost.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'drag-and-drop-ghost' }
})
export class DragAndDropGhostComponent implements AfterViewInit {

  @ViewChild('ref', {read: ViewContainerRef}) public ref: any;
  public left: number = 0;
  public top: number = 0;
  private _templateToLoad: TemplateRef<any>;
  private _contextToLoad: object | null = null;

  constructor(public viewContainerRef: ViewContainerRef, public cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.ref.clear();
    if (this._templateToLoad) {
      this.ref.createEmbeddedView(this._templateToLoad, this._contextToLoad);
      this.cdr.detectChanges();
    }
  }

  public updateView(template: TemplateRef<any>, context: object | null = null): void {
    this._templateToLoad = template;
    this._contextToLoad = context;
  }

  getTransform(): string {
    return 'translate(' + this.left + 'px, ' + this.top + 'px';
  }

}
