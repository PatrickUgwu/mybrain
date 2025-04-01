import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calendar-milestone',
  standalone: true,
  imports: [],
  templateUrl: './calendar-milestone.component.html',
  styleUrl: './calendar-milestone.component.css'
})
export class CalendarMilestoneComponent {
  title = input.required<string>()
}
