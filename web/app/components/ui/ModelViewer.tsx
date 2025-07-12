"use client"

import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Model } from "./Model"

const ModelViewer = ({ modelPath }: { modelPath: string }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 25 }}
      style={{
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight intensity={1} position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <Model path={modelPath} />
      </Suspense>
    </Canvas>
  )
}

export default ModelViewer 