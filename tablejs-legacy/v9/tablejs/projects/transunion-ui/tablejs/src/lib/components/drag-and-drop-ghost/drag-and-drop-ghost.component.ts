import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tablejs-drag-and-drop-ghost',
  templateUrl: './drag-and-drop-ghost.component.html',
  styleUrls: ['./drag-and-drop-ghost.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'drag-and-drop-ghost' }
})
export class DragAndDropGhostComponent {

  html: string = '';
  show: boolean = false;
  left = 0;
  top = 0;

  constructor() { }

  getTransform(): string {
    return 'translate(' + this.left + 'px, ' + this.top + 'px';
  }

}
