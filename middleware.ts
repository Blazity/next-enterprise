import { trace } from "@opentelemetry/api"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Iniciar una nueva traza para el middleware
  const tracer = trace.getTracer("nextjs-middleware")
  const span = tracer.startSpan("middleware-span")

  // TODO: Feel free to remove this block
  if (request.headers?.get("host")?.includes("next-enterprise.vercel.app")) {
    span.setAttribute("redirect", true)
    span.end()
    return NextResponse.redirect("https://blazity.com/open-source/nextjs-enterprise-boilerplate", { status: 301 })
  }

  // Finalizar la traza
  span.end()
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
