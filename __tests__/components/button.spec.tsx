import { render, screen } from "@testing-library/react"

import { Button } from "@/components/Button/Button"

describe("Button component", () => {
  it("renders with default intent and size", () => {
    render(<Button href="/">Default Button</Button>)
    const btn = screen.getByRole("link", { name: /default button/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass("bg-blue-400")
    expect(btn).toHaveClass("text-lg")
  })

  it("renders secondary intent correctly", () => {
    render(<Button href="/" intent="secondary">Secondary Button</Button>)
    const btn = screen.getByRole("link", { name: /secondary button/i })
    expect(btn).toHaveClass("bg-transparent")
    expect(btn).toHaveClass("text-blue-400")
  })

  it("renders small size correctly", () => {
    render(<Button href="/" size="sm">Small Button</Button>)
    const btn = screen.getByRole("link", { name: /small button/i })
    expect(btn).toHaveClass("text-sm")
    expect(btn).toHaveClass("min-w-20")
  })

  it("applies underline when underline prop is true", () => {
    render(<Button href="/" underline>Underlined Button</Button>)
    const btn = screen.getByRole("link", { name: /underlined button/i })
    expect(btn).toHaveClass("underline")
  })

  it("does not apply underline class when underline prop is false or omitted", () => {
    render(<Button href="/">No Underline</Button>)
    const btn = screen.getByRole("link", { name: /no underline/i })
    expect(btn).not.toHaveClass("underline")
  })

  it("merges custom className with variant classes", () => {
    render(<Button href="/" className="custom-class">Custom Class Button</Button>)
    const btn = screen.getByRole("link", { name: /custom class button/i })
    expect(btn).toHaveClass("custom-class")
    expect(btn).toHaveClass("bg-blue-400")
  })

  it("forwards href and other props correctly", () => {
    render(<Button href="/test" rel="noopener noreferrer">Link Button</Button>)
    const btn = screen.getByRole("link", { name: /link button/i })
    expect(btn).toHaveAttribute("href", "/test")
    expect(btn).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("renders children inside the anchor tag", () => {
    render(<Button href="/">Click Me</Button>)
    expect(screen.getByText("Click Me")).toBeInTheDocument()
  })
})
