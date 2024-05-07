import { TestBed } from '@angular/core/testing';
import { SortDirection } from './sort-direction';
import { SortOptions } from './sort-options';


describe('SortOptions', () => {
  
  let sortOptions: SortOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    sortOptions = new SortOptions('id', (valueA, valueB) => 0);

  });

  describe('directionOrder', () => {
    it('should set direction order', () => {
      const directions = [SortDirection.ASCENDING, SortDirection.DESCENDING];
      sortOptions.directionOrder = directions;
      expect(sortOptions.directionOrder).toEqual(directions);
    });
    it('should reset sort direction to NONE', () => {
      const directions = [SortDirection.ASCENDING, SortDirection.DESCENDING];
      sortOptions.directionOrder = directions;
      expect(sortOptions.sortDirection).toBe(SortDirection.NONE);
    })
  });

  describe('nextSortDirection', () => {
    it('should set sortDirection to the next direction in the sort order', () => {
      const directions = [SortDirection.ASCENDING, SortDirection.DESCENDING];
      sortOptions.directionOrder = directions;
      sortOptions.sortDirection = SortDirection.ASCENDING;
      sortOptions.nextSortDirection();
      expect(sortOptions.sortDirection).toBe(SortDirection.DESCENDING);
    });
    it('should set sort direction to the first item in the sort order', () => {
      const directions = [SortDirection.ASCENDING, SortDirection.DESCENDING];
      sortOptions.directionOrder = directions;
      sortOptions.sortDirection = SortDirection.DESCENDING;
      sortOptions.nextSortDirection();
      expect(sortOptions.sortDirection).toBe(SortDirection.ASCENDING);
    })
  });

});
