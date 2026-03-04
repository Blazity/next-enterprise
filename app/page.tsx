import { Metadata } from "next"

import { HeroSection } from "@/components/HeroSection/HeroSection"

export const metadata: Metadata = {
  title: "Streamify — Discover Music",
  description: "Your daily dose of fresh tracks and curated picks.",
}

export default function Home() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-5xl">
        <HeroSection />
      </div>
    </div>
  )
}
