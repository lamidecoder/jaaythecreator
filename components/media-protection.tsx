"use client";

import { useEffect } from "react";

/**
 * Blocks the easiest way most people would try to save media from this
 * site: right-clicking an image or video and choosing "Save as...".
 *
 * Worth being honest about the limits here, since no amount of
 * front-end code can make this airtight: anyone who wants a copy badly
 * enough can still screenshot, screen-record, or open browser DevTools
 * and grab the file directly. This removes the one-click path, not
 * every path.
 */
export function MediaProtection() {
  useEffect(() => {
    function blockContextMenu(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.tagName === "VIDEO")) {
        event.preventDefault();
      }
    }

    document.addEventListener("contextmenu", blockContextMenu);
    return () => document.removeEventListener("contextmenu", blockContextMenu);
  }, []);

  return null;
}
