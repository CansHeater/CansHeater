import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { HeaterManagementService } from '../../heater-management.service';
import { HeaterStats } from '../../heater-stats';

@Component({
  selector: 'app-heater-settings',
  templateUrl: './heater-settings.component.html',
  styleUrls: ['./heater-settings.component.css']
})
export class HeaterSettingsComponent implements OnInit {

  status: boolean;
  temperatureTargeted: number;
  city: string;

  constructor(private heaterManagementService: HeaterManagementService,
      public snackbar: MatSnackBar) { }

  ngOnInit() {
    this.heaterManagementService.getCurrentStats().subscribe(data => {
      this.status = data.state;
      this.temperatureTargeted = data.tempTarget;
    });

    this.heaterManagementService.getCity().subscribe(data => {
      this.city = data.city
    });
  }

  snack(message: string): void {
    this.snackbar.open(message, null, { duration: 5000 });
  }

  sliderTriggered(event: MatSlideToggleChange): void {
    this.status = event.checked;
    this.heaterManagementService.setHeaterState(this.status).subscribe();

    if (this.status) {
      this.snack('The heater will turn on soon');
    } else {
      this.snack('The heater will turn off soon');
    }
  }

  targetTempUpdated(): void {
    this.heaterManagementService.setTargetedTemperature(
        this.temperatureTargeted).subscribe();
  }

  otherSettingsUpdated(): void {
    this.heaterManagementService.setCity(this.city).subscribe(data => {
      if (this.city !== data.city) {
        this.city = data.city;
        this.snack('The specified city is does not exist');
      }
    });
  }

}
