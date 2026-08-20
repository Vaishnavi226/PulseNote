import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, UserStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { RegisterInput } from '../validators/authValidators';

const SALT_ROUNDS = 12;

interface AuthResponse {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: Role;
  };
  token: string;
}

export class AuthService {
  private generateToken(userId: string, role: Role): string {
    const expiresIn = env.JWT_EXPIRES_IN;

    if (/^\d+$/.test(expiresIn)) {
      return jwt.sign({ userId, role }, env.JWT_SECRET, {
        expiresIn: Number(expiresIn),
      });
    }

    const durationMap: Record<string, number> = {
      '1h': 3600,
      '2h': 7200,
      '6h': 21600,
      '12h': 43200,
      '1d': 86400,
      '7d': 604800,
      '14d': 1209600,
      '30d': 2592000,
    };

    const seconds = durationMap[expiresIn] ?? 604800;
    return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: seconds });
  }

  private sanitizeUser(user: { id: string; name: string; username: string; email: string; role: Role }) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new AppError('Email already in use', 409, 'EMAIL_EXISTS');
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new AppError('Username already taken', 409, 'USERNAME_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        passwordHash,
        role: Role.USER,
        status: UserStatus.ACTIVE,
      },
      select: { id: true, name: true, username: true, email: true, role: true },
    });

    const token = this.generateToken(user.id, user.role);

    return { user: this.sanitizeUser(user), token };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, username: true, email: true, role: true, status: true, passwordHash: true },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status !== UserStatus.ACTIVE) {
      const code = user.status === UserStatus.SUSPENDED ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_BANNED';
      const message = user.status === UserStatus.SUSPENDED
        ? 'Account has been suspended'
        : 'Account has been banned';
      throw new AppError(message, 403, code);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user.id, user.role);

    return { user: this.sanitizeUser(user), token };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        title: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }
}

export const authService = new AuthService();
