import { Component, computed, inject } from '@angular/core';
import { RoadmapService } from '../../../services/roadmap.service';
import { Roadmap } from '../../../models/interfaces/roadmap.interface';
import { AddButtonComponent } from "../../calendar/add-button/add-button.component";
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { Goal } from '../../../models/interfaces/goal.interface';
import { Action } from '../../../models/interfaces/action.interface';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { ItemOverviewComponent } from "../item-overview/item-overview.component";

@Component({
  selector: 'app-roadmap-overview',
  standalone: true,
  imports: [AddButtonComponent, ItemOverviewComponent],
  templateUrl: './roadmap-overview.component.html',
  styleUrl: './roadmap-overview.component.css'
})
export class RoadmapOverviewComponent {
  roadmapService = inject(RoadmapService)

  roadmaps = computed<Roadmap[]>( () => this.roadmapService.roadmaps() )
  milestones = computed<Milestone[]>( () => this.roadmapService.milestones() )
  goals = computed<Goal[]>( () => this.roadmapService.goals() )
  actions = computed<Action[]>( () => this.roadmapService.actions())
  todos = computed<ToDo[]>( () => this.roadmapService.todos() )

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

  deleteItem(item: any, itemType: string) {
    this.roadmapService.deleteItem(item.id, itemType)
  }
}
