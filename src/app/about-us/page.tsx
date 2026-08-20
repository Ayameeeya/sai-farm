import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"

export const metadata: Metadata = {
  title: "私たちについて",
  description: "南伊豆で自然と共に暮らす。サイファーム南伊豆の想いとストーリー。",
}

export default function AboutUsPage() {
  return (
    <main>
      {/* 動画の読み込み中もファーストビューを即座に表示する */}
      <link
        rel="preload"
        as="image"
        href="/movies/about-hero-poster.jpg"
        fetchPriority="high"
      />
      <AboutHero />
      <AboutStory
        images={{
          ocean: "/images/about/ocean.jpg",
          forest: "/images/about/forest.jpg",
          green: "/images/about/geopark.jpg",
        }}
      />
    </main>
  )
}
