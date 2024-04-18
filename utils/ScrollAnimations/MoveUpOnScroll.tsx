import React from "react"
import { motion } from "framer-motion"
function MoveUpWhenVisible({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      variants={{
        visible: { opacity: 1, translateY: 0 },
        hidden: { translateY: 100, opacity: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}

export default MoveUpWhenVisible
