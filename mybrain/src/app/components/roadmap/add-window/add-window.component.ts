import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoadmapService } from '../../../services/roadmap.service';
import { createGoalForm } from '../../../models/interfaces/goal.interface';
import { createMilestoneForm } from '../../../models/interfaces/milestone.interface';
import { createRoadmapForm } from '../../../models/interfaces/roadmap.interface';
import { KnowledgeService } from '../../../services/knowledge.service';
import { createActionForm } from '../../../models/interfaces/action.interface';
import { createWorkspaceForm } from '../../../models/interfaces/workspace.interface';
import { createCollectionForm } from '../../../models/interfaces/collection.interface';
import { createPageForm } from '../../../models/interfaces/page.interface';
import { createToDoForm } from '../../../models/interfaces/todo.interface';

@Component({
  selector: 'app-add-window',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-window.component.html',
  styleUrl: './add-window.component.css'
})
export class AddWindowComponent implements OnInit{
  roadmapService = inject(RoadmapService)
  knowledgeService = inject(KnowledgeService)
  parentItemType = input<string>("")
  parent = input<any>(null)
  itemType: string = ""
  parents: any = []
  @Output() close = new EventEmitter<void>()

  itemForm!:FormGroup 
  
  getPossibleParents(type:string){  
    this.roadmapService.getPossibleParents(type).subscribe(data => {
      this.parents = data
    })
  }

  closeAdd(){
    this.close.emit()
  }

  addItem() {
    if (this.itemType === "workspace" || this.itemType === "collection" || this.itemType === "page") {
      this.knowledgeService.addItem(this.itemForm.value, this.itemType)
    }
    else {
      this.roadmapService.addItem(this.itemForm.value, this.itemType)
    }
    this.closeAdd()  
  }

  getItemForm(itemType: string, parentTitle?: string) {
    switch(itemType) {
      case "roadmap":
        this.itemForm = createRoadmapForm()
        break
      case "milestone":
        this.itemForm = createMilestoneForm(parentTitle)
        break
      case "goal":
        this.itemForm = createGoalForm(parentTitle)
        break
      case "action":
        this.itemForm = createActionForm(parentTitle)
        break
      case "todo":
        this.itemForm = createToDoForm()
        break

      case "workspace":
        this.itemForm = createWorkspaceForm()
        break
      case "collection":
        this.itemForm = createCollectionForm(parentTitle)
        break
      case "page":
        this.itemForm = createPageForm(parentTitle)
        break
    }

    if (this.parent() === null) this.getPossibleParents(itemType)
  }

  ngOnInit(): void {
    switch(this.parentItemType()) {
      case "":
        return
      case "none_rm":
        this.itemType = "roadmap"
        break
      case "roadmap":
        this.itemType = "milestone"
        break
      case "milestone":
        this.itemType = "goal"
        break
      case "goal":
        this.itemType = "action"
        break

      case "none_ws":
        this.itemType = "workspace"
        break
      case "workspace":
        this.itemType = "collection"
        break
      case "collection":
        this.itemType = "page"
        break
    }
    this.parents = [this.parent()]
    this.getItemForm(this.itemType, this.parent()?.title)
  }
}

