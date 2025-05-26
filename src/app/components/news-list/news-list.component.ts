import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HackerNewsItem } from '../../models/HackerNewsItem ';
import { HackerNewsService } from '../../services/hacker-news.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatButtonModule

  ],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss'
})
export class NewsListComponent implements OnInit {

  stories = signal<HackerNewsItem[]>([]);
  pageIndex = signal(0);
  pageSize = signal(5);
  isLoading = signal(false);
  searchQuery = signal<string>('');
  totalStories = signal<number>(100);
  currentPage = signal<number>(1);
  displayedColumns: string[] = ['id', 'title', 'url', 'time'];
  initialStories = 100;

  displayedStories = computed(() => {
    // debugger
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.stories().slice(start, end);
  });


  constructor(private newsService: HackerNewsService) {
  }
  ngOnInit(): void {
    this.latestStories();
  }

  latestStories() {
    this.isLoading.set(true)
    this.newsService.getLatest(50).subscribe(data => {
      console.log(data);

      this.stories.set(data);
      this.totalStories.set(data.length)
      this.displayedStories()
      console.log(this.displayedStories());
      this.isLoading.set(false)
    },
      err => console.log(err)
    )
  }
  loadStories(pageNumber: number, pageSize: number) {
    this.isLoading.set(true)
    this.newsService.getPage(
      pageNumber, pageSize)
      .subscribe(data => {
        this.stories.set(data)
        this.isLoading.set(false)
      },
        err => {
          console.log(err);
        })

  }

  onSearch() {
    if (this.searchQuery().trim()) {
      this.pageIndex.set(0); // reset to first page
      this.currentPage.set(1)
      this.searchStories();
    } else {
      this.latestStories(); // fallback
    }
  }

  searchStories() {
    const query = this.searchQuery().trim();
    const page = this.pageIndex() + 1;
    const size = this.pageSize();

    this.isLoading.set(true)
    this.newsService.search(query, page, size).subscribe(data => {
      this.stories.set(data.stories);
      this.totalStories.set(data.totalCount);

      this.isLoading.set(false)
    });
  }


  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex + 1);

    const isSearch = this.searchQuery().trim().length > 0;

    if (isSearch) {
      this.searchStories();
    } else {

      //debugger
      // If user is on the last page, and stories are not yet loaded, fetch more
      const totalPages = Math.ceil(this.totalStories() / this.pageSize());
      if (this.currentPage() >= totalPages - 1) {
        this.loadMoreStories(); // fetch more and append
      }
      else {
        this.loadStories(this.currentPage(), this.pageSize());
      }
    }
  }

  loadMoreStories() {
    this.isLoading.set(true)
    console.log('Loading 100 more stories...');
    this.initialStories += 100;
    console.log(this.initialStories);

    this.newsService.getLatest(this.initialStories).subscribe(data => {
      this.stories.set(data);
      this.totalStories.set(data.length);
      this.displayedStories()
      this.isLoading.set(false)
      console.log(this.displayedStories());
    });
  }


}
