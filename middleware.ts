import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Patterns that indicate path traversal or common attack probes
const BLOCKED_PATTERNS = [
  /\.\.\//,
  /etc\/passwd/,
  /\.env$/,
  /\.git\//,
  /wp-admin/,
  /phpmyadmin/i,
  /xmlrpc/i,
  /<script/i,
  /union.*select/i,
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullPath = pathname + search;

  // Block suspicious paths
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(fullPath)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // Enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
