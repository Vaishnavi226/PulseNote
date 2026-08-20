import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/articleService';
import {
  ArticleListQuery,
  CreateArticleInput,
  UpdateArticleInput,
  PublishArticleInput,
} from '../validators/articleValidators';

export class ArticleController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as ArticleListQuery;
      const result = await articleService.listArticles(
        query,
        req.user?.id,
        req.user?.role,
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const article = await articleService.getArticleBySlug(
        slug,
        req.user?.id,
        req.user?.role,
      );
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as CreateArticleInput;
      const article = await articleService.createArticle(data, req.user!.id);
      res.status(201).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body as UpdateArticleInput;
      const article = await articleService.updateArticle(
        id,
        data,
        req.user!.id,
        req.user!.role,
      );
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body as PublishArticleInput;
      const article = await articleService.publishArticle(
        id,
        status,
        req.user!.id,
        req.user!.role,
      );
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await articleService.deleteArticle(id, req.user!.id, req.user!.role);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();
