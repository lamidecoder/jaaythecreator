"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { videoMimeType, videoPosterPath } from "./media-frame";
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
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "400px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("group relative overflow-hidden bg-ink", sizeClass, span)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.hero.src && inView ? (
        project.hero.type === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={videoPosterPath(project.hero.src)}
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
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
              objectPosition,
            )}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bone/30 to-ink" />
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:opacity-0",
          hovered ? "sm:opacity-100" : "",
        )}
      >
        <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
      </div>
    </div>
  );
}
