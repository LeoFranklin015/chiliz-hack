"use client"

import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import FootballScene from "./components/FootBallScene"
import ScoreXText from "./components/ScoreXText"

import FeaturesSection from "./components/FeaturesSection"


export default function Home() {
  const [showText, setShowText] = useState(false)

  // Prevent spacebar from scrolling the page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleShowText = (show: boolean) => {
    setShowText(show)
  }

  return (
    <>
      {/* Canvas sandwich container */}
      <div className="relative w-full h-screen">
        {/* Bottom div - behind canvas with football ground background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-black"
          style={{
            backgroundImage: "url('/football-ground.jpg')",
            opacity: 0.4
          }}
        />
        
        {/* Linear gradient overlay */}
        <div 
          className="absolute inset-0 z-1"
          style={{
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0% , rgba(0, 0, 0, 1) 100% )"
          }}
        />

        {/* 3D Canvas - middle layer */}
        <div className="absolute inset-0 z-10">
       
          <Canvas camera={{ position: [0, 0, 20], fov: 50 }} className="w-full h-screen">
            <Suspense fallback={null}>
              <Environment preset="night" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={3} />
              <FootballScene onShowText={handleShowText} />

            </Suspense>

          </Canvas>
          
        </div>

        {/* ScoreX Text Overlay */}
        <ScoreXText 
          showText={showText}
        />

        {/* Top div - above canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1 }}
          >
            <div className="flex flex-col items-center space-y-2">
 
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>

      </div>
      <FeaturesSection />

    </>
  )
}
