import { Component, input } from '@angular/core';
import { CalendarTileComponent } from "../calendar-tile/calendar-tile.component";
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';

@Component({
  selector: 'app-calender-day',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calender-day.component.html',
  styleUrl: './calender-day.component.css'
})
export class CalenderDayComponent {
  VIEW = "day"
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()

}
