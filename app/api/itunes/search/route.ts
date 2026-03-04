import type { NextRequest } from "next/server"

import { env } from "@/env.mjs"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const term = searchParams.get("term")

  if (!term || !term.trim()) {
    return Response.json({ resultCount: 0, results: [] })
  }

  const limit = searchParams.get("limit") || "25"

  const url = new URL(env.ITUNES_API_BASE_URL)
  url.searchParams.set("term", term)
  url.searchParams.set("media", "music")
  url.searchParams.set("entity", "song")
  url.searchParams.set("limit", limit)

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return Response.json({ error: "iTunes API request failed" }, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: "Failed to fetch from iTunes" }, { status: 502 })
  }
}
