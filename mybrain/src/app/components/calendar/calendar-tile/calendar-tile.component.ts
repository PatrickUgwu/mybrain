import { Component, computed, input } from '@angular/core';
import { CalendarActionComponent } from '../calendar-action/calendar-action.component';
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';


@Component({
  selector: 'app-calendar-tile',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent],
  templateUrl: './calendar-tile.component.html',
  styleUrl: './calendar-tile.component.css'
})
export class CalendarTileComponent {
  currentView = input.required<string>(); 
  actions = input<Action[]>([])
  todos = input<ToDo[]>([])
  minHeight = "30%";
  maxHeight = "35%";

  
  
  view = computed( () => {
    let view = this.currentView()
    if (view === "day") {return "Day"}
    else if (view === "week") {
      this.minHeight = "20%";
      this.maxHeight = "25%";
      return "Weekday";
    }
    else if (view === "month") {return "Monthday"}
    else {return "view not found"}
  })
}
