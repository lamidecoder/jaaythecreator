#!/usr/bin/env node
/**
 * add-vercel-analytics.js
 *
 * Installs Vercel Web Analytics and wires the <Analytics /> component into
 * the Next.js root layout, so every page reports a visit.
 *
 * Safe to run more than once — if it's already set up, it just says so and
 * still runs npm install to make sure your local packages are in sync.
 *
 * Run from the project root:
 *   node add-vercel-analytics.js
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const PKG_PATH = path.join(ROOT, "package.json");
const LAYOUT_PATH = path.join(ROOT, "app", "layout.tsx");
const ANALYTICS_VERSION = "^2.0.1";

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// --- sanity check: make sure this is really the project root ---
if (!fs.existsSync(PKG_PATH) || !fs.existsSync(LAYOUT_PATH)) {
  fail(
    "Couldn't find package.json and app/layout.tsx in this folder.\n" +
      "  Move this script into the jaaythecreator project root (next to package.json) and run it again.",
  );
}

console.log("Setting up Vercel Web Analytics...\n");

// --- 1. package.json: add the dependency if it isn't already there ---
let pkgChanged = false;
const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
if (!pkg.dependencies) pkg.dependencies = {};

if (!pkg.dependencies["@vercel/analytics"]) {
  pkg.dependencies["@vercel/analytics"] = ANALYTICS_VERSION;
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n");
  pkgChanged = true;
  console.log("✓ Added @vercel/analytics to package.json");
} else {
  console.log("• @vercel/analytics is already in package.json — skipping");
}

// --- 2 & 3. app/layout.tsx: add the import and render <Analytics /> ---
let layoutSrc = fs.readFileSync(LAYOUT_PATH, "utf8");
let layoutChanged = false;

if (!layoutSrc.includes('from "@vercel/analytics/next"')) {
  const importAnchor = 'import type { ReactNode } from "react";\n';
  if (!layoutSrc.includes(importAnchor)) {
    fail(
      "app/layout.tsx doesn't look like what I expected (couldn't find the " +
        '\'import type { ReactNode } from "react";\' line).\n' +
        "  The file may have changed since — paste me its current contents and I'll adjust the script.",
    );
  }
  layoutSrc = layoutSrc.replace(
    importAnchor,
    `${importAnchor}import { Analytics } from "@vercel/analytics/next";\n`,
  );
  layoutChanged = true;
  console.log("✓ Added the Analytics import to app/layout.tsx");
} else {
  console.log("• Analytics import is already in app/layout.tsx — skipping");
}

if (!layoutSrc.includes("<Analytics />")) {
  const jsxAnchor = "        </Providers>\n      </body>";
  if (!layoutSrc.includes(jsxAnchor)) {
    fail(
      "app/layout.tsx doesn't look like what I expected (couldn't find the " +
        "'</Providers></body>' block).\n" +
        "  The file may have changed since — paste me its current contents and I'll adjust the script.",
    );
  }
  layoutSrc = layoutSrc.replace(
    jsxAnchor,
    "        </Providers>\n        <Analytics />\n      </body>",
  );
  layoutChanged = true;
  console.log("✓ Rendered <Analytics /> in app/layout.tsx");
} else {
  console.log("• <Analytics /> is already rendered in app/layout.tsx — skipping");
}

if (layoutChanged) {
  fs.writeFileSync(LAYOUT_PATH, layoutSrc);
}

if (!pkgChanged && !layoutChanged) {
  console.log("\nEverything was already set up — nothing to change.");
}

// --- 4. npm install, so node_modules and the lockfile are in sync ---
console.log("\nRunning npm install (this can take a minute)...\n");
try {
  execSync("npm install", { cwd: ROOT, stdio: "inherit" });
} catch {
  fail("npm install failed. Scroll up for the real error, fix it, then re-run: node add-vercel-analytics.js");
}

console.log(`
✓ Done — Vercel Web Analytics is wired in.

What happens next:
  1. Commit and push these changes the way you normally deploy.
  2. Once that deploy finishes, go to vercel.com, open this project, and click the
     "Analytics" tab in the top nav — that's where page views and visitor counts show up.
  3. It's free on your current (Hobby) plan, no charge, ever. If you pass the monthly
     included limit, Vercel just pauses collecting new data until your next billing
     cycle resets it — nothing breaks and you don't get billed.
  4. It only counts visits from the moment this deploy goes live — nobody who visited
     the site before today will show up in the numbers.
`);
