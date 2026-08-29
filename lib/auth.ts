// Auth helper — JWT maison avec jose + bcryptjs (BB-03 §4)
// ⚠️ JAMAIS bcrypt (binding C++ natif), toujours bcryptjs (pur JS)

import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "bb-jwt-secret-change-in-production"
);

const COOKIE_NAME = "bb-admin-token";
const TOKEN_EXPIRY = "24h";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function signToken(payload: {
  adminId: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { adminId: string; email: string };
  } catch {
    return null;
  }
}

// For use in Route Handlers (server-side)
export async function getAdminFromCookie(): Promise<{
  adminId: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// For use in middleware (uses request object, NOT cookies())
// ⚠️ BB-03 §4 : cookies() de next/headers casse en prod Workers
export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export { COOKIE_NAME };
