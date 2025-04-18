import { Component, inject, input, OnInit } from '@angular/core';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";

@Component({
  selector: 'app-calendar-quarter',
  standalone: true,
  imports: [CalendarTileComponent, CalendarGoalComponent],
  templateUrl: './calendar-quarter.component.html',
  styleUrl: './calendar-quarter.component.css'
})
export class CalendarQuarterComponent implements OnInit {
  VIEW = "quarter"
  calendarService = inject(CalendarService)
  quarterGoals = input.required<Goal[]>()
  monthGoals = input.required<Goal[]>()
  weekGoals = input.required<Goal[]>()
  todos = input.required<ToDo[]>()
  quarter:[string, Goal[], Goal[][]][] = []


  ngOnInit(): void {
    this.calendarService.getQuarter().subscribe(data => {
      data.forEach( month => {
        let quarterMonth: [string, Goal[], Goal[][]] = ["", [], [[],[],[],[],[]]]
        quarterMonth[0] = month[0]

        this.monthGoals().forEach( goal => {
          if (month[1] === goal.deadline.slice(5,7)) {
            quarterMonth[1].push(goal)
          }
        })

        this.weekGoals().forEach( goal => {
          if (month[1] === goal.deadline.slice(5,7)) {
            let index = Math.floor(Number(goal.deadline.slice(8)) / 7)
            console.log(Number(goal.deadline.slice(8)))
            console.log(index)
            quarterMonth[2][index].push(goal)
          }
        })

        this.quarter.push(quarterMonth)
        
      })
      console.log(this.quarter)
      
    })
  }
}