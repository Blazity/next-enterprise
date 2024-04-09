"use client"

import { Button } from "components/Button/Button"

import { useState } from "react"

import "../styles/custom.css"
import AboutUs from "components/aboutUs/AboutUs"
import Hero01 from "components/Hero01/Hero01"
import OurServices from "components/OurServices/OurServices"
import Portfolio from "components/Portfolio/Portfolio"
import ContactUs from "components/ContactUs/ContactUs"

export default function Web() {
  const [init, setInit] = useState(false)
  const [hovered, setHovered] = useState(false)
  const imgStyle = {
    transform: hovered ? "translateX(3px)" : "none",
    transition: "transform .2s", // Optional: Smooth transition
  }
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, staggerChildren: 0.1 } },
  }
  return (
    <div>
      <section className="bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[15%] lg:pr-[15%]">
        <Hero01 />
      </section>
      <section className="bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[15%] lg:pr-[15%]">
        <AboutUs />
      </section>
      <section className="mt-[3%] bg-[#0f172a] max-md:p-4 md:pl-0 md:pr-0 lg:pl-[10%] lg:pr-[10%]">
        <OurServices />
      </section>

      <section className="mb-10 h-[20%] bg-[#0f172a] pl-[10%] pr-[10%] pt-40">
        <Portfolio />
      </section>

      <section className="bg-[#0f172a] max-md:p-4 md:pl-0 md:pr-0 lg:pl-[10%] lg:pr-[10%]">
        <ContactUs />
      </section>
    </div>
  )
}
