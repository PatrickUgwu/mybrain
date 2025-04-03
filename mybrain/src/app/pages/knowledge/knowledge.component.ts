import { Component } from '@angular/core';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css'
})

export class KnowledgeComponent {
  view: string = "recent"

  setView(view: string) {
    this.view = view
  }
}
