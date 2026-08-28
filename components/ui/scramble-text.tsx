"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useScramble } from "use-scramble";

import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  text: string;
  speed?: number;
  className?: string;
  autoStart?: boolean;
  onComplete?: () => void;
  useIntersectionObserver?: boolean;
  retriggerOnIntersection?: boolean;
  intersectionThreshold?: number;
  intersectionRootMargin?: string;
  scrambleOnHover?: boolean;
}

export interface ScrambleTextHandle {
  start: () => void;
  reset: () => void;
}

const ScrambleText = forwardRef<ScrambleTextHandle, ScrambleTextProps>(
  (
    {
      text,
      speed = 80,
      className = "",
      autoStart = true,
      onComplete,
      useIntersectionObserver = false,
      retriggerOnIntersection = false,
      intersectionThreshold = 0.3,
      intersectionRootMargin = "0px",
      scrambleOnHover = false,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const hasCompletedOnce = useRef(false);

    const { ref: scrambleRef, replay } = useScramble({
      text,
      speed: speed / 100,
      tick: 2,
      step: 1,
      range: [65, 125],
      scramble: 2,
      playOnMount: autoStart && !useIntersectionObserver,
      onAnimationEnd: () => {
        hasCompletedOnce.current = true;
        onComplete?.();
      },
      overdrive: false,
    });

    useImperativeHandle(ref, () => ({
      start: () => replay(),
      reset: () => {
        hasCompletedOnce.current = false;
        replay();
      },
    }));

    useEffect(() => {
      if (!useIntersectionObserver || !containerRef.current) return;

      const observerOptions = {
        root: null,
        rootMargin: intersectionRootMargin,
        threshold: intersectionThreshold,
      };

      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasCompletedOnce.current || retriggerOnIntersection) {
              replay();
            }

            if (!retriggerOnIntersection) {
              observer.unobserve(entry.target);
            }
          }
        });
      };

      const observer = new IntersectionObserver(
        handleIntersection,
        observerOptions,
      );
      observer.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }, [
      useIntersectionObserver,
      retriggerOnIntersection,
      intersectionThreshold,
      intersectionRootMargin,
      replay,
    ]);

    const handleMouseEnter = () => {
      if (scrambleOnHover) {
        replay();
      }
    };

    return (
      <>
        <span className="sr-only">{text}</span>
        <span
          ref={containerRef}
          className={cn("inline-block whitespace-pre-wrap", className)}
          aria-hidden="true"
          onMouseEnter={scrambleOnHover ? handleMouseEnter : undefined}
        >
          <span ref={scrambleRef} />
        </span>
      </>
    );
  },
);

ScrambleText.displayName = "ScrambleText";
export default ScrambleText;
