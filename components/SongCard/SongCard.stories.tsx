import type { Meta, StoryObj } from "@storybook/react"

import { SongCard } from "./SongCard"

const mockSong = {
  id: "story-1",
  title: "Midnight Echoes",
  artist: { id: "artist-1", name: "Luna Wave" },
  albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
  duration: 234,
}

const meta: Meta<typeof SongCard> = {
  title: "Components/SongCard",
  component: SongCard,
  argTypes: {
    variant: { control: "select", options: ["featured", "trending"] },
    isPlaying: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-950 p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SongCard>

export const Featured: Story = {
  args: {
    song: mockSong,
    variant: "featured",
    isPlaying: false,
    onPlay: () => {},
  },
}

export const Trending: Story = {
  args: {
    song: mockSong,
    variant: "trending",
    rank: 1,
    isPlaying: false,
    onPlay: () => {},
  },
}

export const Playing: Story = {
  args: {
    song: mockSong,
    variant: "featured",
    isPlaying: true,
    onPlay: () => {},
  },
}

export const TrendingPlaying: Story = {
  args: {
    song: mockSong,
    variant: "trending",
    rank: 3,
    isPlaying: true,
    onPlay: () => {},
  },
}
