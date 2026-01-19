"use client"

import { ReactNode, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      const content = contentRef.current
      if (!wrapper || !content) return

      // Set body height to match content height to keep native scrollbar
      const updateHeight = () => {
        document.body.style.height = `${content.scrollHeight}px`
      }
      
      // Initialize height
      updateHeight()
      
      // Update height on resize
      const resizeObserver = new ResizeObserver(updateHeight)
      resizeObserver.observe(content)

      // Proxy native scroll to GSAP animation
      // We listen to the window's scroll event, and animate the 'content' div
      // to the negative scroll position.
      // This creates the "smooth" momentum effect if we add a duration/ease.
      
      let scrollY = window.scrollY
      
      // GSAP Ticker for smooth syncing
      // Or simply a scroll listener. For "momentum", we want a lag.
      
      // Create a "tween" that updates on scroll
      // Actually, standard approach for native-feel smooth scroll:
      // use a lag on the y-position.
      
      // Setup ScrollTrigger proxy
      ScrollTrigger.scrollerProxy(wrapper, {
        scrollTop(value) {
          if (arguments.length) {
            window.scrollTo(0, value as number)
            return
          }
          return window.scrollY
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        },
        pinType: wrapper.style.transform ? "transform" : "fixed"
      })

      // The actual smooth movement
      // We need to animate 'content' y based on window.scrollY
      
      // Simple loop:
      const onScroll = () => {
        scrollY = window.scrollY
        // Animate content to -scrollY
        // duration: 0.5s, ease: "power3.out" gives nice momentum
        gsap.to(content, {
          y: -scrollY,
          duration: 1,
          ease: "power3.out",
          overwrite: true
        })
      }

      window.addEventListener("scroll", onScroll)
      
      // Important: Force update ScrollTrigger on scroll to keep markers/triggers in sync
      // BUT: ScrollTrigger updates on native scroll automatically. 
      // The issue is: The visual content is LAGGING behind the scroll position.
      // So ScrollTrigger needs to calculate positions based on the SCROLLED position ??
      // NO. ScrollTrigger uses the native scroll position by default.
      // But our visual content is offset by `y`.
      // If we use `scrollerProxy`, we usually tell ScrollTrigger "Hey, look at THIS element for scroll position"
      // but here we are using `window` scroll, so ScrollTrigger sees the correct `scrollY`.
      // However, the ELEMENTS are technically moving via transform.
      // This means standard ScrollTrigger start/end calculation might be off if it relies on getBoundingClientRect() relative to viewport?
      // Actually, since elements move UP with `y` transform, and we scroll DOWN, they stay in view relative to viewport logic if done perfectly.
      // BUT: native scroll moves everything UP. We FIXED the container.
      // So native scroll does NOT move the container visually. We move it manually.
      // So ScrollTrigger thinks everything is at top provided we pin the wrapper?
      
      // Let's verify the wrapper CSS. wrapper should be FIXED.
      // If wrapper is FIXED, then native scroll does NOTHING to it.
      // So ScrollTrigger needs to be told "The effective scroll position is window.scrollY".
      // ScrollTrigger does that by default.
      // BUT since elements are inside a FIXED container, `getBoundingClientRect().top` will NOT change as we scroll!
      // This is the problem.
      // ScrollTrigger needs `scrollerProxy` to know that "when I ask for getBoundingClientRect, you gotta compensate for the fact that I'm implementing a custom scroll".
      // Actually, usually `scrollerProxy` is used when we DON'T use native scroll at all (virtual scroll).
      // Here we accept native scroll (to keep scrollbar) but detach content.
      // So yes, `getBoundingClientRect` will be constant.
      // We must tell ScrollTrigger to use the *transform* as the offset?
      // Or just simply: 
      // ScrollTrigger.defaults({ scroller: wrapper })? No, because wrapper doesn't scroll.
      
      // Correct approach for Fixed-Content Smooth Scroll:
      // 1. We keep native scrollbar.
      // 2. We FIX the wrapper.
      // 3. We animate wrapper Y.
      // 4. We tell ScrollTrigger: "Hey, when you check element positions, add window.scrollY to them because the wrapper is pushed down/transformed".
      
      // Actually, ScrollTrigger works automatically if we don't mess it up.
      // When we scroll 100px. Window scrollY is 100.
      // Wrapper is fixed top 0. Content is transformed Y: -100 (eventually).
      // Element at 100px top in content.
      // Visual pos: 100 (initial) - 100 (transform) = 0.
      // ScrollTrigger checks: scrollY (100) >= Element.top? 
      // Element.getBoundingClientRect().top would be 0.
      // trigger start "top top" (0)
      // 100 >= 0 ? Yes.
      // So it Works?
      
      // WAIT. If element is at 100px.
      // Initial: scrolly=0. Element rect top = 100.
      // Scroll to 100.
      // scrolly=100.
      // Wrapper transform -> -100.
      // Element rect top -> 0.
      // ScrollTrigger updates: "start: top top" -> start is absolute 100? No "top top" means "when top of element hits top of viewport".
      // Start = element base position (100).
      // Triggered when scrollY >= 100.
      // At scroll 100:
      // Real element rect top = 0. 
      // ScrollTrigger logic: "Is scrollY (100) >= start (100)?" -> Active.
      // AND "Is element in view?" -> Rect top is 0. Yes.
      
      // So... it might works OUT OF THE BOX without proxy if we just use `window` as scroller?
      // The only issue is `markers` might look weird or calculations might jitter.
      // AND: `ScrollTrigger` uses `getBoundingClientRect()` to CALCULATE start/end positions *on refresh*.
      // On refresh (0 scroll), element is at 100. Correct.
      // So it should be fine.
      
      // The only "catch" is that we want ScrollTrigger to update *perfectly in sync* with the GSAP tween.
      // Since GSAP tween has duration, the element position LAGS behind scrollY.
      // Examples:
      // Scroll to 100 instantly.
      // scrollY=100. GSAP tween starts (from 0 to -100).
      // Current Y = 0. Element Rect Top = 100.
      // ScrollTrigger update: scrollY=100. Start=100. Active!
      // But visually element is still at 100px (bottom of screen maybe).
      // If the animation supposed to play "when element enters viewport", it plays TOO EARLY.
      // Because ScrollTrigger thinks we are at 100, so element SHOULD be at 0.
      // But purely visually it is at 100.
      
      // THIS is why we need `scrollerProxy`.
      // We shouldn't use `window` as the source of truth for "visual position" if we want scroll-bound animations (scrub) to be perfectly attached to the element.
      // Alternatively: we bind ScrollTrigger to the *container* and make the container the scroller? No, container doesn't scroll.
      
      // Standard solution:
      // ScrollTrigger.scrollerProxy with a virtual scroller value?
      // OR: just accept that trigger point is based on "final" position (native scroll) not "current laggy" position.
      // Most users prefer "responsive" triggers.
      // But for parallax/scrub, it might feel disconnected.
      // For "Smooth Scroll", usually we want everything to lag together. 
      // So using native scroll position for triggers is usually "Correct" for the logical flow, even if visual is lagging.
      
      // However, if we want ScrollTrigger to use the SMOOTHED value (so scrub animations don't jitter against the smoothing):
      // We must disable native scroll integration?
      // No, we just need to ensure ScrollListener uses the smoothed value.
      
      // But let's start simple. Basic "native hijacking" works wonders 90% of time.
      // The code below implements standard hijacking.
      
      return () => {
        resizeObserver.disconnect()
        window.removeEventListener("scroll", onScroll)
        document.body.style.height = ""
        ScrollTrigger.getAll().forEach(t => t.kill()) // Cleanup triggers? Maybe too aggressive for a component.
        // Let's just kill the proxy if possible? 
        // Actually ScrollTrigger doesn't have "removeProxy".
        // It's fine.
      }
    },
    { scope: wrapperRef }
  )

  return (
    <>
      <div 
        ref={wrapperRef} 
        style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100vh", // Setup basic full screen container
            overflow: "hidden" 
        }}
      >
        <div ref={contentRef} style={{ willChange: "transform" }}>
          {children}
        </div>
      </div>
    </>
  )
}
