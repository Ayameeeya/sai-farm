import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import MetallicPaint from "@/components/MetallicPaint"

const UNSPLASH_IMAGE =
  "https://images.unsplash.com/photo-1777781694770-c68871e767ba?auto=format&fit=crop&w=1200&q=88"

const METALLIC_CIRCLE_MASK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='244' fill='%23000'/%3E%3C/svg%3E"

export function ArticleContactBanner() {
  return (
    <aside className="my-10 overflow-hidden rounded-[8px] bg-[#080808] text-white sm:my-12">
      <Link
        href="/contact/"
        className="group grid min-h-[320px] sm:grid-cols-[1.15fr_0.85fr]"
        aria-label="伊豆の不動産の相続・売却について相談する"
      >
        <div className="relative order-2 flex flex-col justify-between overflow-hidden px-6 py-7 sm:order-1 sm:px-8 sm:py-9 lg:px-10">
          <div className="relative">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.24em] text-white/62 uppercase">
              <span>Real estate consultation</span>
              <span className="h-px w-8 bg-[#8c753f]" />
              <span>Izu</span>
            </div>

            <h2 className="mt-7 font-serif text-[clamp(27px,4vw,42px)] font-light leading-[1.35] tracking-[0.02em] text-white">
              伊豆の不動産、
              <br />
              <span className="text-[#d0bd86]">
                相続・売却でお困りの方へ。
              </span>
            </h2>

            <p className="mt-4 max-w-[340px] text-[12px] leading-[1.9] text-white/72 sm:text-[13px]">
              相続した土地や空き家、売却時期や価格のお悩みまで。
              伊豆を知る不動産会社が、査定から売却まで丁寧に伴走します。
            </p>
          </div>

          <div className="relative mt-8 flex items-center justify-between border-t border-[#9d8246]/25 pt-5">
            <span className="text-[12px] tracking-[0.08em] text-[#dec992]">
              無料相談・査定を申し込む
            </span>
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#8c753f] text-[#fff4d5] shadow-[0_4px_18px_rgba(130,106,49,0.16)]">
              <span className="absolute inset-0 transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:brightness-105">
                <MetallicPaint
                  imageSrc={METALLIC_CIRCLE_MASK}
                  seed={19}
                  scale={2.4}
                  refraction={0.001}
                  blur={0.045}
                  liquid={0.02}
                  speed={0.04}
                  brightness={1.08}
                  contrast={0.72}
                  angle={-18}
                  fresnel={0.35}
                  lightColor="#c9b67d"
                  darkColor="#8c753f"
                  tintColor="#a08a57"
                  patternSharpness={0.45}
                  waveAmplitude={0.06}
                  noiseScale={0.12}
                  chromaticSpread={0.02}
                  distortion={0}
                  contour={0.12}
                  matte={0.88}
                  mouseAnimation
                />
              </span>
              <span className="relative z-10 flex size-5 items-center justify-center overflow-hidden drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="absolute transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-0"
                />
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="absolute -translate-x-5 translate-y-5 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </span>
            </span>
          </div>
        </div>

        <div className="relative order-1 min-h-[210px] overflow-hidden sm:order-2 sm:min-h-full">
          <Image
            src={UNSPLASH_IMAGE}
            alt="豊かな緑に囲まれた日本家屋"
            fill
            className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, 340px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent sm:bg-gradient-to-r sm:from-black/20 sm:to-transparent" />
          <p className="absolute bottom-5 right-5 text-[9px] tracking-[0.28em] text-[#b8a36b] uppercase [writing-mode:vertical-rl]">
            Local knowledge
          </p>
        </div>
      </Link>
    </aside>
  )
}
