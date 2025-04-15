import { Component, inject, input, OnInit } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarTileComponent } from '../calendar-tile/calendar-tile.component';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";


@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, CalendarGoalComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.css'
})
export class CalendarWeekComponent implements OnInit { 
  VIEW = "week"
  today = input<string>("")
  todayIndex?:number;
  calendarService = inject(CalendarService)
  goals = input<Goal[]>([])
  actions = input.required<Action[]>()
  todos = input.required<ToDo[]>()
  week:string[] = ["Mon","Thu","Wed","Thu","Fri","Sat","Sun"]
  
  
  ngOnInit(): void {
    this.calendarService.getWeek().subscribe(data => {
      
      for (let index = 0; index < data.length; index++) {
        if (this.today() === data[index]) {
          this.todayIndex = index
       }
      }
       

        //this.week.push(day)
      

    })
    
  }

}
