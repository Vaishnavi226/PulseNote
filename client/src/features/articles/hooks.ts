import { useQuery } from '@tanstack/react-query';
import { articleService } from './articleService';
import { ArticleListQuery } from './types';

export function useArticleList(query: ArticleListQuery = {}) {
  return useQuery({
    queryKey: ['articles', query],
    queryFn: () => articleService.listArticles(query),
  });
}

export function useArticleDetail(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleService.getArticleBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => articleService.getCategories(),
    staleTime: 1000 * 60 * 30,
  });
}
