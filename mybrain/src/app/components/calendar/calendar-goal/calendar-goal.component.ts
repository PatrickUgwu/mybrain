import { Component, inject, input, signal } from '@angular/core';
import { Goal } from '../../../models/interfaces/goal.interface';
import { RoadmapService } from '../../../services/roadmap.service';
import { ItemOverviewComponent } from "../../roadmap/item-overview/item-overview.component";

@Component({
  selector: 'app-calendar-goal',
  standalone: true,
  imports: [ItemOverviewComponent],
  templateUrl: './calendar-goal.component.html',
  styleUrl: './calendar-goal.component.css'
})
export class CalendarGoalComponent {
  roadmapService = inject(RoadmapService)
  self = input.required<Goal>()
  popup = ""

  openPopup(popupType: string) {
    this.popup = popupType
  }

  closePopup(): void {
    this.popup = ""
  }
}
