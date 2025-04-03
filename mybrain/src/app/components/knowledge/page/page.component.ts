import { Component } from '@angular/core';
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
  markdownContent = "# This is markdown!"
}
