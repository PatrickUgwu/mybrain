import { Component, inject, input } from '@angular/core';
import { ItemOverviewComponent } from "../../roadmap/item-overview/item-overview.component";
import { ToDo } from '../../../models/interfaces/todo.interface';
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-calendar-todo',
  standalone: true,
  imports: [ItemOverviewComponent],
  templateUrl: './calendar-todo.component.html',
  styleUrl: './calendar-todo.component.css'
})
export class CalendarTodoComponent {
  roadmapService = inject(RoadmapService)
  self = input.required<ToDo>()
  popup: string = ""
  
  openPopup(popupType: string) {
    this.popup = popupType
  }

  closePopup(): void {
    this.popup = ""
  }

}
