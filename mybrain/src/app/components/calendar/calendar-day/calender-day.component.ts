import { Component, input } from '@angular/core';
import { CalendarTileComponent } from "../calendar-tile/calendar-tile.component";
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";

@Component({
  selector: 'app-calender-day',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent],
  templateUrl: './calender-day.component.html',
  styleUrl: './calender-day.component.css'
})
export class CalenderDayComponent implements OnInit{
  calendarService = inject(CalendarService)
  weekday = ""
  day = input.required<string>()
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  ngOnInit(): void {
    this.calendarService.getWeekDay(this.day()).subscribe(day => {
      this.weekday = day
    })
  }

}
