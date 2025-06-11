import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { RoadmapService } from '../../../services/roadmap.service';


@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, CalendarGoalComponent, AddButtonComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.css'
})
export class CalendarWeekComponent implements OnInit { 
  roadmapService = inject(RoadmapService)
  calendarService = inject(CalendarService)
  today = input<string>("") // to mark the current day
  week:string[] = ["Mon","Thu","Wed","Thu","Fri","Sat","Sun"]
  
  weekData = signal<[string,ToDo[]][]>([])
  todos = computed<ToDo[][]>( () => {
    let allTodos = this.roadmapService.todos()
    let weekTodos: ToDo[][] = []
    for (let index = 0; index < this.weekData().length; index++) {
      let matches = allTodos.filter(todo => todo.deadline === this.weekData()[index][0])
      weekTodos.push(matches)
    }
    return weekTodos
  })
  actions = computed<Action[]>( () => {return this.roadmapService.actions()})
  weekGoals = computed<Goal[]>( () => { return this.roadmapService.goals().filter(goal => goal.type === "week")})
  todayIndex = computed<number>( () => {
    for (let index = 0; index < this.weekData().length; index++) {
      if (this.today() === this.weekData()[index][0]) {
        return index
      }
    }
    return -1
  })

  ngOnInit(): void {
    this.calendarService.getWeek().subscribe(data => {
      this.weekData.set(data)
    })
  }
}
