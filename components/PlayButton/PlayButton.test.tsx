import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { PlayButton } from "./PlayButton"

describe("PlayButton", () => {
  it("renders with play label when not playing", () => {
    render(<PlayButton isPlaying={false} onToggle={() => {}} />)
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument()
  })

  it("renders with pause label when playing", () => {
    render(<PlayButton isPlaying={true} onToggle={() => {}} />)
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument()
  })

  it("calls onToggle when clicked", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<PlayButton isPlaying={false} onToggle={onToggle} />)
    await user.click(screen.getByRole("button"))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it("applies size variant classes", () => {
    const { rerender } = render(<PlayButton isPlaying={false} onToggle={() => {}} size="sm" />)
    expect(screen.getByRole("button")).toHaveClass("size-8")

    rerender(<PlayButton isPlaying={false} onToggle={() => {}} size="lg" />)
    expect(screen.getByRole("button")).toHaveClass("size-14")
  })
})
