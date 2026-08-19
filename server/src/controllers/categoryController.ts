import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';

export class CategoryController {
  /**
   * GET /api/categories
   * Fetch all categories
   */
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/categories/:slug
   * Fetch single category by slug
   */
  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const category = await categoryService.getCategoryBySlug(slug);

      if (!category) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Category with slug '${slug}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
