import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)
  
  getKnowledge(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + "/knowledge")
  }

  getRecentPages():Observable<Page[]> {
    return this.httpClient.get<Page[]>(this.url + "/recent_pages")
  }
  
  constructor() { }
}
