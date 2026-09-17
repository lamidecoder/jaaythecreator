"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "./smooth-scroll";
import { CursorProvider } from "./cursor";
import { TransitionProvider } from "./transition";
import { GrainOverlay } from "./grain-overlay";
import { IntroLoader } from "./intro-loader";
import { MediaProtection } from "./media-protection";
import { BackToTop } from "./back-to-top";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <CursorProvider>
        <TransitionProvider>
          {children}
          <GrainOverlay />
          <IntroLoader />
          <MediaProtection />
          <BackToTop />
        </TransitionProvider>
      </CursorProvider>
    </SmoothScroll>
  );
}
