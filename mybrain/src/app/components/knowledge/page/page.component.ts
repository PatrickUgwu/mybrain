import { Component, inject, model, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent} from 'ngx-markdown';
import { KnowledgeService } from '../../../services/knowledge.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MarkdownComponent, FormsModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit{
  knowledgeService = inject(KnowledgeService)
  page = model.required<any>()
  markdownContent = ""
  editMode: boolean = false
  mode: string = "view"
  close = output()
  editCopy: any
  

  displayPageInfo = false

  togglePageInfo(): void {
    if (this.displayPageInfo == false) {
      this.displayPageInfo = true
    } else {
      this.displayPageInfo = false
    }
    
  }


  closePopup(){
    this.cancelEdit()
    this.close.emit()
  }

  toggleEditMode() {
    if (this.mode === "view") {
      this.mode = "edit"
      this.editMode = true
    }
    else {
      this.mode = "view"
      this.editMode = false
      this.saveEdit()
    }
  }

  saveEdit() {
    this.editCopy.content = this.markdownContent
    this.knowledgeService.updatePage(this.editCopy.id, this.editCopy).subscribe(updatedPage => { // addupdateItem()
      this.page.set(updatedPage)
    })
    this.editMode = false
    this.mode = "view"
  }

  cancelEdit() {
    this.editCopy = this.page()
    this.editMode = false
    this.mode = "view"
  }

  ngOnInit(): void {
    this.editCopy = {...this.page()}
    this.markdownContent = this.editCopy.content
  }
}
