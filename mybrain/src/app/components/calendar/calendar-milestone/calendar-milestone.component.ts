import { Component, inject, input } from '@angular/core';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { RoadmapService } from '../../../services/roadmap.service';
import { ItemOverviewComponent } from "../../roadmap/item-overview/item-overview.component";

@Component({
  selector: 'app-calendar-milestone',
  standalone: true,
  imports: [ItemOverviewComponent],
  templateUrl: './calendar-milestone.component.html',
  styleUrl: './calendar-milestone.component.css'
})
export class CalendarMilestoneComponent {
  roadmapService = inject(RoadmapService)
  self = input.required<Milestone>()
  popup = ""

  openPopup(popupType: string) {
    this.popup = popupType
  }

  closePopup(): void {
    this.popup = ""
  }
}
