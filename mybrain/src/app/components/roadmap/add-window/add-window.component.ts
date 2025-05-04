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
    type: new FormControl("", [
      Validators.required
    ]),
    title: new FormControl("", [
      Validators.required
    ]),
    description: new FormControl("", [
      Validators.required, 
      Validators.minLength(3)
    ]),
    parent: new FormControl("", [
      Validators.required
    ]),
    // Actions
    pattern: new FormControl("daily"),

    // Goals
    deadline: new FormControl(""),
    goalType: new FormControl("week"),
  })
  
  getPossibleParents(type:string){
    this.roadmapService.getPossibleParents(type.toLowerCase()).subscribe(data => {
      data.forEach(parent => {
        this.parents.push(parent)
      })
    })
  }

  closeAdd(){
    this.close.emit()
  }

  addItem() {
    this.closeAdd()
  }
}
