"use client"
import { Button } from "components/Button/Button"
import { InfiniteSlider } from "components/Slider/Slider"
import { motion } from "framer-motion"
import { useState } from "react"
import { FaArrowRight } from "react-icons/fa"

export default function Hero01() {
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
      <div
        className=" h-[80%] rounded-[3rem]  pt-[10%] max-md:rounded-none"
        style={{
          backgroundImage: `url('/images/glow-bottom.svg')`,
          backgroundSize: "fill",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <motion.h1
              className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl"
              initial="hidden"
              animate="visible"
              variants={wordVariants}
            >
              {" "}
              {"Experience the next dimension".split(" ").map((word, index) => (
                <motion.span key={index} variants={wordVariants}>
                  {word}{" "}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="mb-6 max-w-2xl font-light  text-gray-200 md:text-lg lg:mb-8 lg:text-xl"
            >
              {"Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software solutions powered by AI."
                .split(" ")
                .map((word, index) => (
                  <motion.span key={index} variants={wordVariants}>
                    {word}{" "}
                  </motion.span>
                ))}
            </motion.p>
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
      {/* <BackgroundBeams /> */}
    </div>
  )
}
