import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ElementRef, OnInit } from '@angular/core';
import { HorizResizeGripComponent } from './horiz-resize-grip.component';

export class MockElementRef extends ElementRef {
  nativeElement: any | undefined = {
    children: null,
    innerText: '',
    contains: () => false,
    appendChild: (child: Node) => true,
    removeChild: (child: Node) => true,
    classList: {
      add: (item: string) => true
    },
    gridDirective: null,
    directive: null,
    getElementsByClassName: (cls: string) => [''],
    reordering: false,
    parentElement: {
      dispatchEvent: (event: any) => true
    },
    querySelector: (str: string) => true
  };
}

describe('HorizResizeGripComponent', () => {
  let component: HorizResizeGripComponent;
  let fixture: ComponentFixture<HorizResizeGripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizResizeGripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizResizeGripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
