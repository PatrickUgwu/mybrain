import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calendar-action',
  standalone: true,
  imports: [],
  templateUrl: './calendar-action.component.html',
  styleUrl: './calendar-action.component.css'
})
export class CalendarActionComponent {
  title = input.required<string>()
}
