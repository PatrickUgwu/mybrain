import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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
  todos = signal<ToDo[]>([])

  getRoadmaps(): Observable<any> {
    return this.httpClient.get<any>(this.url + "/roadmaps")
  }

  getPossibleParents(type: string): Observable<string[]> {
    return this.httpClient.get<string[]>(this.url + "/possible_parents?type=" + type)
  }

  addItem(item: any, type: string): void {
    if (type === "action") { this.addAction(item) }
    else if (type === "roadmap") { this.addRoadmap(item) }
    else if (type === "milestone") { this.addMilestone(item) }
    else if (type === "goal") { this.addGoal(item) }
    else if (type === "todo") { this.addTodo(item) }
    else {throw new Error(`Unknown type ${type}`);}
  }

  getToDos(day: string): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>(this.url + "/todos?day=" + day)
  }

  addTodo(todo: ToDo): void {
    this.httpClient.post<ToDo>(this.url + "/todo", todo).subscribe({
      next: (newItem) => {
        this.todos.update(current => [...current, newItem])
      },
    })
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

  constructor() {
    this.getToDos("").subscribe(data => this.todos.set(data))
  }
}
