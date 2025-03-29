import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';


@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.css'
})
export class CalendarWeekComponent implements OnInit { 
  VIEW = "week"
  day = input("")
  calendarService = inject(CalendarService)
  goals = input<Goal[]>([])
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  week:[string, Goal[]][] = []
  
  
  ngOnInit(): void {
    this.calendarService.getWeekDays().subscribe(data => {
      
      for (let index = 0; index < data.length; index++) {
        let day:[string, Goal[]] = ["",[]];
        day[0] = data[index]
        
        this.goals().forEach(goal => {
          if (data[index] === goal.deadline) {
            day[1].push(goal)
          }
        })

        this.week.push(day)
      }

    })
    
  }

}
