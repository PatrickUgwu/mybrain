import { Component, input } from '@angular/core';
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [AddWindowComponent],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.css'
})
export class AddButtonComponent {
  popup: string = ""
  itemType = input<string>("")
  item = input<any>(null)
  
  openPopup(popupType: string) {
    this.popup = popupType
  }

  closePopup(): void {
    this.popup = ""
  }
}
