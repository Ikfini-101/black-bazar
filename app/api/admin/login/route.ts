// POST /api/admin/login — Auth admin (PRD §7.7)
// Anti-bruteforce basique : 3 échecs → délai

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiting (reset on worker restart)
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Anti-bruteforce check
    const attempts = failedAttempts.get(email);
    if (attempts && attempts.count >= 3) {
      const timeSince = Date.now() - attempts.lastAttempt;
      if (timeSince < 30000) {
        // 30s delay after 3 failures
        return NextResponse.json(
          { error: "Trop de tentatives. Réessayez dans 30 secondes." },
          { status: 429 }
        );
      }
      failedAttempts.delete(email);
    }

    const db = await getDb();
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .get();

    if (!admin) {
      trackFailure(email);
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      trackFailure(email);
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Success — clear failures + issue JWT
    failedAttempts.delete(email);
    const token = await signToken({ adminId: admin.id, email: admin.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });

    return response;
  } catch (error) {
    console.error("[Login Error]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

function trackFailure(email: string) {
  const current = failedAttempts.get(email) || { count: 0, lastAttempt: 0 };
  failedAttempts.set(email, {
    count: current.count + 1,
    lastAttempt: Date.now(),
  });
}
