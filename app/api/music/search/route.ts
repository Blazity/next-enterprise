import { NextRequest, NextResponse } from "next/server"
import { searchTracks } from "lib/itunes"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Missing search query parameter 'q'" }, { status: 400 })
  }

  try {
    const tracks = await searchTracks(query.trim())
    return NextResponse.json({ tracks })
  } catch (error: unknown) {
    console.error("iTunes search error:", error)
    const err = error as Error
    return NextResponse.json(
      { error: "Failed to search tracks" },
      { status: 500 }
    )
  }
}
