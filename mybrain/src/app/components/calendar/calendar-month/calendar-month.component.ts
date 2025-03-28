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
  goals = input.required<Goal[]>()
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  month:[string, Goal[]][] = [];

  ngOnInit(): void {
    this.calendarService.getMonthDays().subscribe(data => {
      
      data.forEach(date => {
        let day:[string, Goal[]] = ["",[]]
        day[0] = date
        
        this.goals().forEach(goal => {
          if (date === goal.deadline) {
            day[1].push(goal)
          }
        })

        this.month.push(day)
      })
      
    })
  }
}
