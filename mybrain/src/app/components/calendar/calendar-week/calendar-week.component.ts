import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";


@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, CalendarGoalComponent, AddWindowComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.css'
})
export class CalendarWeekComponent implements OnInit { 
  VIEW = "week"
  today = input<string>("")
  todayIndex?:number;
  calendarService = inject(CalendarService)
  goals = input<Goal[]>([])
  actions = input.required<Action[]>()
  todos: ToDo[][] = []
  week:string[] = ["Mon","Thu","Wed","Thu","Fri","Sat","Sun"]
  add = false
  
  openAddWindow() {
    this.add = true
  }
  
  closeAddWindow() {
    this.add = false
  }

  ngOnInit(): void {
    this.calendarService.getWeek().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        // add todos
        this.todos[index] = data[index][1]

        //check if day is today
        if (this.today() === data[index][0]) {
          this.todayIndex = index
        }
      }
    })
    
  }

}
