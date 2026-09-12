"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Wraps a card so it tilts in 3D toward the cursor on hover. Mouse only,
 * a no-op on touch, and skipped under prefers-reduced-motion.
 */
export function TiltCard({
  children,
  className,
  strength = 6,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 24, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 24, mass: 0.5 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * strength);
    rotateX.set(-py * strength);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 800 }}
      className={cn("block", className)}
    >
      {children}
    </motion.div>
  );
}
