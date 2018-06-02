import { TestBed, inject } from '@angular/core/testing';

import { HeaterManagemetService } from './heater-management.service';

describe('HeaterManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaterManagementService]
    });
  });

  it('should be created', inject([HeaterManagementService], (service: HeaterManagementService) => {
    expect(service).toBeTruthy();
  }));
});
