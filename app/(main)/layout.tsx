"use client"

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { NavBar } from "@/components/NavBar/NavBar"
import { NowPlaying } from "@/components/NowPlaying/NowPlaying"
import { NowPlayingSpacer } from "@/components/NowPlaying/NowPlayingSpacer"
import { UserSync } from "@/components/UserSync/UserSync"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(10, 15, 25)"
        gradientBackgroundEnd="rgb(5, 10, 15)"
        firstColor="15, 60, 90"    
        secondColor="20, 80, 120"  
        thirdColor="10, 40, 70"     
        fourthColor="5, 30, 60"    
        fifthColor="25, 90, 130"    
        pointerColor="30, 120, 150" 
        size="100%"
        containerClassName="fixed inset-0 -z-10 opacity-50 pointer-events-none"
        interactive={false}
      />
      <UserSync />
      <NowPlaying />
      <div className="flex h-screen flex-col overflow-hidden">
        <NowPlayingSpacer />
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <NavBar />
          <main className="flex-1 overflow-y-auto overscroll-contain pb-6 md:pb-0 relative">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
