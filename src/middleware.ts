import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/jwt";
import { AUTH } from "@/lib/constants";

const PUBLIC_PATHS = ["/login", "/register", "/", "/courses"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(AUTH.COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

// Surface to satisfy unused-import linters when PUBLIC_PATHS evolves.
export const __publicPaths = PUBLIC_PATHS;
