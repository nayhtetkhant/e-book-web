import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    const role = request.cookies.get("auth-role")?.value;
    const destination = token && role === "user" ? "dashboard" : "login";

    return NextResponse.redirect(new URL(`/user/${destination}`, request.url));
}
