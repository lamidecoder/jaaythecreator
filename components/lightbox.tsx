"use client";

import { useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { MediaFrame } from "./media-frame";
import type { GalleryImage } from "@/lib/gallery";

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const goNext = useCallback(() => onIndexChange((index + 1) % images.length), [index, images.length, onIndexChange]);
  const goPrev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrev, onClose]);

  const current = images[index];

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[75] flex flex-col bg-ink/97 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-paper/60">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="font-sans text-xs uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-paper"
        >
          Close
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-10 sm:px-16">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous image"
          className="absolute left-1 top-1/2 z-10 -translate-y-1/2 p-3 text-paper/60 transition-colors hover:text-paper sm:left-6"
        >
          <ArrowIcon direction="left" />
        </button>

        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-[70vh] w-full max-w-4xl"
        >
          <MediaFrame media={current} fit="contain" sizes="90vw" />
        </motion.div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="absolute right-1 top-1/2 z-10 -translate-y-1/2 p-3 text-paper/60 transition-colors hover:text-paper sm:right-6"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </motion.div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {direction === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}
