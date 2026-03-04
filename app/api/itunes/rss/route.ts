import type { NextRequest } from "next/server"

const ITUNES_BASE_URL = "https://itunes.apple.com"

// Proxy for iTunes RSS feeds — avoids CORS, adds 1-hour cache
// Usage: /api/itunes/rss?feed=topsongs&limit=20
//        /api/itunes/rss?feed=topalbums&limit=20
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const feed = searchParams.get("feed")
  const limit = searchParams.get("limit") ?? "20"

  if (!feed) {
    return Response.json({ error: "feed param is required" }, { status: 400 })
  }

  const url = `${ITUNES_BASE_URL}/us/rss/${feed}/limit=${limit}/json`
  const response = await fetch(url, { next: { revalidate: 3600 } })

  if (!response.ok) {
    return Response.json({ error: "RSS feed request failed" }, { status: response.status })
  }

  const data = await response.json()
  return Response.json(data)
}
