import { motion, Transition } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

type ScoreXTextProps = {
  showText: boolean;
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const ScoreXText: React.FC<ScoreXTextProps> = ({
  showText,
  text = "SC   REZ",
  delay = 200,
  className = "",
  animateBy = "letters",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  // Only start animation when showText becomes true
  useEffect(() => {
    if (showText && !shouldAnimate) {
      setShouldAnimate(true);
    } else if (!showText) {
      setShouldAnimate(false);
    }
  }, [showText, shouldAnimate]);

  const defaultFrom = useMemo(
    () => ({
      filter: "blur(10px)",
      opacity: 0,
      y: direction === "top" ? -50 : 50,
    }),
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  // Don't render anything until showText is true
  if (!showText) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <p 
        ref={ref} 
        className={`text-7xl font-weight-700 md:text-8xl font-red text-red tracking-wider gaming-text ${className} flex`}
       
      >
        {elements.map((segment, index) => {
          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

          const spanTransition: Transition = {
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
          };
          (spanTransition as any).ease = easing;

          return (
            <motion.span
              key={index}
              initial={fromSnapshot}
              animate={shouldAnimate ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={
                index === elements.length - 1 ? onAnimationComplete : undefined
              }
              style={{
                display: "inline-block",
                willChange: "transform, filter, opacity",
              }}
            >
              {segment === " " ? "\u00A0" : segment}
              {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
            </motion.span>
          );
        })}
      </p>
    </div>
  );
};

export default ScoreXText;
