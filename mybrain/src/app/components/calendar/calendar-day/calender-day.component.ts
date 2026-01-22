import { Component, computed, inject, input, OnInit } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { RoadmapService } from '../../../services/roadmap.service';
import { AddButtonComponent } from "../add-button/add-button.component";
import { ToDo } from '../../../models/interfaces/todo.interface';

@Component({
  selector: 'app-calender-day',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, AddButtonComponent],
  templateUrl: './calender-day.component.html',
  styleUrl: './calender-day.component.css'
})
export class CalenderDayComponent{
  calendarService = inject(CalendarService)
  roadmapService = inject(RoadmapService)
  
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
}
