import { Component, inject, input } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarTileComponent } from "../calendar-tile/calendar-tile.component";

@Component({
  selector: 'app-calendar-year',
  standalone: true,
  imports: [CalendarTileComponent],
  templateUrl: './calendar-year.component.html',
  styleUrl: './calendar-year.component.css'
})
export class CalendarYearComponent {
  VIEW = "year"
  calendarService = inject(CalendarService)
  year:string[] = []

  ngOnInit(): void {
    this.calendarService.getYear().subscribe(data => {
      this.year = data
    })
  }
}
