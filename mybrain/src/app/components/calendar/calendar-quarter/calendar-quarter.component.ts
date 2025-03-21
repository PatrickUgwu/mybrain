import { Component, inject, input, OnInit } from '@angular/core';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';
import { ToDo } from '../../../models/interfaces/todo.interface';

@Component({
  selector: 'app-calendar-quarter',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calendar-quarter.component.html',
  styleUrl: './calendar-quarter.component.css'
})
export class CalendarQuarterComponent implements OnInit {
  VIEW = "quarter"
  calendarService = inject(CalendarService)
  todos = input.required<ToDo[]>()
  quarter:string[] = []


  ngOnInit(): void {
    this.calendarService.getQuarter().subscribe(data => {
      this.quarter = data
    })
  }
}