import { Component, inject, input } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { CalendarMilestoneComponent } from "../calendar-milestone/calendar-milestone.component";

@Component({
  selector: 'app-calendar-year',
  standalone: true,
  imports: [CalendarGoalComponent, CalendarMilestoneComponent],
  templateUrl: './calendar-year.component.html',
  styleUrl: './calendar-year.component.css'
})
export class CalendarYearComponent {
  VIEW = "year"
  calendarService = inject(CalendarService)
  milestones = input.required<Milestone[]>()
  quarterGoals = input.required<Goal[]>()
  monthGoals = input.required<Goal[]>()
  year:[string[], Goal[], Goal[][]][] = []

  ngOnInit(): void {
    this.calendarService.getYear().subscribe(data => {
      let yearQuarter: [string[], Goal[], Goal[][]] = [[], [], [[],[],[]]]
      for (let i = 0; i < data.length; i++) {
        yearQuarter[0].push(data[i][0])

        this.quarterGoals().forEach( goal => {
          if (data[i][1] === goal.deadline.slice(5,7)) {
            yearQuarter[1].push(goal)
          }
        })

        this.monthGoals().forEach( goal => {
          if (data[i][1] === goal.deadline.slice(5,7)) {
            yearQuarter[2][i].push(goal)
          }
        })

        if (Number(data[i][1]) % 3 === 0) {
          this.year.push(yearQuarter)
          yearQuarter = [[], [], [[],[],[]]]
        }
      }
      
    })
    
  }
}
