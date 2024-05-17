import { TestBed } from '@angular/core/testing';
import { GridService } from './../grid/grid.service';
import { DirectiveRegistrationService } from './directive-registration.service';

describe('DirectiveRegistrationService', () => {
  let service: DirectiveRegistrationService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [GridService]
  }));

  beforeEach(() => {
    service = TestBed.get(DirectiveRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
