import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tablejs-reorder-grip',
  templateUrl: './reorder-grip.component.html',
  styleUrls: ['./reorder-grip.component.scss'],
  host: { class: 'col-dots-container' },
  encapsulation: ViewEncapsulation.None
})
export class ReorderGripComponent {

  constructor() { }

}
