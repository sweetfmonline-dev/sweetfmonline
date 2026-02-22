import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sweet FM Online — Ghana's Premier News Portal",
    template: "%s | Sweet FM Online",
  },
  description: "Breaking news, politics, business, sports & entertainment from Ghana. Sweet FM 106.5 — your trusted news source.",
  keywords: ["Ghana news", "Sweet FM", "breaking news", "politics", "business", "sports", "Accra", "106.5"],
  metadataBase: new URL("https://www.sweetfmonline.com"),
  alternates: {
    canonical: "https://www.sweetfmonline.com",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Sweet FM Online — Ghana's Premier News Portal",
    description: "Breaking news, politics, business, sports & entertainment from Ghana.",
    url: "https://www.sweetfmonline.com",
    siteName: "Sweet FM Online",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sweet FM Online - Ghana's Premier News Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweet FM Online",
    description: "Ghana's Premier News Portal",
    images: ["/og-image.png"],
    creator: "@sweetfmonline",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased bg-gray-50`}
      >
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <GlobalJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
