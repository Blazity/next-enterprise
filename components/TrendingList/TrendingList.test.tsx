import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

import { TrendingList } from "./TrendingList"

describe("TrendingList", () => {
  beforeEach(() => {
    useMusicStore.setState({
      searchQuery: "",
      currentlyPlaying: null,
      playState: PLAY_STATE.IDLE,
    })
  })

  it("renders trending heading when no search query", () => {
    render(<TrendingList />)
    expect(screen.getByText("Trending Now")).toBeInTheDocument()
  })

  it("renders all trending songs with rank numbers", () => {
    render(<TrendingList />)
    const { trendingSongs } = useMusicStore.getState()
    trendingSongs.forEach((song, index) => {
      expect(screen.getByText(song.title)).toBeInTheDocument()
      expect(screen.getByText(String(index + 1))).toBeInTheDocument()
    })
  })

  it("displays search results when search query is active", () => {
    useMusicStore.setState({
      searchQuery: "Velocity",
      searchResults: [
        {
          id: "search-1",
          title: "Velocity",
          artist: { id: "a1", name: "Apex Motion" },
          albumArt: "https://example.com/art.jpg",
          duration: 200,
          previewUrl: "https://example.com/preview.m4a",
        },
      ],
    })
    render(<TrendingList />)
    expect(screen.getByText("Velocity")).toBeInTheDocument()
    expect(screen.queryByText("Glass Horizon")).not.toBeInTheDocument()
  })

  it("shows results heading when search query is present", () => {
    useMusicStore.setState({ searchQuery: "test" })
    render(<TrendingList />)
    expect(screen.getByText('Results for "test"')).toBeInTheDocument()
  })

  it("shows empty state when no songs match", () => {
    useMusicStore.setState({ searchQuery: "xyznonexistent", searchResults: [] })
    render(<TrendingList />)
    expect(screen.getByText("No songs found matching your search.")).toBeInTheDocument()
  })
})
