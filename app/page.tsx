"use client"
import { Metadata } from "next"
import { Button } from "components/Button/Button"
import { InfiniteSlider } from "components/Slider/Slider"
import Navbar from "components/Navbar/Navbar"
import { LP_GRID_ITEMS } from "lp-items"
import { FaArrowRight, FaFileCsv } from "react-icons/fa"
import "../styles/custom.css"
import { MdOutlineWeb } from "react-icons/md"
import { TiTick } from "react-icons/ti"
import { useState } from "react"
import { MdOutlineAppSettingsAlt } from "react-icons/md"

export default function Web() {


  return (
    <div>
      <section className="bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[15%] lg:pr-[15%]">
        <div
          className=" h-[80%] rounded-[3rem] pt-[10%]"
          style={{
            backgroundImage: `url('/images/glow-bottom.svg')`,
            backgroundSize: "cover",
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
              <Button href="https://github.com/Blazity/next-enterprise" className="mr-3 " intent="hero1" size="hero1">
                <span className="transition-all hover:pr-1">Get started</span>
                <div className="ml-2">
                  <FaArrowRight className="text-orange-500" />
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
            backgroundSize: "fill",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="w-[100% ] flex items-center justify-around pb-[5vh] pt-[5vh]">
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
      <section className="mt-[3%] bg-[#0f172a] md:pl-0 md:pr-0 lg:pl-[15%] lg:pr-[10%]">
        <div className="flex flex-col items-center justify-around">
          <div className="mb-4 max-w-3xl text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
            <h2 className="">Our Services</h2>
          </div>
          <p className="mb-6 max-w-2xl text-center font-light text-gray-200 md:text-lg lg:mb-8 lg:text-xl">
            Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software solutions
            powered by AI.
          </p>
        </div>
        <div className="mt-10 grid max-w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div className=" flex max-w-[100%] items-center rounded-[20px] border p-4">
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
                  We specialize in creating modern, user-friendly websites that reflect your brand and drive business
                  growth.
                </p>
                <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
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
          <div className=" flex max-w-[100%] items-center rounded-[20px] border p-4">
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
                  We specialize in creating modern, user-friendly websites that reflect your brand and drive business
                  growth.
                </p>
                <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
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
          <div className=" flex max-w-[100%] items-center rounded-[20px] border p-4">
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
                  We specialize in creating modern, user-friendly websites that reflect your brand and drive business
                  growth.
                </p>
                <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
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
          <div className=" flex max-w-[100%] items-center rounded-[20px] border p-4">
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
                  We specialize in creating modern, user-friendly websites that reflect your brand and drive business
                  growth.
                </p>
                <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
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

        </div>
      </section>
    </div>
  )
}
