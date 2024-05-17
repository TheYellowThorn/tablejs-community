import { SortableColDirective } from './sortable-col.directive';
import { TestBed, inject } from '@angular/core/testing';
import { GridService } from './../../services/grid/grid.service';


describe('SortableColDirective', () => {
  let directive: SortableColDirective;
  let gridService: GridService;

  beforeEach(() => {
      // Set up test service before each test
      TestBed.configureTestingModule({
        providers: [
          GridService,
          SortableColDirective,
        ]
      });
      gridService = TestBed.get(GridService);
      directive = TestBed.get(SortableColDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
