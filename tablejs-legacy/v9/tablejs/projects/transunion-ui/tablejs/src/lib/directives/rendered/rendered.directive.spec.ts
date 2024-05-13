import { RenderedDirective } from './rendered.directive';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AfterViewInit, Component, DebugElement, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'tablejs-app',
  template: '<div tablejsRendered></div>'
})
export class HostComponent {

}

describe('RenderedDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: RenderedDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [RenderedDirective, HostComponent],
      providers: [
        GridService,
        RenderedDirective
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(RenderedDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(RenderedDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(hostComponent).toBeTruthy();
    expect(hostElements[0]).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('should call requestAnimationFrame', () => {
      const spy = spyOn(window, 'requestAnimationFrame');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('onEnterFrame()', () => {
    it('should have tablejsRendered emit', () => {
      const spy = spyOn(directive.tablejsRendered, 'emit');
      directive.onEnterFrame(directive, 0);
      expect(spy).toHaveBeenCalled();
    });
  });
});
