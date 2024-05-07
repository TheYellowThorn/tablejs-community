import { HideColumnIfDirective } from './hide-column-if.directive';
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
  template: '<div tablejsHideColumnIf="true"></div>'
})
export class HostComponent {

}
describe('HideColumnIfDirective', () => {

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let directive: HideColumnIfDirective;
  let gridService: GridService;
  let hostElements: DebugElement[];

  beforeEach(() => {
    // Set up test service before each test
    TestBed.configureTestingModule({
      declarations: [HideColumnIfDirective, HostComponent],
      providers: [
        GridService,
        HideColumnIfDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComponent = fixture.componentInstance;

    hostElements = fixture.debugElement.queryAll(By.directive(HideColumnIfDirective));

    gridService = TestBed.inject(GridService);
    directive = fixture.debugElement.injector.get(HideColumnIfDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
