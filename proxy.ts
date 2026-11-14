import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth-token")?.value;
    const role = request.cookies.get("auth-role")?.value;

    const isAuthenticatedUser = !!token && role === "user";
    const isAuthenticatedAdmin = !!token && role === "admin";

    // 1. Root route: redirect based on auth status
    if (pathname === "/") {
        if (isAuthenticatedAdmin) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
        if (isAuthenticatedUser) {
            return NextResponse.redirect(new URL("/user/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/user/login", request.url));
    }

    // 2. /user and /admin base routes
    if (pathname === "/user") {
        return NextResponse.redirect(
            new URL(isAuthenticatedUser ? "/user/dashboard" : "/user/login", request.url)
        );
    }

    if (pathname === "/admin") {
        return NextResponse.redirect(
            new URL(isAuthenticatedAdmin ? "/admin/dashboard" : "/admin/login", request.url)
        );
    }

    // 3. Protected user dashboard routes
    if (pathname.startsWith("/user/dashboard")) {
        if (!isAuthenticatedUser) {
            return NextResponse.redirect(new URL("/user/login", request.url));
        }
    }

    // 4. Protected admin dashboard routes
    if (pathname.startsWith("/admin/dashboard")) {
        if (!isAuthenticatedAdmin) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // 5. Public auth routes (prevent logged-in users from viewing login)
    if (pathname === "/user/login" && isAuthenticatedUser) {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    if (pathname === "/admin/login" && isAuthenticatedAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt, static svgs/images
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
