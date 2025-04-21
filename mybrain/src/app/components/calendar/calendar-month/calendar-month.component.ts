import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CalendarTodoComponent, CalendarGoalComponent, AddWindowComponent],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit{
  calendarService = inject(CalendarService)
  monthGoals = input.required<Goal[]>()
  weekGoals = input.required<Goal[]>()
  actions = input.required<Action[]>()
  month:[[string, ToDo[]][], Goal[]][] = [];
  add =  false

  openAddWindow() {
    this.add = true
  }
  
  closeAddWindow() {
    this.add = false
  }

  ngOnInit(): void {
    this.calendarService.getMonth().subscribe(data => {
      let week:[[string, ToDo[]][], Goal[]] = [[],[]] // [ [Date, ToDos[]][], weekGoals[] ]
      for (let i = 0; i < data.length; i++) {

        // add day to week
        if (data[i][0] === null) {
          week[0].push(["-", data[i][1]]) // add day outside month
        }
        else {
          week[0].push([data[i][0].slice(8,10), data[i][1]]) // add day inside month
        }

        // add to week goals
        this.weekGoals().forEach(goal => {
          if (data[i][0] === goal.deadline) {
            week[1].push(goal)
          }
        })

        // add and reset week
        if (i % 7 === 6) {
          this.month.push(week)
          week = [[],[]]
        }
      }
    })
  }
}
