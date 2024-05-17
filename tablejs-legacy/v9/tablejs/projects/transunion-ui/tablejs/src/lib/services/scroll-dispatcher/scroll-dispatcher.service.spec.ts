import { TestBed } from '@angular/core/testing';

import { ScrollDispatcherService } from './scroll-dispatcher.service';

describe('ScrollDispatcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollDispatcherService = TestBed.get(ScrollDispatcherService);
    expect(service).toBeTruthy();
  });
});
