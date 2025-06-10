import { Component, inject, input, OnInit, output } from '@angular/core';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { Action } from '../../../models/interfaces/action.interface';
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-item-overview',
  standalone: true,
  imports: [],
  templateUrl: './item-overview.component.html',
  styleUrl: './item-overview.component.css'
})
export class ItemOverviewComponent implements OnInit {
  roadmapService = inject(RoadmapService)
  itemType = input.required<string>()
  item = input.required<any>()
  parent: Milestone | Goal | Action | ToDo | undefined
  close = output()

  closePopup(){
    this.close.emit()
  }

  deleteItem() {
    this.roadmapService.deleteItem(this.item().id, this.itemType())
    this.closePopup()
  }

  ngOnInit(): void {
    this.roadmapService.getParent(this.itemType(), this.item().id).subscribe(parent => {
      this.parent = parent
    })
  }
}
