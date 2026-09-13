import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";
import { TransitionLink } from "./transition";

export function AboutTeaser() {
  return (
    <section className="bg-paper px-6 py-24 text-ink sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-12 sm:items-center sm:gap-8">
        <div className="sm:col-span-5">
          <MediaFrame
            sizes="(min-width: 640px) 480px, 100vw"
            media={{
              type: "image",
              aspect: "4:5",
              alt: "Bridal prep styling ahead of a wedding",
              src: "/media/work/piece-8/hero.jpg",
              placeholderTone: 4,
            }}
          />
        </div>
        <Reveal className="sm:col-span-7">
          <h2 className="font-serif text-h1 text-ink">{"Styled where it should be. Honest where it shouldn't."}</h2>
          <p className="mt-6 max-w-prose font-sans text-base leading-relaxed text-ink/70">
            {"A gele takes forty minutes to tie properly, and most people never see that part. We're there for the pins and the folding, not just the finished look."}
          </p>
          <TransitionLink
            href="/about"
            className="mt-8 inline-block font-sans text-xs uppercase tracking-[0.2em] text-ink/70 underline decoration-wine decoration-2 underline-offset-4 transition-colors hover:text-ink"
          >
            More about the studio
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
