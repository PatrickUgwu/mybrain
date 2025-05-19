import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '../models/interfaces/action.interface';
import { Goal } from '../models/interfaces/goal.interface';
import { Milestone } from '../models/interfaces/milestone.interface';
import { ToDo } from '../models/interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)

  getRoadmaps(): Observable<any> {
    return this.httpClient.get<any>(this.url + "/roadmaps")
  }

  getPossibleParents(type: string): Observable<string[]> {
    return this.httpClient.get<string[]>(this.url + "/possible_parents?type=" + type)
  }

  addItem(item: any, type: string): Observable<any> {
    if (type === "action") { return this.addAction(item) }
    else if (type === "roadmap") { return this.addRoadmap(item) }
    else if (type === "milestone") { return this.addMilestone(item) }
    else if (type === "goal") { return this.addGoal(item) }
    else if (type === "todo") { return this.addTodo(item) }
    throw new Error(`Unknown type ${type}`);
  }

  addTodo(todo: ToDo): Observable<ToDo> {
    return this.httpClient.post<ToDo>(this.url + "/todo", todo)
  }

  addAction(action: Action): Observable<Action> {
    return this.httpClient.post<Action>(this.url + "/action", action)
  }

  addGoal(goal: Goal): Observable<Goal> {
    return this.httpClient.post<Goal>(this.url + "/goal", goal)
  }

  addMilestone(milestone: Milestone): Observable<Milestone> {
    return this.httpClient.post<Milestone>(this.url + "/milestone", milestone)
  }

  addRoadmap(roadmap: any): Observable<any> {
    return this.httpClient.post<any>(this.url + "/roadmap", roadmap)
  }

  constructor() { }
}
