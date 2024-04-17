import React from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const AnimatedDiv = () => {
  const controls = useAnimation()
  const { ref, inView } = useInView()

  React.useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { scale: 1, opacity: 1 },
          hidden: { scale: 0, opacity: 0 },
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

export default AnimatedDiv
