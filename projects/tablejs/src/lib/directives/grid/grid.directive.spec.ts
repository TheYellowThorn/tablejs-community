import { GridDirective } from './grid.directive';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, EmbeddedViewRef, Injector, Input, IterableDiffers, NgModuleRef, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { GridService } from './../../services/grid/grid.service';
import { ScrollDispatcherService } from './../../services/scroll-dispatcher/scroll-dispatcher.service';
import { By } from '@angular/platform-browser';
import { ScrollViewportDirective } from './../../directives/scroll-viewport/scroll-viewport.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { DirectiveRegistrationService } from '../../services/directive-registration/directive-registration.service';
import { TablejsForOfContext, VirtualForDirective } from '../virtual-for/virtual-for.directive';


@Component({
  template: `
  <div>
  <div tablejsGrid>
    <table tablejsScrollViewport>
      <thead>
        <tr tablejsGridRow>
          <th tablejsDataColClasses="name">
            <div>Name</div>
          </th>
          <th tablejsDataColClasses="item">
            <div>Purchase</div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr tablejsGridRow>
          <td>
            <div tablejsDataColClass="name" initialWidth="30%">Name</div>
          </td>
          <td>
            <div tablejsDataColClass="item" initialWidth="70%">Item</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
  `
})
class HostComponent {
  @Input() gridDirective: GridDirective;

  constructor() { }
}

const dummyElement = document.createElement('div');

export class MockElementRef extends ElementRef {

  override nativeElement: HTMLElement = dummyElement;
  constructor() {
    super(dummyElement);
  }
}

export class MockScrollViewportDirective extends ScrollViewportDirective {
  override registerCustomElementsInputs: (viewport) => true;
  override ngOnInit: () => true;
  override ngAfterViewInit =  () => {
    return true;
  };
}

export class MockVirtualForDirective extends VirtualForDirective<any, any> {
  constructor(public override _viewContainer: ViewContainerRef,
    public override _template: TemplateRef<TablejsForOfContext<any, any>>,
    _differs: IterableDiffers,
    elementRef: ElementRef,
    directiveRegistrationService: DirectiveRegistrationService) {
    super(_viewContainer, _template, _differs, elementRef, directiveRegistrationService);
  }
}

export interface Type<T> extends Function {
  new(...args: any[]): T;
}

export abstract class MockViewContainerRef {

  get element(): ElementRef<any> {
    return new MockElementRef();
  }
  get injector(): Injector {
    throw new Error('Method not implemented.');
  }
  get parentInjector(): Injector {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  get(index: number): ViewRef {
    throw new Error('Method not implemented.');
  }
  get length(): number {
    throw new Error('Method not implemented.');
  }
  createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C, index?: number): EmbeddedViewRef<C> | null {
    return null;
  }
  createComponent<C>(componentFactory: ComponentFactory<C>, index?: number, injector?: Injector, projectableNodes?: any[][], ngModule?: NgModuleRef<any>): ComponentRef<C> | null {
    return null;
  }

  insert(viewRef: ViewRef, index?: number): ViewRef {
    throw new Error('Method not implemented.');
  }
  move(viewRef: ViewRef, currentIndex: number): ViewRef {
    throw new Error('Method not implemented.');
  }
  indexOf(viewRef: ViewRef): number {
    throw new Error('Method not implemented.');
  }
  remove(index?: number): void {
    throw new Error('Method not implemented.');
  }
  detach(index?: number): ViewRef {
    throw new Error('Method not implemented.');
  }

}

export class MockDocument {
  getElementsByTagName: () => any;
}

export class MockMutationObserver {
  observe = (el) => document.createElement('div');
}

const singleNode = ((nodeList) => (node) => {
  const layer = { // define our specific case
    0: { value: node, enumerable: true },
    length: { value: 1 },
    item: {
      value(i) {
        return this[+i || 0];
      }, 
      enumerable: true,
    },
  };
  return Object.create(nodeList, layer); // put our case on top of true NodeList
})(document.createDocumentFragment().childNodes); // scope a true NodeList

const getMutationObject = (type: string, addedNodes: any): any => {
  return { 
    type: type,
    addedNodes: addedNodes,
    attributeName: '',
    attributeNamespace: '',
    nextSibling: null,
    oldValue: null,
    previousSibling: null,
    removedNodes: null,
    target: null
  };
}

describe('GridDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let directive: GridDirective;
  let gridService: GridService;
  let virtualForDirective: VirtualForDirective<any, any>;
  let viewContainerRef: ViewContainerRef;
  let templateRef: TemplateRef<any>;
  let differs: IterableDiffers;
  let mockElementRef: MockElementRef;
  let directiveRegistrationService: DirectiveRegistrationService;
  let scrollViewportDirective: ScrollViewportDirective;
  const mockDocument = new MockDocument();

  beforeEach(waitForAsync(() => {
    // Set up test service before each test

    console.log = () => {};
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      declarations: [HostComponent, GridDirective],
      providers: [
        GridDirective,
        GridService,
        ComponentFactoryResolver,
        MockDocument,
        MockElementRef,
        TemplateRef,
        IterableDiffers,
        DirectiveRegistrationService,
        VirtualForDirective,
        { provide: document, useValue: mockDocument  },
        { provide: ElementRef, useClass: MockElementRef },
        { provide: ViewContainerRef, useClass: MockViewContainerRef },
        { provide: MutationObserver, useClass: MockMutationObserver },
        { provide: ScrollViewportDirective, useClass: MockScrollViewportDirective },
        ScrollDispatcherService
      ]
    });
  }));

  beforeEach(() => {
    gridService = TestBed.inject(GridService);
    viewContainerRef = TestBed.inject(ViewContainerRef);
    templateRef = TestBed.inject(TemplateRef);
    differs = TestBed.inject(IterableDiffers);
    mockElementRef = TestBed.inject(MockElementRef);
    directiveRegistrationService = TestBed.inject(DirectiveRegistrationService);
    
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    const directiveEl = fixture.debugElement.query(By.directive(GridDirective));
    directive = directiveEl.injector.get(GridDirective);

    scrollViewportDirective = new MockScrollViewportDirective(
      mockElementRef,
      directive['gridService'],
      directive['document'],
      directiveRegistrationService,
      directive['scrollDispatcherService'],
      directive['operatingSystem'],
      null,
      directive['rendererFactory']
    );
    directive.scrollViewportDirective = scrollViewportDirective;
    directive['elementRef'].nativeElement.scrollViewportDirective = scrollViewportDirective;

  });


  it('should create an instance', async () => {
    await fixture.whenStable();
    expect(directive).toBeTruthy();
  });

  describe('registerDirectiveToElement()', () => {
    it('should add grid directive to the nativeElement', async () => {
      await fixture.whenStable();
      await directive['registerDirectiveToElement']();
      expect(directive['elementRef'].nativeElement.gridDirective).toBe(directive);
    });
    it('should add the grid directive to the nativeElement\'s parent', async() => {
      await fixture.whenStable();
      await directive['registerDirectiveToElement']();
      expect(directive['elementRef'].nativeElement.parentElement.gridDirective).toBe(directive);
    });
  });

  describe('attachMutationObserver()', () => {
    it('should set the observer', async () => {
      await fixture.whenStable();
      await directive['attachMutationObserver']();
      expect(directive.observer).toBeTruthy();
    });
  });

  describe('updateMutations()', () => {
    it('should register node', () => {
      const spy = spyOn(directive['directiveRegistrationService'], 'registerNodeAttributes');
      const div = document.createElement('div');
      const mutation: MutationRecord = getMutationObject('childList', singleNode(div));
      directive['updateMutations'](mutation);
      expect(spy).toHaveBeenCalledWith(div);
    });
    it('should register the children of the node', () => {
      const spy = spyOn<any>(directive, 'getChildNodes').and.callThrough();
      const div = document.createElement('div');
      const mutation: MutationRecord = getMutationObject('childList', singleNode(div));
      directive['updateMutations'](mutation);
      expect(spy).toHaveBeenCalledWith(div);
    });
    it('should not register the node if the mutation type is not childList', () => {
      const spy = spyOn(directive['directiveRegistrationService'], 'registerNodeAttributes');
      const div = document.createElement('div');
      const mutation: MutationRecord = getMutationObject('not-childList', singleNode(div));
      directive['updateMutations'](mutation);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getChildNodes()', () => {
    it('should register the child node', async () => {
      await fixture.whenStable();
      const spy = spyOn(directive['directiveRegistrationService'], 'registerNodeAttributes');
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.appendChild(div2);
      await directive['getChildNodes'](div);
      expect(spy).toHaveBeenCalledWith(div2);
    });
    it('should call getChildNodes again if the child is an HTMLElement', async () => {
      await fixture.whenStable();
      const spy = spyOn<any>(directive, 'getChildNodes').and.callThrough();
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.appendChild(div2);
      await directive['getChildNodes'](div);
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should not call getChildNodes again if the child is not an HTMLElement', async () => {
      await fixture.whenStable();
      const spy = spyOn<any>(directive, 'getChildNodes').and.callThrough();
      const div = document.createElement('div');
      div.innerText = 'boo';
      await directive['getChildNodes'](div);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngAfterViewInit()', () => {
    // it('should create and append headStyle', async () => {
    //   await fixture.whenStable();
    //   directive.scrollViewportDirective = scrollViewportDirective;
    //   const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
    //   viewport.scrollViewportDirective = scrollViewportDirective;
    //   await fixture.detectChanges();
    //   await directive.ngAfterViewInit();
    //   expect(directive.headStyle).toBeTruthy();
    //   expect(directive.headTag.contains(directive.headStyle)).toBe(true);
    // });
    describe('viewport exists', () => {
      // it('should create a new scrollViewportDirective', async () => {
      //   await fixture.whenStable();
      //   directive.scrollViewportDirective = scrollViewportDirective;
      //   const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      //   viewport.scrollViewportDirective = null;
      //   await fixture.detectChanges();
      //   await directive.ngAfterViewInit();
      //   expect(viewport).toBeTruthy();
      //   expect(viewport.scrollViewportDirective).toBeTruthy();
      // });
      it('should not create a new scrollViewportDirective', async () => {
        await fixture.whenStable();
        directive.scrollViewportDirective = scrollViewportDirective;
        const oldViewportDirective: ScrollViewportDirective = directive.scrollViewportDirective!;
        const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
        viewport.scrollViewportDirective = {};
        await fixture.detectChanges();
        await directive.ngAfterViewInit();
        expect(directive.scrollViewportDirective).toBe(oldViewportDirective);
      });
      it('should not create a new scrollViewportDirective', async () => {
        await fixture.whenStable();
        directive.scrollViewportDirective = scrollViewportDirective;
        const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
        viewport.scrollViewportDirective = scrollViewportDirective;
        await fixture.detectChanges();
        await directive.ngAfterViewInit();
        expect(viewport).toBeTruthy();
        expect(viewport.scrollViewportDirective).toBe(directive.scrollViewportDirective);
      });
    });
    it('should set the elementRef.native element directive', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      await directive.ngAfterViewInit();
      expect(directive['elementRef'].nativeElement.directive).toBe(directive);
    });
    it('should add pointer down listener', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      document['hasPointerDownListener'] = false;
      const spy = spyOn(document, 'addEventListener');
      await directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
    it('should not add pointer down listener if the listener exists', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      document['hasPointerDownListener'] = true;
      const spy = spyOn(document, 'addEventListener');
      await directive.ngAfterViewInit();
      expect(spy).not.toHaveBeenCalled();
    });
    it('should add window.requestAnimationFrame', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const spy = spyOn(window, 'requestAnimationFrame');
      await directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
    it('should trigger onPointerDown', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const event = new PointerEvent('pointerdown');
      await Object.defineProperty(event, 'target', {writable: false, value: directive['elementRef'].nativeElement});
      await directive['elementRef'].nativeElement.setAttribute('tablejsGrid', 'boo');
      const spy = spyOn<any>(directive, 'onPointerDown');
      await directive.ngAfterViewInit();
      await document.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
    });
    it('should trigger onPointerDown if parent has tablejsGrid', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const event = new PointerEvent('pointerdown');
      await Object.defineProperty(event, 'target', {writable: false, value: directive['elementRef'].nativeElement});
      await directive['elementRef'].nativeElement.removeAttribute('tablejsGrid');
      await directive['elementRef'].nativeElement.parentElement.setAttribute('tablejsGrid', 'boo');
      directive['elementRef'].nativeElement.parentElement.directive = directive;
      const spy = spyOn<any>(directive, 'onPointerDown');
      await directive.ngAfterViewInit();
      await document.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
      expect(directive['elementRef'].nativeElement.parentElement).toBeTruthy();
    });
    it('should not trigger onPointerDown if parent has tablejsGrid', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const event = new PointerEvent('pointerdown');
      await Object.defineProperty(event, 'target', {writable: false, value: directive['elementRef'].nativeElement});
      await directive['elementRef'].nativeElement.removeAttribute('tablejsGrid');
      const spy = spyOn<any>(directive, 'onPointerDown');
      await directive.ngAfterViewInit();
      document.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
      // readd to make sure other tests work properly
      await directive['elementRef'].nativeElement.parentElement.setAttribute('tablejsGrid', '');
    });
    it('should not trigger onPointerDown', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const event = new PointerEvent('pointerdown');
      await Object.defineProperty(event, 'target', {writable: false, value: null});
      const spy = spyOn<any>(directive, 'onPointerDown');
      await directive.ngAfterViewInit();
      document.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onEnterFrame()', () => {
    it('should disconnect observer if columnsWithDataClasses exist', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const spy = spyOn<any>(directive.observer, 'disconnect');
      const div = document.createElement('div');
      div['dataClasses'] = ['foo'];
      directive.parentGroups = [[]];
      directive.columnsWithDataClasses = [div];
      await directive['onEnterFrame'](directive, Date.now());
      expect(spy).toHaveBeenCalled();
    });
    it('should not disconnect observer if columnsWithDataClasses exist', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const spy = spyOn<any>(directive.observer, 'disconnect');
      const div = document.createElement('div');
      div['dataClasses'] = ['foo'];
      directive.parentGroups = [[]];
      directive.columnsWithDataClasses = [];
      directive.mutationColumnsWithDataClasses = [div];
      await directive['onEnterFrame'](directive, Date.now());
      expect(spy).not.toHaveBeenCalled();
    });
    it('should request another frame if no columnsWithDataClasses and mutationColumnsWithDataClasses exist', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const spy = spyOn(window, 'requestAnimationFrame');
      directive.columnsWithDataClasses = [];
      directive.mutationColumnsWithDataClasses = [];
      await directive['onEnterFrame'](directive, Date.now());
      expect(spy).toHaveBeenCalled();
    });
    it('should set columnsWithDataClasses to mutationColumnsWithDataClasses if columnsWithDataClasses does not exist', async () => {
      await fixture.whenStable();
      directive.scrollViewportDirective = scrollViewportDirective;
      const viewport = directive['elementRef'].nativeElement.querySelector('*[tablejsScrollViewport');
      viewport.scrollViewportDirective = scrollViewportDirective;
      await fixture.detectChanges();
      const spy = spyOn<any>(directive.observer, 'disconnect');
      const div = document.createElement('div');
      div['dataClasses'] = ['foo'];
      directive.parentGroups = [[]];
      directive.columnsWithDataClasses = [];
      directive.mutationColumnsWithDataClasses = [div];
      await directive['onEnterFrame'](directive, Date.now());
      expect(directive.columnsWithDataClasses).toEqual([div]);
    });
  });

  // describe('setParentGroups()', () => {

  // });

  // describe('checkForGridInitReady()', () => {

  // });

  // describe('awaitWidths()', () => {

  // });

  // describe('awaitSingleFrame()', () => {

  // });

  // describe('onPointerDown()', () => {

  // });

  // describe('copyColumnToJPeg()', () => {

  // });

  // describe('getContainerScrollCount()', () => {

  // });

  // describe('onPointerMove()', () => {

  // });

  // describe('updateWidths()', () => {

  // });

  // describe('generateWidthStyle()', () => {

  // });

  // describe('getResizableClasses()', () => {

  // });

  // describe('setResizableStyles()', () => {

  // });

  // describe('addStyle()', () => {

  // });

  // describe('setStyleContent()', () => {

  // });

  // describe('moveStyleContentToProminent()', () => {

  // });

  // describe('setReorderStyles()', () => {

  // });

  // describe('getColSpan()', () => {

  // });

  // describe('validateColumnSpansAreTheSame()', () => {

  // });

  // describe('onPointerUp()', () => {

  // });

  // describe('addPointerListeners()', () => {

  // });

  // describe('removePointerListeners()', () => {

  // });

  // describe('endDrag()', () => {

  // });

  // describe('initGrid()', () => {

  // });

  // describe('calculateWidthsFromStyles()', () => {

  // });

  // describe('emitGridInitialization()', () => {

  // });

  // describe('createDragAndDropComponent()', () => {

  // });

  // describe('setDragAndDropPosition()', () => {

  // });

  // describe('setDragAndDropHTML()', () => {

  // });

  // describe('removeDragAndDropComponent()', () => {

  // });

  // describe('generateColumnGroups()', () => {

  // });

  // describe('generateSubGroup()', () => {

  // });

  // describe('orderSubGroups()', () => {

  // });

  // describe('setGridOrder()', () => {

  // });

  // describe('getOffset()', () => {

  // });

  // describe('getParentTablejsGridDirective()', () => {

  // });

  // describe('elementRefUnderPoint()', () => {

  // });

  // describe('getReorderColsUnderPoint()', () => {

  // });

  // describe('getReorderHandlesUnderPoint()', () => {

  // });

  // describe('getResizableElements()', () => {

  // });

  // describe('removeHighlights()', () => {

  // });

  // describe('removeElementHighlight()', () => {

  // });

  // describe('reorderColumns()', () => {

  // });

  // describe('constructGridTemplateColumns()', () => {

  // });

  // describe('setReorderHighlightHeight()', () => {

  // });

  // describe('generateContainerID()', () => {

  // });

  // describe('generateViewportID()', () => {

  // });

  // describe('attachContentResizeSensor()', () => {

  // });

  // describe('setScrollbarAdjustmentStyle()', () => {

  // });

  // describe('clearSelection()', () => {

  // });

  // describe('addResizableGrip()', () => {

  // });

  // describe('addResizableColumn()', () => {

  // });

  // describe('addReorderGrip()', () => {

  // });

  // describe('addReorderableColumn()', () => {

  // });

  // describe('addColumnsWithDataClasses()', () => {

  // });

  // describe('addRow()', () => {

  // });

  // describe('addInfiniteScrollViewport()', () => {

  // });

  // describe('removeStylesFromHead()', () => {

  // });

  // describe('ngOnDestroy()', () => {

  // });


});
