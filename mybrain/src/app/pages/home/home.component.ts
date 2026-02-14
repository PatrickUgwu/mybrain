import { Component, inject, OnInit, signal } from '@angular/core';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarService } from '../../services/calendar.service';
import { KnowledgeService } from '../../services/knowledge.service';
import { Page } from '../../models/interfaces/page.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalenderDayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  calendarService = inject(CalendarService)
  knowledgeService = inject(KnowledgeService)
  knowledge:any[] = []
  recentPages = signal<Page[]>([])
  day = ""
  
  ngOnInit(): void {
    this.knowledgeService.getKnowledge().subscribe(data => {
      this.knowledge = data
    })

    this.knowledgeService.getRecentPages().subscribe(pages => {
      this.recentPages.set(pages)
    })
  }
}
