import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsListComponent } from './news-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HackerNewsService } from '../../services/hacker-news.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NewsListComponent,NoopAnimationsModule], 
      providers: [HackerNewsService]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
