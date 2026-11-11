import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Role, User } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
  validateRegisterInput,
  signSessionToken,
  verifySessionToken,
  requireAuth,
  requireAdmin,
  AuthError,
  SESSION_COOKIE_NAME,
} from '../src/lib/auth';
import { POST as registerHandler } from '../src/app/api/auth/register/route';
import { POST as loginHandler } from '../src/app/api/auth/login/route';
import { GET as sessionHandler } from '../src/app/api/auth/session/route';
import { POST as logoutHandler } from '../src/app/api/auth/logout/route';
import prisma from '../src/lib/prisma';
import { NextRequest } from 'next/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Mock Prisma
vi.mock('../src/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('A4: User Accounts & Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Password Hashing & Verification (bcryptjs)', () => {
    it('hashes passwords and verifies matching plain text correctly', async () => {
      const password = 'EnthusiastKeyboard2026!';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);

      const isMatch = await verifyPassword(password, hash);
      expect(isMatch).toBe(true);

      const isWrong = await verifyPassword('WrongPassword123!', hash);
      expect(isWrong).toBe(false);
    });
  });

  describe('Input Validation (docs/api-specification.md 5.1.1)', () => {
    it('accepts valid email and password >= 8 characters', () => {
      const result = validateRegisterInput({
        email: 'customer@azertystudio.com',
        password: 'Password123!',
        name: 'Jane Doe',
      });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects passwords shorter than 8 characters', () => {
      const result = validateRegisterInput({
        email: 'customer@azertystudio.com',
        password: 'short',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters long and email must be valid');
    });

    it('rejects malformed email addresses', () => {
      const invalidEmails = ['invalid-email', 'customer@', '@domain.com', 'spaces in@email.com'];
      for (const email of invalidEmails) {
        const result = validateRegisterInput({
          email,
          password: 'Password123!',
        });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must be at least 8 characters long and email must be valid');
      }
    });
  });

  describe('JWT Session Management (jose)', () => {
    it('signs and verifies session tokens containing user identity and role', async () => {
      const user = {
        id: 'usr_kb_01',
        email: 'enthusiast@azertystudio.com',
        name: 'Enthusiast User',
        role: Role.CUSTOMER,
      };

      const token = await signSessionToken(user);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);

      const payload = await verifySessionToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe(user.id);
      expect(payload?.email).toBe(user.email);
      expect(payload?.name).toBe(user.name);
      expect(payload?.role).toBe(user.role);
    });

    it('rejects tampered or malformed tokens', async () => {
      const tamperedToken = 'header.payload.signature_tampered';
      const payload = await verifySessionToken(tamperedToken);
      expect(payload).toBeNull();
    });
  });

  describe('Authorization Guards & Role Enforcement (A10)', () => {
    it('requireAuth throws 401 AuthError when no session is present', async () => {
      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue(undefined),
      } as unknown as ReadonlyRequestCookies);

      await expect(requireAuth()).rejects.toThrow(AuthError);
    });

    it('requireAdmin throws 403 Forbidden AuthError when user is CUSTOMER', async () => {
      const user = {
        id: 'usr_cust_01',
        email: 'customer@azertystudio.com',
        name: 'Regular Customer',
        role: Role.CUSTOMER,
      };
      const token = await signSessionToken(user);

      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: token, name: SESSION_COOKIE_NAME }),
      } as unknown as ReadonlyRequestCookies);

      await expect(requireAdmin()).rejects.toThrow(AuthError);
    });

    it('requireAdmin succeeds when user is ADMIN', async () => {
      const admin = {
        id: 'usr_admin_01',
        email: 'admin@azertystudio.com',
        name: 'Mihnea Admin',
        role: Role.ADMIN,
      };
      const token = await signSessionToken(admin);

      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: token, name: SESSION_COOKIE_NAME }),
      } as unknown as ReadonlyRequestCookies);

      const user = await requireAdmin();
      expect(user.id).toBe(admin.id);
      expect(user.role).toBe(Role.ADMIN);
    });
  });

  describe('API Endpoints (docs/api-specification.md 5.1)', () => {
    it('POST /api/auth/register returns 400 on invalid input', async () => {
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad-email', password: '123' }),
      });

      const response = await registerHandler(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('Password must be at least 8 characters long and email must be valid');
    });

    it('POST /api/auth/register returns 409 when user already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'existing_01',
        email: 'duplicate@azertystudio.com',
      } as unknown as User);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'duplicate@azertystudio.com',
          password: 'SecurePassword123!',
          name: 'Existing User',
        }),
      });

      const response = await registerHandler(request);
      expect(response.status).toBe(409);

      const data = await response.json();
      expect(data.error).toBe('An account with this email address already exists');
    });

    it('POST /api/auth/register creates user and returns 201 Created', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.create).mockResolvedValueOnce({
        id: 'new_user_01',
        email: 'newuser@azertystudio.com',
        name: 'New Enthusiast',
        role: Role.CUSTOMER,
        createdAt: new Date('2026-11-11T12:00:00Z'),
      } as unknown as User);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@azertystudio.com',
          password: 'SecurePassword123!',
          name: 'New Enthusiast',
        }),
      });

      const response = await registerHandler(request);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.user.id).toBe('new_user_01');
      expect(data.user.role).toBe(Role.CUSTOMER);
      expect(data.user.email).toBe('newuser@azertystudio.com');
    });

    it('POST /api/auth/login returns 401 on non-existent email or wrong password', async () => {
      // Non-existent email
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const request1 = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ghost@azertystudio.com', password: 'Password123!' }),
      });

      const res1 = await loginHandler(request1);
      expect(res1.status).toBe(401);
      const data1 = await res1.json();
      expect(data1.error).toBe('Invalid email or password');

      // Wrong password
      const validHash = await hashPassword('CorrectPassword123!');
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'user_01',
        email: 'user@azertystudio.com',
        passwordHash: validHash,
        name: 'User One',
        role: Role.CUSTOMER,
      } as unknown as User);

      const request2 = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@azertystudio.com', password: 'WrongPassword999!' }),
      });

      const res2 = await loginHandler(request2);
      expect(res2.status).toBe(401);
      const data2 = await res2.json();
      expect(data2.error).toBe('Invalid email or password');
    });

    it('POST /api/auth/login returns 200 OK and sets session cookie on correct credentials', async () => {
      const correctPassword = 'EnthusiastPassword123!';
      const passwordHash = await hashPassword(correctPassword);

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'usr_success_01',
        email: 'enthusiast@azertystudio.com',
        name: 'Alex Gamer',
        role: Role.CUSTOMER,
        passwordHash,
      } as unknown as User);

      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'enthusiast@azertystudio.com', password: correctPassword }),
      });

      const response = await loginHandler(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.user.email).toBe('enthusiast@azertystudio.com');
      expect(data.user.role).toBe(Role.CUSTOMER);

      const setCookie = response.headers.get('set-cookie');
      expect(setCookie).toContain(SESSION_COOKIE_NAME);
    });

    it('GET /api/auth/session returns authenticated: false when unauthenticated', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/session');
      const response = await sessionHandler(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.authenticated).toBe(false);
      expect(data.user).toBeNull();
    });

    it('GET /api/auth/session returns authenticated: true with user profile when valid cookie present', async () => {
      const user = {
        id: 'usr_valid_01',
        email: 'customer@azertystudio.com',
        name: 'Jane Doe',
        role: Role.CUSTOMER,
      };
      const token = await signSessionToken(user);

      const request = new NextRequest('http://localhost:3000/api/auth/session', {
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=${token}`,
        },
      });

      const response = await sessionHandler(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.authenticated).toBe(true);
      expect(data.user.id).toBe(user.id);
      expect(data.user.email).toBe(user.email);
      expect(data.user.role).toBe(Role.CUSTOMER);
    });

    it('POST /api/auth/logout clears session cookie and returns success message', async () => {
      const response = await logoutHandler();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.message).toBe('Logged out successfully');

      const setCookie = response.headers.get('set-cookie');
      expect(setCookie).toContain(`${SESSION_COOKIE_NAME}=;`);
      expect(setCookie).toContain('Max-Age=0');
    });
  });
});
