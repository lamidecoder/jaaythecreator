"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Wraps a single CTA so it drifts gently toward the cursor. Reserved for the
 * one or two calls to action per page that should feel considered — not a
 * treatment applied to every button.
 */
export function MagneticButton({
  children,
  className,
  strength = 16,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 16, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 200, damping: 16, mass: 0.2 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((event.clientX - (rect.left + rect.width / 2)) / rect.width) * strength);
    y.set(((event.clientY - (rect.top + rect.height / 2)) / rect.height) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
