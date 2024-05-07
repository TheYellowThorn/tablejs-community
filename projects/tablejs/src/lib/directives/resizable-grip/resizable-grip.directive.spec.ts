import { ResizableGripDirective } from './resizable-grip.directive';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AfterViewInit, Component, DebugElement, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { By } from '@angular/platform-browser';

export class MockElementRef extends ElementRef {
  constructor() {
    super({});
  }
}

@Component({
  selector: 'tablejs-app',
  template: '<th resizableGrip></th>'
})
export class HostComponent {

}

describe('ResizableGripDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: ResizableGripDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [ResizableGripDirective, HostComponent],
      providers: [
        GridService,
        ResizableGripDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(ResizableGripDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(ResizableGripDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(hostComponent).toBeTruthy();
    expect(hostElements[0]).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('should call registerGripOnGridDirective()', () => {
      const spy = spyOn(directive, 'registerGripOnGridDirective');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('registerGripOnGridDirective()', () => {
    it('should call addResizableGrip with native element', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addResizableGrip: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => hostElements[0].nativeElement;
      const spy = spyOn(hostElement.gridDirective, 'addResizableGrip');
      directive.registerGripOnGridDirective();
      expect(spy).toHaveBeenCalledWith(directive.elementRef.nativeElement);
    });
    it('should not call addResizableGrip if element is null', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addResizableGrip: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => null;
      const spy = spyOn(hostElement.gridDirective, 'addResizableGrip');
      directive.registerGripOnGridDirective();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
