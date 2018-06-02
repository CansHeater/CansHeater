import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HeaterStats } from './heater-stats';

@Injectable({
  providedIn: 'root'
})
export class HeaterManagementService {

  private url: string = 'http://127.0.0.1:8080/info'; // Server IP here

  constructor(private http: HttpClient) { }

  getCurrentStats(): Observable<HeaterStats> {
    return this.http.get<HeaterStats>(this.url + '/current').pipe(
      catchError(this.handleError<HeaterStats>())
    );
  }

  setHeaterState(state: boolean): Observable<any> {
    return this.http.post(this.url + '/state', { state: state }).pipe(
      catchError(this.handleError())
    );
  }

  setTargetedTemperature(target: number): Observable<any> {
    return this.http.post(this.url + '/target', { target: target }).pipe(
      catchError(this.handleError())
    );
  }

  getCity(): Observable<any> {
    return this.http.get(this.url + '/city').pipe(
      catchError(this.handleError())
    );
  }

  setCity(city: string): Observable<any> {
    return this.http.post(this.url + '/city', { city: city }).pipe(
      catchError(this.handleError())
    );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of (result as T);
    }
  }

}
