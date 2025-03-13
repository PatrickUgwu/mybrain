import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Action } from '../../models/interfaces/action.interface';
import { ToDo } from '../../models/interfaces/todo.interface';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarWeekComponent } from "../../calendar-week/calendar-week.component";
import { CalendarMonthComponent } from '../../components/calendar/calendar-month/calendar-month.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalenderDayComponent, CalendarWeekComponent, CalendarMonthComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarService = inject(CalendarService)
  actions = signal<Action[]>([])
  todos = signal<ToDo[]>([])
  view = signal("day")
  
  ngOnInit(): void {
    this.calendarService.getActions().subscribe(data => {
      this.actions.set(data)
    })

    this.calendarService.getToDos().subscribe(data => {
      this.todos.set(data)
    })
  }

  setView(view:string): void {
    this.view.set(view)

  }
}
