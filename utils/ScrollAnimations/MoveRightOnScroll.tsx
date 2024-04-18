import React from "react"
import { motion } from "framer-motion"
function MoveRightWhenVisible({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      variants={{
        visible: { opacity: 1, translateX: 0 },
        hidden: { translateX: -100, opacity: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}

export default MoveRightWhenVisible
