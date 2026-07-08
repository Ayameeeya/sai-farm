import type { Metadata } from "next"
import Script from "next/script"
import { Noto_Sans_JP, Noto_Serif_JP, Inter, Bebas_Neue, Barlow } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SmoothScroll } from "@/components/layout/smooth-scroll"
import { SITE_URL } from "@/lib/site"

const GA_ID = "G-3LWDF8E1X3"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
})

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | サイファーム南伊豆",
    default: "サイファーム南伊豆 | 伊豆の不動産・移住・別荘",
  },
  description: "静岡県伊豆・南伊豆エリアの不動産情報。土地・戸建・別荘の売買、移住相談はサイファーム南伊豆へ。",
  openGraph: {
    type: "website",
    siteName: "サイファーム南伊豆",
    locale: "ja_JP",
    images: ["/ogp.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@OfficialSaifarm",
    images: ["/ogp.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable} ${inter.variable} ${bebasNeue.variable} ${barlow.variable}`}>
      <body className="font-sans antialiased bg-white text-black">
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
