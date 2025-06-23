import { Component, input } from '@angular/core';
import { AddWindowComponent } from "../../roadmap/add-window/add-window.component";
import { Roadmap } from '../../../models/interfaces/roadmap.interface';
import { Goal } from '../../../models/interfaces/goal.interface';
import { Milestone } from '../../../models/interfaces/milestone.interface';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [AddWindowComponent],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.css'
})
export class AddButtonComponent {
  popup: string = ""
  parent = input<[string, Roadmap|Milestone|Goal|any]>(["", null])
  openPopup(popupType: string) {
    this.popup = popupType
  }

  closePopup(): void {
    this.popup = ""
  }
}
