import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check if environment is production and if the app is ready
  const isProd = process.env.NODE_ENV === "production"
  const isReady = process.env.READY === "true"

  // If in production and not ready, redirect to under-development
  if (isProd && !isReady) {
    return NextResponse.redirect(new URL("/under-development", request.url))
  }

  // Original redirect for /about paths
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  if (process.env.NODE_ENV === "development") {
    // return NextResponse.redirect(new URL("/showcase", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match about paths and the root path to check readiness
  matcher: ["/about/:path*", "/((?!under-development|api|_next/static|favicon.ico).*)"],
}
