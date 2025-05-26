import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HackerNewsService } from './hacker-news.service';
import { PagedResponse } from '../models/pagedResponse';
import { HackerNewsItem } from '../models/HackerNewsItem ';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://localhost:7018/api/HackerNews';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch latest stories', () => {
    const mockData: HackerNewsItem[] = [
      { id: 1, title: 'News 1', url: '', by: '', time: 0 }
    ];

    service.getLatest(5).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/latest?count=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch paginated stories', () => {
    const mockData: HackerNewsItem[] = [
      { id: 2, title: 'Paginated News', url: '', by: '', time: 0 }
    ];

    service.getPage(2, 10).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/page?pageNumber=2&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should search stories with non-empty query', () => {
    const mockResponse: PagedResponse = {
      stories: [{ id: 3, title: 'Search Match', url: 'https://abc.com', by: '', time: 0 }],
      totalCount: 1
    };

    service.search('trump', 1, 10).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === `${apiUrl}/search` &&
      req.params.get('query') === 'trump' &&
      req.params.get('pageNumber') === '1' &&
      req.params.get('pageSize') === '10'
    );
    req.flush(mockResponse);
  });

  it('should search stories with empty query', () => {
    const mockResponse: PagedResponse = {
      stories: [],
      totalCount: 0
    };

    service.search('', 1, 10).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === `${apiUrl}/search` &&
      req.params.get('query') === `''` &&
      req.params.get('pageNumber') === '1' &&
      req.params.get('pageSize') === '10'
    );
    req.flush(mockResponse);
  });
});
