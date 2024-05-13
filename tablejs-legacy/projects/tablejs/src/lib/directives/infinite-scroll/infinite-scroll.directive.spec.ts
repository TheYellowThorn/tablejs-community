import { InfiniteScrollDirective } from './infinite-scroll.directive';
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
  template: '<div tablejsInfiniteScroll></div>'
})
export class HostComponent {

}

describe('InfiniteScrollDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: InfiniteScrollDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [InfiniteScrollDirective, HostComponent],
      providers: [
        GridService,
        InfiniteScrollDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(InfiniteScrollDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(InfiniteScrollDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(hostComponent).toBeTruthy();
    expect(hostElements[0]).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('should call registerColumnOnGridDirective()', () => {
      const spy = spyOn(directive, 'registerColumnOnGridDirective');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('registerColumnOnGridDirective()', () => {
    it('should call addInfiniteScrollViewport with native element', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addInfiniteScrollViewport: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => hostElements[0].nativeElement;
      const spy = spyOn(hostElement.gridDirective, 'addInfiniteScrollViewport');
      directive.registerColumnOnGridDirective();
      expect(spy).toHaveBeenCalledWith(directive.elementRef.nativeElement);
    });
    it('should not call addInfiniteScrollViewport if element is null', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addInfiniteScrollViewport: (el: HTMLElement) => null
      };
      gridService.getParentTablejsGridDirective = (el) => null;
      const spy = spyOn(hostElement.gridDirective, 'addInfiniteScrollViewport');
      directive.registerColumnOnGridDirective();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
