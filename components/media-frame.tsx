"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/projects";
import { placeholderTone } from "@/lib/placeholder-tones";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

function videoMimeType(src: string) {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  if (ext === "m4v") return "video/x-m4v";
  return "video/mp4";
}

type MediaFrameProps = {
  media: MediaAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shown only in placeholder mode, in a quiet corner. Omit for a clean, textless frame. */
  caption?: string;
  /**
   * "cover" (default) locks the wrapper to the media's own aspect ratio and
   * fills it, used everywhere in the exhibition grids. "contain" instead
   * fills whatever box the parent gives it and letterboxes the media inside,
   * used only by the lightbox, where the box size is fixed and the image's
   * own ratio needs to be seen in full rather than cropped.
   */
  fit?: "cover" | "contain";
};

/**
 * Renders one piece of media at its own natural aspect ratio. A 9:16 film
 * stays 9:16, a 4:3 photograph stays 4:3 — nothing here forces a crop to
 * 16:9. When a project has no `src` yet, it falls back to one of the
 * studio's placeholder tones instead of a broken file or a stock photo.
 */
export function MediaFrame({
  media,
  className,
  sizes = "100vw",
  priority = false,
  caption,
  fit = "cover",
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        if (!prefersReducedMotion()) {
          video.play().catch(() => {
            // Autoplay can be blocked before the first user interaction on
            // some browsers; the poster frame stays visible in that case.
          });
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const [w, h] = media.aspect.split(":").map(Number);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink", className)}
      style={fit === "cover" ? { aspectRatio: `${w} / ${h}` } : undefined}
    >
      {media.src ? (
        media.type === "video" ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={media.poster}
            aria-label={media.alt}
            className={cn("absolute inset-0 h-full w-full", fit === "cover" ? "object-cover" : "object-contain")}
            data-in-view={inView}
          >
            <source src={media.src} type={videoMimeType(media.src)} />
          </video>
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={fit === "cover" ? "object-cover" : "object-contain"}
          />
        )
      ) : (
        <div
          className="absolute inset-0 flex items-end p-4"
          style={{ backgroundImage: placeholderTone(media.placeholderTone) }}
          role="img"
          aria-label={media.alt}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,0.35)" }}
          />
          {caption ? (
            <span className="relative font-sans text-[11px] tracking-wide text-paper/40">
              {caption}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
