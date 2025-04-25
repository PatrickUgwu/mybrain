import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-window',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-window.component.html',
  styleUrl: './add-window.component.css'
})
export class AddWindowComponent {
  item: string = ""
  @Output() close = new EventEmitter<void>()
  @Input() goals = ""

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
    pattern: new FormControl(""),

    // Goals
    deadline: new FormControl(""),
    goalType: new FormControl(""),
  })
  
  closeAdd(){
    this.close.emit()
  }

  addItem() {
    console.log(this.itemForm)
    this.closeAdd()
  }
}
