export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface AuthorSummary {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface AuthorDetail extends AuthorSummary {
  bio: string | null;
  title: string | null;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface TagSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleCounts {
  challengeCount: number;
  commentCount: number;
  likeCount: number;
  bookmarkCount: number;
}

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  quickTake: string | null;
  coverImageUrl: string | null;
  status: ArticleStatus;
  pulseScore: number;
  views: number;
  readingTimeMin: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: AuthorSummary;
  category: CategorySummary;
  tags: TagSummary[];
  challengeCount: number;
  commentCount: number;
  likeCount: number;
  bookmarkCount: number;
}

export interface ArticleDetail extends ArticleSummary {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  author: AuthorDetail;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticleListResponse {
  articles: ArticleSummary[];
  pagination: PaginationInfo;
}

export interface ArticleListQuery {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'popular' | 'pulse';
  category?: string;
  search?: string;
  status?: ArticleStatus;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
