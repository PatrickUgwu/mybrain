import { Component, inject, input, OnInit } from '@angular/core';
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
  today = input<string>("") // to mark the current day
  todayIndex?:number;
  calendarService = inject(CalendarService)
  goals = input<Goal[]>([])
  actions = input.required<Action[]>()
  todos: ToDo[][] = []
  week:string[] = ["Mon","Thu","Wed","Thu","Fri","Sat","Sun"]
  popup: [string, any] = ["", null]

  openPopup(popupType: string, item?: unknown) {
    this.popup[0] = popupType
    if (this.popup[0] !== "add") {
      this.popup[1] = item
    }
  }
  
  closePopup() {
    this.popup = ["", null]
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
