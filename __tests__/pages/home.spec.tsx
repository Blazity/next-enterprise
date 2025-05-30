import { render, screen } from "@testing-library/react"

import Home, { metadata } from "@/app/page"
import { LP_GRID_ITEMS } from "lp-items"

describe("Home", () => {
  beforeEach(() => {
    render(<Home />)
  })

  it("renders the main heading", () => {
    expect(screen.getByText("Next.js Enterprise Boilerplate")).toBeInTheDocument()
  })

  it("renders the description paragraph", () => {
    expect(screen.getByText(/Jumpstart your enterprise project/)).toBeInTheDocument()
  })

  it("renders both buttons with correct text and links", () => {
    const getStartedButton = screen.getByText("Get started")
    const deployNowButton = screen.getByText("Deploy Now")

    expect(getStartedButton).toBeInTheDocument()
    expect(deployNowButton).toBeInTheDocument()
    expect(getStartedButton.closest('a')).toHaveAttribute('href', 'https://github.com/Blazity/next-enterprise')
    expect(deployNowButton.closest('a')).toHaveAttribute('href', 'https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise')
  })

  it("renders all grid items with their content", () => {
    LP_GRID_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  it("renders grid items in the correct structure", () => {
    const gridItems = screen.getAllByRole('heading', { level: 3 })
    expect(gridItems).toHaveLength(LP_GRID_ITEMS.length)
    
    gridItems.forEach((item) => {
      const parent = item.closest('div')
      expect(parent).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'text-center')
    })
  })

  it("has correct metadata configuration", () => {
    expect(metadata).toEqual({
      title: "Next.js Enterprise Boilerplate",
      twitter: {
        card: "summary_large_image",
      },
      openGraph: {
        url: "https://next-enterprise.vercel.app/",
        images: [
          {
            width: 1200,
            height: 630,
            url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
          },
        ],
      },
    })
  })
})