import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";
import { RoadmapService } from '../../../services/roadmap.service';
import { ItemOverviewComponent } from "../../roadmap/item-overview/item-overview.component";

@Component({
  selector: 'app-calender-day',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, AddWindowComponent, ItemOverviewComponent],
  templateUrl: './calender-day.component.html',
  styleUrl: './calender-day.component.css'
})
export class CalenderDayComponent implements OnInit{
  calendarService = inject(CalendarService)
  roadmapService = inject(RoadmapService)
  weekday = ""
  day = input.required<string>()
  actions = input.required<Action[]>()
  popup: [string, any] = ["", null]

  openPopup(popupType: string, item?: unknown) {
    this.popup[0] = popupType
    if (this.popup[0] !== "add") {
      this.popup[1] = item
    }
  }
  
  closePopup() {
    this.popup = ["", null]
  }

  ngOnInit(): void {
    this.calendarService.getWeekDay(this.day()).subscribe(day => {
      this.weekday = day
    })
  }

}
