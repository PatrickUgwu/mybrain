import { Component, input } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent {
  VIEW = "month"
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  days = Array.from({ length: 30 }, (_, i) => i + 1);
}
