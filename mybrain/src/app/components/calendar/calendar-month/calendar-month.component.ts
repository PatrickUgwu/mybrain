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
export class CalendarMonthComponent{
  roadmapService = inject(RoadmapService)
  calendarService = inject(CalendarService)

  monthGoals = computed<Goal[]>( () => this.roadmapService.goals().filter(goal => goal.type === "month"))
  actions = computed<Action[]>( () => this.roadmapService.actions())
  todayIndex = this.calendarService.today_idx()
}
