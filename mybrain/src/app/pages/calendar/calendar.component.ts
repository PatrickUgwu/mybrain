import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Action } from '../../models/interfaces/action.interface';
import { ToDo } from '../../models/interfaces/todo.interface';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarWeekComponent } from '../../components/calendar/calendar-week/calendar-week.component';
import { CalendarMonthComponent } from '../../components/calendar/calendar-month/calendar-month.component';
import { CalendarQuarterComponent } from '../../components/calendar/calendar-quarter/calendar-quarter.component';
import { CalendarYearComponent } from "../../components/calendar/calendar-year/calendar-year.component";
import { Goal } from '../../models/interfaces/goal.interface';
import { Milestone } from '../../models/interfaces/milestone.interface';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalenderDayComponent, CalendarWeekComponent, CalendarMonthComponent, CalendarQuarterComponent, CalendarYearComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarService = inject(CalendarService)
  allGoals: Goal[] = []
  milestones = signal<Milestone[]>([])
  weekGoals = signal<Goal[]>([])
  monthGoals = signal<Goal[]>([])
  quarterGoals = signal<Goal[]>([])
  actions = signal<Action[]>([])
  todos = signal<ToDo[]>([])
  view = signal("day")
  day = signal("")
  
  ngOnInit(): void {
    this.calendarService.getMilestones().subscribe(data => {
      this.milestones.set(data)
    })
    
    this.calendarService.getGoals().subscribe(data => {
      this.allGoals = data

      this.allGoals.forEach( goal => {
        switch (goal.type) {
          case "week": {
            this.weekGoals().push(goal)
            break
          }
          case "month": {
            this.monthGoals().push(goal)
            break
          }
          case "quarter": {
            this.quarterGoals().push(goal)
            break
          }
          default: {
            console.warn("Wrong goal type!")
          }
        }
        
      })
      
    })

    this.calendarService.getActions().subscribe(data => {
      this.actions.set(data)
    })

    this.calendarService.getToDos(this.day()).subscribe(data => {
      this.todos.set(data)
    })
    
    
  }

  setView(view:string): void {
    this.view.set(view)

  }
}
