import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';
import { GridComponent } from './grid.component';
import { GridDirective } from './../../directives/grid/grid.directive';
import { ColumnResizeEvent } from './../../shared/classes/events/column-resize-event';
import { ColumnReorderEvent } from './../../shared/classes/events/column-reorder-event';
import { GridEvent } from '../../shared/classes/events/grid-event';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'tablejs-test-component-wrapper',
  template: `<tablejs-grid [linkClass]="linkClass" [resizeColumnWidthByPercent]="resizeColumnWidthByPercent"
  (columnResizeStart)="columnResizeStart($event)"
  (columnResize)="columnResize($event)"
  (columnResizeEnd)="columnResizeEnd($event)"
  (columnReorderStart)="columnReorderStart($event)"
  (columnReorder)="columnReorder($event)"
  (columnReorderEnd)="columnReorderEnded($event)"></tablejs-grid>`
})
class TablejsTestWrapperComponent {
  linkClass = 'link-class';
  resizeColumnWidthByPercent = false;
  columnResizeStart = (e: any) => true;
  columnResize = (e: any) => true;
  columnResizeEnd = (e: any) => true;
  columnReorderStart = (e: any) => true;
  columnReorder = (e: any) => true;
  columnReorderEnd = (e: any) => true;

}

@Component({
  selector: 'tablejs-test-component-wrapper-no-link',
  template: `<tablejs-grid [linkClass]="linkClass" [resizeColumnWidthByPercent]="resizeColumnWidthByPercent"
  (columnResizeStart)="columnResizeStart($event)"
  (columnResize)="columnResize($event)"
  (columnResizeEnd)="columnResizeEnd($event)"
  (columnReorderStart)="columnReorderStart($event)"
  (columnReorder)="columnReorder($event)"
  (columnReorderEnd)="columnReorderEnded($event)"></tablejs-grid>`
})
class TablejsTestWrapperNoLinkComponent {
  linkClass = undefined;
  resizeColumnWidthByPercent = false;
  columnResizeStart = (e: any) => true;
  columnResize = (e: any) => true;
  columnResizeEnd = (e: any) => true;
  columnReorderStart = (e: any) => true;
  columnReorder = (e: any) => true;
  columnReorderEnd = (e: any) => true;

}

export class MockElementRef extends ElementRef {
  nativeElement: {
    children: null,
    innerText: '',
    contains: () => false,
    appendChild: (child: Node) => void,
    removeChild: (child: Node) => void,
    classList: {
      add: (item: string) => true
    },
    gridDirective: null,
    directive: null,
    getElementsByClassName: (cls: string) => [''],
    reordering: false,
    parentElement: {
      dispatchEvent: (event: any) => true;
    },
    querySelector: (str: string) => null;
  } | undefined = undefined;
}

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<TablejsTestWrapperComponent>;
  let noLinkComponent: GridComponent;
  let noLinkFixture: ComponentFixture<TablejsTestWrapperNoLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ OverlayModule ],
      declarations: [ GridDirective, GridComponent, TablejsTestWrapperComponent, TablejsTestWrapperNoLinkComponent ],
      providers: [
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablejsTestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();

    noLinkFixture = TestBed.createComponent(TablejsTestWrapperNoLinkComponent);
    noLinkComponent = noLinkFixture.debugElement.children[0].componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(noLinkComponent).toBeTruthy();
  });

  it('should add link class', () => {
    component.ngOnInit();
    expect(component.elementRef.nativeElement.classList[0]).toBe('link-class');
  });
  it('should not add link class', () => {
    noLinkComponent.ngOnInit();
    expect(noLinkComponent.elementRef.nativeElement.classList[0]).not.toBe('link-class');
  });
  describe('columnResizeStarted', () => {
    it('should emit resize event', () => {
      const spy = spyOn(component.columnResizeStart, 'emit');
      const event: ColumnResizeEvent = new ColumnResizeEvent();
      component.columnResizeStarted(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(ColumnResizeEvent.ON_RESIZE_START);
    });
  });
  describe('columnResized', () => {
    it('should emit resize event', () => {
      const spy = spyOn(component.columnResize, 'emit');
      const event: ColumnResizeEvent = new ColumnResizeEvent();
      component.columnResized(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(ColumnResizeEvent.ON_RESIZE);
    });
  });
  describe('columnResizeEnded', () => {
    it('should emit resize event', () => {
      const spy = spyOn(component.columnResizeEnd, 'emit');
      const event: ColumnResizeEvent = new ColumnResizeEvent();
      component.columnResizeEnded(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(ColumnResizeEvent.ON_RESIZE_END);
    });
  });
  describe('columnReorderStarted', () => {
    it('should emit reorder event', () => {
      const spy = spyOn(component.columnReorderStart, 'emit');
      const event: ColumnReorderEvent = new ColumnReorderEvent();
      component.columnReorderStarted(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(ColumnReorderEvent.ON_REORDER_START);
    });
  });
  describe('columnReorderd', () => {
    it('should emit reorder event', () => {
      const spy = spyOn(component.columnReorder, 'emit');
      const event: ColumnReorderEvent = new ColumnReorderEvent();
      component.columnReordered(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(ColumnReorderEvent.ON_REORDER);
    });
  });
  describe('columnReorderEnded', () => {
    it('should emit reorder event', () => {
      const spy = spyOn(component.columnReorderEnd, 'emit');
      const event: ColumnReorderEvent = new ColumnReorderEvent();
      component.columnReorderEnded(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(ColumnReorderEvent.ON_REORDER_END);
    });
  });

  describe('gridInitialized', () => {
    it('should emit grid initialized event', () => {
      const spy = spyOn(component.gridInitialize, 'emit');
      const event: GridEvent = new GridEvent();
      component.gridInitialized(event);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(event.type).toBe(GridEvent.ON_INITIALIZED);
    });
  });
});
