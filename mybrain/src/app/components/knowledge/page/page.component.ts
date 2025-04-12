import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MarkdownComponent, FormsModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  mode = "view"
  markdownContent = input.required<string>()

  setMode() {
    // saveMarkdown() auto save changes before changing view
    if (this.mode === "view") {
      this.mode = "edit"
    }
    else {
      this.mode = "view"
    }
  }
}
