import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, UserStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { env } from '../config/env';
import { AppError } from './errorHandler';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  status: UserStatus;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

interface JwtPayload {
  userId: string;
  role: Role;
}

export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new AppError('Authentication required', 401, 'TOKEN_MISSING'));
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      next(new AppError('Authentication required', 401, 'TOKEN_MISSING'));
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new AppError('Token has expired', 401, 'TOKEN_EXPIRED'));
        return;
      }
      next(new AppError('Invalid token', 401, 'TOKEN_INVALID'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, role: true, status: true },
    });

    if (!user) {
      next(new AppError('User not found', 401, 'USER_NOT_FOUND'));
      return;
    }

    if (user.status !== UserStatus.ACTIVE) {
      const code = user.status === UserStatus.SUSPENDED ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_BANNED';
      const message = user.status === UserStatus.SUSPENDED
        ? 'Account has been suspended'
        : 'Account has been banned';
      next(new AppError(message, 403, code));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
