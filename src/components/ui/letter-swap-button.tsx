"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRightFromSquare, Send } from "lucide-react"
import { motion, useAnimate, type Transition } from "framer-motion"
import { cn } from "@/lib/utils"

const SWAP_TRANSITION: Transition = { type: "spring", duration: 0.7 }
const STAGGER = 0.03

type Props = {
  href: string
  label: string
  variant?: "dark" | "light"
  icon?: "link" | "send"
  className?: string
  fullWidth?: boolean
}

function SwapChars({ label }: { label: string }) {
  return (
    <>
      {label.split("").map((letter, i) => (
        <span key={i} className="whitespace-pre relative inline-flex overflow-hidden" aria-hidden>
          <motion.span className="relative letter" style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className="absolute letter-secondary left-0"
            style={{ top: "-100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </>
  )
}

function SwapIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden shrink-0" aria-hidden>
      <motion.span className="relative letter flex items-center" style={{ top: 0 }}>
        {children}
      </motion.span>
      <motion.span
        className="absolute letter-secondary left-0 flex items-center"
        style={{ top: "-100%" }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function useLetterSwap() {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const runSwap = (enter: boolean) => {
    const letters = scope.current?.querySelectorAll(".letter")
    const secondaries = scope.current?.querySelectorAll(".letter-secondary")
    if (!letters?.length) return

    letters.forEach((el: Element, i: number) => {
      animate(
        el,
        { y: enter ? "100%" : 0 },
        { ...SWAP_TRANSITION, delay: i * STAGGER },
      )
    })
    secondaries?.forEach((el: Element, i: number) => {
      animate(
        el,
        { top: enter ? "0%" : "-100%" },
        { ...SWAP_TRANSITION, delay: i * STAGGER },
      )
    })
  }

  const hoverStart = () => {
    if (isHovered) return
    setIsHovered(true)
    runSwap(true)
  }

  const hoverEnd = () => {
    setIsHovered(false)
    runSwap(false)
  }

  return { scope, hoverStart, hoverEnd }
}

export function LetterSwapButton({
  href,
  label,
  variant = "dark",
  icon = "link",
  className,
  fullWidth = false,
}: Props) {
  const { scope, hoverStart, hoverEnd } = useLetterSwap()
  const iconColor = variant === "dark" ? "text-white" : "text-black"
  const Icon = icon === "send" ? Send : ArrowUpRightFromSquare

  return (
    <Link
      ref={scope}
      href={href}
      onMouseEnter={hoverStart}
      onMouseLeave={hoverEnd}
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] gap-2.5 pl-6 pr-5 py-2.5 text-[13px] font-medium tracking-[0.12em] transition-colors duration-300",
        variant === "dark"
          ? "bg-black text-white hover:bg-black/90"
          : "bg-white text-black hover:bg-white/90",
        fullWidth && "w-full",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <span className="inline-flex items-center relative overflow-hidden" aria-hidden>
        <SwapChars label={label} />
      </span>
      <SwapIcon>
        <Icon size={14} strokeWidth={1.5} className={iconColor} />
      </SwapIcon>
    </Link>
  )
}

type SubmitProps = {
  label: string
  busyLabel?: string
  isSubmitting?: boolean
  className?: string
}

export function LetterSwapSubmitButton({
  label,
  busyLabel = "送信中…",
  isSubmitting = false,
  className,
}: SubmitProps) {
  const { scope, hoverStart, hoverEnd } = useLetterSwap()
  const currentLabel = isSubmitting ? busyLabel : label

  return (
    <button
      ref={scope}
      type="submit"
      disabled={isSubmitting}
      onMouseEnter={hoverStart}
      onMouseLeave={hoverEnd}
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] gap-2.5 pl-6 pr-5 py-2.5 text-[13px] font-medium tracking-[0.12em] transition-colors duration-300 bg-black text-white hover:bg-black/90 disabled:opacity-50",
        className,
      )}
    >
      <span className="sr-only">{currentLabel}</span>
      <span className="inline-flex items-center relative overflow-hidden" aria-hidden>
        <SwapChars key={currentLabel} label={currentLabel} />
      </span>
      <SwapIcon>
        <Send size={14} strokeWidth={1.5} className="text-white" />
      </SwapIcon>
    </button>
  )
}
