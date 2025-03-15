import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';


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
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  week:string[] = []
  
  
  ngOnInit(): void {
    this.calendarService.getWeekDays().subscribe(data => {
      this.week = data
      console.log(this.week)
    })
  }
}
