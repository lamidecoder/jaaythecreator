#!/usr/bin/env node
/**
 * fix-card-tilt.js
 *
 * Adds the 3D tilt-on-hover effect from the preview to project cards
 * (used in Selected films on Home, the Work grid, and "More stories" on
 * project pages). New file components/tilt-card.tsx follows the exact
 * same pointer-tracking pattern as the existing MagneticButton: mouse
 * only, skipped on touch, skipped under prefers-reduced-motion, and
 * smoothed with real spring physics rather than snapping directly to
 * the cursor.
 *
 * Run once from your project root:  node fix-card-tilt.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/tilt-card.tsx": `"use client";

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
`,
  "components/project-card.tsx": `"use client";

import { TransitionLink } from "./transition";
import { MediaFrame } from "./media-frame";
import { TiltCard } from "./tilt-card";
import { useCursorLabel } from "./cursor";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const setCursorLabel = useCursorLabel();
  const label = project.hero.type === "video" ? "View film" : "View story";

  return (
    <TiltCard className={cn("group relative", className)}>
      <TransitionLink
        href={\`/work/\${project.slug}\`}
        className="relative block"
        onMouseEnter={() => setCursorLabel(label)}
        onMouseLeave={() => setCursorLabel(null)}
      >
        <div className="overflow-hidden transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.015]">
          <MediaFrame media={project.hero} caption={project.title} priority={priority} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10">
          <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
          <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
        </div>
      </TransitionLink>
    </TiltCard>
  );
}
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Hover any film card with a mouse and it should tilt toward your cursor.");
