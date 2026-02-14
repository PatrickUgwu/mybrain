import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { createToDoForm } from '../../../models/interfaces/todo.interface';
import { createGoalForm } from '../../../models/interfaces/goal.interface';
import { createMilestoneForm } from '../../../models/interfaces/milestone.interface';
import { createActionForm } from '../../../models/interfaces/action.interface';
import { createCollectionForm } from '../../../models/interfaces/collection.interface';
import { createWorkspaceForm } from '../../../models/interfaces/workspace.interface';
import { createPageForm } from '../../../models/interfaces/page.interface';
import { createRoadmapForm } from '../../../models/interfaces/roadmap.interface';
import { RoadmapService } from '../../../services/roadmap.service';
import { AddButtonComponent } from "../../calendar/add-button/add-button.component";
import { FormGroup, FormsModule } from '@angular/forms';


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
  parent: any
  editMode: boolean = false
  close = output()
  editCopy: any
  itemForm!: FormGroup

  getItemForm(itemType: string) {
    switch(itemType) {
      case "roadmap":
        this.itemForm = createRoadmapForm()
        break
      case "milestone":
        this.itemForm = createMilestoneForm()
        break
      case "goal":
        this.itemForm = createGoalForm()
        break
      case "action":
        this.itemForm = createActionForm()
        break
      case "todo":
        this.itemForm = createToDoForm()
        break

      case "workspace":
        this.itemForm = createWorkspaceForm()
        break
      case "collection":
        this.itemForm = createCollectionForm()
        break
      case "page":
        this.itemForm = createPageForm()
        break
    }
  }

  closePopup(){
    this.cancelEdit()
    this.close.emit()
  }

  editItem() {
    this.editMode = true
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
    this.getItemForm(this.itemType())
  }
}
