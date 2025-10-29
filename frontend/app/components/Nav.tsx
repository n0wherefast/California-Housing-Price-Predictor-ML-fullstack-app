import React from 'react'
import Link from 'next/link'

function Nav() {
  return (
    <>
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
  <div className="flex items-center gap-2">
    <span className="text-2xl">🏠</span>
    <h1 className="text-xl font-bold text-blue-700">
      California Housing Price Predictor
    </h1>
  </div>

  <div className="flex gap-6">
    <Link href="/" className="hover:text-blue-600 font-medium">
      Home
    </Link>
    <Link href="/about" className="hover:text-blue-600 font-medium">
      About
    </Link>
    <a
      href="https://github.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-600 font-medium"
    >
      GitHub
    </a>
  </div>
</nav>

    </>
  )
}

export default Nav
