import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { createApp } from '../app';
import { env } from '../config/env';

const prisma = new PrismaClient();
const app = createApp();

const TEST_EMAIL = `testauth_${Date.now()}@pulsenote.dev`;
const TEST_USERNAME = `testauthuser_${Date.now()}`;
const TEST_PASSWORD = 'SecurePass123!';

let authToken = '';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { contains: 'testauth_' } },
  });
  await prisma.user.deleteMany({
    where: { email: { contains: 'suspended_' } },
  });
  await prisma.user.deleteMany({
    where: { email: { contains: 'banned_' } },
  });
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Auth User',
        username: TEST_USERNAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(TEST_EMAIL);
    expect(res.body.data.user.username).toBe(TEST_USERNAME);
    expect(res.body.data.user.role).toBe('USER');
    expect(res.body.data.user.id).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
    authToken = res.body.data.token;
  });

  it('should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Email User',
        username: `unique_${Date.now()}`,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });

  it('should reject duplicate username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Username User',
        username: TEST_USERNAME,
        email: `unique_${Date.now()}@pulsenote.dev`,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('USERNAME_EXISTS');
  });

  it('should hash the password and never store plaintext', async () => {
    const user = await prisma.user.findUnique({
      where: { email: TEST_EMAIL },
      select: { passwordHash: true },
    });

    expect(user).not.toBeNull();
    expect(user!.passwordHash).not.toBe(TEST_PASSWORD);
    expect(user!.passwordHash.length).toBeGreaterThan(0);

    const isValid = await bcrypt.compare(TEST_PASSWORD, user!.passwordHash);
    expect(isValid).toBe(true);
  });

  it('should reject registration with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Invalid Email',
        username: `validuser_${Date.now()}`,
        email: 'not-an-email',
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject registration with short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Short Password',
        username: `validuser_${Date.now()}`,
        email: `valid_${Date.now()}@pulsenote.dev`,
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject registration with short username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Short Username',
        username: 'ab',
        email: `valid_${Date.now()}@pulsenote.dev`,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject registration with invalid username characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Invalid Username',
        username: 'user with spaces!',
        email: `valid_${Date.now()}@pulsenote.dev`,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(TEST_EMAIL);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    authToken = res.body.data.token;
  });

  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: TEST_EMAIL,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should reject login for nonexistent email without revealing existence', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@pulsenote.dev',
        password: 'SomePassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(res.body.error.message).toBe('Invalid email or password');
  });
});

describe('Suspended Account Handling', () => {
  const suspendedEmail = `suspended_${Date.now()}@pulsenote.dev`;
  const suspendedUsername = `suspendeduser_${Date.now()}`;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Password123!', 12);
    await prisma.user.create({
      data: {
        name: 'Suspended User',
        username: suspendedUsername,
        email: suspendedEmail,
        passwordHash: hash,
        role: Role.USER,
        status: UserStatus.SUSPENDED,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: suspendedEmail } });
  });

  it('should reject login for suspended account', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: suspendedEmail,
        password: 'Password123!',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ACCOUNT_SUSPENDED');
  });
});

describe('Banned Account Handling', () => {
  const bannedEmail = `banned_${Date.now()}@pulsenote.dev`;
  const bannedUsername = `banneduser_${Date.now()}`;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Password123!', 12);
    await prisma.user.create({
      data: {
        name: 'Banned User',
        username: bannedUsername,
        email: bannedEmail,
        passwordHash: hash,
        role: Role.USER,
        status: UserStatus.BANNED,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: bannedEmail } });
  });

  it('should reject login for banned account', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: bannedEmail,
        password: 'Password123!',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ACCOUNT_BANNED');
  });
});

describe('JWT Token Handling', () => {
  it('should accept valid JWT and return user data', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(TEST_EMAIL);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('should reject request with missing JWT', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_MISSING');
  });

  it('should reject request with malformed JWT', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.valid.jwt.token');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_INVALID');
  });

  it('should reject request with expired JWT', async () => {
    const expiredToken = jwt.sign(
      { userId: 'test-user-id', role: Role.USER },
      env.JWT_SECRET,
      { expiresIn: '0s' }
    );

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_EXPIRED');
  });

  it('should reject request with invalid JWT signature', async () => {
    const wrongSecretToken = jwt.sign(
      { userId: 'test-user-id', role: Role.USER },
      'completely_wrong_secret_key',
      { expiresIn: '7d' }
    );

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${wrongSecretToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_INVALID');
  });
});

describe('Authenticated Request Flow', () => {
  it('should allow access to protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.username).toBe(TEST_USERNAME);
    expect(res.body.data.role).toBe('USER');
  });
});

describe('Role-Based Authorization', () => {
  it('should identify USER role correctly from authenticated response', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('USER');
    expect(res.body.data.role).not.toBe('ADMIN');
  });

  it('should identify ADMIN role correctly from seeded admin account', async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@pulsenote.dev',
        password: 'Password123!',
      });

    expect(adminRes.status).toBe(200);
    const adminToken = adminRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.role).toBe('ADMIN');
  });
});
