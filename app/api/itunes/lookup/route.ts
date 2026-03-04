import type { NextRequest } from "next/server"

const ITUNES_BASE_URL = "https://itunes.apple.com"

// Proxy for iTunes Lookup API
// Usage: /api/itunes/lookup?ids=123,456,789          → batch track/album lookup
//        /api/itunes/lookup?id=123&entity=song        → album tracklist
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const ids = searchParams.get("ids")
  const id = searchParams.get("id")
  const entity = searchParams.get("entity")

  const lookupId = ids ?? id
  if (!lookupId) {
    return Response.json({ error: "ids or id param is required" }, { status: 400 })
  }

  const url = new URL(`${ITUNES_BASE_URL}/lookup`)
  url.searchParams.set("id", lookupId)
  if (entity) url.searchParams.set("entity", entity)

  const response = await fetch(url.toString(), { next: { revalidate: 60 } })

  if (!response.ok) {
    return Response.json({ error: "iTunes lookup failed" }, { status: response.status })
  }

  const data = await response.json()
  return Response.json(data)
}
