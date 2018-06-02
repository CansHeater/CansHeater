import { Component, OnInit } from '@angular/core';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-heater-stats',
  templateUrl: './heater-stats.component.html',
  styleUrls: ['./heater-stats.component.css']
})
export class HeaterStatsComponent implements OnInit {

  currentStatsRefreshRequested: boolean = false;
  temperaturesChartsRefreshRequested: boolean = false;
  selectedDate: Date;


  constructor() { }

  ngOnInit() {
  }

  refresh(): void {
    this.currentStatsRefreshRequested = true;
    this.temperaturesChartsRefreshRequested = true;
  }

  selectedDateChanged(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
    this.temperaturesChartsRefreshRequested = true;
  }

  currentStatsUpdated(): void {
    this.currentStatsRefreshRequested = false;
  }

  temperaturesChartsUpdated(): void {
    this.temperaturesChartsRefreshRequested = false;
  }

}
