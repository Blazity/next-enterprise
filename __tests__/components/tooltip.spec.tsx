import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { Tooltip } from "@/components/Tooltip/Tooltip"

describe("Tooltip", () => {
  it("should render tooltip content when open is true", () => {
    render(
      <Tooltip explainer="Click me" open={true}>
        <div>Hover me</div>
      </Tooltip>
    )

    expect(screen.getByText("Hover me")).toBeInTheDocument()

    const tooltipContent = document.querySelector('[data-radix-popper-content-wrapper]')
    expect(tooltipContent).toBeInTheDocument()
    expect(tooltipContent).toHaveTextContent("Click me")
  })

  it("should not render tooltip content when open is false or undefined", () => {
    render(
      <Tooltip explainer="Click me">
        <div>Hover me</div>
      </Tooltip>
    )

    expect(screen.getByText("Hover me")).toBeInTheDocument()
    const tooltipContent = document.querySelector('[data-radix-popper-content-wrapper]')
    expect(tooltipContent).not.toBeInTheDocument()
  })

  it("calls onOpenChange when tooltip open state changes", async () => {
    const handleOpenChange = jest.fn()

    render(
      <Tooltip explainer="Controlled" open={false} onOpenChange={handleOpenChange}>
        <button>Hover me</button>
      </Tooltip>
    )

    expect(screen.queryByText("Controlled")).not.toBeInTheDocument()

    fireEvent.mouseOver(screen.getByText("Hover me"))

    expect(screen.queryByText("Controlled")).not.toBeInTheDocument()

    handleOpenChange(true)

    expect(handleOpenChange).toHaveBeenCalledWith(true)
  })

  it("renders arrow when withArrow is true", () => {
    const { container } = render(
      <Tooltip explainer="Tooltip with arrow" open={true} withArrow={true}>
        <button>Hover me</button>
      </Tooltip>
    )

    console.log(container.innerHTML)

    const arrow = document.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

})
