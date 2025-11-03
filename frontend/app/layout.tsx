import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Nav from "./components/Nav";



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
      <body className={`${geistSans.variable} ${geistMono.variable}bg-gray-100 text-gray-800  antialiased font-bold flex flex-col justify-center`}>
        {/* 🔹 Navbar */}
        <Nav/>

        {/* 🔹 Titolo principale */}
        <header className="text-center mt-8 px-6 pt-16">
          <h2 className="text-3xl font-semibold text-gray-700">
            Predizione del valore mediano delle case in California
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-2xl">
            Questa web app utilizza un modello Machine Learning di regressione lineare allenato
            sul dataset California Housing per stimare i prezzi medi delle case
            in base a posizione, età, popolazione e reddito medio.
          </p>
        </header>

        {/* 🔹 Contenuto principale */}
        <main className="min-h-screen flex justify-center">{children}</main>

        {/* 🔹 Footer */}
        <footer className="bg-gray-200 text-center py-4 mt-10 text-sm text-gray-600">
          © {new Date().getFullYear()} - Realizzato con Flask + Next.js + ❤️
        </footer>
      </body>
    </html>
  );
}
