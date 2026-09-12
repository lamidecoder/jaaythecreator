"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { getGalleryImages } from "@/lib/projects";
import { MediaFrame } from "./media-frame";
import { Lightbox } from "./lightbox";
import { Reveal } from "./reveal";

const sizeSpan: Record<string, string> = {
  full: "col-span-2 sm:col-span-12",
  large: "sm:col-span-6",
  medium: "col-span-2 sm:col-span-5",
  small: "sm:col-span-4",
};

export function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const galleryImages = getGalleryImages();

  return (
    <section className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h1 className="max-w-2xl font-serif text-display text-paper">Gallery.</h1>
          <p className="mt-6 max-w-md font-sans text-base text-bone">
            A closer look at the photography, outside the context of any one wedding.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-flow-row-dense sm:grid-cols-12 sm:gap-5">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`text-left ${sizeSpan[image.size]}`}
              aria-label={`Open ${image.alt}`}
            >
              <MediaFrame media={image} />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null ? (
          <Lightbox images={galleryImages} index={openIndex} onClose={() => setOpenIndex(null)} onIndexChange={setOpenIndex} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
