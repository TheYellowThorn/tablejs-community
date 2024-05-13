import { ElementRef } from '@angular/core';

export abstract class MyAbstractComponent {

  public elementRef: ElementRef;

  public getRef() {
    return this.elementRef ? this.elementRef : null;
  }
  // some public methods that should be available in directive
}
