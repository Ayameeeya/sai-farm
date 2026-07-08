"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

const boxVariant = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  hidden: { opacity: 0, y: 40 },
}

export function AnimatedStay({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  const control = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (inView) control.start("visible")
    else control.start("hidden")
  }, [control, inView])

  return (
    <motion.h2
      ref={ref}
      variants={boxVariant}
      initial="hidden"
      animate={control}
      className={`font-normal text-center tracking-[0.12em] leading-[2.2] ${className}`}
    >
      {text}
    </motion.h2>
  )
}
