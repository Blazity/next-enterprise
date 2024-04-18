"use client"

import { Button } from "components/Button/Button"
import { useState } from "react"
import { ImageCard } from "./image"
import { FilterableData } from "./FilterableData"
import { CardBody, CardContainer, CardItem } from "components/Ui/Card"
import { motion } from "framer-motion" // Import motion

const ImageFilter = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const buttonCaptions = ["all", "Web", "Mobile App", "UI/UX"]

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
  }

  return (
    <section className="mb-3 flex w-full flex-col gap-12 px-5 py-16 md:px-10 lg:px-16">
      <div className="flex w-full flex-wrap items-start gap-3 md:justify-center md:gap-6">
        {buttonCaptions.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            type="button"
            className={`mb-2 rounded-lg border-2 border-[#F0B37D] px-5 py-2.5 text-sm font-medium capitalize text-white hover:bg-[#F0B37D] focus:outline-none ${
              activeFilter === filter ? "bg-[#F0B37D]" : " "
            }`}
          >
            {filter === "all" ? "Show all" : filter}
          </button>
        ))}
        {/* filtered cards display */}
      </div>
      <main className="grid max-w-full grid-cols-1 place-items-center gap-3 p-4 md:max-w-full md:grid-cols-3">
        {FilterableData.map((item, index) => (
          <motion.div
            key={index}
            layout={"position"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-800 shadow  ${
              activeFilter === "all" || activeFilter === item.name
                ? "" /* Show card */
                : "hidden" /* Hide if not matched */
            }`}
          >
            <CardContainer>
              <CardBody>
                <ImageCard
                  className="h-full w-full overflow-hidden rounded-lg"
                  image={item.src}
                  alt={item.name}
                  objectCover="object-cover"
                />
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </main>
    </section>
  )
}

export default ImageFilter
