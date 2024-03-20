import { TestBed } from '@angular/core/testing';

import { CedService } from './ced.service';

describe('CedService', () => {
  let service: CedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
