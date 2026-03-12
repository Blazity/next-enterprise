import type { NextRequest } from "next/server"

import { env } from "@/env.mjs"
import { cacheGet, cacheSet } from "@/lib/redis"

// Cache TTL for iTunes search results (24 hours — trending/top picks refresh daily)
const ITUNES_CACHE_TTL = 86400

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const term = searchParams.get("term")

  if (!term || !term.trim()) {
    return Response.json({ resultCount: 0, results: [] })
  }

  const limit = searchParams.get("limit") || "25"

  // Check Redis cache first
  const cacheKey = `itunes:search:${term.toLowerCase()}:${limit}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
      },
    })
  }

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

    // Cache the response in Redis
    await cacheSet(cacheKey, data, ITUNES_CACHE_TTL)

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "MISS",
      },
    })
  } catch {
    return Response.json({ error: "Failed to fetch from iTunes" }, { status: 502 })
  }
}
