import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calendar-todo',
  standalone: true,
  imports: [],
  templateUrl: './calendar-todo.component.html',
  styleUrl: './calendar-todo.component.css'
})
export class CalendarTodoComponent {
  title = input.required<string>()
}
