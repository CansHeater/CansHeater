import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaterSettingsComponent } from './heater-settings.component';

describe('HeaterSettingsComponent', () => {
  let component: HeaterSettingsComponent;
  let fixture: ComponentFixture<HeaterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
