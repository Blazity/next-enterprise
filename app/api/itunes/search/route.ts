import type { NextRequest } from "next/server"

const ITUNES_BASE_URL = "https://itunes.apple.com"

// Proxy route for iTunes Search API
// Prevents CORS issues and centralises API config
// Docs: /search?term={TERM}&entity={ENTITY}&limit={LIMIT}
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const term = searchParams.get("term")
  const entity = searchParams.get("entity")
  const limit = searchParams.get("limit") ?? "12"

  if (!term || !entity) {
    return Response.json({ error: "term and entity are required" }, { status: 400 })
  }

  const url = new URL(`${ITUNES_BASE_URL}/search`)
  url.searchParams.set("term", term)
  url.searchParams.set("entity", entity)
  url.searchParams.set("limit", limit)

  const response = await fetch(url.toString(), { next: { revalidate: 60 } })

  if (!response.ok) {
    return Response.json({ error: "iTunes API request failed" }, { status: response.status })
  }

  const data = await response.json()
  return Response.json(data)
}
