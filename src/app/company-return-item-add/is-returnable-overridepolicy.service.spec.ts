import { TestBed } from '@angular/core/testing';

import { IsReturnableOverridepolicyService } from './is-returnable-overridepolicy.service';

describe('IsReturnableOverridepolicyService', () => {
  let service: IsReturnableOverridepolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsReturnableOverridepolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
