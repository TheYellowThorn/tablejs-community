import { AfterViewInit, Directive, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[tablejsRendered]'
})
export class RenderedDirective implements AfterViewInit {

  constructor() { }

  @Output() tablejsRendered: EventEmitter<any> = new EventEmitter();

   ngAfterViewInit() {
    window.requestAnimationFrame((timestamp) => {
      this.onEnterFrame(this, timestamp);
    });
  }

   onEnterFrame(directive: RenderedDirective, timestamp: number) {
    this.tablejsRendered.emit();
   }

}
