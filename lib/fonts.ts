import { Cormorant_Garamond } from "next/font/google";
import { GeistSans } from "geist/font/sans";

// Editorial serif for display type: the wordmark, the big statement lines,
// pull quotes. Cormorant Garamond's thin, sharp, high-fashion character
// was chosen deliberately over softer variable serifs (Fraunces and
// similar) that have become a common default look, on the studio's own
// design feedback.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const geistSans = GeistSans;
