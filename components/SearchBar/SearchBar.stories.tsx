import type { Meta, StoryObj } from "@storybook/react"

import { SearchBar } from "./SearchBar"

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md bg-gray-950 p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {}

export const WithClassName: Story = {
  args: {
    className: "max-w-sm",
  },
}
