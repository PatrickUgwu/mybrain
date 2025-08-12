import { Component, inject, input, OnInit } from '@angular/core';
import { ItemOverviewComponent } from "../../roadmap/item-overview/item-overview.component";
import { RoadmapService } from '../../../services/roadmap.service';
import { Action } from '../../../models/interfaces/action.interface';

@Component({
  selector: 'app-calendar-action',
  standalone: true,
  imports: [ItemOverviewComponent],
  templateUrl: './calendar-action.component.html',
  styleUrl: './calendar-action.component.css'
})
export class CalendarActionComponent{
  roadmapService = inject(RoadmapService)
  self = input.required<Action>()
  popup = ""

  openPopup(popupType: string) {
    this.popup = popupType
  }

  closePopup(): void {
    this.popup = ""
  }
}
