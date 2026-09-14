"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/projects";
import { placeholderTone } from "@/lib/placeholder-tones";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function videoMimeType(src: string) {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  if (ext === "m4v") return "video/x-m4v";
  return "video/mp4";
}

/**
 * Poster images sit alongside the video as poster.jpg (see
 * organize-media-v2.js), so this is always derivable from the video's
 * own path rather than needing its own data field. Videos processed
 * before poster generation existed won't have one, the browser just
 * quietly ignores a missing poster and falls back to its normal
 * behavior, so this is safe either way.
 */
export function videoPosterPath(src: string) {
  return src.replace(/\/[^/]+$/, "/poster.jpg");
}

type MediaFrameProps = {
  media: MediaAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shown only in placeholder mode, in a quiet corner. Omit for a clean, textless frame. */
  caption?: string;
  /**
   * "cover" (default) locks the wrapper to the media's own declared aspect
   * ratio, used everywhere in the exhibition grids so tiles line up in a
   * predictable grid. "contain" instead fills whatever box the parent
   * gives it, used by the lightbox and the project-detail hero, where the
   * box size is fixed by the layout itself.
   *
   * Neither mode crops the actual media: both use object-contain, so the
   * full frame is always visible. "cover" only affects how the
   * surrounding box gets its size, not how the media fits inside it.
   */
  fit?: "cover" | "contain";
};

/**
 * Renders one piece of media at its own natural aspect ratio. A 9:16 film
 * stays 9:16, a 4:3 photograph stays 4:3 — nothing here forces a crop to
 * 16:9. When a project has no `src` yet, it falls back to one of the
 * studio's placeholder tones instead of a broken file or a stock photo.
 *
 * Video plays via plain native autoplay (autoPlay + muted + playsInline),
 * which every browser handles on its own with no JavaScript required.
 * An earlier version gated playback behind an IntersectionObserver and a
 * manual .play() call to pause off-screen video for performance, that's
 * gone for now in favour of the simpler, more reliable version, it can be
 * reintroduced later once real footage is in and performance tuning
 * actually matters.
 */
export function MediaFrame({
  media,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  caption,
  fit = "cover",
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Safety net only: if the visitor has reduced motion turned on, stop
    // the video right after it mounts rather than fighting the browser
    // to never start it in the first place.
    if (prefersReducedMotion()) {
      videoRef.current?.pause();
    }
  }, []);

  const [w, h] = media.aspect.split(":").map(Number);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink", fit === "cover" ? "max-h-[75vh]" : "", className)}
      style={fit === "cover" ? { aspectRatio: `${w} / ${h}` } : undefined}
    >
      {media.src ? (
        media.type === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.poster ?? videoPosterPath(media.src)}
            aria-label={media.alt}
            className="absolute inset-0 h-full w-full object-contain"
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
            className="object-contain"
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
