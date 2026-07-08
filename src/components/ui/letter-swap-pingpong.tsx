"use client"

import { useState } from "react"
import {
  motion,
  useAnimate,
  type AnimationOptions,
  type Transition,
} from "framer-motion"
import { cn } from "@/lib/utils"

type StaggerFrom = "first" | "last" | "center" | number

type Props = {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: StaggerFrom
  className?: string
}

function getStaggerDelay(index: number, from: StaggerFrom, total: number) {
  if (typeof from === "number") return Math.abs(index - from)
  if (from === "last") return total - 1 - index
  if (from === "center") return Math.abs(index - (total - 1) / 2)
  return index
}

export function LetterSwapPingPong({
  label,
  reverse = true,
  transition = { type: "spring", duration: 0.7 },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
}: Props) {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const run = (selector: string, values: Record<string, string | number>) => {
    const letters = scope.current?.querySelectorAll(selector)
    letters?.forEach((el: Element, i: number) => {
      animate(
        el,
        values,
        {
          ...(transition as Transition),
          delay: getStaggerDelay(i, staggerFrom, label.length) * staggerDuration,
        },
      )
    })
  }

  const hoverStart = () => {
    if (isHovered) return
    setIsHovered(true)
    run(".letter", { y: reverse ? "100%" : "-100%" })
    run(".letter-secondary", { top: "0%" })
  }

  const hoverEnd = () => {
    setIsHovered(false)
    run(".letter", { y: 0 })
    run(".letter-secondary", { top: reverse ? "-100%" : "100%" })
  }

  return (
    <motion.span
      ref={scope}
      className={cn("inline-flex items-center relative overflow-hidden", className)}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
    >
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => (
        <span key={i} className="whitespace-pre relative inline-flex overflow-hidden" aria-hidden>
          <motion.span className="relative letter" style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className="absolute letter-secondary left-0"
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
