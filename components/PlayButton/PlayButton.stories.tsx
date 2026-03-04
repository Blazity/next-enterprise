import type { Meta, StoryObj } from "@storybook/react"

import { PlayButton } from "./PlayButton"

const meta: Meta<typeof PlayButton> = {
  title: "Components/PlayButton",
  component: PlayButton,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    isPlaying: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 bg-gray-950 p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PlayButton>

export const Idle: Story = {
  args: {
    isPlaying: false,
    onToggle: () => {},
  },
}

export const Playing: Story = {
  args: {
    isPlaying: true,
    onToggle: () => {},
  },
}

export const Small: Story = {
  args: {
    isPlaying: false,
    onToggle: () => {},
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    isPlaying: false,
    onToggle: () => {},
    size: "lg",
  },
}
