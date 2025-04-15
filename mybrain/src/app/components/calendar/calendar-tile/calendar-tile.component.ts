import { Component, computed, inject, input, OnInit } from '@angular/core';
import { CalendarActionComponent } from '../calendar-action/calendar-action.component';
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { Goal } from '../../../models/interfaces/goal.interface';


@Component({
  selector: 'app-calendar-tile',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, CalendarGoalComponent],
  templateUrl: './calendar-tile.component.html',
  styleUrl: './calendar-tile.component.css'
})
export class CalendarTileComponent implements OnInit {
  calendarService = inject(CalendarService)
  view = input.required<string>(); 
  day = input<string>("")
  month = input<string>("")
  name = ""
  todos: ToDo[] = []
  actions = input<Action[]>([])
  goals = input<Goal[]>([])
  minHeight = "30%";
  maxHeight = "35%";

  ngOnInit(): void {
    if (this.view() == "week") {
      this.minHeight = "20%";
      this.maxHeight = "25%";
    }
    if (this.view() === "quarter" || this.view() === "year") {
      this.name = this.month()
    } 
    else if (this.view() === "month") {
      if (this.day() === null) {
        this.name = "-"
      }
      else {
        this.name = this.day().slice(8,10)
      }
      
    }
    else{
      this.calendarService.getWeekDay(this.day()).subscribe(data => {
        this.name = data
      })
    }
    if (this.view() !== "month") {
      this.calendarService.getToDos(this.day()).subscribe(data => {
        this.todos = data
      })
    }
    

  }
}
