import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  url = "http://127.0.0.1:8000"
  httpClient = inject(HttpClient)

  getRoadmaps(): Observable<any> {
    return this.httpClient.get<any>(this.url + "/roadmaps")
  }

  getPossibleParents(type: string): Observable<string[]> {
    return this.httpClient.get<string[]>(this.url + "/possible_parents?type=" + type)
  }

  constructor() { }
}
