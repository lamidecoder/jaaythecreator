import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black, matching the studio's actual Instagram aesthetic
        // rather than a warmer stand-in.
        ink: "#0A0A0A",
        // Warm cream used for the site's "breathing" sections (About,
        // Services) rather than as the default background.
        paper: "#FAF8F1",
        // Muted warm grey for secondary text on dark sections.
        bone: "#8F8B82",
        // The single sparing accent: a confident red, never used as the
        // main colour of a large surface or a full paragraph of text.
        wine: "#B22318",
        "wine-soft": "#D66B5F",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.4rem, 8vw, 5.8rem)", { lineHeight: "1.03", letterSpacing: "-0.01em", fontWeight: "400" }],
        "display-lg": ["clamp(2.8rem, 10vw, 7.8rem)", { lineHeight: "1.02", letterSpacing: "-0.01em", fontWeight: "400" }],
        h1: ["clamp(1.9rem, 5vw, 3.2rem)", { lineHeight: "1.1", fontWeight: "400" }],
        h2: ["clamp(1.5rem, 3.2vw, 2.2rem)", { lineHeight: "1.15", fontWeight: "400" }],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.65, 0, 0.15, 1)",
        reveal: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      transitionDuration: {
        curtain: "900ms",
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
