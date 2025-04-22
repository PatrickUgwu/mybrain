import { Component, inject, input, OnInit } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";

@Component({
  selector: 'app-calendar-quarter',
  standalone: true,
  imports: [CalendarGoalComponent, AddWindowComponent],
  templateUrl: './calendar-quarter.component.html',
  styleUrl: './calendar-quarter.component.css'
})
export class CalendarQuarterComponent implements OnInit {
  calendarService = inject(CalendarService)
  quarterGoals = input.required<Goal[]>()
  monthGoals = input.required<Goal[]>()
  weekGoals = input.required<Goal[]>()
  quarter:[string, Goal[], Goal[][]][] = []
  add = false

  openAddWindow() {
    this.add = true
  }
  
  closeAddWindow() {
    this.add = false
  }

  ngOnInit(): void {
    this.calendarService.getQuarter().subscribe(data => {
      data.forEach( month => {
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

        this.quarter.push(quarterMonth)
        
      })
    })
  }
}