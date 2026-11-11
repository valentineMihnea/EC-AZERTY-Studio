import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'azerty_session';
export const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string | null;
  role: Role;
  [key: string]: unknown;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || 'fallback-secret-key-at-least-32-chars-long-azerty';
  return new TextEncoder().encode(secret);
}

/**
 * Hash plain password using bcrypt (10 rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validates registration input according to API specification
 */
export function validateRegisterInput(body: {
  email?: unknown;
  password?: unknown;
  name?: unknown;
}): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    typeof body.email !== 'string' ||
    !emailRegex.test(body.email.trim()) ||
    typeof body.password !== 'string' ||
    body.password.length < 8
  ) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long and email must be valid',
    };
  }

  return { valid: true };
}

/**
 * Signs a JWT session token
 */
export async function signSessionToken(user: SessionUser): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRATION_SECONDS}s`)
    .sign(secret);
}

/**
 * Verifies a JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: (payload.name as string) ?? null,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

/**
 * Reads and verifies current user from the request cookies (Server Components, Route Handlers, Server Actions)
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Sets session cookie on the incoming request context via next/headers
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRATION_SECONDS,
  });
}

/**
 * Clears session cookie via next/headers
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AuthError';
  }
}

/**
 * Guard: Requires an authenticated user, throws 401 AuthError otherwise
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  return user;
}

/**
 * Guard: Requires ADMIN role, throws 401 if not logged in or 403 Forbidden if not ADMIN
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== Role.ADMIN) {
    throw new AuthError('Forbidden: Admin access required', 403);
  }
  return user;
}
