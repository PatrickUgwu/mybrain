import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { CalendarService } from '../../../services/calendar.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CalendarTodoComponent, CalendarGoalComponent, AddButtonComponent],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit{
  roadmapService = inject(RoadmapService)
  calendarService = inject(CalendarService)
  today = input<string>("")
  monthData = signal<[string, ToDo[]][]>([])

  monthGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "month"))
  actions = computed<Action[]>( () => this.roadmapService.actions())

  todayIndex = computed<number[]>( () => { // [week, day]
    for (let i = 0; i < this.monthData().length; i++) {
      //check if day is today
      
      if (this.today() === this.monthData()[i][0]) {
        return [Math.floor(i / 7), i % 7]
      }
    }
    return [0,0]
  }) 

  ngOnInit(): void {
    this.calendarService.getMonth().subscribe(data => {
      this.monthData.set(data)
    })
  }
}
