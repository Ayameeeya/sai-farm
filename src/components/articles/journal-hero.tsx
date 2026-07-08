type Props = {
  activeCategory?: string
}

export function JournalHero({ activeCategory }: Props) {
  const headline = activeCategory
    ? `${activeCategory}に関する記事`
    : "伊豆の暮らしや地域の話題を、\nお届けします。"

  return (
    <header className="px-6 pb-10 pt-8 text-center lg:px-12 lg:pb-14 lg:pt-12">
      <p
        className="mb-5 text-black/45"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          letterSpacing: "0.35em",
        }}
      >
        JOURNAL
      </p>
      <h1 className="mx-auto max-w-[920px] whitespace-pre-line font-serif text-[clamp(28px,4.2vw,52px)] font-light leading-[1.3] tracking-[-0.01em] text-black">
        {headline}
      </h1>
    </header>
  )
}
