import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoadmapService } from '../../../services/roadmap.service';
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';
import { Roadmap } from '../../../models/interfaces/roadmap.interface';

@Component({
  selector: 'app-add-window',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-window.component.html',
  styleUrl: './add-window.component.css'
})
export class AddWindowComponent implements OnInit{
  roadmapService = inject(RoadmapService)
  parent = input<[string, Roadmap|Milestone|Goal|any]>(["", null])
  item: string = ""
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
    if (this.parent()[1] === null || this.parent()[0] === "action" || this.parent()[0] === "todo") {
      this.roadmapService.getPossibleParents(type).subscribe(data => {
        this.parents = data
      })
    }
  }

  buildForm(type: string){
    if (type !== "roadmap" && type !== "todo") {
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
    this.getPossibleParents(type)
  }

  closeAdd(){
    this.close.emit()
  }

  addItem() {
    this.roadmapService.addItem(this.itemForm.value, this.item)
    this.closeAdd()  
  }

  ngOnInit(): void {
    if (this.parent()[0] !== "" && this.parent()[0] !== "action" && this.parent()[0] !== "todo") {
      if (this.parent()[0] === "roadmap") {this.item = "milestone"}
      else if (this.parent()[0] === "milestone") {this.item = "goal"}
      else if (this.parent()[0] === "goal") {this.item = "action"}
      else if (this.parent()[0] === "none") {this.item = "roadmap"}
      this.parents = [this.parent()[1]]
      this.buildForm(this.item)
    }

  }
}
