export type Service = {
  slug: string;
  name: string;
  description: string;
  detail: string;
  placeholderTone: number;
};

export const services: Service[] = [
  {
    slug: "weddings",
    name: "Weddings",
    description: "Full day coverage, start to last dance.",
    detail:
      "Photography and film from the first look through to the send-off, edited to hold together as a full record of the day, not just a highlight reel.",
    placeholderTone: 1,
  },
  {
    slug: "bridal-prep",
    name: "Bridal Prep",
    description: "The getting-ready hours, styled and kept.",
    detail:
      "The pins, the folding, the last adjustments before anyone steps back to look. Usually the most candid part of the whole day, even though it is the most styled.",
    placeholderTone: 4,
  },
  {
    slug: "asoebi-moments",
    name: "Asoebi Moments",
    description: "The coordinated family and friend group, celebrated properly.",
    detail:
      "The group everyone matches with deserves its own set of photographs, not a rushed five minutes before the reception starts.",
    placeholderTone: 2,
  },
  {
    slug: "social-content",
    name: "Social Content",
    description: "Short-form cuts for how people actually watch now.",
    detail:
      "Shot on location, often on mobile, and edited fast for Instagram and TikTok. The same eye, built for a different feed.",
    placeholderTone: 5,
  },
];
