import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';

const router = Router();

// GET /api/categories
router.get('/', (req, res, next) => categoryController.getCategories(req, res, next));

// GET /api/categories/:slug
router.get('/:slug', (req, res, next) => categoryController.getCategoryBySlug(req, res, next));

export default router;
