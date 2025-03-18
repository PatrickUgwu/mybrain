import { inject, Injectable } from '@angular/core';
import { Action } from '../models/interfaces/action.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../models/interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)

  getActions(): Observable<Action[]> {
    return this.httpClient.get<Action[]>(this.url + "/actions")
  }

  getToDos(day: string): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>(this.url + "/todos?day=" + day)
  }

  getWeekDays():Observable<string[]> {
    return this.httpClient.get<string[]>(this.url + "/weekdays")
  }

  getWeekDay(day: string):Observable<string> {
    return this.httpClient.get<string>(this.url + "/weekday?day=" + day)
  }

  getMonthDays():Observable<string[]> {
    return this.httpClient.get<string[]>(this.url + "/monthdays")
  }

  constructor() { }
}
