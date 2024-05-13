import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tablejs-horiz-resize-grip',
  templateUrl: './horiz-resize-grip.component.html',
  styleUrls: ['./horiz-resize-grip.component.scss'],
  host: { class: 'resize-grip' },
  encapsulation: ViewEncapsulation.None
})
export class HorizResizeGripComponent {

  constructor() { }

}
