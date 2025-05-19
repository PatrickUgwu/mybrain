import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoadmapService } from '../../../services/roadmap.service';

@Component({
  selector: 'app-add-window',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-window.component.html',
  styleUrl: './add-window.component.css'
})
export class AddWindowComponent {
  roadmapService = inject(RoadmapService)
  item: string = ""
  parents: string[] = []
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

  
  getPossibleParents(type:string){
    this.roadmapService.getPossibleParents(type.toLowerCase()).subscribe(data => {
      data.forEach(parent => {
        this.parents.push(parent)
      })
    })
  }

  buildForm(type: string){
      if (type !== "Roadmap" && type !== "ToDo") {
        this.itemForm.addControl("parent_id", new FormControl("", Validators.required))
      }
    
      if (type === "Action") {
        this.itemForm.addControl("pattern", new FormControl("daily", Validators.required))
      }
      else if (type === "Goal") {
        this.itemForm.addControl("deadline", new FormControl("", Validators.required))
        this.itemForm.addControl("type", new FormControl("week", Validators.required))
      }
      else if (type === "Milestone") {
        this.itemForm.addControl("deadline", new FormControl("", Validators.required))
      }
      else if (type === "ToDo") {
        this.itemForm.addControl("parent_id", new FormControl())
        this.itemForm.addControl("deadline", new FormControl())
      }
      this.getPossibleParents(type)
    }

  closeAdd(){
    this.close.emit()
  }

  addItem() {
    this.closeAdd()
  }
}
