"use client"

import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"
import React, { ReactNode, useEffect, useState } from "react"
import { Button } from "./button"

interface CircularCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ReactNode[]
  itemWidth?: number
  itemClassName?: string
}

const CircularCarousel = React.forwardRef<
  HTMLDivElement,
  CircularCarouselProps
>(
  (
    { items, itemWidth = 220, className, itemClassName, ...props },
    ref
  ) => {
    const [rotation, setRotation] = useState(0)
    const [radius, setRadius] = useState(0)
    const itemCount = items.length
    const angle = 360 / itemCount

    useEffect(() => {
      // A bit of trigonometry to calculate the radius so items don't overlap
      // This is based on the itemWidth and the angle between items
      setRadius((itemWidth / 2) / Math.tan(Math.PI / itemCount))
    }, [itemCount, itemWidth])

    const rotate = (direction: "next" | "prev") => {
      setRotation((prevRotation) =>
        direction === "next" ? prevRotation - angle : prevRotation + angle
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4",
          className
        )}
        {...props}
      >
        <div
          className="relative "
          style={{
            width: `${itemWidth}px`,
            height: `400px`, // let's assume a fixed height for cards
            perspective: "1200px",
          }}
        >
          <div
            className="absolute h-full w-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotation}deg)`,
              transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "absolute flex h-full w-full items-center justify-center",
                  itemClassName
                )}
                style={{
                  transform: `rotateY(${
                    index * angle
                  }deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-12 mt-24 bg-black ">
          <Button
            onClick={() => rotate("prev")}
            className="z-10 bg-black"
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() =>  rotate("next")}
            className="z-10 bg-black"
            variant="outline"
            size="icon"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
)

CircularCarousel.displayName = "CircularCarousel"

export { CircularCarousel }