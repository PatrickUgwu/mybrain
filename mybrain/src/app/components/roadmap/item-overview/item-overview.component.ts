import { Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import { ToDo } from '../../../models/interfaces/todo.interface';
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { Action } from '../../../models/interfaces/action.interface';
import { RoadmapService } from '../../../services/roadmap.service';
import { AddButtonComponent } from "../../calendar/add-button/add-button.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-overview',
  standalone: true,
  imports: [AddButtonComponent, FormsModule],
  templateUrl: './item-overview.component.html',
  styleUrl: './item-overview.component.css'
})
export class ItemOverviewComponent implements OnInit {
  roadmapService = inject(RoadmapService)
  itemType = input.required<string>()
  item = model.required<any>()
  parent: Milestone | Goal | Action | ToDo | undefined
  editMode: boolean = false
  close = output()
  editCopy: any

  closePopup(){
    this.cancelEdit()
    this.close.emit()
  }

  editItem() {
    this.editMode = true
    console.log(this.editCopy.deadline)
  }

  saveEdit() {
    this.roadmapService.updateItem(this.editCopy, this.editCopy.id, this.itemType()).subscribe(updatedItem => {
      this.item.set(updatedItem)
    })
    this.editMode = false
  }

  cancelEdit() {
    this.editCopy = {...this.item()}
    this.editMode = false
  }

  deleteItem() {
    this.roadmapService.deleteItem(this.item().id, this.itemType())
    this.closePopup()
  }

  ngOnInit(): void {
    this.roadmapService.getParent(this.itemType(), this.item().id).subscribe(parent => {
      this.parent = parent
    })
    this.editCopy = {...this.item()}
  }
}
