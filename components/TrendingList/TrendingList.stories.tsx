import type { Meta, StoryObj } from "@storybook/react"

import { useMusicStore } from "@/store/musicStore"

import { TrendingList } from "./TrendingList"

const meta: Meta<typeof TrendingList> = {
  title: "Screens/TrendingList",
  component: TrendingList,
  decorators: [
    (Story) => {
      useMusicStore.setState({ searchQuery: "" })
      return (
        <div className="min-h-screen bg-gray-950 p-6">
          <Story />
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof TrendingList>

export const Default: Story = {}

export const WithSearchQuery: Story = {
  decorators: [
    (Story) => {
      useMusicStore.setState({ searchQuery: "Velocity" })
      return <Story />
    },
  ],
}

export const NoResults: Story = {
  decorators: [
    (Story) => {
      useMusicStore.setState({ searchQuery: "xyznonexistent" })
      return <Story />
    },
  ],
}
