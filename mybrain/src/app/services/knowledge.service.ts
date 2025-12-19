import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/interfaces/page.interface';
import { Workspace } from '../models/interfaces/workspace.interface';
import { Collection } from '../models/interfaces/collection.interface';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)
  workspaces = signal<Workspace[]>([])
  collections = signal<Collection[]>([])
  pages = signal<Page[]>([])
  recentPages = signal<Page[]>([])
  
  getKnowledge(): Observable<Workspace[]> {
    return this.httpClient.get<Workspace[]>(this.url + "/knowledge")
  }

  getRecentPages():Observable<Page[]> {
    return this.httpClient.get<Page[]>(this.url + "/recent_pages")
  }

  addItem(item: any, type: string): void {
    if (type === "workspace") { this.addWorkspace(item) }
    else if (type === "collection") { this.addCollection(item) }
    else if (type === "page") { this.addPage(item) }
    else {throw new Error(`Unknown type ${type}`);}
  }

  getWorkspaces(): Observable<Workspace[]> {
      return this.httpClient.get<Workspace[]>(this.url + "/workspaces")
  }

  addWorkspace(workspace: Workspace): void {
    this.httpClient.post<Workspace>(this.url + "/workspace", workspace).subscribe(newWorkspace => {
        this.workspaces.update(current => [...current, newWorkspace])
    })
  }

  getCollections(): Observable<Collection[]> {
      return this.httpClient.get<Collection[]>(this.url + "/collections")
  }

  addCollection(collection: Collection): void {
    this.httpClient.post<Collection>(this.url + "/collection", collection).subscribe(newCollection => {
        this.collections.update(current => [...current, newCollection])
    })
  }

  getPages(): Observable<Page[]> {
      return this.httpClient.get<Page[]>(this.url + "/pages")
  }

  addPage(page: Page): void {
    this.httpClient.post<Page>(this.url + "/page", page).subscribe(newPage => {
        this.pages.update(current => [...current, newPage])
    })
  }
  updatePage(pageID: number, page: Page): Observable<Page> {
    return this.httpClient.patch<Page>(this.url + "/page/" + pageID, page).pipe(
      tap(updatedPage => {
        this.pages.update(current => current.map(page => page.id === pageID ? updatedPage : page))
      })
    )
  }

  deletePage(pageID: number) {
    this.httpClient.delete(this.url + "/page/" + pageID).subscribe(() => {
      this.pages.update(current => current.filter(page => page.id !== pageID))
    })
  }
  
  constructor() {
    this.getRecentPages().subscribe(data => this.recentPages.set(data))
    this.getPages().subscribe(data => this.pages.set(data))
    this.getCollections().subscribe(data => this.collections.set(data))
    this.getWorkspaces().subscribe(data => this.workspaces.set(data))
  }
}
