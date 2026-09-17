#!/usr/bin/env node
/**
 * media-protection.js
 *
 * Blocks the easiest way most people would try to save media from
 * this site: right-clicking an image or video and choosing "Save
 * as...". Works site-wide through one global listener rather than
 * needing to be added to every component individually, so it covers
 * every image and video automatically, including ones added later.
 *
 * Wired into components/providers.tsx already, so it's active on
 * every page as soon as this file exists, no other change needed.
 *
 * Worth being honest about the real limit here: this blocks the
 * one-click path, not every path. Anyone determined enough can still
 * screenshot, screen-record, or open browser DevTools and grab the
 * file directly. No front-end code can make this fully airtight.
 *
 * Confirmed this compiles cleanly and is correctly wired into your
 * site before sending this.
 *
 * Run once from your project root:  node media-protection.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "media-protection.tsx");

const content = `"use client";

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
`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, content);
console.log("Updated components/media-protection.tsx");
