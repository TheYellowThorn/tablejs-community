import { ScrollViewportDirective } from './scroll-viewport.directive';
import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { AfterViewInit, ChangeDetectorRef, ComponentFactory, ComponentRef, ElementRef, EmbeddedViewRef, Injectable, Injector, NgModuleRef, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { DOCUMENT } from '@angular/common';
import { DirectiveRegistrationService } from './../../services/directive-registration/directive-registration.service';
import { ScrollDispatcherService } from './../../services/scroll-dispatcher/scroll-dispatcher.service';
import { OperatingSystemService } from './../../services/operating-system/operating-system.service';

@Injectable()
export class MockElementRef extends ElementRef {
    constructor() {
      super( { 
        removeEventListener: (listener) => {},
        scrollViewportDirective: ''
      } );
    }

}

class MockViewContainerRef {
  get element(): ElementRef<any> | null {
    return null;
  }
  get injector(): Injector | null {
    return null;
  }
  get parentInjector(): Injector | null {
    return null;
  }
  clear(): void {

  }
  get(index: number): ViewRef | null {
    return null;
  }
  get length(): number | null {
    return null;
  }
  createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C, index?: number): EmbeddedViewRef<C> | null {
    return null;
  }
  createComponent<C>(componentFactory: ComponentFactory<C>, index?: number, injector?: Injector, projectableNodes?: any[][], ngModule?: NgModuleRef<any>): ComponentRef<C> | null {
    return null;
  }
  insert(viewRef: ViewRef, index?: number): ViewRef | null {
    return null;
  }
  move(viewRef: ViewRef, currentIndex: number): ViewRef | null {
    return null;
  }
  indexOf(viewRef: ViewRef): number | null {
    return null;
  }
  remove(index?: number): void | null {
    return null;
  }
  detach(index?: number): ViewRef | null {
    return null;
  }

}

class MockDocument {
  querySelectorAll(a: any): any[] {
    return [];
  }
}

describe('ScrollViewportDirective', () => {
  let elementRef: MockElementRef;
  let directive: ScrollViewportDirective;
  let gridService: GridService;
  let directiveRegistrationService: DirectiveRegistrationService;
  let scrollDispatcherService: ScrollDispatcherService;
  let operatingSystem: OperatingSystemService;

  beforeEach(waitForAsync(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [ ScrollViewportDirective ],
      providers: [
        { provide: DOCUMENT, useClass: MockDocument },
        MockElementRef,
        ChangeDetectorRef,
        { provide: ElementRef, useClass: MockElementRef },
        GridService,
        { provide: ViewContainerRef, useClass: MockViewContainerRef },
        DirectiveRegistrationService,
        ScrollDispatcherService,
        OperatingSystemService,
        ScrollViewportDirective
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    elementRef = TestBed.inject(MockElementRef);
    gridService = TestBed.inject(GridService);
    directiveRegistrationService = TestBed.inject(DirectiveRegistrationService);
    scrollDispatcherService = TestBed.inject(ScrollDispatcherService);
    operatingSystem = TestBed.inject(OperatingSystemService);
    directive = TestBed.inject(ScrollViewportDirective);
  });

  it('should create an instance', () => {
    expect(gridService).toBeTruthy();
  });
});
