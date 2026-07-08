"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { richTextToFirstParagraph } from "@/lib/rich-text"
import { HorizontalCarousel } from "@/components/ui/horizontal-carousel"
import type { Service } from "@/types"

const INSET = 80 // px — header left indent matches carousel first-card start

type Props = { services: Service[] }

export function ServicesSection({ services }: Props) {
  if (services.length === 0) return null

  return (
    <section className="bg-[#f5f4f2] py-28 lg:py-48 overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 lg:mb-24 flex items-end justify-between px-6 lg:px-20"
      >
        <div>
          <p
            className="text-black/45 mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              letterSpacing: "0.35em",
            }}
          >
            SERVICES
          </p>
          <h2 className="font-serif text-[clamp(40px,5.5vw,84px)] font-light text-black leading-[1.05]">
            サービスのご紹介
          </h2>
        </div>
      </motion.div>

      {/* Full-width carousel */}
      <HorizontalCarousel gap={24} paddingX={INSET} mobilePaddingX={24}>
        {services.map((s, i) => {
          const text =
            s.description ??
            (s.content ? richTextToFirstParagraph(s.content) : "") ??
            ""
          const imgSrc =
            s.featured_photo_url ??
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=90"

          return (
            <Link
              key={s.id}
              href={`/services/${s.slug}/`}
              className="group block"
              style={{ width: "clamp(320px, 44vw, 620px)" }}
            >
              {/* Image — フィルタで写真トーンを統一 */}
              <div className="relative w-full overflow-hidden rounded-[6px]" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={imgSrc}
                  alt={s.name}
                  fill
                  className="object-cover saturate-[0.72] contrast-[0.96] brightness-[1.02] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-100"
                  sizes="(max-width: 768px) 90vw, 44vw"
                />
              </div>

              {/* Text */}
              <div className="pt-6 pb-2">
                <p className="text-[11px] tracking-[0.35em] text-black/40 uppercase mb-2">
                  Service 0{i + 1}
                </p>
                <h3 className="font-serif text-[22px] lg:text-[26px] font-light text-black mb-3 leading-snug">
                  {s.name}
                </h3>
                {text && (
                  <p className="text-[14px] leading-[2] text-black/60 line-clamp-3 mb-5">
                    {text}
                  </p>
                )}
                <span className="inline-flex items-center gap-3 text-[12px] tracking-[0.15em] uppercase text-black/55 group-hover:text-black transition-colors duration-300">
                  詳しく見る
                  <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-16" />
                </span>
              </div>
            </Link>
          )
        })}
      </HorizontalCarousel>
    </section>
  )
}
