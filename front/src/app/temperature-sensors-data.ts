export class TemperatureSensorsData {

  date: Date;
  temperatureIn: number;
  temperatureOut: number;

  constructor(date: string, temperatureIn: number, temperatureOut:number) {
    this.date = new Date(date);
    this.temperatureIn = temperatureIn;
    this.temperatureOut = temperatureOut;
  }

}
