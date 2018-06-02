import { TestBed, inject } from '@angular/core/testing';

import { SensorsDataService } from './sensors-data.service';

describe('SensorsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SensorsDataService]
    });
  });

  it('should be created', inject([SensorsDataService], (service: SensorsDataService) => {
    expect(service).toBeTruthy();
  }));
});
