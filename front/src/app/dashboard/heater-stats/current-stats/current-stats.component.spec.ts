import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStatsComponent } from './current-stats.component';

describe('CurrentStatsComponent', () => {
  let component: CurrentStatsComponent;
  let fixture: ComponentFixture<CurrentStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
