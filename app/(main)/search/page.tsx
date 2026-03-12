"use client"

import { motion } from "framer-motion"

import { RecentSongs } from "@/components/RecentSongs/RecentSongs"
import { SearchBar } from "@/components/SearchBar/SearchBar"
import { TrendingList } from "@/components/TrendingList/TrendingList"
import { Spotlight } from "@/components/ui/spotlight"
import en from "@/i18n/locales/en.json"

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function SearchPage() {
  return (
    <div className="relative px-6 py-6 md:px-10 md:py-8">
      <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(252, 60, 68, 0.07)" />
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-2xl space-y-6"
      >
        <motion.h1
          variants={fadeUp}
          className="text-text-primary text-2xl font-bold"
        >
          {en["search.pageTitle"]}
        </motion.h1>
        <motion.div variants={fadeUp}>
          <SearchBar />
        </motion.div>
        <motion.div variants={fadeUp}>
          <RecentSongs />
        </motion.div>
        <motion.div variants={fadeUp}>
          <TrendingList />
        </motion.div>
      </motion.div>
    </div>
  )
}
