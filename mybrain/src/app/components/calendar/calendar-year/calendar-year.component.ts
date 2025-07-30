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
  quarterGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "quarter"))
  monthGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "month"))
  yearData = signal<string[][]>([])

  year = computed<[string[], Goal[], Goal[][]][]>( () => {
    let year: [string[], Goal[], Goal[][]][] = []
    let yearQuarter: [string[], Goal[], Goal[][]] = [[], [], [[],[],[]]]
    let monthGoalIndex:number = 0
    for (let i = 0; i < this.yearData().length; i++) {
      yearQuarter[0].push(this.yearData()[i][0])

      this.quarterGoals().forEach( goal => {
        if (this.yearData()[i][1] === goal.deadline.slice(5,7)) {
          yearQuarter[1].push(goal)
        }
      })

      this.monthGoals().forEach( goal => {
        if (this.yearData()[i][1] === goal.deadline.slice(5,7)) {
          yearQuarter[2][monthGoalIndex].push(goal)
        }
      })

      monthGoalIndex++

      if (Number(this.yearData()[i][1]) % 3 === 0) {
        year.push(yearQuarter)
        yearQuarter = [[], [], [[],[],[]]]
        monthGoalIndex = 0
      }
    }
    return year
  })
  

  ngOnInit(): void {
    this.calendarService.getYear().subscribe(data => {
      this.yearData.set(data)
    })    
  }

}
