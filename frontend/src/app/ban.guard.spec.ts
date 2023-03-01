import { TestBed } from '@angular/core/testing';

import { BanGuard } from './ban.guard';

describe('BanGuard', () => {
  let guard: BanGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BanGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
