import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'tablejs-scroll-prev-spacer',
  templateUrl: './scroll-prev-spacer.component.html',
  styleUrls: ['./scroll-prev-spacer.component.scss']
})
export class ScrollPrevSpacerComponent implements OnDestroy {

  @ViewChild('template', {static: true}) public template: any;
  constructor(public elementRef: ElementRef) { }

  ngOnDestroy(): void {
    this.template = null;
  }

}
