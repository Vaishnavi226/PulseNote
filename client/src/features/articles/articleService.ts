import { axiosClient } from '../../api/axiosClient';
import {
  ArticleListResponse,
  ArticleDetail,
  ArticleListQuery,
  Category,
  ApiResponse,
} from './types';

function buildQueryParams(query: ArticleListQuery): Record<string, string> {
  const params: Record<string, string> = {};
  if (query.page) params.page = String(query.page);
  if (query.limit) params.limit = String(query.limit);
  if (query.sort) params.sort = query.sort;
  if (query.category) params.category = query.category;
  if (query.search) params.search = query.search;
  if (query.status) params.status = query.status;
  return params;
}

export const articleService = {
  async listArticles(query: ArticleListQuery = {}): Promise<ArticleListResponse> {
    const response = await axiosClient.get<ApiResponse<ArticleListResponse>>(
      '/articles',
      { params: buildQueryParams(query) }
    );
    return response.data.data;
  },

  async getArticleBySlug(slug: string): Promise<ArticleDetail> {
    const response = await axiosClient.get<ApiResponse<ArticleDetail>>(
      `/articles/${slug}`
    );
    return response.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await axiosClient.get<ApiResponse<Category[]>>(
      '/categories'
    );
    return response.data.data;
  },
};
