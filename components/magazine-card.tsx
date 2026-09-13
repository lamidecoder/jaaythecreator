"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { videoMimeType } from "./media-frame";
import { cn } from "@/lib/utils";

export function MagazineCard({
  project,
  span,
  sizeClass,
  objectPosition,
}: {
  project: Project;
  span: string;
  sizeClass: string;
  objectPosition?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      className={cn("group relative block overflow-hidden bg-ink", sizeClass, span)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.hero.src ? (
        project.hero.type === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
              objectPosition,
            )}
          >
            <source src={project.hero.src} type={videoMimeType(project.hero.src)} />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.hero.src}
            alt={project.hero.alt}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
              objectPosition,
            )}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bone/30 to-ink" />
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-paper/40 font-sans text-[10px] uppercase tracking-[0.15em] text-paper backdrop-blur-sm transition-all duration-300",
            hovered ? "scale-110 opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {project.hero.type === "video" ? "Watch" : "View"}
        </span>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:opacity-0",
          hovered ? "sm:opacity-100" : "",
        )}
      >
        <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
      </div>
    </TransitionLink>
  );
}
