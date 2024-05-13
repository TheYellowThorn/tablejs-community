import { GridRowDirective } from './grid-row.directive';
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
  template: '<div tablejsGridRow></div>'
})
export class HostComponent {

}

describe('GridRowDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: GridRowDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [GridRowDirective, HostComponent],
      providers: [
        GridService,
        GridRowDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(GridRowDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(GridRowDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(hostComponent).toBeTruthy();
    expect(hostElements[0]).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('should call registerRowsOnGridDirective()', () => {
      const spy = spyOn(directive, 'registerRowsOnGridDirective');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('registerRowsOnGridDirective()', () => {
    it('should call addRow with native element', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addRow: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => hostElements[0].nativeElement;
      const spy = spyOn(hostElement.gridDirective, 'addRow');
      directive.registerRowsOnGridDirective();
      expect(spy).toHaveBeenCalledWith(directive.elementRef.nativeElement);
    });
    it('should not call addRow if element is null', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addRow: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => null;
      const spy = spyOn(hostElement.gridDirective, 'addRow');
      directive.registerRowsOnGridDirective();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
