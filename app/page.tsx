"use client"
import { Metadata } from "next"
import { Button } from "components/Button/Button"
import { InfiniteSlider } from "components/Slider/Slider"
import { useState } from "react"
import Navbar from "components/Navbar/Navbar"
import { LP_GRID_ITEMS } from "lp-items"
import { FaArrowRight, FaFileCsv, FaNewspaper } from "react-icons/fa"
import "../styles/custom.css"
import { MdOutlineWeb } from "react-icons/md"
import { TiTick } from "react-icons/ti"
import { MdOutlineAppSettingsAlt } from "react-icons/md"
import { Glow, GlowCapture } from "@codaworks/react-glow"
import StarBackground from "components/StarBackground/StarBackground"
import { Textarea } from "@nextui-org/react"

export default function Web() {
  const [init, setInit] = useState(false)
  const [hovered, setHovered] = useState(false)
  const imgStyle = {
    transform: hovered ? "translateX(3px)" : "none",
    transition: "transform .2s", // Optional: Smooth transition
  }
  return (
    <div>
      <section className="bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[15%] lg:pr-[15%]">
        <div
          className=" h-[80%] rounded-[3rem] pt-[10%]"
          style={{
            backgroundImage: `url('/images/glow-bottom.svg')`,
            backgroundSize: "fill",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
            <div className="mx-auto place-self-center">
              <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
                Experience the next dimension
              </h1>
              <p className="mb-6 max-w-2xl font-light  text-gray-200 md:text-lg lg:mb-8 lg:text-xl">
                Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software
                solutions powered by AI.
              </p>
              <Button
                href="https://github.com/Blazity/next-enterprise"
                className="mr-3 "
                intent="hero1"
                size="hero1"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <span>Get started</span>
                <div className="ml-2">
                  <span>
                    <FaArrowRight style={imgStyle} className="text-orange-500" />
                  </span>
                </div>
              </Button>
              <Button
                href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
                intent="secondary"
                size="hero1"
              >
                Deploy Now
              </Button>
            </div>
          </div>
        </div>
        <div className="p-10">
          <InfiniteSlider />
        </div>
      </section>
      <section className="bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[15%] lg:pr-[15%]">
        <div
          className=" h-[60%] rounded-[3rem]"
          style={{
            backgroundImage: `url('/images/glow-top.svg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex w-[100%] items-center justify-around pb-[10vh] pt-[5vh]">
            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-16">
              <div className="mx-auto text-left text-white">
                <h4 className="bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 bg-clip-text pt-20 font-bold text-transparent ">
                  About Vizole Labs
                </h4>
                <div className="mb-4 max-w-2xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
                  <h2 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text text-transparent">
                    We are a new digital product development agency
                  </h2>
                </div>
                <h3 className="mr-90 max-w-2xl text-slate-300">
                  we're dedicated to bringing your ideas to life with innovative solutions tailored to your unique
                  needs.
                </h3>
              </div>

              <div className="mx-auto mt-3 flex flex-col justify-around text-left text-white">
                <Button
                  href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
                  intent="aboutUs"
                  size="hero1"
                >
                  <TiTick className="mr-2 h-5 w-5" />
                  Expertise and Experience
                </Button>
                <Button
                  href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
                  intent="aboutUs"
                  size="hero1"
                >
                  <TiTick className="mr-2 h-5 w-5" />
                  Client-Centric Approach
                </Button>
                <Button
                  href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
                  intent="aboutUs"
                  size="hero1"
                >
                  <TiTick className="mr-2 h-5 w-5" />
                  Innovation at the Core
                </Button>
              </div>
            </div>
            <div>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/_vhf0RZg0fg"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-[3%] bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[10%] lg:pr-[10%]">
        <div>
          <GlowCapture>
            <div className="flex flex-col items-center justify-around">
              <div className="mb-4 max-w-3xl text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
                <h2 className="">Our Services</h2>
              </div>
              <p className="mb-6 max-w-2xl text-center font-light text-gray-200 md:text-lg lg:mb-8 lg:text-xl">
                Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software
                solutions powered by AI.
              </p>
            </div>
            <div className="mt-10 grid max-w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
              <Glow color="#F0B37D">
                <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
                  <div className=" text-center">
                    <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                      <MdOutlineWeb className="h-[80px] w-[80px] text-white" />
                    </div>
                  </div>
                  <div className="flex h-full flex-col rounded-lg ">
                    <div className="mb-3 flex items-center ">
                      <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                        Web Devlopment
                      </h2>
                    </div>
                    <div className="flex flex-grow flex-col justify-between">
                      <p className="text-base leading-relaxed text-gray-300">
                        We specialize in creating modern, user-friendly websites that reflect your brand and drive
                        business growth.
                      </p>
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white"
                      >
                        Learn More
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="ml-2 h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Glow>
              <Glow color="#F5887A">
                <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
                  <div className=" text-center">
                    <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                      <MdOutlineAppSettingsAlt className="h-[80px] w-[80px] text-white" />
                    </div>
                  </div>
                  <div className="flex h-full flex-col rounded-lg ">
                    <div className="mb-3 flex items-center ">
                      <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                        IOS / Android App Development
                      </h2>
                    </div>
                    <div className="flex flex-grow flex-col justify-between">
                      <p className="text-base leading-relaxed text-gray-300">
                        We specialize in creating modern, user-friendly websites that reflect your brand and drive
                        business growth.
                      </p>
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white"
                      >
                        Learn More
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="ml-2 h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Glow>
              <Glow color="#C37EB6">
                <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
                  <div className=" text-center">
                    <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                      <MdOutlineWeb className="h-[80px] w-[80px] text-white" />
                    </div>
                  </div>
                  <div className="flex h-full flex-col rounded-lg ">
                    <div className="mb-3 flex items-center ">
                      <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                        Web Devlopment
                      </h2>
                    </div>
                    <div className="flex flex-grow flex-col justify-between">
                      <p className="text-base leading-relaxed text-gray-300">
                        We specialize in creating modern, user-friendly websites that reflect your brand and drive
                        business growth.
                      </p>
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white"
                      >
                        Learn More
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="ml-2 h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Glow>
              <Glow color="#D30253">
                <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
                  <div className=" text-center">
                    <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                      <MdOutlineWeb className="h-[80px] w-[80px] text-white" />
                    </div>
                  </div>
                  <div className="flex h-full flex-col rounded-lg ">
                    <div className="mb-3 flex items-center ">
                      <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                        Web Devlopment
                      </h2>
                    </div>
                    <div className="flex flex-grow flex-col justify-between">
                      <p className="text-base leading-relaxed text-gray-300">
                        We specialize in creating modern, user-friendly websites that reflect your brand and drive
                        business growth.
                      </p>
                      <a
                        href="#"
                        className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white"
                      >
                        Learn More
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          className="ml-2 h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Glow>
            </div>
          </GlowCapture>
        </div>
      </section>

      <section className="h-[150vh] bg-[#0f172a] pl-[10%] pr-[10%] pt-40">
        <div className="mx-auto place-self-center text-center">
          <div className="mb-4 text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
            <h1 className="">Our Portfolio</h1>
          </div>
          <p className="pl-5 pr-5 text-2xl text-white">
            The showcase of our innovations. Dive in to explore our diverse range of projects and see how we’re driving
            digital transformation across industries.”
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="mt-10 flex max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <img className="h-auto max-w-full rounded-lg" src="/images/site01.png" alt="" />
          </div>
          <div className="mt-10 flex max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <img className="h-auto max-w-full rounded-lg" src="/images/site02.png" alt="" />
          </div>
          <div className="mt-10 flex max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <img className="h-auto max-w-full rounded-lg" src="/images/site03.png" alt="" />
          </div>
          <div className="mt-10 flex max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <img className="h-auto max-w-full rounded-lg" src="/images/site01.png" alt="" />
          </div>
          <div className="mt-10 flex max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <img className="h-auto max-w-full rounded-lg" src="/images/site02.png" alt="" />
          </div>
          <div className="flex] mt-10 max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <img className="h-auto max-w-full rounded-lg" src="/images/site03.png" alt="" />
          </div>
        </div>
      </section>

      <section className="bg-[#0f172a] dark:bg-gray-900">
        <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
          <h2 className="mb-4 text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
            Contact Us
          </h2>
          <p className="mb-8 text-center font-light text-slate-200 dark:text-gray-400 sm:text-xl lg:mb-16">
            Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let
            us know.
          </p>
          <form action="#" className="space-y-8">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-homeBg2 p-2.5 text-sm text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="name@gmail.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300  bg-homeBg2 p-3 text-sm text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-white dark:text-gray-400">
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                className="block w-full rounded-lg border border-gray-300  bg-homeBg2 p-2.5 text-sm text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <Button
              type="submit"
              href="#"
              className="rounded-lg bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
            >
              Send message
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
