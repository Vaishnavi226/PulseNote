import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticateToken } from '../middleware/authenticateToken';
import { registerSchema, loginSchema } from '../validators/authValidators';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

// POST /api/auth/login
router.post('/login', validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res, next) =>
  authController.getMe(req, res, next)
);

export default router;
