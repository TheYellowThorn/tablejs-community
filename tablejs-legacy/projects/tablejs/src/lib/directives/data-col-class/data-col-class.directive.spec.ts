import { DataColClassDirective } from './data-col-class.directive';
import { ComponentFixture, TestBed, tick, inject, fakeAsync } from '@angular/core/testing';
import { AfterViewInit, Component, DebugElement, Directive, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { By } from '@angular/platform-browser';

export class MockElementRef extends ElementRef {

  nativeElement: any = {
    classList: {
      add: (item: string) => true
    },
    setAttribute: (att: any) => null
  };

  constructor() {
    super(
      {
        classList: {
          add: (item: string) => true
        },
        setAttribute: (att: any) => null
      }
    );
  }
}

@Component({
  selector: 'tablejs-app',
  template: '<div tablejsDataColClass="foo" initialWidth="500"></div>'
})
export class HostComponent {

}

describe('DataColClassDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: DataColClassDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [HostComponent, DataColClassDirective],
      providers: [
        GridService,
        DataColClassDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    }).createComponent(HostComponent);

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(DataColClassDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(DataColClassDirective);
    
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(hostComponent).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('should add the class injected via the tablejsDataColClass input', () => {
      const hostElement = hostElements[0].nativeElement;
      expect(hostElement.classList).toContain('foo');
    });
    it('should add the tablejsDataColClass attribute with the supplied class', () => {
      const hostElement = hostElements[0].nativeElement;
      expect(hostElement.getAttribute('tablejsDataColClass')).toBe('foo');
    });
    it('should add the initialWidth attribute with the supplied initialWidth', () => {
      const hostElement = hostElements[0].nativeElement;
      expect(hostElement.getAttribute('initialWidth')).toBe('500');
    });
    it('should register initialWidth', fakeAsync(() => {
      directive.tablejsDataColClass = 'foo';
      const spy = spyOn(directive, 'registerInitialColumnWidthOnGridDirective');
      directive.ngAfterViewInit();
      tick(20);
      expect(spy).toHaveBeenCalled();
    }));
    it('should throw error if no class is supplied', () => {
      directive.tablejsDataColClass = '';
      expect(() => { directive.ngAfterViewInit() }).toThrowError('A class name must be supplied to the tablejsDataColClass directive.');
    });
  });

  describe('registerInitialColumnWidthOnGridDirective()', () => {
    describe('initialWidth is undefined', () => {
      it('should call triggerHasInitialWidths with false', () => {
        console.log = (str) => true;
        const spy = spyOn(directive.gridService, 'triggerHasInitialWidths').and.callThrough();
        directive.initialWidth = undefined;
        directive.registerInitialColumnWidthOnGridDirective();
        expect(spy).toHaveBeenCalledWith(false);
      });
      it('should log performance alert', () => {
        console.log = (str) => true;
        const spy = spyOn(console, 'log').and.callThrough();
        directive.initialWidth = undefined;
        directive.registerInitialColumnWidthOnGridDirective();
        expect(spy).toHaveBeenCalledWith('[Performance Alert] Add an initialWidth value on the tablejsDataColClass directive for a significant performance boost.');
      });
    });
    describe('initialWidth is defined', () => {
      it('should call triggerHasInitialWidths with true', () => {
        const hostElement = hostElements[0].nativeElement;
        hostElement.gridDirective = {
          initialWidths: {
          }
        }
        gridService.getParentTablejsGridDirective = (el) => hostElement;

        directive.initialWidth = '50';
        const spy = spyOn(directive.gridService, 'triggerHasInitialWidths').and.callThrough();
        directive.registerInitialColumnWidthOnGridDirective();
        expect(spy).toHaveBeenCalledWith(true);
      });
      it('should set initial widths on the gridDirective', () => {
        directive.tablejsDataColClass = 'foo';
        const hostElement = hostElements[0].nativeElement;
        hostElement.gridDirective = {
          initialWidths: {
          }
        }
        gridService.getParentTablejsGridDirective = (el) => hostElements[0].nativeElement;

        directive.initialWidth = '50';
        directive.registerInitialColumnWidthOnGridDirective();
        expect(hostElement.gridDirective.initialWidths.foo).toBe('50');
      });
      it('should not set initial widths on the gridDirective', () => {
        directive.tablejsDataColClass = 'foo';
        const hostElement = hostElements[0].nativeElement;
        hostElement.gridDirective = {
          initialWidths: {
          }
        }
        gridService.getParentTablejsGridDirective = (el) => null;

        directive.initialWidth = '50';
        directive.registerInitialColumnWidthOnGridDirective();
        expect(hostElement.gridDirective.initialWidths.foo).toBe(undefined);
      });
    });
    
  });
});
