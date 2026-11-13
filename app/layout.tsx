/**
 * File: app/layout.tsx
 * Version: v2.0 FINAL ROOT LAYOUT
 * Updated: 2026-04-17 [Europe/Istanbul]
 * Status: ACTIVE
 */

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CINENTO | From Idea to International Film Market",
  description:
    "CINENTO is a next-generation film development platform connecting storytelling, financing, cinematic packaging, and international market positioning.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-cinento-locale") || "en";
  const lang = ["en", "tr", "fa", "ar"].includes(locale) ? locale : "en";
  return (
    <html
      lang={lang}
      dir={lang === "fa" || lang === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
