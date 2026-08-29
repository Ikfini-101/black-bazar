// Middleware — Protection routes admin (BB-03 §4)
// ⚠️ Utilise request.cookies.get(), JAMAIS cookies() de next/headers
// cookies() marche en local (next dev) mais casse silencieusement en prod Workers

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes admin protégées (sauf login)
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLoginRoute =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    const token = getTokenFromRequest(request);

    if (!token) {
      // API → 401, Page → redirect login
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Token invalide" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
