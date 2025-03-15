import { Component, computed, inject, input, OnInit } from '@angular/core';
import { CalendarActionComponent } from '../calendar-action/calendar-action.component';
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';


@Component({
  selector: 'app-calendar-tile',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent],
  templateUrl: './calendar-tile.component.html',
  styleUrl: './calendar-tile.component.css'
})
export class CalendarTileComponent implements OnInit {
  calendarService = inject(CalendarService)
  view = input.required<string>(); 
  day = input.required<string>()
  name = ""
  todos: ToDo[] = []
  actions = input<Action[]>([])
  minHeight = "30%";
  maxHeight = "35%";

  ngOnInit(): void {
    if (this.view() == "week") {
      this.minHeight = "20%";
      this.maxHeight = "25%";
    }

    this.calendarService.getToDos(this.day()).subscribe(data => {
      this.todos = data
      console.log("in tile: " + this.day())
      console.log(this.todos)
    })

    this.calendarService.getWeekDay(this.day()).subscribe(data => {
      this.name = data
    })
    
  }
}
