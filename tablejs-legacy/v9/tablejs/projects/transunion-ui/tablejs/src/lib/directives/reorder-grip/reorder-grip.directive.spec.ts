import { ReorderGripDirective } from './reorder-grip.directive';
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
  template: '<th reorderGrip></th>'
})
export class HostComponent {

}

describe('ReorderGripDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: ReorderGripDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [ReorderGripDirective, HostComponent],
      providers: [
        GridService,
        ReorderGripDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(ReorderGripDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(ReorderGripDirective);
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
    it('should call addReorderGrip with native element', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addReorderGrip: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => hostElements[0].nativeElement;
      const spy = spyOn(hostElement.gridDirective, 'addReorderGrip');
      directive.registerGripOnGridDirective();
      expect(spy).toHaveBeenCalledWith(directive.elementRef.nativeElement);
    });
    it('should not call addReorderGrip if element is null', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addReorderGrip: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => null;
      const spy = spyOn(hostElement.gridDirective, 'addReorderGrip');
      directive.registerGripOnGridDirective();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
