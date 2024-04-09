"use client"
interface NavbarProps {
  logoSrc: string // Path to your logo image
}

import { useState, useEffect } from "react"
import { Button } from "components/Button/Button"
import { FaArrowRight } from "react-icons/fa"

const Navbar: React.FC<NavbarProps> = ({ logoSrc }) => {
  const [showBackground, setShowBackground] = useState(false)
  const TOP_OFFSET = 50

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true)
      } else {
        setShowBackground(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const [hovered, setHovered] = useState(false)
  const imgStyle = {
    transform: hovered ? "translateX(3px)" : "none",
    transition: "transform .2s", // Optional: Smooth transition
  }

  return (
    <nav
      className={`${
        showBackground ? "backdrop-blur" : "bg-transparent"
      } fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between px-4 text-white`}
    >
      <a href="/">
        <img src={logoSrc} alt="Your Logo" className="h-20 text-white" />
      </a>
      <ul className="hidden space-x-4 text-lg font-medium md:flex">
        <li>
          <a href="/" className="hover:text-vizoleG2">
            Home
          </a>
        </li>
        <li>
          <a href="/services" className="hover:text-vizoleG2">
            Services
          </a>
        </li>
        <li>
          <a href="/portfolio" className="hover:text-vizoleG2">
            Portfolio
          </a>
        </li>
        <li>
          <a href="/about-us" className="hover:text-vizoleG2">
            About Us
          </a>
        </li>
        <li>
          <a href="/contact-us" className="hover:text-vizoleG2">
            Contact Us
          </a>
        </li>
      </ul>
      <div className="flex items-center">
        <Button
          href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
          intent="navSignIn"
          size="hero1"
        >
          Sign In
        </Button>
        <Button
          href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
          intent="navSignUp"
          size="hero1"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Sign Up
          <div className="ml-2">
            <span>
              <FaArrowRight style={imgStyle} className="text-white" />
            </span>
          </div>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
