import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

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
    default: "Sweet FM Online | Ghana's Premier News Portal",
    template: "%s | Sweet FM Online",
  },
  description: "Breaking news, politics, business, sports, and entertainment from Ghana and around the world. Sweet FM 106.5 - Your trusted source for news.",
  keywords: ["Ghana news", "Sweet FM", "breaking news", "politics", "business", "sports", "Accra", "106.5"],
  metadataBase: new URL("https://sweetfmonline.com"),
  // favicon.ico, icon.png, and apple-icon.png are auto-served from src/app/
  manifest: "/manifest.json",
  openGraph: {
    title: "Sweet FM Online | Ghana's Premier News Portal",
    description: "Breaking news, politics, business, sports, and entertainment from Ghana and around the world.",
    url: "https://sweetfmonline.com",
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
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
