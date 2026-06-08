"use client";

import { useEffect, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Transition,
  type TargetAndTransition,
  type VariantLabels,
} from "framer-motion";
import "./RotatingText.css";

type StaggerFrom = "first" | "last" | "center" | "random" | number;

interface RotatingTextProps {
  texts: string[];
  transition?: Transition;
  initial?: boolean | VariantLabels | TargetAndTransition;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: TargetAndTransition | VariantLabels;
  animatePresenceMode?: "wait" | "sync" | "popLayout";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: StaggerFrom;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "characters" | "words";
  onNext?: (index: number) => void;
  mainClassName?: string;
  elementLevelClassName?: string;
  splitLevelClassName?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function RotatingText({
  texts,
  transition = { type: "spring", damping: 25, stiffness: 300 },
  initial = { y: "100%", opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: "-120%", opacity: 0 },
  animatePresenceMode = "wait",
  animatePresenceInitial = false,
  rotationInterval = 2000,
  staggerDuration = 0.025,
  staggerFrom = "first",
  loop = true,
  auto = true,
  splitBy = "characters",
  onNext,
  mainClassName,
  elementLevelClassName,
  splitLevelClassName,
  style,
  className,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= texts.length && !loop) return prev;
      const newIdx = nextIdx % texts.length;
      onNext?.(newIdx);
      return newIdx;
    });
  }, [texts.length, loop, onNext]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [auto, next, rotationInterval]);

  const getStaggerDelay = (index: number, total: number): number => {
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
    if (staggerFrom === "center") {
      const center = Math.floor(total / 2);
      return Math.abs(center - index) * staggerDuration;
    }
    if (staggerFrom === "random") return Math.random() * staggerDuration * total;
    if (typeof staggerFrom === "number") return Math.abs(staggerFrom - index) * staggerDuration;
    return index * staggerDuration;
  };

  const currentText = texts[currentIndex] ?? "";
  const elements = splitBy === "characters" ? currentText.split("") : currentText.split(" ");

  return (
    <LayoutGroup>
    <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
      <motion.span
        key={currentIndex}
        layout
        className={`rotating-text ${mainClassName ?? ""} ${className ?? ""}`.trim()}
        style={style}
        aria-label={currentText}
        aria-live="polite"
      >
        {elements.map((char, i) => (
          <span key={i} className={splitLevelClassName} style={{ display: "inline-block" }}>
            <motion.span
              className={elementLevelClassName}
              style={{ display: "inline-block" }}
              initial={initial}
              animate={animate}
              exit={exit}
              transition={{ ...transition, delay: getStaggerDelay(i, elements.length) }}
            >
              {char === " " ? " " : char}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </AnimatePresence>
    </LayoutGroup>
  );
}
