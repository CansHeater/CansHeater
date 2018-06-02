import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, SimpleChange, EventEmitter } from '@angular/core';

import { SensorsDataService } from '../../../sensors-data.service';
import { TemperatureSensorsData } from '../../../temperature-sensors-data';
import { element } from 'protractor';

@Component({
  selector: 'app-temperatures-charts',
  templateUrl: './temperatures-charts.component.html',
  styleUrls: ['./temperatures-charts.component.css']
})
export class TemperaturesChartsComponent implements OnInit {

  @Input() refreshRequested: boolean;
  @Input() specificDate: Date;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  temperaturesChartData: Array<any>;
  ratioChartData: Array<any>;
  displayCharts: boolean = false;

  constructor(private sensorsDataService: SensorsDataService) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshRequested && this.refreshRequested) {
      this.displayCharts = false;
      this.fetchData();
    }
  }

  fetchData(): void {
    let tabTempIn: Array<number> = new Array<number>();
    let tabTempOut: Array<number> = new Array<number>();
    let tabRatio: Array<number> = new Array<number>();
    let tabDate: Array<string> = new Array<string>();

    this.sensorsDataService.getTemperatureSensorsData(this.specificDate)
        .subscribe(data => {
      data.forEach(elt => {
        tabTempIn.push(elt.temperatureIn);
        tabTempOut.push(elt.temperatureOut);
        tabRatio.push(elt.temperatureOut / elt.temperatureIn);
        tabDate.push(('0' + elt.date.getHours()).slice(-2) + ":"
            + ('0' + elt.date.getMinutes()).slice(-2));
      });

      this.temperaturesChartData = [
        { data: tabTempIn, label: 'Temperature in' },
        { data: tabTempOut, label: 'Temperature out' }
      ];

      this.ratioChartData = [
        { data: tabRatio, label: 'Heater efficiency (temperature out/in ratio)' }
      ]

      this.temperaturesChartLabels = tabDate;
      this.ratioChartLabels = tabDate;

      this.displayCharts = true;

      this.updated.emit({ updated: true });
    });
  }

  temperaturesChartLabels: Array<any>;
  ratioChartLabels: Array<any>;

  temperaturesChartOptions: any = {
    responsive: true
  };

  ratioChartOptions: any = {
    responsive: true
  };

  temperaturesChartColors: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'hsla(0, 100%, 30%, 0.2)',
      borderColor: 'hsla(0, 100%, 30%, 1)',
      pointBackgroundColor: 'hsla(0, 100%, 30%, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'hsla(0, 100%, 30%, 0.8)'
    }
  ];

  ratioChartColors: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  temperaturesChartLegend: boolean = true;
  ratioChartLegend: boolean = false;

  temperaturesChartType: string = 'line';
  ratioChartType: string = 'line';

}
