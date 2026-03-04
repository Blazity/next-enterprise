import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useMusicStore } from "@/store/musicStore"

import { TrendingList } from "./TrendingList"

describe("TrendingList", () => {
  beforeEach(() => {
    useMusicStore.setState({
      searchQuery: "",
      currentlyPlaying: null,
      playState: "idle",
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

  it("filters songs based on search query", () => {
    useMusicStore.setState({ searchQuery: "Velocity" })
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
    useMusicStore.setState({ searchQuery: "xyznonexistent" })
    render(<TrendingList />)
    expect(screen.getByText("No songs found matching your search.")).toBeInTheDocument()
  })
})
