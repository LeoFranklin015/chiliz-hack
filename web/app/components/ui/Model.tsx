"use client"

import * as THREE from "three"
import React, { useMemo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

export function Model({
  path,
  ...props
}: { path: string } & React.JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF(path)
  const groupRef = useRef<THREE.Group>(null!)

  const processedScene = useMemo(() => {
    const clonedScene = scene.clone()
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxDim
    
    clonedScene.scale.set(scale, scale, scale)
    clonedScene.position.sub(center.multiplyScalar(scale))

    return clonedScene
  }, [scene])

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={processedScene} />
    </group>
  )
}

useGLTF.preload("/messi.glb")
useGLTF.preload("/ronaldo.glb") 