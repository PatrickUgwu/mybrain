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
  actions = signal<Action[]>([])
  goals = signal<Goal[]>([])
  milestones = signal<Milestone[]>([])
  roadmaps = signal<any[]>([])

  getRoadmaps(): Observable<any> {
    return this.httpClient.get<any>(this.url + "/roadmaps")
  }

  getPossibleParents(type: string): Observable<string[]> {
    return this.httpClient.get<string[]>(this.url + "/possible_parents?type=" + type)
  }

  getParent(itemType: string, itemID: any) : Observable<Milestone|Goal|Action|ToDo> {
    return this.httpClient.get<Milestone|Goal|Action|ToDo>(this.url + "/parent?item_type=" + itemType + "&item_id=" + itemID)
  }

  addItem(item: any, type: string): void {
    if (type === "action") { this.addAction(item) }
    else if (type === "roadmap") { this.addRoadmap(item) }
    else if (type === "milestone") { this.addMilestone(item) }
    else if (type === "goal") { this.addGoal(item) }
    else if (type === "todo") { this.addTodo(item) }
    else {throw new Error(`Unknown type ${type}`);}
  }

  deleteItem(itemID: number, type: string): void {
    if (type === "action") { this.deleteAction(itemID) }
    else if (type === "todo") { this.deleteTodo(itemID) }
    else if (type === "goal") { this.deleteGoal(itemID) }
    else if (type === "milestone") { this.deleteMilestone(itemID) }
    else {throw new Error(`Unknown type ${type}`);}
  }

  getToDos(day: string): Observable<ToDo[]> {
    return this.httpClient.get<ToDo[]>(this.url + "/todos?day=" + day)
  }

  addTodo(todo: ToDo): void {
    this.httpClient.post<ToDo>(this.url + "/todo", todo).subscribe(newTodo => {
        this.todos.update(current => [...current, newTodo])
    })
  }

  deleteTodo(todoID: number) {
    this.httpClient.delete(this.url + "/todo/" + todoID).subscribe(() => {
      this.todos.update(current => current.filter(todo => todo.id !== todoID))
    })
  }

  getActions(): Observable<Action[]> {
    return this.httpClient.get<Action[]>(this.url + "/actions")
  }

  addAction(action: Action): void {
    this.httpClient.post<Action>(this.url + "/action", action).subscribe(newAction => {
        this.actions.update(current => [...current, newAction])
    })
  }

  deleteAction(actionID: number) {
    this.httpClient.delete(this.url + "/action/" + actionID).subscribe(() => {
      this.actions.update(current => current.filter(action => action.id !== actionID))
    })
  }

  getGoals(): Observable<Goal[]> {
    return this.httpClient.get<Goal[]>(this.url + "/goals")
  }

  addGoal(goal: Goal): void {
    this.httpClient.post<Goal>(this.url + "/goal", goal).subscribe(newGoal => {
      this.goals.update(current => [...current, newGoal])
    })
  }

  deleteGoal(goalID: number): void {
    this.httpClient.delete(this.url + "/goal/" + goalID).subscribe(() => {
      this.goals.update(current => current.filter(goal => goal.id !== goalID))
      this.actions.update(current => current.filter(action => action.parent_id != goalID.toString()));
    })
  }

  getMilestones(): Observable<Milestone[]> {
    return this.httpClient.get<Milestone[]>(this.url + "/milestones")
  }

  addMilestone(milestone: Milestone): void {
    this.httpClient.post<Milestone>(this.url + "/milestone", milestone).subscribe(newMilestone => {
      this.milestones.update(current => [...current, newMilestone])
    })
  }

  deleteMilestone(milestoneID: number): void {
    this.httpClient.delete(this.url + "/milestone/" + milestoneID).subscribe(() => {
      this.milestones.update(current => current.filter(milestone => milestone.id !== milestoneID))
      this.goals.update(current => current.filter(goal => goal.parent_id != milestoneID.toString()))
    })
  }

  addRoadmap(roadmap: any): void {
    this.httpClient.post<any>(this.url + "/roadmap", roadmap).subscribe(() => {
      
    })
  }

  constructor() {
    this.getToDos("all").subscribe(data => this.todos.set(data))
    this.getActions().subscribe(data => this.actions.set(data))
    this.getGoals().subscribe(data => this.goals.set(data))
    this.getMilestones().subscribe(data => this.milestones.set(data))
  }
}
