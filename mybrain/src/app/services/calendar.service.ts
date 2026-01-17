import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../models/interfaces/todo.interface';
import { Goal } from '../models/interfaces/goal.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)
  year = signal<{
    "month_str": string, 
    "month_goals": Goal[], 
    "month_quarter_goals": Goal[]
  }[][]>([])
  quarter = signal<{
    "month_str": string, 
    "month_goals": Goal[], 
    "week_goals": Goal[][]
  }[]>([])
  month = signal<{
    "week_days": string[], 
    "todos": ToDo[], 
    "week_goals": Goal[]
  }[]>([])
  

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

  getMonthData(year?: number, month?: number):Observable<any> {
    let params = ""
    if (year !== undefined) { 
      params = "?year=" + year 
      if (month !== undefined) { params = params + "&month=" + month }
    }
     
    return this.httpClient.get<any>(this.url + "/calendar_month_data" + params)
  }

  getQuarter():Observable<string[][]> {
    return this.httpClient.get<string[][]>(this.url + "/quarter")
  }

  getQuarterData(year?: number, quarter?: number):Observable<any> {
    let params = ""
    if (year !== undefined) { 
      params = params + "?year=" + year 
      if (quarter !== undefined) { params = params + "&quarter=" + quarter }
    }
     
    return this.httpClient.get<any>(this.url + "/calendar_quarter_data" + params)
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
  
  loadData(){
    this.getYearData().subscribe(data => this.year.set(data))
    this.getQuarterData().subscribe(data => this.quarter.set(data))
    this.getMonthData().subscribe(data => this.month.set(data))
  }

  constructor() {
    this.loadData()
  }
}
