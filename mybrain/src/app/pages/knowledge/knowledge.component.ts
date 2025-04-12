import { Component, inject, OnInit } from '@angular/core';
import { KnowledgeService } from '../../services/knowledge.service';
import { Page } from '../../models/interfaces/page.interface';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [],
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css'
})

export class KnowledgeComponent implements OnInit{
  knowledgeService = inject(KnowledgeService)
  knowledge: any[] = []
  recentPages: Page[] = []
  view: string = "recent"

  setView(view: string) {
    this.view = view
  }

  ngOnInit(): void {
    this.knowledgeService.getKnowledge().subscribe(data => {
      this.knowledge = data
    })

    this.knowledgeService.getRecentPages().subscribe(pages => {
      this.recentPages = pages
    })
  }
}
