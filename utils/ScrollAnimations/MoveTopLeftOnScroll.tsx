import React from "react"
import { motion } from "framer-motion"
function MoveTopLeftWhenVisible({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      variants={{
        visible: { opacity: 1, translateX: 0, translateY: 0 },
        hidden: { translateX: 20, translateY: 5, opacity: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}

export default MoveTopLeftWhenVisible
