"use client"

import { ReactNode, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function SmoothScroll({ children }: { children: ReactNode }) {
    useGSAP(
        () => {
            ScrollSmoother.create({
                wrapper: "#smooth-wrapper", // The element that will contain the smoothed content
                content: "#smooth-content", // The element that will be smoothed
                smooth: 1, // Adjust the smoothness of the scroll
                effects: true, // Enable ScrollSmoother's built-in effects
            })
        },
        {}
    )

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content">
                {children}
            </div>
        </div>
    )
}
