import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Marvel - Kod & Altyapı Paylaşım Platformu",
    template: "%s | Marvel"
  },
  description: "Discord tabanlı modern kod ve altyapı paylaşım platformu. BDFD, AOI.JS, JavaScript ve altyapı kodlarınızı paylaşın.",
  keywords: ["BDFD", "AOI.JS", "JavaScript", "Python", "Discord Bot", "Kod Paylaşım", "Altyapı"],
  authors: [{ name: "Marvel Team" }],
  creator: "Marvel Team",
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://marvel-code.vercel.app',
    title: 'Marvel - Kod & Altyapı Paylaşım Platformu',
    description: 'Discord tabanlı modern kod ve altyapı paylaşım platformu',
    siteName: 'Marvel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marvel - Kod & Altyapı Paylaşım Platformu',
    description: 'Discord tabanlı modern kod ve altyapı paylaşım platformu',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 pb-20 md:pb-8">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
