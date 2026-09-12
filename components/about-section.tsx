import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-40 sm:px-10 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl font-serif text-display text-ink">
            {"Styled where it should be. Honest where it shouldn't."}
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-12 sm:gap-8">
          <div className="sm:col-span-5">
            <MediaFrame
              media={{ type: "image", aspect: "4:5", alt: "Bridal prep styling in progress", placeholderTone: 6 }}
            />
          </div>
          <Reveal className="sm:col-span-7 sm:pt-4">
            <div className="max-w-prose space-y-6 font-sans text-lg leading-relaxed text-ink/80">
              <p>
                {
                  "A gele takes forty minutes to tie properly, and most people never see that part. The pins, the folding, the small adjustments before anyone steps back to look."
                }
              </p>
              <p>
                {
                  "We're there for that too, not just the finished look. Every wedding, every bridal prep morning, and every asoebi group photo gets the same attention: styled where the moment calls for it, candid where it doesn't."
                }
              </p>
              <p>
                {
                  "Weddings, bridal prep, and asoebi moments, in whatever mix of photo and film each one calls for. UK-based, available worldwide."
                }
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-24 border-t border-ink/10 pt-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <MediaFrame media={{ type: "image", aspect: "4:5", alt: "An asoebi group photographed together", placeholderTone: 2 }} />
            <MediaFrame
              media={{ type: "image", aspect: "4:5", alt: "A styled bridal portrait", placeholderTone: 5 }}
              className="sm:mt-10"
            />
            <MediaFrame media={{ type: "image", aspect: "4:5", alt: "Detail from a wedding day", placeholderTone: 7 }} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
