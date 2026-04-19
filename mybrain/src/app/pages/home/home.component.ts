import { Component, computed, inject } from '@angular/core';
import { CalenderDayComponent } from "../../components/calendar/calendar-day/calender-day.component";
import { CalendarService } from '../../services/calendar.service';
import { KnowledgeService } from '../../services/knowledge.service';
import { Page } from '../../models/interfaces/page.interface';
import { PageComponent } from "../../components/knowledge/page/page.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalenderDayComponent, PageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  calendarService = inject(CalendarService)
  knowledgeService = inject(KnowledgeService)
  recentPages = computed<Page[]>( () => this.knowledgeService.recentPages())
  day = ""

  // popup -> into component later
  popup = {"display" : false, "itemType" : "", "item" : null}

  openPopup(itemType: string, item: any, event: Event) {
    event.stopPropagation();
    this.popup.display = true
    this.popup.itemType = itemType
    this.popup.item = item
  }

  closePopup(): void {
    this.popup.display = false
    this.popup.itemType = ""
    this.popup.item = null
  }
  
}
