import { HackerNewsItem } from "./HackerNewsItem ";

export interface PagedResponse {
  stories: HackerNewsItem[];
  totalCount: number;
}