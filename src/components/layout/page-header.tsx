type Props = {
  label: string
  title: string
  description?: string
  imageUrl?: string
}

export function PageHeader({ label, title, description, imageUrl }: Props) {
  if (imageUrl) {
    return (
      <section className="relative h-[28vh] min-h-[200px] lg:h-[36vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-fixed"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p
            className="mb-3 text-white/70"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              letterSpacing: "0.35em",
            }}
          >
            {label}
          </p>
          <h1
            className="font-serif text-[22px] lg:text-[26px] font-normal leading-[1.8]"
            style={{ textShadow: "0 0 20px rgba(0,0,0,0.5)" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[13px] text-white/75">{description}</p>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="border-b border-black/8 bg-white px-6 py-16 lg:px-12 lg:py-24">
      <div className="max-w-screen-xl mx-auto">
        <p
          className="text-black/45 mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "0.35em",
          }}
        >
          {label}
        </p>
        <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-light text-black leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[14px] text-black/50">{description}</p>
        )}
      </div>
    </div>
  )
}
