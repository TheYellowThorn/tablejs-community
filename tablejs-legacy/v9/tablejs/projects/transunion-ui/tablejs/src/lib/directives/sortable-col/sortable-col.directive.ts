import { Directive } from '@angular/core';

@Directive({
  selector: '[tablejsSortableCol]',
  host: { class: 'tablejs-sortable' }
})
export class SortableColDirective {

  constructor() { }

}
