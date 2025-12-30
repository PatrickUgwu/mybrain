import { Component, computed, inject, signal } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { CalendarMilestoneComponent } from "../calendar-milestone/calendar-milestone.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-calendar-year',
  standalone: true,
  imports: [CalendarGoalComponent, CalendarMilestoneComponent, AddButtonComponent],
  templateUrl: './calendar-year.component.html',
  styleUrl: './calendar-year.component.css'
})
export class CalendarYearComponent {
  calendarService = inject(CalendarService)
  roadmapService = inject(RoadmapService)

  milestones = computed<Milestone[]>( () => this.roadmapService.milestones())
  year = signal<{
    "month_str": string, 
    "month_goals": Goal[], 
    "month_quarter_goals": Goal[]
  }[][]>([])
  

  ngOnInit(): void {    
    this.calendarService.getYearData().subscribe(data => {
      this.year.set(data)
      console.log("year ", this.year())
    })    
  }

}
