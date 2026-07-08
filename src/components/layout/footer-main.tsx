import Image from "next/image"
import Link from "next/link"

const MAIN_NAV = [
  { href: "/about-us/", label: "私たちについて" },
  { href: "/properties/", label: "物件を探す" },
  { href: "/services/", label: "サービス" },
  { href: "/contact/", label: "お問い合わせ" },
]

const SUB_NAV = [
  { href: "/properties/property-categories/land/", label: "土地を買う" },
  { href: "/properties/property-categories/house/", label: "住まいを買う" },
  { href: "/map/", label: "エリアから探す" },
  { href: "/sales/", label: "不動産を売る" },
]

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/officialsaifarm/", label: "Instagram", handle: "@officialsaifarm" },
  { href: "https://www.facebook.com/OfficialSaifarm/", label: "Facebook", handle: "@OfficialSaifarm" },
  { href: "https://twitter.com/OfficialSaifarm/", label: "X", handle: "@OfficialSaifarm" },
]

export function FooterMain() {
  return (
    <>
      <div className="px-6 lg:px-12 pt-10 lg:pt-12 pb-20 lg:pb-24 grid lg:grid-cols-2 gap-y-16">
        <div className="flex flex-col justify-between gap-16 lg:pr-24">
          <Link href="/" className="inline-block no-underline text-inherit">
            <Image
              src="/common/logo-white.png"
              alt="SAIFARM MINAMI-IZU"
              width={277}
              height={215}
              className="w-[150px] h-auto"
            />
          </Link>

          <div className="max-w-[320px]">
            <p className="text-[13px] leading-[1.9] text-white/90 mb-8">
              サイファーム南伊豆は、伊豆半島・南伊豆エリアの土地・戸建・別荘を扱う不動産会社です。都会から自然へ。移住やリゾート暮らしのはじまりを、地元の目線でお手伝いします。
            </p>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[12px] text-white hover:opacity-60 transition-opacity duration-300"
                  >
                    <span className="flex items-center justify-center w-[17px] h-[17px] rounded-[4px] border border-white/80 text-[9px] leading-none">
                      {s.label.charAt(0)}
                    </span>
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <nav>
            <ul>
              {MAIN_NAV.map((item) => (
                <li key={item.href} className="border-b border-white/[0.22]">
                  <Link
                    href={item.href}
                    className="block py-[7px] text-[17px] lg:text-[19px] font-medium tracking-[0.01em] text-white hover:opacity-60 transition-opacity duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="mt-24 lg:mt-28 grid grid-cols-2 gap-y-[15px]">
            {SUB_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] text-white hover:opacity-60 transition-opacity duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 lg:px-12 py-[18px] flex flex-wrap items-center gap-x-8 gap-y-3 lg:justify-between lg:gap-x-10 font-mono text-[10px] tracking-[0.12em] text-white uppercase">
        <span className="order-last w-full pt-3 lg:order-0 lg:w-auto lg:pt-0">© 2026 Saifarm Minami-izu co.,ltd.</span>
        <Link href="/company/" className="hover:opacity-60 transition-opacity duration-300">
          会社情報
        </Link>
        <Link href="/privacy-policy/" className="hover:opacity-60 transition-opacity duration-300">
          プライバシーポリシー
        </Link>
        <Link href="/articles/" className="hover:opacity-60 transition-opacity duration-300">
          ブログ記事
        </Link>
        <Link
          href="/tools/properties-tax-simulator/"
          className="hover:opacity-60 transition-opacity duration-300"
        >
          税金シミュレーター
        </Link>
        <Link href="/contact/" className="hover:opacity-60 transition-opacity duration-300">
          お問い合わせ
        </Link>
      </div>
    </>
  )
}
