"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Nav() {
    
  const [open, setOpen] = useState(false);
  const navLinks = [
      { href: "/", label: "Home" },
      { href: "#AB", label: "About" },
      { href: "#MT", label: "Metrics" },
      { href: "#EDA", label: "EDA" },
      { href: "https://github.com/n0wherefast/California-Housing-Price-Predictor-ML-fullstack-app", label: "GitHub" },
    ];

  return (
    <>


 <nav className="bg-slate-900 border-b border-indigo-400 text-white shadow-md fixed top-0 left-0 right-0 z-9999 font-bold">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Titolo / Logo */}
              <Link href="/" className="text-lg sm:text-xl font-bold">
                AI California Housing  Dashboard
              </Link>

              {/* Menu mobile toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="sm:hidden focus:outline-none"
                aria-label="Apri menu"
              >
                {open ? <X size={26} /> : <Menu size={26} />}
              </button>

              {/* Menu desktop */}
              <div className="hidden sm:flex space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-sky-800 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Menu mobile aperto */}
          {open && (
            <div className="sm:hidden bg-slate-800 shadow-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 border-b border-indigo-600 hover:bg-blue-600 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

    </>
  )
}

export default Nav
