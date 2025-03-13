import { Component, inject, OnInit, signal } from '@angular/core';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarService } from '../../services/calendar.service';
import { NgControl } from '@angular/forms';
import { Action } from '../../models/interfaces/action.interface';
import { ToDo } from '../../models/interfaces/todo.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalenderDayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  calendarService = inject(CalendarService)
  actions = signal<Action[]>([])
  todos = signal<ToDo[]>([])
  
  ngOnInit(): void {
    this.calendarService.getActions().subscribe(data => {
      this.actions.set(data)
    })

    this.calendarService.getToDos().subscribe(data => {
      this.todos.set(data)
    })
  }
}
