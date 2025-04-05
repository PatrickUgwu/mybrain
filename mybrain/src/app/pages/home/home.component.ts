import { Component, inject, OnInit, signal } from '@angular/core';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarService } from '../../services/calendar.service';
import { NgControl } from '@angular/forms';
import { Action } from '../../models/interfaces/action.interface';
import { ToDo } from '../../models/interfaces/todo.interface';
import { KnowledgeService } from '../../services/knowledge.service';
import { MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalenderDayComponent, MarkdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  calendarService = inject(CalendarService)
  knowledgeService = inject(KnowledgeService)
  actions = signal<Action[]>([])
  todos = signal<ToDo[]>([])
  knowledge:any[] = []
  day = ""
  
  ngOnInit(): void {
    this.calendarService.getActions().subscribe(data => {
      this.actions.set(data)
    })

    this.calendarService.getToDos(this.day).subscribe(data => {
      this.todos.set(data)
    })

    this.knowledgeService.getKnowledge().subscribe(data => {
      this.knowledge = data
    })
  }
}
