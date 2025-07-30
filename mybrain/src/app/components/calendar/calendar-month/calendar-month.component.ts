import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CalendarTodoComponent, CalendarGoalComponent, AddButtonComponent],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit{
  roadmapService = inject(RoadmapService)
  calendarService = inject(CalendarService)
  today = input<string>("")
  monthData = signal<[string, ToDo[]][]>([])

  monthGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "month"))
  weekGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "week"))
  actions = computed<Action[]>( () => this.roadmapService.actions())

  month = computed<[[string, ToDo[]][], Goal[]][]>( () => {
    let week:[[string, ToDo[]][], Goal[]] = [[],[]] // [ [Date, ToDos[]][], weekGoals[] ]
    let month: [[string, ToDo[]][], Goal[]][] = []
    for (let i = 0; i < this.monthData().length; i++) {
      let dayTodos = this.roadmapService.todos().filter(todo => todo.deadline === this.monthData()[i][0])
      // add day to week
      if (this.monthData()[i][0] === null) {
        week[0].push(["-", dayTodos]) // add day outside month
      }
      else {
        week[0].push([this.monthData()[i][0].slice(8,10), dayTodos]) // add day inside month
      }

      // add to week goals
      this.weekGoals().forEach(goal => {
        if (this.monthData()[i][0] === goal.deadline) {
          week[1].push(goal)
        }
      })
      
      // add and reset week
      if (i % 7 === 6) {
        month.push(week)
        week = [[],[]]
      }
    }
    return month
  })

  todayIndex = computed<number[]>( () => { // [week, day]
    for (let i = 0; i < this.monthData().length; i++) {
      //check if day is today
      
      if (this.today() === this.monthData()[i][0]) {
        return [Math.floor(i / 7), i % 7]
      }
    }
    return [0,0]
  }) 

  ngOnInit(): void {
    this.calendarService.getMonth().subscribe(data => {
      this.monthData.set(data)
    })
  }
}
