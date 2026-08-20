import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, UserStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { env } from '../config/env';

interface JwtPayload {
  userId: string;
  role: Role;
}

/**
 * Optional authentication middleware.
 * If a valid Bearer token is present, sets req.user.
 * If no token or invalid token, continues without req.user (does NOT fail).
 */
export const optionalAuthenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      next();
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      next();
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, role: true, status: true },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      next();
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};
