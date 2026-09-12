"use client";

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
        href={`/work/${project.slug}`}
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
