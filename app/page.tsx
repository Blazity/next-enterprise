"use client"

import "../styles/custom.css"
import AboutUs from "components/aboutUs/AboutUs"
import Hero01 from "components/Hero01/Hero01"
import OurServices from "components/OurServices/OurServices"
import Portfolio from "components/Portfolio/Portfolio"
import ContactUs from "components/ContactUs/ContactUs"

export default function Web() {
  return (
    <div>
      <section id="Home" className="bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[2%] lg:pr-[2%]">
        <Hero01 />
      </section>
      <section id="aboutUs" className="bg-[#0f172a] md:pl-0 md:pr-0 ">
        <AboutUs />
      </section>
      <div>
        <section id="services" className="mt-[3%] bg-[#0f172a] max-md:p-4 md:pl-0 md:pr-0 lg:pl-[10%] lg:pr-[10%]">
          <OurServices />
        </section>
      </div>
      <div>
        <section id="portfolio" className="mb-10 h-[20%] bg-[#0f172a] pl-[10%] pr-[10%] pt-40">
          <Portfolio />
        </section>
      </div>
      <div>
        <section id="contactUs" className="bg-[#0f172a] max-md:p-4 md:pl-0 md:pr-0 lg:pl-[10%] lg:pr-[10%]">
          <ContactUs />
        </section>
      </div>
    </div>
  )
}
