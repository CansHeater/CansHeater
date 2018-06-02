import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { TemperatureSensorsData } from './temperature-sensors-data';
import { TEMPERATURE_SENSORS_DATA } from './mock-sensors-data';

@Injectable({
  providedIn: 'root'
})
export class SensorsDataService {

  private url: string = 'http://127.0.0.1:8080/info'; // Server IP here

  constructor(private http: HttpClient) { }

  getTemperatureSensorsData(date: Date = undefined)
      : Observable<TemperatureSensorsData[]> {
    let requestUrl: string = this.url + '/temperatures';

    if (date) {
      requestUrl += "?date=" + date.getFullYear() + "-" + (date.getMonth() + 1)
          + "-" + date.getDate();
    }

    return this.http.get<{date, tempIn, tempOut}[]>(requestUrl).pipe(
      map(res => res.map(
        elt => new TemperatureSensorsData(elt.date, elt.tempIn,
            elt.tempOut))
      ),
      catchError(this.handleError<TemperatureSensorsData[]>())
    );
    // return of(TEMPERATURE_SENSORS_DATA);
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of (result as T);
    }
  }

}
