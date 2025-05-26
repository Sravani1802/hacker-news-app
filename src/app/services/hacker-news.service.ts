import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HackerNewsItem } from '../models/HackerNewsItem ';
import { PagedResponse } from '../models/pagedResponse';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {

  private apiUrl = "https://localhost:7018/api/HackerNews"
  constructor(private http: HttpClient) { }



  getLatest(count: number): Observable<HackerNewsItem[]> {
    return this.http.get<HackerNewsItem[]>(`${this.apiUrl}/latest?count=${count}`);
  }

  getPage(pageNumber: number = 1, pageSize: number = 10): Observable<HackerNewsItem[]> {
    
    return this.http.get<HackerNewsItem[]>(`${this.apiUrl}/page?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  search(query: string = "", pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponse> {
      const finalQuery = query.trim() === '' ? `''` : query;

    const params = new HttpParams()
    .set('query', finalQuery)
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());
    return this.http.get<PagedResponse>(`${this.apiUrl}/search`, { params });
  }
}
