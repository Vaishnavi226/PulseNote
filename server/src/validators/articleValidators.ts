import { z } from 'zod';

// ── Params ──────────────────────────────────────────────

export const articleParamsSchema = z.object({
  id: z.string().uuid('Invalid article ID format'),
});

export const articleSlugParamsSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

// ── Query (List) ────────────────────────────────────────

export const articleListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['latest', 'popular', 'pulse']).default('latest'),
});

// ── Create Body ─────────────────────────────────────────

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or fewer'),
  slug: z
    .string()
    .max(200, 'Slug must be 200 characters or fewer')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or fewer').optional(),
  content: z.string().min(1, 'Content is required'),
  quickTake: z.string().optional(),
  coverImageUrl: z.string().url('Cover image must be a valid URL').optional(),
  categoryId: z.string().uuid('Invalid category ID format'),
  tagIds: z.array(z.string().uuid()).max(10, 'Maximum 10 tags allowed').optional(),
  seoTitle: z.string().max(70, 'SEO title must be 70 characters or fewer').optional(),
  seoDescription: z.string().max(160, 'SEO description must be 160 characters or fewer').optional(),
  readingTimeMin: z.number().int().min(1).max(120).default(5),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, 'FAQ question is required').max(300),
        answer: z.string().min(1, 'FAQ answer is required').max(2000),
      }),
    )
    .max(10, 'Maximum 10 FAQs allowed')
    .optional(),
});

// ── Update Body ─────────────────────────────────────────

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  quickTake: z.string().optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).max(10).optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  readingTimeMin: z.number().int().min(1).max(120).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1).max(300),
        answer: z.string().min(1).max(2000),
      }),
    )
    .max(10)
    .optional()
    .nullable(),
});

// ── Publish Body ────────────────────────────────────────

export const publishArticleSchema = z.object({
  status: z.enum(['PUBLISHED', 'DRAFT']),
});

// ── Types ───────────────────────────────────────────────

export type ArticleParams = z.infer<typeof articleParamsSchema>;
export type ArticleSlugParams = z.infer<typeof articleSlugParamsSchema>;
export type ArticleListQuery = z.infer<typeof articleListQuerySchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type PublishArticleInput = z.infer<typeof publishArticleSchema>;
