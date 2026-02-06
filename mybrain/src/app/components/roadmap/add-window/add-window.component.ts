import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoadmapService } from '../../../services/roadmap.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { Roadmap } from '../../../models/interfaces/roadmap.interface';
import { KnowledgeService } from '../../../services/knowledge.service';

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
  parentItemType = input<string>()
  parent = input<any>()
  itemType: string = ""
  parents: Roadmap[] | Milestone[] | Goal[] = []
  @Output() close = new EventEmitter<void>()

  itemForm:FormGroup = new FormGroup({
    
    title: new FormControl("", [
      Validators.required
    ]),
    description: new FormControl("", [
      Validators.required, 
      Validators.minLength(3),
    ])
  })
  //itemForm2: FormGroup = this.roadmapService.buildForm(this.item)
  
  getPossibleParents(type:string){
    // this.parent()[1] === null means no parent set yet
    if (this.parent() === null || this.parentItemType() === "action" || this.parentItemType() === "todo") {
      this.roadmapService.getPossibleParents(type).subscribe(data => {
        this.parents = data
      })
    }
  }

  buildForm(type: string){
    if (type !== "roadmap" && type !== "todo" && type !== "workspace") {
      this.itemForm.addControl("parent_id", new FormControl(this.parents[0]?.title, Validators.required))
    }
    if (type === "action") {
      this.itemForm.addControl("pattern", new FormControl("daily", Validators.required))
    }
    else if (type === "goal") {
      this.itemForm.addControl("deadline", new FormControl("", Validators.required))
      this.itemForm.addControl("type", new FormControl("week", Validators.required))
    }
    else if (type === "milestone") {
      this.itemForm.addControl("deadline", new FormControl("", Validators.required))
    }
    else if (type === "todo") {
      this.itemForm.addControl("parent_id", new FormControl())
      this.itemForm.addControl("deadline", new FormControl())
    }
    else if (type === "page") {
      this.itemForm.addControl("content", new FormControl(""))
    }

    this.getPossibleParents(type)
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

  ngOnInit(): void {
    // setting item as the type of the item (str) based on the parent[0] = parent type(str), parent[1] = actual parent
    if (this.parentItemType() !== "" && this.parentItemType() !== "action" && this.parentItemType() !== "todo") {
      if (this.parentItemType() === "roadmap") {this.itemType = "milestone"}
      else if (this.parentItemType() === "milestone") {this.itemType = "goal"}
      else if (this.parentItemType() === "goal") {this.itemType = "action"}
      else if (this.parentItemType() === "none") {this.itemType = "roadmap"} /// correct !! dont use:
      else if (this.parentItemType() === "noneWS") {this.itemType = "workspace"} /// "none"/"noneWS"
      else if (this.parentItemType() === "workspace") {this.itemType = "collection"}
      else if (this.parentItemType() === "collection") {this.itemType = "page"}
      this.parents = [this.parent()]
      this.buildForm(this.itemType)
    }
    }

  }
}
