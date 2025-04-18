import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-window',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-window.component.html',
  styleUrl: './add-window.component.css'
})
export class AddWindowComponent {
  item: string = ""
  @Output() close = new EventEmitter<void>()

  setItem(item: string) {
    this.item = item
  }

  closeAdd(){
    this.close.emit()
  }
}
