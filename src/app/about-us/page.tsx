import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { MEDIA } from "@/lib/media"

export const metadata: Metadata = {
  title: "私たちについて",
  description: "南伊豆で自然と共に暮らす。サイファーム南伊豆の想いとストーリー。",
}

export default function AboutUsPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory
        images={{
          ocean: MEDIA.IMG_CHOJAGAHARA,
          forest: MEDIA.IMG_1874,
          green: MEDIA.IMG_1710,
          life: MEDIA.IMG_1834,
        }}
      />
    </main>
  )
}
