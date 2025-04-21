import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";

@Component({
  selector: 'app-calender-day',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, AddWindowComponent],
  templateUrl: './calender-day.component.html',
  styleUrl: './calender-day.component.css'
})
export class CalenderDayComponent implements OnInit{
  calendarService = inject(CalendarService)
  weekday = ""
  day = input.required<string>()
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  add = false

  openAddWindow() {
    this.add = true
  }
  
  closeAddWindow() {
    this.add = false
  }

  ngOnInit(): void {
    this.calendarService.getWeekDay(this.day()).subscribe(day => {
      this.weekday = day
    })
  }

}
