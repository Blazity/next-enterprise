import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { featuredSongs, trendingSongs } from "@/data/songs"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

import { HeroSection } from "./HeroSection"

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: { firstName: "Test" } }),
}))

describe("HeroSection", () => {
  beforeEach(() => {
    useMusicStore.setState({
      currentlyPlaying: null,
      playState: PLAY_STATE.IDLE,
      featuredSongs,
      trendingSongs,
      isLoadingHome: false,
      homeError: null,
    })
  })

  it("renders the greeting heading", () => {
    render(<HeroSection />)
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
  })

  it("renders top picks section", () => {
    render(<HeroSection />)
    expect(screen.getByText("Top Picks for You")).toBeInTheDocument()
    expect(screen.getByText("Made for You")).toBeInTheDocument()
  })

  it("renders trending now section", () => {
    render(<HeroSection />)
    expect(screen.getByText("Trending Now")).toBeInTheDocument()
  })

  it("renders featured songs in top picks", () => {
    render(<HeroSection />)
    const topPicks = featuredSongs.slice(0, 3)
    topPicks.forEach((song) => {
      expect(screen.getAllByText(song.title).length).toBeGreaterThanOrEqual(1)
    })
  })
})
