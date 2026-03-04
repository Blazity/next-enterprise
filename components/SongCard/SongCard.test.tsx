import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { SongCard } from "./SongCard"

const mockSong = {
  id: "test-1",
  title: "Test Song",
  artist: { id: "artist-1", name: "Test Artist" },
  albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
  duration: 200,
}

describe("SongCard", () => {
  it("renders song title and artist name in featured variant", () => {
    render(<SongCard song={mockSong} variant="featured" />)
    expect(screen.getByText("Test Song")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
  })

  it("renders song title and artist name in trending variant", () => {
    render(<SongCard song={mockSong} variant="trending" />)
    expect(screen.getByText("Test Song")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
  })

  it("renders album art with correct alt text", () => {
    render(<SongCard song={mockSong} variant="featured" />)
    expect(screen.getByAltText("Test Song album art")).toBeInTheDocument()
  })

  it("displays rank number in trending variant", () => {
    render(<SongCard song={mockSong} variant="trending" rank={1} />)
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("calls onPlay when trending card is clicked", async () => {
    const user = userEvent.setup()
    const onPlay = vi.fn()
    render(<SongCard song={mockSong} variant="trending" onPlay={onPlay} />)
    await user.click(screen.getByRole("button", { name: /Test Song/i }).closest("[role='button']")!)
    expect(onPlay).toHaveBeenCalled()
  })

  it("renders play button", () => {
    render(<SongCard song={mockSong} variant="featured" />)
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument()
  })
})
