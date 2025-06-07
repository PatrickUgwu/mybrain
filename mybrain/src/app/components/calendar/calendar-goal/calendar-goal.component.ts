import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-calendar-goal',
  standalone: true,
  imports: [],
  templateUrl: './calendar-goal.component.html',
  styleUrl: './calendar-goal.component.css'
})
export class CalendarGoalComponent {
  self = input.required<Goal>()
}
