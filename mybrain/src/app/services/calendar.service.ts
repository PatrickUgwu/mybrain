import { inject, Injectable } from '@angular/core';
import { Action } from '../models/interfaces/action.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../models/interfaces/todo.interface';
import { Goal } from '../models/interfaces/goal.interface';
import { Milestone } from '../models/interfaces/milestone.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)

  getMilestones(): Observable<Milestone[]> {
    return this.httpClient.get<Milestone[]>(this.url + "/milestones")
  }

  getGoals(): Observable<Goal[]> {
    return this.httpClient.get<Goal[]>(this.url + "/goals")
  }
  
  getToday(): Observable<string> {
    return this.httpClient.get<string>(this.url + "/today")
  }
  
  getActions(): Observable<Action[]> {
    return this.httpClient.get<Action[]>(this.url + "/actions")
  }

  getToDos(day: string): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>(this.url + "/todos?day=" + day)
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

  getQuarter():Observable<[string[]]> {
    return this.httpClient.get<[string[]]>(this.url + "/quarter")
  }

  getYear():Observable<[string[]]> {
    return this.httpClient.get<[string[]]>(this.url + "/year")
  }

  constructor() { }
}
