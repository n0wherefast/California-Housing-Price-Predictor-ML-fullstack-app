import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Nav from "./components/Nav";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata :Metadata = {
  title: "California Housing Price Predictor",
  description: "App di Machine Learning per predire i prezzi delle case in California con Flask + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-linear-to-b from-slate-950 via-slate-slate- to-slate-900/60 antialiased font-bold flex flex-col justify-center`}>
        <Analytics/>
        <Nav/>
        <header className="text-center mt-8 px-6 pt-16">
        </header>
        <main className="min-h-screen flex justify-center">{children}</main>
        <footer className="bg-gray-200 text-center py-4 mt-10 text-sm text-gray-600">
          © {new Date().getFullYear()} - Realizzato con Flask + Next.js + ❤️
        </footer>
      </body>
    </html>
  );
}
