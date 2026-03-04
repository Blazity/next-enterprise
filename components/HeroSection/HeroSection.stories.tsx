import type { Meta, StoryObj } from "@storybook/react"

import { HeroSection } from "./HeroSection"

const meta: Meta<typeof HeroSection> = {
  title: "Screens/HeroSection",
  component: HeroSection,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-950 p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof HeroSection>

export const Default: Story = {}
