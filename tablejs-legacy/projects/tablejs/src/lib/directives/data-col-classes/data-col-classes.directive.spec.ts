import { DataColClassesDirective } from './data-col-classes.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { By } from '@angular/platform-browser';

export class MockElementRef extends ElementRef {

  nativeElement: any | undefined = {
    dataClasses: null,
    getAttribute: (str: string) => this.attr,
    setAttribute: (att: string, str: string) => this.attr = str
  };
  attr: string | null = null;

  constructor() {
    super(
      {
        dataClasses: null,
        getAttribute: (str: string) => this.attr,
        setAttribute: (att: string, str: string) => this.attr = str
      }
    );
  }
}

@Component({
  selector: 'tablejs-app',
  template: '<div tablejsDataColClasses="foo foo2"></div>'
})
export class HostComponent {

}

describe('DataColClassesDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: DataColClassesDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
      // Set up test service before each test
      TestBed.configureTestingModule({
        declarations: [HostComponent, DataColClassesDirective],
        providers: [
          GridService,
          DataColClassesDirective,
          { provide: ElementRef, useClass: MockElementRef }
        ]
      });
      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      hostComponent = fixture.componentInstance;

      hostElements = fixture.debugElement.queryAll(By.directive(DataColClassesDirective));

      gridService = TestBed.inject(GridService);
      directive = fixture.debugElement.injector.get(DataColClassesDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('should call cacheClassessOnElement() and registerColumnsWithDataClassesOnGridDirective()', () => {
      const cacheSpy = spyOn(directive, 'cacheClassesOnElement');
      const registerSpy = spyOn(directive, 'registerColumnsWithDataClassesOnGridDirective');
      directive.ngAfterViewInit();
      expect(cacheSpy).toHaveBeenCalledWith();
      expect(registerSpy).toHaveBeenCalledWith();
    });
  });

  describe('cacheClassesOnElement()', () => {
    it('should set tablejsDataColClasses attribute on element', () => {
      const hostElement = hostElements[0].nativeElement;
      directive.elementRef.nativeElement.setAttribute('tablejsDataColClasses', 'foo foo2');
      directive.cacheClassesOnElement();
      expect(hostElement.getAttribute('tablejsDataColClasses')).toBe('foo foo2');
    });
    it('should set parse the tablejsDataColClasses string into an array', () => {
      const hostElement = hostElements[0].nativeElement;
      directive.elementRef.nativeElement.setAttribute('tablejsDataColClasses', 'foo foo2');
      directive.cacheClassesOnElement();
      expect(directive.elementRef.nativeElement.getAttribute('tablejsDataColClasses')).toBe('foo foo2');
    });
  });

  describe('registerColumnsWithDataClassesOnGridDirective()', () => {
    it('should call gridService.addColumnsWithDataClasses()', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addColumnsWithDataClasses: (el: any) => null
      };
      const spy = spyOn(hostElement.gridDirective, 'addColumnsWithDataClasses');
      gridService.getParentTablejsGridDirective = (el) => hostElement;
      directive.registerColumnsWithDataClassesOnGridDirective();
      expect(spy).toHaveBeenCalledWith(directive.elementRef.nativeElement);

    });
    it('should not call gridService.addColumnsWithDataClasses()', () => {
      const hostElement = hostElements[0].nativeElement;
      hostElement.gridDirective = {
        addColumnsWithDataClasses: (el: any) => null
      };
      const spy = spyOn(hostElement.gridDirective, 'addColumnsWithDataClasses');
      gridService.getParentTablejsGridDirective = (el) => null;
      directive.registerColumnsWithDataClassesOnGridDirective();
      expect(spy).not.toHaveBeenCalled();

    });
  });
});
