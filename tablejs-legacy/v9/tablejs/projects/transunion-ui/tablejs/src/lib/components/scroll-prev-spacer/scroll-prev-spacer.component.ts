import { Component, ElementRef,OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'tablejs-scroll-prev-spacer',
  templateUrl: './scroll-prev-spacer.component.html',
  styleUrls: ['./scroll-prev-spacer.component.scss']
})
export class ScrollPrevSpacerComponent implements OnInit {

  @ViewChild('template', {static: true}) public template: any;
  constructor(public elementRef: ElementRef) { }

  ngOnInit(): void {
  }

}
