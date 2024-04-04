"use client"
import { Button } from "components/Button/Button"
import { InfiniteSlider } from "components/Slider/Slider"
import Navbar from "components/Navbar/Navbar"
import { FaArrowRight, FaFileCsv, FaHandPaper, FaNewspaper } from "react-icons/fa"
import "../styles/custom.css"
import { useState } from "react"

export default function Web() {
  const [hovered, setHovered] = useState(false)
  const imgStyle = {
    transform: hovered ? "translateX(2px)" : "none",
    transition: "transform .2s", // Optional: Smooth transition
  }
  return (
    <div>
      <section className="h-[60%] bg-[#0f172a] pl-[15%] pr-[15%] ">
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
              <p className="mb-6 max-w-2xl font-light text-gray-200 text-slate-100 md:text-lg lg:mb-8 lg:text-xl">
                Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software
                solutions powered by AI.
              </p>
              <Button
                href="https://github.com/Blazity/next-enterprise"
                className="mr-3"
                intent="hero1"
                size="hero1"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <span className="">Get started</span>
                <div className="ml-2">
                  <span>
                    <FaArrowRight style={imgStyle} />
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

      <section className="h-[100vh] bg-[#0f172a] pl-[15%] pr-[15%] ">
        <div
          className=" h-[60%] rounded-[3rem]"
          style={{
            backgroundImage: `url('/images/glow-top.svg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div>
            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-16">
              <div className="mx-auto text-left text-white">
                <h4 className="bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 bg-clip-text pt-20 font-bold text-transparent ">
                  About VizoleLabs
                </h4>
                <div className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
                  <h2 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text text-transparent">
                    Our Mission in Motion
                  </h2>
                </div>
                <h3 className="mr-90 text-slate-300">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos, totam culpa officia ad esse
                </h3>
                <div>
                  <ul className="grid w-1/3 md:grid-cols-1">
                    <div className="mt-5 pt-2">
                      <li>
                        <input
                          type="radio"
                          id="item01"
                          name="items"
                          value="item-01"
                          className="peer hidden"
                          defaultChecked
                        />
                        <label
                          htmlFor="item01"
                          className="inline-flex w-full cursor-pointer items-center rounded-lg border border-gray-200 bg-transparent p-2 text-gray-500 hover:bg-homeBg2 peer-checked:border-blue-600 peer-checked:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:peer-checked:text-blue-500"
                        >
                          <FaNewspaper className="mr-2" />
                          <div className="block">
                            <div className="w-full">Section 01</div>
                          </div>
                        </label>
                      </li>
                    </div>
                    <div className="pt-2">
                      <li>
                        <input type="radio" id="item02" name="items" value="item-02" className="peer hidden" />
                        <label
                          htmlFor="item02"
                          className="inline-flex w-full cursor-pointer items-center rounded-lg border border-gray-200 bg-transparent p-2 text-gray-500 hover:bg-homeBg2 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
                        >
                          <FaNewspaper className="mr-2" />
                          <div className="block">
                            <div className="w-full">Section 02</div>
                          </div>
                        </label>
                      </li>
                    </div>
                    <div className="pt-2">
                      <li>
                        <input type="radio" id="item03" name="items" value="item-03" className="peer hidden" />
                        <label
                          htmlFor="item03"
                          className="inline-flex w-full cursor-pointer items-center rounded-lg border border-gray-200 bg-transparent p-2 text-gray-500 hover:bg-homeBg2 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
                        >
                          <FaNewspaper className="mr-2" />
                          <div className="block">
                            <div className="w-full">Section 03</div>
                          </div>
                        </label>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="h-[150vh] bg-[#0f172a] pl-[10%] pr-[10%] ">
        <div className="mx-auto place-self-center text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl xl:text-6xl">
            Lorem. Ipsam.
          </h1>
          <p className="text-2xl text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, veniam aperiam! Delectus, tempora, est
            perferendis repellat explicabo nesciunt facere totam quod quos ratione distinctio? Voluptates in
            necessitatibus quam fugiat quo!
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 mt-10 h-[50vh] max-w-full rounded-xl border border-gray-200 bg-transparent shadow dark:border-gray-700 dark:bg-gray-800">
            <div
              className=" h-[100%] rounded-[3rem]"
              style={{
                backgroundImage: `url('/images/glow-bottom.svg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <p></p>
            </div>
          </div>
          <div className="max-w-70% col-span-2 mt-10 h-[50vh] rounded-xl border border-gray-200 bg-transparent p-6 shadow dark:border-gray-700 dark:bg-gray-800"></div>
          <div className="mt-10 h-[50vh] max-w-full rounded-xl border border-gray-200 bg-transparent p-6 shadow dark:border-gray-700 dark:bg-gray-800"></div>
        </div>
      </section>
    </div>
  )
}
