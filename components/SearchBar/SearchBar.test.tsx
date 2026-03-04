import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useMusicStore } from "@/store/musicStore"

import { SearchBar } from "./SearchBar"

describe("SearchBar", () => {
  beforeEach(() => {
    useMusicStore.setState({ searchQuery: "" })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders search input with placeholder", () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText("What do you want to listen to?")).toBeInTheDocument()
  })

  it("updates local input value on type", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("What do you want to listen to?")
    await user.type(input, "hello")
    expect(input).toHaveValue("hello")
  })

  it("debounces store update by 300ms", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("What do you want to listen to?")

    await user.type(input, "test")

    expect(useMusicStore.getState().searchQuery).toBe("")

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(useMusicStore.getState().searchQuery).toBe("test")
  })

  it("shows clear button when input has value and clears on click", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("What do you want to listen to?")

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument()

    await user.type(input, "query")
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument()

    await user.click(screen.getByLabelText("Clear search"))
    expect(input).toHaveValue("")
  })

  it("has accessible label", () => {
    render(<SearchBar />)
    expect(screen.getByLabelText("Search songs")).toBeInTheDocument()
  })
})
