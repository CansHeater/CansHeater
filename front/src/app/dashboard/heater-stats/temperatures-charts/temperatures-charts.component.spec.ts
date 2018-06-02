import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturesChartsComponent } from './temperatures-charts.component';

describe('TemperaturesChartsComponent', () => {
  let component: TemperaturesChartsComponent;
  let fixture: ComponentFixture<TemperaturesChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturesChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturesChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
