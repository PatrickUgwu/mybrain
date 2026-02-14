import { Component, computed, inject } from '@angular/core';
import { Action } from '../../../models/interfaces/action.interface';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarActionComponent } from "../calendar-action/calendar-action.component";
import { CalendarTodoComponent } from "../calendar-todo/calendar-todo.component";
import { CalendarGoalComponent } from "../calendar-goal/calendar-goal.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { RoadmapService } from '../../../services/roadmap.service';


@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CalendarActionComponent, CalendarTodoComponent, CalendarGoalComponent, AddButtonComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.css'
})
export class CalendarWeekComponent { 
  roadmapService = inject(RoadmapService)
  calendarService = inject(CalendarService)
  actions = computed<Action[]>( () => this.roadmapService.actions() )  
  todayIndex = this.calendarService.today_idx()
}
