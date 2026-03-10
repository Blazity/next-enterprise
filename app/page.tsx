import { Metadata } from "next"
import { Button } from "components/Button/Button"

import { LP_GRID_ITEMS } from "lp-items"

export const metadata: Metadata = {
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
}

export default function Web() {
  return (
    <main className="min-h-screen pb-32">
      <TopNav onHome={handleClearSearch} />

      {/* Hero Search Section & Suggested Chips */}
      <div className="from-aura-bg relative mx-auto flex max-w-screen-xl flex-col items-center overflow-hidden border-b border-white/5 bg-gradient-to-b to-transparent px-4 pt-16 pb-12">
        {/* Decorative background glow */}
        <div className="bg-aura-primary/10 pointer-events-none absolute top-[-50%] left-1/2 aspect-[2/1] w-full max-w-3xl -translate-x-1/2 rounded-[100%] blur-[120px]" />

        <h1 className="animate-in slide-in-from-bottom-3 z-10 mb-10 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-center text-4xl font-black tracking-tight text-transparent duration-700 md:text-5xl">
          What&apos;s your aura today?
        </h1>

        <div className="animate-in slide-in-from-bottom-4 relative z-10 w-full delay-75 duration-700">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
        </div>

        {/* Suggested Searches */}
        <div className="animate-in slide-in-from-bottom-5 z-10 mt-8 flex flex-wrap items-center justify-center gap-3 delay-150 duration-700">
          {SUGGESTED_SEARCHES.map((pill) => (
            <button
              key={pill}
              onClick={() => handleSearch(pill)}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-300 shadow-sm transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6">
        {isHomeView && recentlyPlayed.length > 0 && (
          <div className="animate-in fade-in mb-16 duration-700">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Music3 className="text-aura-primary h-4 w-4" />
              </span>
              Recently Played
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {recentlyPlayed.map((track, i) => (
                <TrackCard
                  key={`recent-${track.trackId}-${i}`}
                  track={track}
                  isCurrentTrack={currentTrack?.trackId === track.trackId}
                  isPlaying={currentTrack?.trackId === track.trackId && isPlaying}
                  onPlay={(t) => handlePlayFromCard(t, "recent")}
                  onPause={handlePause}
                />
              ))}
            </div>
          </div>
        )}

        <div className="animate-in fade-in duration-700">
          <div className="mb-6 flex items-center gap-3">
            {isHomeView ? (
              <Flame className="text-aura-secondary h-6 w-6" />
            ) : (
              <Search className="text-aura-primary h-6 w-6" />
            )}
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isHomeView ? "Trending Now" : `Results for "${searchQuery}"`}
            </h2>
          </div>

          <TrackList
            tracks={tracks}
            currentTrackId={currentTrack?.trackId ?? null}
            isPlaying={isPlaying}
            onPlay={(t) => handlePlayFromCard(t, "search")}
            onPause={handlePause}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Now Playing */}
      <NowPlayingBar
        track={currentTrack}
        isPlaying={isPlaying}
        audioRef={audioRef}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </main>
  )
}
