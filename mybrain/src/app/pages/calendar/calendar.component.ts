import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarWeekComponent } from '../../components/calendar/calendar-week/calendar-week.component';
import { CalendarMonthComponent } from '../../components/calendar/calendar-month/calendar-month.component';
import { CalendarQuarterComponent } from '../../components/calendar/calendar-quarter/calendar-quarter.component';
import { CalendarYearComponent } from "../../components/calendar/calendar-year/calendar-year.component";


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalenderDayComponent, CalendarWeekComponent, CalendarMonthComponent, CalendarQuarterComponent, CalendarYearComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  calendarService = inject(CalendarService)
  view = signal("day")

  setView(view:string): void {
    this.view.set(view)
  }
}
