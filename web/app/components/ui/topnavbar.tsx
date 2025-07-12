"use client"

import Link from "next/link"
import { Button } from "./button"
import { Trophy } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CustomConnectButton } from "../ConnectButton"

// Custom hook to detect FootballScene state
function useFootballSceneState() {
  const [isFootballSceneActive, setIsFootballSceneActive] = useState(false)
  
  useEffect(() => {
    // Listen for custom events from FootballScene
    const handleFootballSceneStart = () => setIsFootballSceneActive(true)
    const handleFootballSceneEnd = () => setIsFootballSceneActive(false)
    
    window.addEventListener('football-scene-start', handleFootballSceneStart)
    window.addEventListener('football-scene-end', handleFootballSceneEnd)
    
    return () => {
      window.removeEventListener('football-scene-start', handleFootballSceneStart)
      window.removeEventListener('football-scene-end', handleFootballSceneEnd)
    }
  }, [])
  
  return isFootballSceneActive
}

// Custom hook to detect scroll position and section
function useScrollSection() {
  const [currentSection, setCurrentSection] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor(scrollY / windowHeight)
      setCurrentSection(section)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return currentSection
}

export default function TopNav() {
  const pathname = usePathname()
  const isFootballSceneActive = useFootballSceneState()
  const currentSection = useScrollSection()
  
  // Hide navbar on landing page when in first section (FootballScene) or when FootballScene is active
  if (pathname === "/" && (currentSection === 0 || isFootballSceneActive)) {
    return null
  }

  return (
    <nav className="relative z-50 w-full fixed top-0 left-0 right-0">
      <div className=" flex items-center justify-between">
        {/* Left Section: Logo */}
        <div
          className="relative bg-zinc-900 px-6 py-3 shadow-lg border border-zinc-800/50 flex items-center space-x-2"
          style={{
            clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
            boxShadow: "0 0 15px rgba(207, 10, 10, 0.2), inset 0 0 8px rgba(207, 10, 10, 0.1)",
          }}
        >
          <span className="text-lg font-mono font-semibold text-white tracking-widest"> SCOREZ</span>
        </div>

        {/* Right Section: Navigation Links and Play Now Button */}
        <div className="flex items-center space-x-0">
          <div
            className="relative bg-zinc-900 px-8 py-3 shadow-lg border border-zinc-800/50 flex items-center space-x-8"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%)",
              boxShadow: "0 0 15px rgba(207, 10, 10, 0.2), inset 0 0 8px rgba(207, 10, 10, 0.1)",
            }}
          >
            <Link
              href="/"
              className="text-red-400 hover:text-white transition-colors font-mono font-medium tracking-wide uppercase"
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
          
          
 <CustomConnectButton />
            
        </div>
      </div>
    </nav>
  )
}
