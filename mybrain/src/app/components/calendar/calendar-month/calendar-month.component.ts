import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit{
  VIEW = "month"
  calendarService = inject(CalendarService)
  monthGoals = input.required<Goal[]>()
  weekGoals = input.required<Goal[]>()
  actions = input.required<Action[]>()
  month:[[string, ToDo[]][], Goal[]][] = [];

  ngOnInit(): void {
    this.calendarService.getMonth().subscribe(data => {
      let week:[[string, ToDo[]][], Goal[]] = [[],[]] // [ [Date, ToDos][], weekGoals[] ]
      for (let i = 0; i < data.length; i++) {

        // add day to week
        if (data[i][0] === null) {
          week[0].push(["-", data[i][1]]) // add day outside month
        }
        else {
          week[0].push([data[i][0].slice(8,10), data[i][1]]) // add day inside month
        }

        // add to week goals
        this.weekGoals().forEach(goal => {
          if (data[i][0] === goal.deadline) {
            week[1].push(goal)
          }
        })

        // add and reset week
        if (i % 7 === 6) {
          this.month.push(week)
          week = [[],[]]
        }
      }
    })
  }
}
