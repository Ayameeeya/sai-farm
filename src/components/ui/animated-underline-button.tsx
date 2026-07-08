"use client"

import { motion, useAnimationControls } from "framer-motion"
import Link from "next/link"

export function AnimatedUnderlineButton({
  text,
  href,
  fontSize = "text-xs",
}: {
  text: string
  href: string
  fontSize?: string
}) {
  const btnControls = useAnimationControls()
  const borderControls = useAnimationControls()

  return (
    <motion.div className="relative inline-block">
      <Link
        href={href}
        className="relative inline-block"
      >
        <motion.span
          animate={btnControls}
          initial={{ backgroundColor: "#000", color: "#fff" }}
          onHoverStart={() => {
            btnControls
              .start({ backgroundColor: "#f0f0f0", color: "#000", transition: { duration: 0.3 } })
              .then(() => borderControls.start({ width: "100%", transition: { duration: 0.5 } }))
          }}
          onHoverEnd={() => {
            btnControls
              .start({ backgroundColor: "#000", color: "#fff" })
              .then(() => borderControls.start({ width: 0 }))
          }}
          className={`inline-block px-4 py-2 ${fontSize} cursor-pointer`}
          style={{ display: "inline-block" }}
        >
          {text}
          <motion.span
            animate={borderControls}
            initial={{ width: 0 }}
            className="absolute bottom-0 left-0 border-b-2 border-black"
            style={{ display: "block" }}
          />
        </motion.span>
      </Link>
    </motion.div>
  )
}
