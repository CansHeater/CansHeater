import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, SimpleChange, EventEmitter } from '@angular/core';

import { HeaterManagementService } from '../../../heater-management.service';
import { HeaterStats } from '../../../heater-stats';

@Component({
  selector: 'app-current-stats',
  templateUrl: './current-stats.component.html',
  styleUrls: ['./current-stats.component.css']
})
export class CurrentStatsComponent implements OnInit {

  @Input() refreshRequested: boolean;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  status: boolean;
  temperatureTargeted: number;
  temperatureIn: number;
  temperatureOut: number;

  constructor(private heaterManagementService: HeaterManagementService) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshRequested && this.refreshRequested) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.heaterManagementService.getCurrentStats().subscribe(data => {
      this.status = data.state;
      this.temperatureIn = data.tempIn;
      this.temperatureOut = data.tempOut;
      this.temperatureTargeted = data.tempTarget;

      this.updated.emit({ updated: true });
    });
  }

}
