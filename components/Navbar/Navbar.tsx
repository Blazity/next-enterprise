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

  const [isNavOpen, setIsNavOpen] = useState(false)

  const mobileNavStyle = {
    display: isNavOpen ? "block" : "none",
  }

  const desktopNavStyle = {
    display: isNavOpen ? "none" : "block",
  }

  return (
    <nav
      className={`${
        showBackground ? "backdrop-blur" : "bg-transparent"
      } fixed start-0 top-0 z-20 w-full bg-transparent dark:border-gray-600 dark:bg-gray-900`}
    >
      <section className="MOBILE-MENU flex hidden backdrop-blur-lg" style={mobileNavStyle}>
        <div>
          {" "}
          <div className="CROSS-ICON absolute right-0 top-0 px-8 py-8">
            <button onClick={() => setIsNavOpen(!isNavOpen)}>
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <ul className="MENU-LINK-MOBILE-OPEN flex min-h-[300px] flex-col items-center justify-center text-white">
            <li className="my-2 border-b border-gray-400 uppercase">
              <a href="#">Home</a>
            </li>
            <li className="my-2 border-b border-gray-400 uppercase">
              <a href="#">Services</a>
            </li>
            <li className="my-2 border-b border-gray-400 uppercase">
              <a href="#">Portfolio</a>
            </li>
            <li className="my-2 border-b border-gray-400 uppercase">
              <a href="#">About</a>
            </li>
            <li className="my-2 border-b border-gray-400 uppercase">
              <a href="#">Sign In</a>
            </li>
            <li className="my-2 border-b border-gray-400 uppercase">
              <a href="#">Sign Up</a>
            </li>
          </ul>
        </div>
      </section>
      <section style={desktopNavStyle}>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logoSrc} className="h-8" alt="Vizolelabs Logo" />
          </a>
          <div className="flex space-x-3 rtl:space-x-reverse md:order-3 md:space-x-0">
            <li className="hidden md:block">
              <Button
                href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
                intent="navSignIn"
                size="hero1"
              >
                Sign In
              </Button>
            </li>
            <li className="hidden lg:block">
              <Button
                href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
                intent="navSignUp"
                size="hero2"
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
            </li>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto" id="navbar-sticky">
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-transparent p-4 font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0 md:dark:bg-gray-900">
              <div className="mt-2 flex flex-col rounded-lg border border-gray-100 bg-transparent font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:mt-2 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0 md:dark:bg-gray-900">
                <li>
                  <a
                    href="#"
                    className="block rounded px-3 py-2 text-white hover:text-vizoleG2 md:p-0"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded px-3 py-2 text-white hover:bg-gray-100 hover:text-vizoleG2 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded px-3 py-2 text-white hover:bg-gray-100 hover:text-vizoleG2 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded px-3 py-2 text-white hover:bg-gray-100 hover:text-vizoleG2 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                  >
                    About
                  </a>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </section>
    </nav>
  )
}

export default Navbar
