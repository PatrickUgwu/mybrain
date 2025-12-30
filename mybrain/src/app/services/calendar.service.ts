import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../models/interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)

  getToday(): Observable<string> {
    return this.httpClient.get<string>(this.url + "/today")
  }

  getWeek():Observable<[string,ToDo[]][]> {
    return this.httpClient.get<[string,ToDo[]][]>(this.url + "/week")
  }

  getWeekDay(day: string):Observable<string> {
    return this.httpClient.get<string>(this.url + "/weekday?day=" + day)
  }

  getMonth():Observable<[string,ToDo[]][]> {
    return this.httpClient.get<[string,ToDo[]][]>(this.url + "/month")
  }

  getQuarter():Observable<string[][]> {
    return this.httpClient.get<string[][]>(this.url + "/quarter")
  }

  getYear():Observable<string[][]> {
    return this.httpClient.get<string[][]>(this.url + "/year")
  }

  getYearData(year?: number):Observable<any> {
    if (year === undefined) {
      return this.httpClient.get<any>(this.url + "/calendar_year_data")
    }
    else {
      return this.httpClient.get<any>(this.url + "/calendar_year_data?year=" + year)
    }
  }

  constructor() { }
}
