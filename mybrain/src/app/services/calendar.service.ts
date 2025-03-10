import { inject, Injectable } from '@angular/core';
import { Action } from '../models/interfaces/action.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../models/interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = "http://127.0.0.1:5000/api"
  httpClient = inject(HttpClient)

  getActions(): Observable<Action[]> {
    return this.httpClient.get<Action[]>(this.url + "/actions")
  }

  getToDos(): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>(this.url + "/todos")
  }

  constructor() { }
}
