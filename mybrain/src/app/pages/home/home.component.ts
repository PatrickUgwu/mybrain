import { Component, inject, OnInit, signal } from '@angular/core';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarService } from '../../services/calendar.service';
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
  knowledge:any[] = []
  day = ""
  
  ngOnInit(): void {
    this.knowledgeService.getKnowledge().subscribe(data => {
      this.knowledge = data
    })
  }
}
