import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaterStatsComponent } from './heater-stats.component';

describe('HeaterStatsComponent', () => {
  let component: HeaterStatsComponent;
  let fixture: ComponentFixture<HeaterStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaterStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaterStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
