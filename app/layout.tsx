"use client"
import "styles/tailwind.css"
import "styles/custom.css"
import Navbar from "components/Navbar/Navbar"

import Footer from "components/Footer/Footer"
import { FloatingWhatsApp } from "react-floating-whatsapp"

// import SmoothScroll from "utils/ScrollAnimations/SmoothScroll"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] ">
        {/* <SmoothScroll> */}
        <Navbar logoSrc="/images/logo.webp" />
        {children}{" "}
        <FloatingWhatsApp
          phoneNumber="0704235666"
          accountName="Vizole Labs"
          allowEsc
          allowClickAway
          notification
          notificationSound
        />
        <Footer />
        {/* </SmoothScroll> */}
      </body>
    </html>
  )
}
