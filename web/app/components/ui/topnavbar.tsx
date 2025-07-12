"use client"

import Link from "next/link"
import { Button } from "./button"
import { Trophy } from "lucide-react"

export default function TopNav() {
  return (
    <nav className="relative z-50 w-full bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/50">
      <div className=" flex items-center justify-between">
        {/* Left Section: Logo */}
        <div
          className="relative bg-zinc-900 px-6 py-3 shadow-lg border border-zinc-800/50 flex items-center space-x-2"
          style={{
            clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 8px rgba(0, 255, 255, 0.1)",
          }}
        >
          <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-mono font-bold text-white tracking-widest">FUTBOL NEXUS</span>
        </div>

        {/* Right Section: Navigation Links and Play Now Button */}
        <div className="flex items-center space-x-0">
          <div
            className="relative bg-zinc-900 px-8 py-3 shadow-lg border border-zinc-800/50 flex items-center space-x-8"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 8px rgba(0, 255, 255, 0.1)",
            }}
          >
            <Link
              href="/"
              className="text-cyan-400 hover:text-white transition-colors font-mono font-medium tracking-wide uppercase"
            >
              Leagues
            </Link>
            <Link
              href="/map"
              className="text-zinc-400 hover:text-white transition-colors font-mono font-medium tracking-wide uppercase"
            >
              World Map
            </Link>
            <Link
              href="/players"
              className="text-zinc-400 hover:text-white transition-colors font-mono font-medium tracking-wide uppercase"
            >
              Players
            </Link>
          </div>

          {/* Connect Button with custom shape */}
          <Button
            className="relative h-12 px-8 py-2 text-white font-mono font-bold uppercase tracking-wide overflow-hidden group ml-[-10px]" // Adjusted margin to overlap
            style={{
              background: "linear-gradient(90deg, rgba(0,255,255,0.2) 0%, rgba(0,255,255,0.4) 100%)",
              clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
              border: "1px solid rgba(0,255,255,0.5)",
              boxShadow: "0 0 20px rgba(0,255,255,0.4)",
            }}
          >
            <span className="relative z-10">Connect</span>
            <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>
    </nav>
  )
}
