import { Component, input } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';


@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.css'
})
export class CalendarWeekComponent {
  VIEW = "week"
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
}
