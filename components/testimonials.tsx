const testimonials: { quote: string; name: string; event: string }[] = [
  {
    quote: "Everything felt effortless on the day. We didn't even notice the camera half the time, and the photos still caught everything that mattered.",
    name: "Tola & Gabriel",
    event: "Wedding, May 2026",
  },
  {
    quote: "So patient and calm the whole morning, even when we were running behind. The gele shots alone were worth it.",
    name: "Soji & Toun",
    event: "Bridal Prep, March 2026",
  },
  {
    quote: "Our whole aso-ebi group actually looked coordinated in the photos for once, not just matching outfits standing around.",
    name: "Kemi & Emeka",
    event: "Asoebi Moments, August 2026",
  },
];

/**
 * Names and dates are filled in. The quotes themselves are still
 * generic-sounding placeholder text, not verified word-for-word from
 * these specific clients, worth swapping in their actual words if you
 * have them (a WhatsApp message, a review) for full accuracy.
 */
export function Testimonials() {
  return (
    <div className="mt-16 border-y border-paper/10 py-12">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper/40">What clients say</p>
      <div className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {testimonials.map((item, index) => (
          <div key={index}>
            <p className="font-serif text-lg italic leading-snug text-paper">{`"${item.quote}"`}</p>
            <p className="mt-4 font-sans text-sm text-bone">{item.name}</p>
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-paper/40">{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
