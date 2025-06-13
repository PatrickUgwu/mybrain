import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
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
export class CalendarQuarterComponent implements OnInit {
  calendarService = inject(CalendarService)
  roadmapService = inject(RoadmapService)

  quarterGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "quarter"))
  monthGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "month"))
  weekGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "week"))
  quarterData = signal<string[][]>([])
  quarter = computed<[string, Goal[], Goal[][]][]>( () => {
    let quarter: [string, Goal[], Goal[][]][] = []
    this.quarterData().forEach( month => {
      let quarterMonth: [string, Goal[], Goal[][]] = ["", [], [[],[],[],[],[]]] // [name, monthGoals[] [weekGoals/week]]
      quarterMonth[0] = month[0]

      this.monthGoals().forEach( goal => {
        if (month[1] === goal.deadline.slice(5,7)) {
          quarterMonth[1].push(goal)
        }
      })

      this.weekGoals().forEach( goal => {
        if (month[1] === goal.deadline.slice(5,7)) {
          let index = Math.floor(Number(goal.deadline.slice(8)) / 7)
          quarterMonth[2][index].push(goal)
        }
      })

      quarter.push(quarterMonth)
      
    })
    return quarter
  })

  

  ngOnInit(): void {
    this.calendarService.getQuarter().subscribe(data => {
      this.quarterData.set(data)
    })
  }
}