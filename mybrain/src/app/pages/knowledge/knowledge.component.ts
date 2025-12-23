import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { KnowledgeService } from '../../services/knowledge.service';
import { Page } from '../../models/interfaces/page.interface';
import { PageComponent } from '../../components/knowledge/page/page.component';
import { AddButtonComponent } from "../../components/calendar/add-button/add-button.component";
import { ItemOverviewComponent } from "../../components/roadmap/item-overview/item-overview.component";
import { Workspace } from '../../models/interfaces/workspace.interface';
import { Collection } from '../../models/interfaces/collection.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [PageComponent, AddButtonComponent, ItemOverviewComponent],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css'
})

export class KnowledgeComponent {
  knowledgeService = inject(KnowledgeService)
  router = inject(Router)
  workspaces = computed<Workspace[]>( () => this.knowledgeService.workspaces())
  collections = computed<Collection[]>( () => this.knowledgeService.collections())
  pages = computed<Page[]>( () => this.knowledgeService.pages())
  recentPages = computed<Page[]>( () => this.knowledgeService.recentPages())
  view: string = "recent"
  

  setView(view: string) {
    this.view = view
  }
  
  // popup -> into component later
  popup = {"display" : false, "itemType" : "", "item" : null}

  openPopup(itemType: string, item: any, event: Event) {
    event.stopPropagation();
    this.popup.display = true
    this.popup.itemType = itemType
    this.popup.item = item
  }

  closePopup(): void {
    this.popup.display = false
    this.popup.itemType = ""
    this.popup.item = null
  }

  // popup -> into component later
  openPage(pageID: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(["page", pageID])
  }


}
