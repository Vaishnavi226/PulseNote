import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { authenticateToken } from '../middleware/authenticateToken';
import { optionalAuthenticateToken } from '../middleware/optionalAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { Role } from '@prisma/client';
import {
  articleSlugParamsSchema,
  articleParamsSchema,
  articleListQuerySchema,
  createArticleSchema,
  updateArticleSchema,
  publishArticleSchema,
} from '../validators/articleValidators';

const router = Router();

// GET /api/articles — public list (optional auth for draft visibility)
router.get(
  '/',
  optionalAuthenticateToken,
  validate(articleListQuerySchema, 'query'),
  (req, res, next) => articleController.list(req, res, next),
);

// GET /api/articles/:slug — public detail (optional auth for draft visibility)
router.get(
  '/:slug',
  optionalAuthenticateToken,
  (req, res, next) => articleController.getBySlug(req, res, next),
);

// POST /api/articles — create (authenticated: AUTHOR, MODERATOR, ADMIN)
router.post(
  '/',
  authenticateToken,
  requireRole(Role.AUTHOR, Role.MODERATOR, Role.ADMIN),
  validate(createArticleSchema, 'body'),
  (req, res, next) => articleController.create(req, res, next),
);

// PATCH /api/articles/:id/publish — publish/unpublish (authenticated)
router.patch(
  '/:id/publish',
  authenticateToken,
  requireRole(Role.AUTHOR, Role.MODERATOR, Role.ADMIN),
  validate(articleParamsSchema, 'params'),
  validate(publishArticleSchema, 'body'),
  (req, res, next) => articleController.publish(req, res, next),
);

// PATCH /api/articles/:id — update (authenticated)
router.patch(
  '/:id',
  authenticateToken,
  requireRole(Role.AUTHOR, Role.MODERATOR, Role.ADMIN),
  validate(articleParamsSchema, 'params'),
  validate(updateArticleSchema, 'body'),
  (req, res, next) => articleController.update(req, res, next),
);

// DELETE /api/articles/:id — delete (authenticated)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(Role.AUTHOR, Role.ADMIN),
  validate(articleParamsSchema, 'params'),
  (req, res, next) => articleController.delete(req, res, next),
);

export default router;
