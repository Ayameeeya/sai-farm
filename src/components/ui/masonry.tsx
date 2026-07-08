"use client"

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { gsap } from "gsap"

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === "undefined") return defaultValue
    return values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue
  }

  const [value, setValue] = useState<number>(defaultValue)

  useEffect(() => {
    setValue(get())
    const handler = () => setValue(get())
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler))
    return () => queries.forEach((q) => matchMedia(q).removeEventListener("change", handler))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return value
}

const useMeasure = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size] as const
}

export type MasonryItem = {
  id: string
  height: number | ((columnWidth: number) => number)
}

type GridItem = MasonryItem & {
  x: number
  y: number
  w: number
  h: number
}

type Props<T extends MasonryItem> = {
  items: T[]
  gap?: number
  columns?: { queries: string[]; values: number[]; default: number }
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random"
  blurToFocus?: boolean
  renderItem: (item: T, gridItem: GridItem) => ReactNode
}

/** React Bits Masonry — https://reactbits.dev/components/masonry */
export function Masonry<T extends MasonryItem>({
  items,
  gap = 24,
  columns = {
    queries: ["(min-width:1024px)", "(min-width:640px)"],
    values: [3, 2],
    default: 1,
  },
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.06,
  animateFrom = "bottom",
  blurToFocus = true,
  renderItem,
}: Props<T>) {
  const columnCount = useMedia(columns.queries, columns.values, columns.default)
  const [containerRef, { width }] = useMeasure()
  const [ready, setReady] = useState(false)
  const hasMounted = useRef(false)

  useEffect(() => {
    setReady(true)
  }, [items])

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return []
    const colHeights = new Array(columnCount).fill(0)
    const totalGaps = (columnCount - 1) * gap
    const columnWidth = (width - totalGaps) / columnCount

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = col * (columnWidth + gap)
      const h =
        typeof child.height === "function" ? child.height(columnWidth) : child.height
      const y = colHeights[col]

      colHeights[col] += h + gap
      return { ...child, x, y, w: columnWidth, h }
    })
  }, [columnCount, gap, items, width])

  const containerHeight = useMemo(() => {
    if (!grid.length) return 0
    return Math.max(...grid.map((item) => item.y + item.h))
  }, [grid])

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction = animateFrom
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"] as const
      direction = dirs[Math.floor(Math.random() * dirs.length)]
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 }
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 }
      case "left":
        return { x: -200, y: item.y }
      case "right":
        return { x: window.innerWidth + 200, y: item.y }
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useLayoutEffect(() => {
    if (!ready || !grid.length) return

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h }

      if (!hasMounted.current) {
        const start = getInitialPosition(item)
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(8px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          },
        )
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        })
      }
    })

    hasMounted.current = true
  }, [grid, ready, stagger, animateFrom, blurToFocus, duration, ease])

  if (!items.length) return null

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerHeight || undefined }}
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className="absolute left-0 top-0 overflow-hidden"
          style={{ willChange: "transform, width, height, opacity" }}
        >
          {renderItem(item as unknown as T, item)}
        </div>
      ))}
    </div>
  )
}
