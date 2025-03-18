import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';

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
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  month:string[] = [];

  ngOnInit(): void {
    this.calendarService.getMonthDays().subscribe(data => {
      this.month = data
    })
  }
}
