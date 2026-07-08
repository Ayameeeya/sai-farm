"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { News } from "@/types"

type Props = { news: News[] }

export function NewsSection({ news }: Props) {
  if (news.length === 0) return null

  return (
    <section className="bg-white py-28 lg:py-44 px-6 lg:px-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-12">

          {/* Header — 左カラム */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <p
              className="text-black/45 mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                letterSpacing: "0.35em",
              }}
            >
              NEWS
            </p>
            <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light text-black leading-[1.1]">
              ニュース
            </h2>
          </motion.div>

          {/* List — 右カラム */}
          <div className="lg:col-span-8 border-t border-b border-black/10 divide-y divide-black/10">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="py-4 lg:py-5">
                  <div className="flex items-baseline gap-6 mb-1.5">
                    <time className="text-[12px] text-black/50 tracking-[0.12em] tabular-nums">
                      {format(new Date(item.created_at), "yyyy.MM.dd", { locale: ja })}
                    </time>
                    {item.tag && (
                      <span
                        className="text-[10px] tracking-[0.25em] text-black/40 uppercase whitespace-nowrap"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.tag.name}
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-[16px] lg:text-[19px] font-light text-black/85 leading-snug line-clamp-2">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
