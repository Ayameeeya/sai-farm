"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { motion, useAnimationControls } from "framer-motion"

export function AnimatedUnderline({
  text,
  href,
  className = "",
}: {
  text: string
  href: string
  className?: string
}) {
  const controls = useAnimationControls()
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      variants={item}
      className={`w-fit ${className}`}
      onHoverStart={() =>
        controls.start({ width: "100%", transition: { duration: 0.5 } })
      }
      onHoverEnd={() => controls.start({ width: 0 })}
    >
      <Link
        href={href}
        className="block text-white text-[16px] lg:text-[20px] font-bold cursor-pointer"
      >
        {text}
      </Link>
      <motion.div
        initial={{ width: 0 }}
        animate={controls}
        className="border-b-2 border-white"
      />
    </motion.div>
  )
}
