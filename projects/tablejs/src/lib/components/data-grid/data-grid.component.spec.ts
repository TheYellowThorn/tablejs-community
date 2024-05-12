import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild, SimpleChange, SimpleChanges, TemplateRef, DebugElement, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DataGridComponent } from './data-grid.component';
import { IColumnConfig } from './types/i-column-config';
import { IGridData } from './../../../app/query.module/types/i-grid-data';
import {
  ColumnResizeEvent,
  ColumnReorderEvent,
  FilterSortService,
  GridEvent,
  ScrollViewportEvent,
  SortOptions,
  SortComparator,
  SortDirection,
  TablejsModule
} from '@transunion-ui/tablejs';
import { OverlayModule } from '@angular/cdk/overlay';
import { testData, testColumnConfigs } from './example-grid/test-data/test-data';
import { interval, firstValueFrom } from 'rxjs';

export const waitUntil = async (untilTruthy: Function): Promise<boolean> => {
  while (!untilTruthy()) {
    await firstValueFrom(interval(25));
  }
  return Promise.resolve(true);
};

@Component({
  selector: 'lib-example-grid',
  template: `
  <lib-data-grid
    [columnConfigs]="columnConfigs"
    [data]="filteredData"
    [loading]="showLoadingSpinner"
    [rowIsSelectable]="false"
    (onRangeUpdated)="onRangeUpdated($event)"
>
</lib-data-grid>
  `
})
class HostComponent implements OnInit {
  @ViewChild('checkboxRef', { static: true, read: TemplateRef }) checkboxRef: TemplateRef<any>;
  @ViewChild('headerRef', { static: true, read: TemplateRef }) headerRef: TemplateRef<any>;

  public columnConfigs: IColumnConfig[] = testColumnConfigs.concat();
  public testData: IGridData[] = testData.concat();
  public filteredData: IGridData[] = [];

  public currentSortOptions: SortOptions | null = null;
  public sortOptionsList: SortOptions[] = [];

  public showLoadingSpinner = true;
  public rangeUpdated = false;

  constructor(public filterSortService: FilterSortService) {
    this.filterSortService.autoDefineUnsetProperties = true;
    this.setSortOptions();
  }

  ngOnInit(): void {
    this.filteredData = this.testData.concat();
    this.showLoadingSpinner = false;
  }

  public onRangeUpdated() {
    this.rangeUpdated = true;
  }

  public setSortOptions(): void {
    this.columnConfigs.forEach((config: IColumnConfig) => {
        config.sortOptions = new SortOptions(
          '',
          SortComparator.NUMERIC,
          SortDirection.NONE
        );
    });
    this.currentSortOptions = this.columnConfigs[0]!.sortOptions as SortOptions;
  }
}

@Component({
  selector: 'lib-example-grid-templated',
  template: `
  <lib-data-grid
    [columnConfigs]="columnConfigs"
    [data]="filteredData"
    [loading]="showLoadingSpinner"
    [rowIsSelectable]="false"
    (onRangeUpdated)="onRangeUpdated($event)"
>

    <ng-template #headerRef let-columnIndex="columnIndex" let-config="config" let-sortOptions="config.sortOptions">
      <span class="left-shift template-header-content">
          <span class="template-box">TMPL</span>
          <span class="template-shifted-table-name">{{ config.name }}</span>
      </span>
    </ng-template>
    <ng-template #checkboxRef let-item="item" let-index="index" let-columnIndex="columnIndex">
        <input id="testCheckbox" class="input" type="checkbox" />
    </ng-template>
</lib-data-grid>
  `
})
class TemplatedHostComponent implements OnInit {

  @ViewChild('checkboxRef', { static: true, read: TemplateRef }) checkboxRef: TemplateRef<any>;
  @ViewChild('headerRef', { static: true, read: TemplateRef }) headerRef: TemplateRef<any>;

  public columnConfigs: IColumnConfig[] = testColumnConfigs.map((columnConfig: IColumnConfig) => {
    columnConfig.tableDataTemplateRef = this.checkboxRef;
    return columnConfig;
  });
  public testData: IGridData[] = testData.concat();
  public filteredData: IGridData[] = [];

  public currentSortOptions: SortOptions | null = null;
  public sortOptionsList: SortOptions[] = [];

  public showLoadingSpinner = false;
  public rangeUpdated = false;

  constructor(public filterSortService: FilterSortService) {
    this.filterSortService.autoDefineUnsetProperties = true;
    this.setSortOptions();

    const columnConfig: IColumnConfig = this.columnConfigs[0] as IColumnConfig;
    columnConfig.tableDataTemplateRef = this.checkboxRef;

    this.columnConfigs.forEach((config: IColumnConfig) => {
      config.tableHeaderTemplateRef = this.headerRef;
    });
  }

  ngOnInit(): void {
    this.filteredData = this.testData.concat();
    this.showLoadingSpinner = false;
  }

  public onRangeUpdated() {
    this.rangeUpdated = true;
  }

  public setSortOptions(): void {
    this.columnConfigs.forEach((config: IColumnConfig) => {
        config.sortOptions = new SortOptions(
          '',
          SortComparator.NUMERIC,
          SortDirection.NONE
        );
    });
    this.currentSortOptions = this.columnConfigs[0]!.sortOptions as SortOptions;
  }
}

describe('DataGridComponent', () => {
  let hostComponent: HostComponent;
  let component: DataGridComponent;
  let fixture: ComponentFixture<HostComponent>;

  let templatedHostComponent: TemplatedHostComponent;
  let templatedComponent: DataGridComponent;
  let templatedFixture: ComponentFixture<TemplatedHostComponent>;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: false } }
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ HostComponent, TemplatedHostComponent, DataGridComponent],
      providers: [
      ],
      imports: [TablejsModule, OverlayModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach( () => {

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance;
    fixture.detectChanges();
    clearTimeout(component.allItemsFitTimeout);
    
    templatedFixture = TestBed.createComponent(TemplatedHostComponent);
    templatedHostComponent = templatedFixture.componentInstance;
    templatedComponent = templatedFixture.debugElement.query(By.directive(DataGridComponent)).componentInstance;
    templatedFixture.detectChanges();
    clearTimeout(templatedComponent.allItemsFitTimeout);

  });

  it('should create', () =>  {
    expect(component).toBeTruthy();
    expect(hostComponent).toBeTruthy();
  });

  it('should not show grid when refreshing', fakeAsync(() => {
    const enabledDebugElement: DebugElement = fixture.debugElement.query(By.css('tablejs-grid'));
    expect(enabledDebugElement).toBeTruthy();
    component.gridIsRefreshing = true;
    fixture.detectChanges();
    tick();
    const disabledDebugElement: DebugElement = fixture.debugElement.query(By.css('tablejs-grid'));
    expect(disabledDebugElement).not.toBeTruthy();
  }));

  it('should show grid when not refreshing', fakeAsync(() => {
    const enabledDebugElement: DebugElement = fixture.debugElement.query(By.css('tablejs-grid'));
    expect(enabledDebugElement).toBeTruthy();
    component.gridIsRefreshing = true;
    fixture.detectChanges();
    tick();
    const disabledDebugElement: DebugElement = fixture.debugElement.query(By.css('tablejs-grid'));
    expect(disabledDebugElement).not.toBeTruthy();
    component.gridIsRefreshing = false;
    fixture.detectChanges();
    tick(2);
    const reenabledDebugElement: DebugElement = fixture.debugElement.query(By.css('tablejs-grid'));
    expect(reenabledDebugElement).toBeTruthy();
  }));

  it('should emit column resize start event', () => {
    const onColumnResizeStartSpy = jest.spyOn(component.onColumnResizeStart, 'emit');
    const resizeEvent = new ColumnResizeEvent();
    component.columnResizeStart(resizeEvent);

    expect(onColumnResizeStartSpy).toHaveBeenCalledWith(resizeEvent);
  });
  it('should check viewport size when column resize starts', () => {
    const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
    const resizeEvent = new ColumnResizeEvent();
    component.columnResizeStart(resizeEvent);

    expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
  });

  it('should emit column resize event', () => {
    const onColumnResizeSpy = jest.spyOn(component.onColumnResize, 'emit');
    const resizeEvent = new ColumnResizeEvent();
    component.columnResize(resizeEvent);

    expect(onColumnResizeSpy).toHaveBeenCalledWith(resizeEvent);
  });
  it('should check viewport size when column resize starts', () => {
    const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
    const resizeEvent = new ColumnResizeEvent();
    component.columnResize(resizeEvent);

    expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
  });

  it('should emit column resize end event', () => {
    const onColumnResizeEndSpy = jest.spyOn(component.onColumnResizeEnd, 'emit');
    const resizeEvent = new ColumnResizeEvent();
    component.columnResizeEnd(resizeEvent);

    expect(onColumnResizeEndSpy).toHaveBeenCalledWith(resizeEvent);
  });
  it('should check viewport size when column resize ends', () => {
    const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
    const resizeEvent = new ColumnResizeEvent();
    component.columnResizeEnd(resizeEvent);

    expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
  });

  it('should emit column reorder event', () => {
    const onColumnReorderSpy = jest.spyOn(component.onColumnReorder, 'emit');
    const reorderEvent = new ColumnReorderEvent();
    component.columnReorder(reorderEvent);

    expect(onColumnReorderSpy).toHaveBeenCalledWith(reorderEvent);
  });
  it('should check viewport size when column reorder starts', () => {
    const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
    const reorderEvent = new ColumnReorderEvent();
    component.columnReorderStart(reorderEvent);

    expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
  });

  it('should emit column reorder end event', () => {
    const onColumnReorderEndSpy = jest.spyOn(component.onColumnReorderEnd, 'emit');
    const reorderEvent = new ColumnReorderEvent();
    component.columnReorderEnd(reorderEvent);

    expect(onColumnReorderEndSpy).toHaveBeenCalledWith(reorderEvent);
  });
  it('should check viewport size when column reorder ends', () => {
    const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
    const reorderEvent = new ColumnReorderEvent();
    component.columnReorderEnd(reorderEvent);

    expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
  });

  describe('ngOnChanges', () => {
    it('should not set refresh if lastConfigs is not set', () => {
      component.gridIsRefreshing = false;
      const columnConfigsChange: SimpleChange = new SimpleChange(undefined, component.columnConfigs, false);
      const simpleChanges: SimpleChanges = { columnConfigs: columnConfigsChange };
      component.ngOnChanges(simpleChanges);

      expect(component.gridIsRefreshing).toBe(false);
    });
  
    it('should set refresh if configs have changed and previous configs existed', () => {
      expect(component.columnConfigs).toBeTruthy();
      const lastColumnConfigs: IColumnConfig[] = component.columnConfigs;
      component['lastConfigs'] = lastColumnConfigs;
      component.columnConfigs = component.columnConfigs.concat();
      const columnConfigsChange: SimpleChange = new SimpleChange(lastColumnConfigs, component.columnConfigs, false);
      const simpleChanges: SimpleChanges = { columnConfigs: columnConfigsChange };
      component.ngOnChanges(simpleChanges);

      expect(component.gridIsRefreshing).toBe(true);
    });

    it('should check viewport size if data value changes', () => {
      const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
      component.loading = false;
      const dataChange: SimpleChange = new SimpleChange(null, [{}, {}], false);
      const simpleChanges: SimpleChanges = { data: dataChange };
      component.ngOnChanges(simpleChanges);

      expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
    });
    it('should check viewport size if loading value changes', () => {
      const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
      component.loading = false;
      const loadingChange: SimpleChange = new SimpleChange(false, true, false);
      const simpleChanges: SimpleChanges = { loading: loadingChange };
      component.ngOnChanges(simpleChanges);

      expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
    });
    it('should set data to an empty array while loading', () => {
      component.loading = false;
      component.data = [{}, {}, {}];
      const loadingChange: SimpleChange = new SimpleChange(false, true, false);
      const simpleChanges: SimpleChanges = { loading: loadingChange };
      component.ngOnChanges(simpleChanges);

      expect(component.data).toEqual([]);
    });

  });

  it('should emit viewport ready event', () => {
    const onViewportReadySpy = jest.spyOn(component.onViewportReady, 'emit');
    const viewportEvent = {};
    component.viewportReady(viewportEvent);

    expect(onViewportReadySpy).toHaveBeenCalledWith(viewportEvent);
  });
  describe('gridInitialized()', () => {
    it('should check viewport size', () => {
      const checkForItemsFittingViewportSpy = jest.spyOn(component, 'checkForItemsFittingViewport');
      const gridEvent = new GridEvent();
      component.gridInitialized(gridEvent);
  
      expect(checkForItemsFittingViewportSpy).toHaveBeenCalled();
    });
    it('should emit grid intialization event', () => {
      const onGridInitializedSpy = jest.spyOn(component.onGridInitialized, 'emit');
      const viewportEvent = new GridEvent();
      component.gridInitialized(viewportEvent);

      expect(onGridInitializedSpy).toHaveBeenCalledWith(viewportEvent);
    });
  });
  

  it('should emit range update event', () => {
    const onRangeUpdatedSpy = jest.spyOn(component.onRangeUpdated, 'emit');
    const rangeEvent = new ScrollViewportEvent();
    component.rangeUpdated(rangeEvent);

    expect(onRangeUpdatedSpy).toHaveBeenCalledWith(rangeEvent);
  });

  describe('onRowSelected()', () => {
    it('should not emit from onRowClicked if row is not selecable', () => {
      component.rowIsSelectable = false;
      const onRowClickedSpy = jest.spyOn(component.onRowClicked, 'emit');
      const mouseEvent = new MouseEvent('click');
      component.onRowSelected(mouseEvent, {});

      expect(onRowClickedSpy).not.toHaveBeenCalled();
    });
    it('should emit from onRowClicked if row is selecable', () => {
      component.rowIsSelectable = true;
      const onRowClickedSpy = jest.spyOn(component.onRowClicked, 'emit');
      const mouseEvent = new MouseEvent('click');
      component.onRowSelected(mouseEvent, {})

      expect(onRowClickedSpy).toHaveBeenCalled();
    });
  });

  it('should emit when column sort is triggered', () => {
    const onColumnSortSpy = jest.spyOn(component.onColumnSort, 'emit');
    const sortOptions = new SortOptions('', SortComparator.ALPHABETICAL);
    component.sortColumnBy(sortOptions);

    expect(onColumnSortSpy).toHaveBeenCalledWith(sortOptions);
  });

  it('should check if items are fitting in the viewport', fakeAsync( () => {
    component.viewportDirective.allItemsFitViewport = () => true;
    fixture.detectChanges();
    tick();
    expect(component.viewportDirective).toBeTruthy();
    const allItemsFitViewportSpy = jest.spyOn(component.viewportDirective, 'allItemsFitViewport');
    const cdrSpy = jest.spyOn(component['cdr'],'detectChanges');
    component.checkForItemsFittingViewport();
    tick(10);

    expect(allItemsFitViewportSpy).toHaveBeenCalled();
    expect(cdrSpy).toHaveBeenCalled();
  }));

  it('should enable column resize functionality', async () => {
    await testColumnConfigs.forEach((config: IColumnConfig) => config.resizable = true);
    await fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('[resizableGrip]'));
    expect(debugElement).toBeTruthy();
  });
  it('should disable column resize functionality', async () => {
    await testColumnConfigs.forEach((config: IColumnConfig) => config.resizable = false);
    await fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('[resizableGrip]'));
    expect(debugElement).not.toBeTruthy();
  });
  it('should enable column reorder functionality', async () => {
    await testColumnConfigs.forEach((config: IColumnConfig) => config.reorderable = true);
    await fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('[reorderGrip]'));
    expect(debugElement).toBeTruthy();
  });
  it('should disable column reorder functionality', async () => {
    await testColumnConfigs.forEach((config: IColumnConfig) => config.reorderable = false);
    await fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('[reorderGrip]'));
    expect(debugElement).not.toBeTruthy();
  });

  it('should show default (non-custom) table header', async () => {
    fixture.detectChanges();
    await waitUntil(() => hostComponent.rangeUpdated);
    const htmlElement: HTMLElement = fixture.nativeElement;
    const customHeader: HTMLInputElement | null = htmlElement.querySelector('.template-header-content');
    expect(customHeader).not.toBeTruthy();
  });
  it('should show custom table header', async () => {
    templatedHostComponent.columnConfigs.forEach((config: IColumnConfig) => config.tableHeaderTemplateRef = templatedHostComponent.headerRef);
    templatedFixture.detectChanges();
    await waitUntil(() => templatedHostComponent.rangeUpdated);
    const htmlElement: HTMLElement = templatedFixture.nativeElement;
    const customHeader: HTMLInputElement | null = htmlElement.querySelector('.template-header-content');
    expect(customHeader).toBeTruthy();
  });
  it('should show default (non-custom) table data', async () => {
    fixture.detectChanges();
    await waitUntil(() => hostComponent.rangeUpdated);
    const htmlElement: HTMLElement = fixture.nativeElement;
    const input: HTMLInputElement | null = htmlElement.querySelector('.input');
    expect(input).not.toBeTruthy();
  });
  it('should show custom table data', async () => {
    templatedHostComponent.columnConfigs.forEach((config: IColumnConfig) => config.tableDataTemplateRef = templatedHostComponent.checkboxRef);
    templatedFixture.detectChanges();
    await waitUntil(() => templatedHostComponent.rangeUpdated);
    const htmlElement: HTMLElement = templatedFixture.nativeElement;
    const input: HTMLInputElement | null = htmlElement.querySelector('.input');
    expect(input).toBeTruthy();
  });
  it('should show spinner when data is loading', async () => {
      templatedHostComponent.showLoadingSpinner = true;
      templatedHostComponent.filteredData = [];
      await templatedFixture.detectChanges();
      const debugElement: DebugElement = await templatedFixture.debugElement.query(By.css('.spinner'));
      expect(debugElement).toBeTruthy();
      expect(templatedComponent.loading).toBe(true);
  });
  it('should not show spinner when data is not loading', async () => {
    templatedHostComponent.showLoadingSpinner = false;
    templatedHostComponent.filteredData = [];
    await templatedFixture.detectChanges();
    const debugElement: DebugElement = await templatedFixture.debugElement.query(By.css('.spinner'));
    expect(debugElement).not.toBeTruthy();
    expect(templatedComponent.loading).not.toBe(true);
  });

  it('should not show "No data found." when data is loading with no results', async () => {
    templatedHostComponent.showLoadingSpinner = true;
    templatedHostComponent.filteredData = [];
    await templatedFixture.detectChanges();
    const debugElement: DebugElement = await templatedFixture.debugElement.query(By.css('.no-data-found'));
    expect(debugElement).not.toBeTruthy();
  });
  it('should not show "No data found." when grid contains one or more items', async () => {
    templatedHostComponent.showLoadingSpinner = false;
    await templatedFixture.detectChanges();
    const debugElement: DebugElement = await templatedFixture.debugElement.query(By.css('.no-data-found'));
    expect(debugElement).not.toBeTruthy();
  });
  it('should show "No data found." when data is not loading with no results', async () => {
    templatedHostComponent.showLoadingSpinner = false;
    templatedHostComponent.filteredData = [];
    await templatedFixture.detectChanges();
    const debugElement: DebugElement = await templatedFixture.debugElement.query(By.css('.no-data-found'));
    expect(debugElement).toBeTruthy();
  });

  describe('getArrowClass()', () => {
    it('should show unsorted icon', () => {
      const sortOptions: SortOptions = new SortOptions('name', SortComparator.ALPHABETICAL, SortDirection.NONE);
      expect(component.getArrowClass(sortOptions)).toBe('fa-long-arrow-alt-up fa-long-arrow-alt-down');
    });
    it('should show sorted down icon', () => {
      const sortOptions: SortOptions = new SortOptions('name', SortComparator.ALPHABETICAL, SortDirection.ASCENDING);
      expect(component.getArrowClass(sortOptions)).toBe('fa-arrow-down');
    });
    it('should show sorted up icon', () => {
      const sortOptions: SortOptions = new SortOptions('name', SortComparator.ALPHABETICAL, SortDirection.DESCENDING);
      expect(component.getArrowClass(sortOptions)).toBe('fa-arrow-up');
    });
  });

});
