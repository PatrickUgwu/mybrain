import { Component, computed, inject } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-calendar-quarter',
  standalone: true,
  imports: [CalendarGoalComponent, AddButtonComponent],
  templateUrl: './calendar-quarter.component.html',
  styleUrl: './calendar-quarter.component.css'
})
export class CalendarQuarterComponent {
  calendarService = inject(CalendarService)
  roadmapService = inject(RoadmapService)

  quarterGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "quarter"))
  todayIndex = this.calendarService.today_idx()
}