import { ArticleStatus, Role, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import {
  CreateArticleInput,
  UpdateArticleInput,
  ArticleListQuery,
} from '../validators/articleValidators';

// ── Helpers ─────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200);
}

async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 0;

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    counter += 1;
    slug = `${base}-${counter}`;
  }
}

// ── Service ─────────────────────────────────────────────

export class ArticleService {
  /**
   * Build the visibility where clause based on the requesting user.
   */
  private buildVisibilityWhere(userId?: string, userRole?: Role, requestedStatus?: ArticleStatus): Prisma.ArticleWhereInput {
    // If an explicit status filter is provided, honor it (admin/moderator only in practice)
    if (requestedStatus) {
      return { status: requestedStatus };
    }

    // Unauthenticated: published only
    if (!userId) {
      return { status: 'PUBLISHED' };
    }

    // Admin/Moderator: all statuses
    if (userRole === Role.ADMIN || userRole === Role.MODERATOR) {
      return {};
    }

    // Author: own drafts + all published
    return {
      OR: [
        { status: 'PUBLISHED' },
        { authorId: userId },
      ],
    };
  }

  /**
   * List articles with pagination, filtering, search, and sorting.
   */
  async listArticles(
    query: ArticleListQuery,
    userId?: string,
    userRole?: Role,
  ) {
    const { page, limit, category, status, search, sort } = query;
    const skip = (page - 1) * limit;

    const visibilityWhere = this.buildVisibilityWhere(userId, userRole, status);

    const where: Prisma.ArticleWhereInput = {
      ...visibilityWhere,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { excerpt: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      sort === 'popular'
        ? { views: 'desc' }
        : sort === 'pulse'
          ? { pulseScore: 'desc' }
          : { publishedAt: 'desc' };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          quickTake: true,
          coverImageUrl: true,
          status: true,
          pulseScore: true,
          views: true,
          readingTimeMin: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          articleTags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              challenges: true,
              comments: true,
              articleLikes: true,
              bookmarks: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    // Flatten articleTags → tags
    const formatted = articles.map((a) => ({
      ...a,
      tags: a.articleTags.map((at) => at.tag),
      articleTags: undefined,
      challengeCount: a._count.challenges,
      commentCount: a._count.comments,
      likeCount: a._count.articleLikes,
      bookmarkCount: a._count.bookmarks,
      _count: undefined,
    }));

    return {
      articles: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single article by slug.
   */
  async getArticleBySlug(slug: string, userId?: string, userRole?: Role) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            bio: true,
            title: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        articleTags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            challenges: true,
            comments: true,
            articleLikes: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!article) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }

    // Draft visibility check
    if (article.status !== 'PUBLISHED') {
      const isAuthor = userId === article.authorId;
      const isAdminOrMod = userRole === Role.ADMIN || userRole === Role.MODERATOR;

      if (!isAuthor && !isAdminOrMod) {
        throw new AppError('Article not found', 404, 'NOT_FOUND');
      }
    }

    // Increment views atomically
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    // Flatten tags and counts
    const { articleTags, _count, ...rest } = article;
    return {
      ...rest,
      views: rest.views + 1, // reflect the increment we just made
      tags: articleTags.map((at) => at.tag),
      challengeCount: _count.challenges,
      commentCount: _count.comments,
      likeCount: _count.articleLikes,
      bookmarkCount: _count.bookmarks,
    };
  }

  /**
   * Create a new article.
   */
  async createArticle(data: CreateArticleInput, authorId: string) {
    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }

    // Validate tags exist if provided
    if (data.tagIds && data.tagIds.length > 0) {
      const tags = await prisma.tag.findMany({
        where: { id: { in: data.tagIds } },
      });
      if (tags.length !== data.tagIds.length) {
        throw new AppError('One or more tags not found', 404, 'TAG_NOT_FOUND');
      }
    }

    // Generate slug
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);
    const slug = await generateUniqueSlug(baseSlug);

    try {
      const article = await prisma.article.create({
        data: {
          authorId,
          categoryId: data.categoryId,
          title: data.title,
          slug,
          excerpt: data.excerpt,
          content: data.content,
          quickTake: data.quickTake,
          coverImageUrl: data.coverImageUrl,
          status: 'DRAFT',
          readingTimeMin: data.readingTimeMin,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          ...(data.tagIds && data.tagIds.length > 0
            ? {
                articleTags: {
                  create: data.tagIds.map((tagId) => ({ tagId })),
                },
              }
            : {}),
        },
        include: {
          author: {
            select: { id: true, name: true, username: true, avatarUrl: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          articleTags: {
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: {
            select: { challenges: true, comments: true, articleLikes: true, bookmarks: true },
          },
        },
      });

      const { articleTags, _count, ...rest } = article;
      return {
        ...rest,
        tags: articleTags.map((at) => at.tag),
        challengeCount: _count.challenges,
        commentCount: _count.comments,
        likeCount: _count.articleLikes,
        bookmarkCount: _count.bookmarks,
      };
    } catch (error) {
      // Handle Prisma P2002 unique constraint on slug (race condition)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const retrySlug = await generateUniqueSlug(baseSlug);
        const article = await prisma.article.create({
          data: {
            authorId,
            categoryId: data.categoryId,
            title: data.title,
            slug: retrySlug,
            excerpt: data.excerpt,
            content: data.content,
            quickTake: data.quickTake,
            coverImageUrl: data.coverImageUrl,
            status: 'DRAFT',
            readingTimeMin: data.readingTimeMin,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            ...(data.tagIds && data.tagIds.length > 0
              ? {
                  articleTags: {
                    create: data.tagIds.map((tagId) => ({ tagId })),
                  },
                }
              : {}),
          },
          include: {
            author: {
              select: { id: true, name: true, username: true, avatarUrl: true },
            },
            category: {
              select: { id: true, name: true, slug: true },
            },
            articleTags: {
              select: {
                tag: { select: { id: true, name: true, slug: true } },
              },
            },
            _count: {
              select: { challenges: true, comments: true, articleLikes: true, bookmarks: true },
            },
          },
        });

        const { articleTags, _count, ...rest } = article;
        return {
          ...rest,
          tags: articleTags.map((at) => at.tag),
          challengeCount: _count.challenges,
          commentCount: _count.comments,
          likeCount: _count.articleLikes,
          bookmarkCount: _count.bookmarks,
        };
      }
      throw error;
    }
  }

  /**
   * Update an article.
   */
  async updateArticle(
    articleId: string,
    data: UpdateArticleInput,
    userId: string,
    userRole: Role,
  ) {
    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }

    // Ownership check
    if (existing.authorId !== userId && userRole !== Role.ADMIN && userRole !== Role.MODERATOR) {
      throw new AppError('You can only edit your own articles', 403, 'FORBIDDEN');
    }

    // Validate category if changing
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
      }
    }

    // Validate tags if changing
    if (data.tagIds && data.tagIds.length > 0) {
      const tags = await prisma.tag.findMany({
        where: { id: { in: data.tagIds } },
      });
      if (tags.length !== data.tagIds.length) {
        throw new AppError('One or more tags not found', 404, 'TAG_NOT_FOUND');
      }
    }

    // Handle slug change
    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await generateUniqueSlug(slugify(data.slug), articleId);
    }

    // Build update data
    const updateData: Prisma.ArticleUpdateInput = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.quickTake !== undefined && { quickTake: data.quickTake }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl }),
      ...(data.categoryId !== undefined && {
        category: { connect: { id: data.categoryId } },
      }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      ...(data.readingTimeMin !== undefined && { readingTimeMin: data.readingTimeMin }),
    };

    // Handle tag replacement atomically
    if (data.tagIds !== undefined) {
      await prisma.$transaction(async (tx) => {
        // Delete existing tag links
        await tx.articleTag.deleteMany({ where: { articleId } });

        // Create new tag links
        if (data.tagIds!.length > 0) {
          await tx.articleTag.createMany({
            data: data.tagIds!.map((tagId) => ({ articleId, tagId })),
          });
        }
      });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        articleTags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: {
          select: { challenges: true, comments: true, articleLikes: true, bookmarks: true },
        },
      },
    });

    const { articleTags, _count, ...rest } = article;
    return {
      ...rest,
      tags: articleTags.map((at) => at.tag),
      challengeCount: _count.challenges,
      commentCount: _count.comments,
      likeCount: _count.articleLikes,
      bookmarkCount: _count.bookmarks,
    };
  }

  /**
   * Publish or unpublish an article.
   */
  async publishArticle(
    articleId: string,
    status: 'PUBLISHED' | 'DRAFT',
    userId: string,
    userRole: Role,
  ) {
    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }

    // Ownership check
    if (existing.authorId !== userId && userRole !== Role.ADMIN && userRole !== Role.MODERATOR) {
      throw new AppError('You can only publish/unpublish your own articles', 403, 'FORBIDDEN');
    }

    const updateData: Prisma.ArticleUpdateInput = {
      status,
      ...(status === 'PUBLISHED' && {
        publishedAt: existing.publishedAt ?? new Date(),
      }),
      ...(status === 'DRAFT' && {
        publishedAt: null,
      }),
    };

    const article = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        articleTags: {
          select: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: {
          select: { challenges: true, comments: true, articleLikes: true, bookmarks: true },
        },
      },
    });

    const { articleTags, _count, ...rest } = article;
    return {
      ...rest,
      tags: articleTags.map((at) => at.tag),
      challengeCount: _count.challenges,
      commentCount: _count.comments,
      likeCount: _count.articleLikes,
      bookmarkCount: _count.bookmarks,
    };
  }

  /**
   * Delete an article.
   * All dependent records (ArticleTag, Challenge, Comment, Like, Bookmark, etc.)
   * are cascade-deleted by PostgreSQL.
   */
  async deleteArticle(articleId: string, userId: string, userRole: Role) {
    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }

    // Ownership check
    if (existing.authorId !== userId && userRole !== Role.ADMIN) {
      throw new AppError('You can only delete your own articles', 403, 'FORBIDDEN');
    }

    await prisma.article.delete({ where: { id: articleId } });
  }
}

export const articleService = new ArticleService();
